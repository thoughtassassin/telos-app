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

  console.log('setting up S3...');

  AWS.config.update({ region: "us-east-1" });
  s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const uploadParams = {
    Bucket: "medicareforms3",
    Key: path.basename("server-medicare.pdf"),
    Body: await pdfDoc.save(),
  };

  console.log("sending file to S3...");

  try {
    const response = await s3.upload(uploadParams).promise();

    console.log("success..", response.Location);

    return {
      statusCode: 200,
      body: JSON.stringify({
        response: "File uploaded..." + response.Location,
      }),
    };
  } catch (e) {

    console.error(e);

    return {
      statusCode: 200,
      body: JSON.stringify({ error: e }),
    };
  }
};
