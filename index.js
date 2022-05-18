import fs from "fs/promises";
import { PDFDocument } from "pdf-lib";

const fetchAndParsePDF = async () => {
  const data = await fs.readFile(
    "1200-eng2011.pdf"
  );  
  const pdfDoc = await PDFDocument.load(data);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  fields.forEach((field, index) => console.log(`${index + 1}. ${field.getName()}`));
};

fetchAndParsePDF();
