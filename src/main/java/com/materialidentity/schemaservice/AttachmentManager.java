package com.materialidentity.schemaservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSArray;
import org.apache.pdfbox.cos.COSDictionary;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.PDDocumentNameDictionary;
import org.apache.pdfbox.pdmodel.PDEmbeddedFilesNameTreeNode;
import org.apache.pdfbox.pdmodel.common.filespecification.PDComplexFileSpecification;
import org.apache.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import static com.materialidentity.schemaservice.config.SchemaControllerConstants.DEFAULT_PDF_ATTACHMENT_CERT_FILE_EXTENSION;

public class AttachmentManager {

    private final String contentString;
    private final Boolean attachJson;
    private String filename;

    public AttachmentManager(String contentString, String filename, Boolean attachJson) {
        this.contentString = contentString;
        this.filename = filename;
        this.attachJson = attachJson;
    }

    public byte[] attach(byte[] pdfData) throws IOException {
        if (!attachJson) {
            return pdfData;
        }
        String prettyContentString = prettyPrintJson(contentString);
        PDDocument document = Loader.loadPDF(pdfData);
        PDComplexFileSpecification fs = new PDComplexFileSpecification();
        if (!filename.endsWith(DEFAULT_PDF_ATTACHMENT_CERT_FILE_EXTENSION)) {
            filename += DEFAULT_PDF_ATTACHMENT_CERT_FILE_EXTENSION;
        }
        fs.setFile(filename);
        fs.setFileUnicode(filename);

        byte[] contentBytes = prettyContentString.getBytes(StandardCharsets.UTF_8);

        InputStream is = new ByteArrayInputStream(contentBytes);
        PDEmbeddedFile embeddedFile = new PDEmbeddedFile(document, is);
        embeddedFile.setSubtype("application/json");
        embeddedFile.setSize(contentBytes.length);
        var currentDate = Calendar.getInstance();
        embeddedFile.setCreationDate(currentDate);
        embeddedFile.setModDate(currentDate);
        fs.setEmbeddedFile(embeddedFile);
        fs.setEmbeddedFileUnicode(embeddedFile);

        COSDictionary dict = fs.getCOSObject();
        dict.setName("AFRelationship", "Alternative");

        PDDocumentCatalog catalog = document.getDocumentCatalog();
        COSArray cosArray = new COSArray();
        cosArray.add(fs.getCOSObject());
        catalog.getCOSObject().setItem(COSName.AF, cosArray);

        PDEmbeddedFilesNameTreeNode efTree = new PDEmbeddedFilesNameTreeNode();
        Map<String, PDComplexFileSpecification> efMap = new HashMap<>();
        efMap.put(filename, fs);
        efTree.setNames(efMap);

        PDDocumentNameDictionary names = new PDDocumentNameDictionary(
                document.getDocumentCatalog());
        names.setEmbeddedFiles(efTree);
        document.getDocumentCatalog().setNames(names);

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        document.save(output);
        return output.toByteArray();
    }

    private String prettyPrintJson(String jsonString) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectWriter writer = mapper.writerWithDefaultPrettyPrinter();
        Object json = mapper.readValue(jsonString, Object.class);
        return writer.writeValueAsString(json);
    }
}
