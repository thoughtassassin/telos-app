const fs = require("fs/promises");
const { PDFDocument } = require("pdf-lib");
const AWS = require('aws-sdk');
const path = require("path");

exports.handler = async (event) => {
  const data = await fs.readFile("medicare-form.pdf");
  const pdfDoc = await PDFDocument.load(data);
  const form = pdfDoc.getForm();

  form.getTextField("firstname").setText("Green");
  form.getTextField("lastname").setText("Arrow");
  form.getTextField("spouseFirstname").setText("Black");
  form.getTextField("spouseLastname").setText("Canary");

  AWS.config.update({ region: "us-east-1" });
  s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const uploadParams = {
    Bucket: "medicareforms3",
    Key: path.basename("new-saved-medicare.pdf"),
    Body: await pdfDoc.save(),
  };
  s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    }
    if (data) {
      console.log("Upload Success", data.Location);
    }
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify({ response: 'File uploaded' }),
  };
};
