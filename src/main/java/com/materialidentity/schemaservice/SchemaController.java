package com.materialidentity.schemaservice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.materialidentity.schemaservice.config.EndpointParamConstants;
import com.materialidentity.schemaservice.config.SchemaControllerConstants;
import com.materialidentity.schemaservice.config.SchemasAndVersions;
import com.materialidentity.schemaservice.config.SchemasAndVersions.SchemaTypes;
import com.networknt.schema.InputFormat;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.transform.TransformerException;

import org.apache.fop.apps.FOPException;
import org.apache.fop.cli.Main;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

@RestController
@RequestMapping("/api")
public class SchemaController {
  private static final Logger logger = LoggerFactory.getLogger(SchemaController.class);

  // TODO: replace this with decorators
  // TODO: move logic to services
  public void validateSchemaTypeAndVersion(SchemaTypes schemaType, String version) {
    // Check if schemaType is valid
    if (!EnumSet.allOf(SchemaTypes.class).contains(schemaType)) {
      throw new IllegalArgumentException("Invalid schemaType: " + schemaType);
    }

    // Retrieve the list of versions for the schemaType
    List<String> versions = SchemasAndVersions.supportedSchemas.get(schemaType);
    // Check if the provided version is in the list for the schemaType
    if (!versions.contains(version)) {
      throw new IllegalArgumentException("Invalid version: " + version + " for schemaType: " + schemaType);
    }
  }

