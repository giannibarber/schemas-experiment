package com.materialidentity.schemaservice;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import net.sf.saxon.TransformerFactoryImpl;

public class XsltTransformer {

  private String xsltSource;
  private JsonNode source;

  public JsonNode getSource() {
    return source;
  }

  public XsltTransformer(String xsltSource, JsonNode source) {
    this.xsltSource = xsltSource;
    this.source = source;
  }

  public String transform() throws TransformerException, IOException {
    String xmlSource = jsonNodeToXml(source);

    Source xmlInput = new StreamSource(new StringReader(xmlSource));
    Source xsltInput = new StreamSource(new StringReader(xsltSource));
    StringWriter outputWriter = new StringWriter();

    TransformerFactory factory = new TransformerFactoryImpl();
    Transformer transformer = factory.newTransformer(xsltInput);
    transformer.transform(xmlInput, new StreamResult(outputWriter));

    return outputWriter.toString();
  }

  private String jsonNodeToXml(JsonNode jsonNode) throws IOException {
    XmlMapper xmlMapper = new XmlMapper();
    return xmlMapper.writer().withRootName("Root").writeValueAsString(jsonNode);
  }
}
