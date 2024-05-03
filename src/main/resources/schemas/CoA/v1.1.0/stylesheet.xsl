<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:fo="http://www.w3.org/1999/XSL/Format">
  <xsl:template match="/">
    <fo:root>
      <fo:layout-master-set>
        <fo:simple-page-master master-name="simple" page-height="29.7cm" page-width="21cm"
          margin="1cm">
          <fo:region-body margin="0.25cm" margin-bottom="1.8cm" />
          <fo:region-after extent="1.5cm" />
        </fo:simple-page-master>
      </fo:layout-master-set>
      <fo:page-sequence master-reference="simple">
        <!-- Page number -->
        <fo:static-content flow-name="xsl-region-after">
          <fo:block font-size="8pt" text-align="center" margin-right="1cm" font-family="NotoSans">
            <fo:page-number />/
            <fo:page-number-citation-last ref-id="last-page" />
          </fo:block>
        </fo:static-content>
        <!-- Body -->
        <fo:flow flow-name="xsl-region-body" font-family="NotoSans">
          <!-- Global variables -->
          <xsl:variable name="i18n" select="Root/Translations" />
          <xsl:variable name="Parties" select="Root/Certificate/Parties" />
          <xsl:variable name="Standard" select="Root/Certificate/Standard" />
          <xsl:variable name="Order" select="Root/Certificate/BusinessTransaction/Order" />
          <xsl:variable name="Delivery" select="Root/Certificate/BusinessTransaction/Delivery" />
          <xsl:variable name="Product" select="Root/Certificate/Product" />
          <xsl:variable name="Analysis" select="Root/Certificate/Analysis" />
          <fo:block font-size="8pt">
            <!-- Parties -->
            <fo:table table-layout="fixed" width="100%">
              <fo:table-column column-width="33%" />
              <fo:table-column column-width="33%" />
              <fo:table-column column-width="33%" />
              <fo:table-body>
                <fo:table-row>
                  <fo:table-cell number-columns-spanned="2" padding-bottom="8pt">
                    <fo:block>
                      <fo:external-graphic src="{Root/Certificate/Logo}" content-height="48px"
                        height="48px" />
                    </fo:block>
                  </fo:table-cell>
                  <xsl:call-template name="PartyInfo">
                    <xsl:with-param name="party" select="$Parties/Manufacturer" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="PartyInfo">
                    <xsl:with-param name="title" select="'Kunde / Customer'" />
                    <xsl:with-param
                      name="party" select="$Parties/Customer" />
                  </xsl:call-template>
                  <xsl:call-template name="PartyInfo">
                    <xsl:with-param name="title"
                      select="'Zertifikatsempfänger / Certificate recipient'" />
                    <xsl:with-param
                      name="party" select="$Parties/Receiver" />
                  </xsl:call-template>
                  <xsl:call-template name="PartyInfo">
                    <xsl:with-param name="title" select="'Warenempfänger / Goods recipient'" />
                    <xsl:with-param
                      name="party" select="$Parties/GoodsReceiver" />
                  </xsl:call-template>
                </fo:table-row>
              </fo:table-body>
            </fo:table>
            <!-- Certificate info -->
            <xsl:call-template
              name="SectionTitle">
              <xsl:with-param name="title"
                select="concat('Certificate ', $Standard/Norm, ' ', $Standard/Type)" />
            </xsl:call-template>
            <fo:table
              table-layout="fixed" width="100%">
              <fo:table-column column-width="30%" />
              <fo:table-column column-width="20%" />
              <fo:table-column column-width="30%" />
              <fo:table-column column-width="20%" />
              <fo:table-body>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Zertifikatsnummer / Certificate ID'" />
                    <xsl:with-param name="value"
                      select="Root/Certificate/Id" />
                  </xsl:call-template>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Datum / Date'" />
                    <xsl:with-param name="value"
                      select="Root/Certificate/Date" />
                  </xsl:call-template>
                </fo:table-row>
              </fo:table-body>
            </fo:table>
            <!-- Business data -->
            <fo:table
              table-layout="fixed" width="100%">
              <fo:table-column column-width="50%" />
              <fo:table-column column-width="50%" />
              <fo:table-body>
                <fo:table-row>
                  <fo:table-cell padding-right="12pt" padding-top="12pt">
                    <xsl:call-template name="SectionTitle">
                      <xsl:with-param name="title"
                        select="'Bestellung / Order'" />
                    </xsl:call-template>
                    <fo:table table-layout="fixed" width="100%">
                      <fo:table-column column-width="70%" />
                      <fo:table-column column-width="30%" />
                      <fo:table-body>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Nummer / ID'" />
                            <xsl:with-param name="value"
                              select="$Order/Id" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Position / Item no.'" />
                            <xsl:with-param name="value"
                              select="$Order/Position" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Menge / Quantity'" />
                            <xsl:with-param name="value"
                              select="$Order/Quantity" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Datum / Date'" />
                            <xsl:with-param name="value"
                              select="$Order/Date" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Produktnummer / Product ID'" />
                            <xsl:with-param name="value"
                              select="$Order/CustomerProductId" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Produktname / Product name'" />
                            <xsl:with-param name="value"
                              select="$Order/CustomerProductName" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Wareneingangsnummer / Goods 
                              receipt ID'" />
                            <xsl:with-param
                              name="value"
                              select="$Order/GoodsReceiptId" />
                          </xsl:call-template>
                        </fo:table-row>
                      </fo:table-body>
                    </fo:table>
                  </fo:table-cell>
                  <fo:table-cell padding-top="12pt">
                    <xsl:call-template name="SectionTitle">
                      <xsl:with-param name="title"
                        select="'Lieferung / Delivery'" />
                    </xsl:call-template>
                    <fo:table table-layout="fixed" width="100%">
                      <fo:table-column column-width="70%" />
                      <fo:table-column column-width="30%" />
                      <fo:table-body>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Nummer / ID'" />
                            <xsl:with-param name="value"
                              select="$Delivery/Id" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Position / Item no.'" />
                            <xsl:with-param name="value"
                              select="$Delivery/Position" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Menge / Quantity'" />
                            <xsl:with-param name="value"
                              select="$Delivery/Quantity" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Datum / Date'" />
                            <xsl:with-param name="value"
                              select="$Delivery/Date" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Auftragsnummer / Order ID'" />
                            <xsl:with-param name="value"
                              select="$Delivery/InternalOrderId" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Auftragsposition / Order item no.'" />
                            <xsl:with-param
                              name="value"
                              select="$Delivery/InternalOrderPosition" />
                          </xsl:call-template>
                        </fo:table-row>
                        <fo:table-row>
                          <xsl:call-template name="KeyValue">
                            <xsl:with-param name="key"
                              select="'Transport / Transport'" />
                            <xsl:with-param name="value"
                              select="$Delivery/Transport" />
                          </xsl:call-template>
                        </fo:table-row>
                      </fo:table-body>
                    </fo:table>
                  </fo:table-cell>
                </fo:table-row>
              </fo:table-body>
            </fo:table>
            <!-- Product -->
            <xsl:call-template
              name="SectionTitle">
              <xsl:with-param name="title"
                select="'Produkt / Product'" />
            </xsl:call-template>
            <fo:table
              table-layout="fixed" width="100%">
              <fo:table-column column-width="50%" />
              <fo:table-column column-width="50%" />
              <fo:table-body>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Produktnummer / Product ID'" />
                    <xsl:with-param name="value"
                      select="$Product/Id" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Handelsbezeichnung / Product designation'" />
                    <xsl:with-param
                      name="value"
                      select="$Product/Name" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Herkunftsland / Country of origin'" />
                    <xsl:with-param name="value"
                      select="$Product/CountryOfOrigin" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Herkunftsort / Place of origin'" />
                    <xsl:with-param name="value"
                      select="$Product/PlaceOfOrigin" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Abfüllcharge / Filling batch ID'" />
                    <xsl:with-param name="value"
                      select="$Product/FillingBatchId" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Abfülldatum / Filling batch date'" />
                    <xsl:with-param name="value"
                      select="$Product/FillingBatchDate" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Produktionscharge / Production batch ID'" />
                    <xsl:with-param
                      name="value"
                      select="$Product/ProductionBatchId" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Produktionsdatum / Production date'" />
                    <xsl:with-param name="value"
                      select="$Product/ProductionDate" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Ablaufdatum / Expiry date'" />
                    <xsl:with-param name="value"
                      select="$Product/ExpirationDate" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Normen / Standards'" />
                    <xsl:with-param name="value"
                      select="string-join($Product/Standards, ', ')" />
                  </xsl:call-template>
                </fo:table-row>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Zusätzliche Informationen / Additional information'" />
                    <xsl:with-param
                      name="value"
                      select="string-join($Product/AdditionalInformation, ', ')" />
                  </xsl:call-template>
                </fo:table-row>
              </fo:table-body>
            </fo:table>
            <!-- Inspections -->
            <xsl:call-template
              name="SectionTitle">
              <xsl:with-param name="title"
                select="'Prüfungen / Inspections'" />
            </xsl:call-template>
            <fo:table
              table-layout="fixed" width="100%">
              <fo:table-column column-width="50%" />
              <fo:table-column column-width="50%" />
              <fo:table-body>
                <fo:table-row>
                  <xsl:call-template name="KeyValue">
                    <xsl:with-param name="key"
                      select="'Prüflos / Lot ID'" />
                    <xsl:with-param name="value"
                      select="$Analysis/LotId" />
                  </xsl:call-template>
                </fo:table-row>
              </fo:table-body>
            </fo:table>
            <fo:table margin-top="12pt"
              width="100%">
              <fo:table-column column-width="15%" />
              <fo:table-column column-width="15%" />
              <fo:table-column column-width="14%" />
              <fo:table-column column-width="14%" />
              <fo:table-column column-width="14%" />
              <fo:table-column column-width="14%" />
              <fo:table-column column-width="14%" />
              <fo:table-body>
                <fo:table-row>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Eigenschaft / Property
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Methode / Method
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Einheit / Unit
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Wert / Value
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Minimum / Minimum
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Maximum / Maximum
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Prüfbedingungen / Inspection conditions
                    </fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <xsl:for-each select="$Analysis/Inspections">
                  <fo:table-row>
                    <fo:table-cell>
                      <fo:block font-family="NotoSans" font-style="italic">
                        <xsl:value-of select="Property" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block>
                        <xsl:value-of select="Method" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block>
                        <xsl:value-of select="Unit" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block>
                        <xsl:value-of select="Value" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block>
                        <xsl:value-of select="Minimum" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block>
                        <xsl:value-of select="Maximum" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block>
                        <xsl:value-of select="TestConditions" />
                      </fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                </xsl:for-each>
              </fo:table-body>
            </fo:table>
            <!-- Declaration -->
            <xsl:call-template
              name="SectionTitle">
              <xsl:with-param name="title"
                select="'Erklärung / Declaration'" />
            </xsl:call-template>
            <fo:block>
              <xsl:value-of select="Root/Certificate/DeclarationOfConformity/Declaration" />
            </fo:block>
            <!-- Contact persons -->
            <xsl:call-template
              name="SectionTitle">
              <xsl:with-param name="title"
                select="'Ansprechpartner / Contact persons'" />
            </xsl:call-template>
            <fo:table
              width="100%">
              <fo:table-column column-width="20%" />
              <fo:table-column column-width="20%" />
              <fo:table-column column-width="20%" />
              <fo:table-column column-width="20%" />
              <fo:table-column column-width="20%" />
              <fo:table-body>
                <fo:table-row>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Name / Name
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Rolle / Post
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Abteilung / Department
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Email / Email
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block font-weight="bold">
                      Telefon / Phone
                    </fo:block>
                  </fo:table-cell>
                </fo:table-row>
                <xsl:for-each select="Root/Certificate/Contacts">
                  <fo:table-row>
                    <fo:table-cell>
                      <fo:block font-family="NotoSans" font-style="italic">
                        <xsl:value-of select="Name" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block>
                        <xsl:value-of select="Role" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block>
                        <xsl:value-of select="Department" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block>
                        <xsl:value-of select="Email" />
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block>
                        <xsl:value-of select="Phone" />
                      </fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                </xsl:for-each>
              </fo:table-body>
            </fo:table>
            <!-- Disclaimer -->
            <fo:block border-top="solid 1pt black" margin-top="16pt" padding-top="6pt">
              <xsl:value-of select="Root/Certificate/Disclaimer" />
            </fo:block>
            <!-- Attachments -->
            <xsl:call-template
              name="SectionTitle">
              <xsl:with-param name="title"
                select="'Anlagen / Attachments'" />
            </xsl:call-template>
            <fo:table
              width="100%">
              <fo:table-column column-width="100%" />
              <fo:table-body>
                <xsl:for-each select="Root/Certificate/Attachments">
                  <fo:table-row>
                    <fo:table-cell>
                      <fo:block font-family="NotoSans" font-style="italic">
                        <xsl:value-of select="FileName" />
                      </fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                </xsl:for-each>
              </fo:table-body>
            </fo:table>
            <!-- Footer -->
            <fo:table
              margin-top="16pt"
              width="100%">
              <fo:table-column column-width="50%" />
              <fo:table-column column-width="50%" />
              <fo:table-body>
                <fo:table-row>
                  <fo:table-cell>
                    <fo:block> Data schema maintained by
                      <fo:basic-link
                        external-destination="https://materialidentity.org">
                        <fo:inline text-decoration="underline">Material Identity</fo:inline>
                      </fo:basic-link>
  .
                    </fo:block>
                  </fo:table-cell>
                  <fo:table-cell>
                    <fo:block color="gray" text-align="right">
                      <fo:basic-link external-destination="{Root/RefSchemaUrl}">
                        <fo:inline text-decoration="underline">
                          <xsl:value-of select="Root/RefSchemaUrl" />
                        </fo:inline>
                      </fo:basic-link>
                    </fo:block>
                  </fo:table-cell>
                </fo:table-row>
              </fo:table-body>
            </fo:table>
            <!-- Used to get the last page number -->
            <fo:block
              id="last-page" />
          </fo:block>
        </fo:flow>
      </fo:page-sequence>
    </fo:root>
  </xsl:template>
  <xsl:template
    name="SectionTitle">
    <xsl:param name="title" />
    <fo:block font-size="10pt" font-weight="bold"
      text-align="left" space-before="12pt" space-after="6pt" border-bottom="solid 1pt black">
      <xsl:value-of
        select="$title" />
    </fo:block>
  </xsl:template>
  <xsl:template name="KeyValue">
    <xsl:param name="key" />
    <xsl:param name="value" />
    <fo:table-cell>
      <fo:block font-family="NotoSans" font-style="italic">
        <xsl:value-of select="$key" />
      </fo:block>
    </fo:table-cell>
    <fo:table-cell>
      <fo:block>
        <xsl:value-of select="$value" />
      </fo:block>
    </fo:table-cell>
  </xsl:template>
  <xsl:template
    name="PartyInfo">
    <xsl:param name="title" />
    <xsl:param name="party" />
    <fo:table-cell>
      <fo:block padding-bottom="4pt" font-weight="bold">
        <xsl:value-of select="$title" />
      </fo:block>
      <fo:block>
        <xsl:value-of select="$party/Name" />
      </fo:block>
      <fo:block>
        <xsl:value-of select="$party/Street" />
      </fo:block>
      <xsl:for-each select="$party/Streets/Street">
        <fo:block>
          <xsl:value-of select="." />
        </fo:block>
      </xsl:for-each>
      <fo:block>
        <xsl:value-of select="concat($party/ZipCode, ' ', $party/City, ', ', $party/Country)" />
      </fo:block>
      <fo:block>
        <fo:basic-link external-destination="{concat('mailto:', $party/Email)}">
          <fo:inline text-decoration="underline">
            <xsl:value-of select="$party/Email" />
          </fo:inline>
        </fo:basic-link>
      </fo:block>
    </fo:table-cell>
  </xsl:template>
</xsl:stylesheet>