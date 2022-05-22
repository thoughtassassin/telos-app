const fs = require("fs/promises");
const { PDFDocument } = require("pdf-lib");

exports.handler = async (event) => {
  const data = await fs.readFile("medicare-form.pdf");
  const pdfDoc = await PDFDocument.load(data);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  const fieldsList = fields.map(
    (field, index) => `${index + 1}. ${field.getName()}`
  );

  form.getTextField("firstname").setText("Clark");
  form.getTextField("lastname").setText("Kent");
  form.getTextField("spouseFirstname").setText("Lois");
  form.getTextField("spouseLastname").setText("Lane");

  fs.writeFile("saved-medicare-form.pdf", await pdfDoc.save());

  return {
    statusCode: 200,
    body: fieldsList,
  };
};