  @PostMapping("/render")
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
    logger.error(ex.getMessage());
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ex.getMessage());
  }

  public ResponseEntity<byte[]> render(
      @RequestParam(EndpointParamConstants.SCHEMA_TYPE_PARAM) SchemasAndVersions.SchemaTypes schemaType,
      @RequestParam(EndpointParamConstants.SCHEMA_VERSION_PARAM) String schemaVersion,
      @RequestParam(EndpointParamConstants.LANGUAGES_PARAM) String[] languages,
      @RequestBody JsonNode certificate)
      throws JsonProcessingException, IOException, FOPException, TransformerException, IOException, SAXException {

    logger.info("Rendering certificate type: {}, version: {}", schemaType, schemaVersion);

    validateSchemaTypeAndVersion(schemaType, schemaVersion);

    String translationsPattern = Paths
        .get("schemas", schemaType.name(), schemaVersion, SchemaControllerConstants.JSON_TRANSLATIONS_FILE_NAME_PATTERN)
        .toString();

    String certificateJson = jsonToString(certificate);

    String xsltPath = Paths
        .get("schemas", schemaType.name(), schemaVersion, SchemaControllerConstants.XSLT_FILE_NAME)
        .toString();

    Resource xsltResource = new ClassPathResource(xsltPath);
    String xsltSource = new String(
        Files.readAllBytes(Paths.get(xsltResource.getURI())));

    byte[] pdfBytes = new PDFBuilder()
        .withXsltTransformer(new XsltTransformer(xsltSource, certificate))
        .withTranslations(new TranslationLoader(translationsPattern, languages))
        .withAttachment(
            new AttachmentManager(certificateJson, SchemaControllerConstants.PDF_ATTACHMENT_CERT_FILE_NAME))
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION,
            String.format("filename=\"%s\"", SchemaControllerConstants.PDF_RENDERED_OUTPUT_FILE_NAME))
        .contentType(MediaType.APPLICATION_PDF)
        .body(pdfBytes);
  }

  @PostMapping("/validate")
  public ResponseEntity<Map<String, Object>> validate(
      @RequestParam("schemaType") String schemaType,
      @RequestParam("schemaVersion") String schemaVersion,
      @RequestBody JsonNode jsonCertificate) throws JsonProcessingException, IOException {

    logger.info("Validating certificate type: {}, version: {}", schemaType, schemaVersion);
    String certificateString = jsonToString(jsonCertificate);

    // build schema validator with schema definition
    JsonSchemaFactory schemaFactory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V202012);

    String schemaDefinitionPath = Paths
        .get(SchemaControllerConstants.SCHEMAS_FOLDER_NAME, schemaType, schemaVersion,
            SchemaControllerConstants.SCHEMA_DEFINITION_FILE_NAME)
        .toString();

    String schemaDefinition = readResourceAsString(schemaDefinitionPath);

    JsonSchema schema = schemaFactory.getSchema(schemaDefinition);

    Set<ValidationMessage> validationResult = schema.validate(certificateString, InputFormat.JSON,
        executionContext -> {
          executionContext.getExecutionConfig().setFormatAssertionsEnabled(true);
        });

    Boolean isValid = validationResult.isEmpty();

    if (!isValid)
      for (ValidationMessage result : validationResult) {
        System.out.println(result.getMessage());
      }

    Map<String, Object> response = new HashMap<>();
    response.put("success", isValid);

    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_JSON)
        .body(response);
  }

  @GetMapping("/schemas")
  private ResponseEntity<Map<String, Object>> getSchemas() throws IOException {
    logger.info("Getting schemas");

    Map<String, Object> response = new HashMap<>();
    PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

    // get 1st level resource tree from directory storing schema types
    Resource[] resources = resolver
        .getResources(String.format("classpath:%s", SchemaControllerConstants.SCHEMA_TYPES_FOLDER_NAME_PATTERN));

    for (Resource resource : resources) {
      if (resource.getFile().isDirectory()) {
        String schemaName = resource.getFilename();
        List<String> versions = getVersionsForResource(resolver, schemaName);
        response.put(schemaName, Collections.singletonMap("versions: ", versions));
      }
    }
    // for (Resource resource : resources) {
    //   if (resource.isReadable()) { // Check if the resource is readable
    //     String schemaName = resource.getFilename();
    //     List<String> versions = getVersionsForResource(resolver, schemaName);
    //     response.put(schemaName, Collections.singletonMap("versions: ", versions));
    //   }
    // }

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_JSON)
        .body(response);
  }

  /**
   * Retrieves a list of version directories for a given schema name from the
   * classpath.
   * This method searches within the 'schemas' directory, specifically in the
   * subdirectory
   * corresponding to the provided schema name, to find all subdirectories which
   * represent
   * different versions of the schema.
   *
   * @param resolver   The {@link PathMatchingResourcePatternResolver} used to
   *                   find resources
   *                   on the classpath.
   * @param schemaName The name of the schema for which versions are to be
   *                   retrieved. This
   *                   should correspond to a subdirectory under the 'schemas'
   *                   directory.
   * @return A list of strings, where each string is the name of a subdirectory
   *         that represents
   *         a version of the schema. The list will be empty if no versions are
   *         found or if the
   *         specified schemaName does not exist.
   * @throws IOException If an I/O error occurs when accessing the file system.
   */
  private List<String> getVersionsForResource(PathMatchingResourcePatternResolver resolver, String schemaName)
      throws IOException {
    List<String> versions = new ArrayList<>();
    Resource[] versionResources = resolver.getResources("classpath:schemas/" + schemaName + "/*");

    for (Resource versionResource : versionResources) {
      if (versionResource.getFile().isDirectory()) {
        versions.add(versionResource.getFilename());
      }
    }

    return versions;
  }

  /**
   * Reads the contents of a resource located at the specified path in the
   * classpath and returns it as a String.
   * This method assumes that the resource content is encoded using UTF-8.
   *
   * @param resourcePath The path to the resource within the classpath. The path
   *                     should not start with a slash (/),
   *                     as "classpath:" is already prefixed when resolving the
   *                     resource.
   * @return A string containing the contents of the resource, decoded using UTF-8
   *         encoding.
   * @throws IOException If an error occurs during I/O operations, such as if the
   *                     resource does not exist
   *                     or an error occurs while reading the resource.
   */
  private String readResourceAsString(String resourcePath) throws IOException {
    PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
    Resource resource = resolver.getResource("classpath:" + resourcePath);
    try (InputStream inputStream = resource.getInputStream()) {
      byte[] bytes = inputStream.readAllBytes();
      return new String(bytes, StandardCharsets.UTF_8);
    }
  }

  public static String jsonToString(JsonNode jsonMap)
      throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper();
    return objectMapper.writeValueAsString(jsonMap);
  }
}
