package com.materialidentity.schemaservice;

import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.stream.Stream;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentNameDictionary;
import org.apache.pdfbox.pdmodel.common.filespecification.PDComplexFileSpecification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsProvider;
import org.junit.jupiter.params.provider.ArgumentsSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.parser.PdfTextExtractor;
import com.materialidentity.schemaservice.config.SchemaControllerConstants;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = App.class)
@AutoConfigureWebTestClient
class RenderTest {

	@Autowired
	private WebTestClient webClient;

	@Autowired
	private CacheManager cacheManager;

	@BeforeEach
	void setUp() {
		cacheManager.getCache("rate-limit-bucket").clear();
	}

	@ParameterizedTest
	@ArgumentsSource(JsonPdfArgumentsProvider.class)
	void renderEndpointTest(Path jsonFilePath, Path pdfFilePath) throws Exception {
		String jsonContent = Files.readString(jsonFilePath);
		byte[] expectedPdfContent = Files.readAllBytes(pdfFilePath);

		webClient
				.post().uri(uriBuilder -> uriBuilder
						.path("/api/render")
						.queryParam("attachJson", "true")
						.build())
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(jsonContent).exchange()
				.expectStatus().isOk()
				.expectBody()
				.consumeWith(response -> {
					byte[] responseBody = response.getResponseBody();
					assert responseBody != null;
					try {
						assertPdfContentEquals(expectedPdfContent, responseBody);
						assertPdfContainsEmbeddedFile(responseBody,
								SchemaControllerConstants.DEFAULT_PDF_ATTACHMENT_CERT_FILE_NAME,
								jsonContent.getBytes(), true);
					} catch (Exception e) {
						throw new RuntimeException("PDF comparison failed", e);
					}
				});
	}

	@Test
	void CoA_renderEndpointTest_WithoutJsonAttachment() throws Exception {
		Path resourceDirectory = Paths.get("src", "test", "resources");
		String testResourcesPath = resourceDirectory.toFile().getAbsolutePath();

		String jsonContent = new String(
				Files.readAllBytes(
						Paths.get(testResourcesPath + "/schemas/CoA/v1.1.0/valid_cert_with_attachment.json")));
		byte[] expectedPdfContent = Files
				.readAllBytes(Paths.get(testResourcesPath + "/schemas/CoA/v1.1.0/valid_cert_with_attachment.pdf"));

		webClient
				.post().uri(uriBuilder -> uriBuilder
						.path("/api/render")
						.queryParam("attachJson", false)
						.build())
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(jsonContent).exchange()
				.expectStatus().isOk()
				.expectBody()
				.consumeWith(response -> {
					byte[] responseBody = response.getResponseBody();
					assert responseBody != null;
					try {
						assertPdfContentEquals(expectedPdfContent, responseBody);
						assertPdfContainsEmbeddedFile(responseBody,
								SchemaControllerConstants.DEFAULT_PDF_ATTACHMENT_CERT_FILE_NAME, jsonContent.getBytes(), false);
					} catch (Exception e) {
						throw new RuntimeException("PDF comparison failed", e);
					}
				});
	}

	@Test
	void CoA_renderEndpointTest_WithoutEmbeddedPDF() throws Exception {
		Path resourceDirectory = Paths.get("src", "test", "resources");
		String testResourcesPath = resourceDirectory.toFile().getAbsolutePath();

		String jsonContent = new String(
				Files.readAllBytes(
						Paths.get(testResourcesPath + "/schemas/CoA/v1.1.0/valid_cert_with_attached_pdf.json")));
		byte[] expectedPdfContent = Files
				.readAllBytes(Paths.get(testResourcesPath + "/schemas/CoA/v1.1.0/valid_cert_with_attached_pdf.pdf"));

		webClient
				.post().uri(uriBuilder -> uriBuilder
						.path("/api/render")
						.queryParam("attachJson", false)
						.build())
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(jsonContent).exchange()
				.expectStatus().isOk()
				.expectBody()
				.consumeWith(response -> {
					byte[] responseBody = response.getResponseBody();
					assert responseBody != null;
					try {
						assertPdfContentEquals(expectedPdfContent, responseBody);
						assertPdfContainsEmbeddedFile(responseBody,
								SchemaControllerConstants.DEFAULT_PDF_ATTACHMENT_CERT_FILE_NAME, jsonContent.getBytes(), false);
					} catch (Exception e) {
						throw new RuntimeException("PDF comparison failed", e);
					}
				});
	}

	@Test
	void CoA_renderEndpointTest_WithoutLanguages() throws Exception {
		Path resourceDirectory = Paths.get("src", "test", "resources");
		String testResourcesPath = resourceDirectory.toFile().getAbsolutePath();

		String jsonContent = new String(
				Files.readAllBytes(Paths.get(testResourcesPath + "/schemas/CoA/v1.1.0/missing_languages.json")));

		webClient
				.post().uri(uriBuilder -> uriBuilder
						.path("/api/render")
						.queryParam("attachJson", true)
						.build())
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(jsonContent).exchange()
				.expectStatus().isEqualTo(HttpStatus.BAD_REQUEST)
				.expectBody()
				.jsonPath("$.message").isEqualTo("CertificateLanguages array is empty");
	}

	@Test
	void CoA_renderEndpointTest_WithoutLanguagesProperty() throws Exception {
		Path resourceDirectory = Paths.get("src", "test", "resources");
		String testResourcesPath = resourceDirectory.toFile().getAbsolutePath();

		String jsonContent = new String(
				Files.readAllBytes(
						Paths.get(testResourcesPath + "/schemas/CoA/v1.1.0/missing_languages_property.json")));

		webClient
				.post().uri(uriBuilder -> uriBuilder
						.path("/api/render")
						.queryParam("attachJson", true)
						.build())
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(jsonContent).exchange()
				.expectStatus().isEqualTo(HttpStatus.BAD_REQUEST)
				.expectBody()
				.jsonPath("$.message").isEqualTo("No languages property found in the certificate");
	}

	@Test
	void CoA_renderEndpointTest_InvalidSchemaType() throws Exception {
		Path resourceDirectory = Paths.get("src", "test", "resources");
		String testResourcesPath = resourceDirectory.toFile().getAbsolutePath();

		String jsonContent = new String(
				Files.readAllBytes(Paths.get(testResourcesPath + "/schemas/CoA/v1.1.0/invalid_schema_type.json")));

		webClient
				.post().uri(uriBuilder -> uriBuilder
						.path("/api/render")
						.queryParam("attachJson", true)
						.build())
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(jsonContent).exchange()
				.expectStatus().isEqualTo(HttpStatus.BAD_REQUEST)
				.expectBody()
				.jsonPath("$.message").isEqualTo("Certificate type 'invalid' is not supported.");
	}

	private void assertPdfContentEquals(byte[] expectedPdfContent, byte[] actualPdfContent) throws Exception {
		PdfReader expectedReader = new PdfReader(new ByteArrayInputStream(expectedPdfContent));
		PdfReader actualReader = new PdfReader(new ByteArrayInputStream(actualPdfContent));

		String expectedText = PdfTextExtractor.getTextFromPage(expectedReader, 1);
		String actualText = PdfTextExtractor.getTextFromPage(actualReader, 1);

		assert expectedText.equals(actualText) : "PDF content does not match";
	}

	private void assertPdfContainsEmbeddedFile(byte[] pdfContent, String embeddedFileName,
			byte[] expectedEmbeddedFileContent, boolean shouldExist) throws IOException {
		try (PDDocument document = Loader.loadPDF(pdfContent)) {
			PDDocumentNameDictionary names = new PDDocumentNameDictionary(document.getDocumentCatalog());

			if (names.getEmbeddedFiles() == null) {
				if (shouldExist) {
					throw new AssertionError("No embedded files found in the PDF, but one was expected");
				}
				return;
			}

			Map<String, PDComplexFileSpecification> embeddedFiles = names.getEmbeddedFiles().getNames();

			if (embeddedFiles.containsKey(embeddedFileName)) {
				if (!shouldExist) {
					throw new AssertionError(
							"Embedded file '" + embeddedFileName + "' found in the PDF, but it was not expected");
				}

				byte[] embeddedFileContent = embeddedFiles.get(embeddedFileName).getEmbeddedFile().toByteArray();

				// Normalize and compare JSON content
				ObjectMapper objectMapper = new ObjectMapper();
				try {
					JsonNode expectedJson = objectMapper.readTree(expectedEmbeddedFileContent);
					JsonNode actualJson = objectMapper.readTree(embeddedFileContent);

					if (!expectedJson.equals(actualJson)) {
						throw new AssertionError("Embedded file content does not match the expected content");
					}
				} catch (IOException e) {
					throw new AssertionError("Error parsing JSON content", e);
				}
			} else if (shouldExist) {
				throw new AssertionError(
						"Embedded file '" + embeddedFileName + "' not found in the PDF, but it was expected");
			}
		}
	}

	static class JsonPdfArgumentsProvider implements ArgumentsProvider {
		@Override
		public Stream<? extends Arguments> provideArguments(ExtensionContext context) throws Exception {
			Path basePath = Paths.get("src", "test", "resources", "schemas");

			// Ensure the directory exists
			if (!Files.exists(basePath)) {
				throw new FileNotFoundException("Directory not found: " + basePath.toAbsolutePath());
			}

			// skips e-coc since it doesn't support rendering
			return Files.walk(basePath)
					.filter(path -> path.getFileName().toString().matches("valid_.*\\.json") && !path.toString().contains("E-CoC"))
					.map(path -> {
						Path pdfPath = Paths.get(path.toString().replace(".json", ".pdf"));
						return Arguments.of(path, pdfPath);
					});
		}
	}
}
