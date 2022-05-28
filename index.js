const fs = require("fs/promises");
const { PDFDocument } = require("pdf-lib");
const AWS = require("aws-sdk");
const path = require("path");

exports.handler = async (event) => {
  try {
    console.log("event object", event);

    const data = await fs.readFile("medicare-form.pdf");
    const pdfDoc = await PDFDocument.load(data);
    const form = pdfDoc.getForm();

    let firstNameResponse = "Johnny";
    let lastNameResponse = "Depp";

    const firstName = form.getTextField("firstname");
    const lastName = form.getTextField("lastname");
    const spouseFirstname = form.getTextField("spouseFirstname");
    const spouseLastname = form.getTextField("spouseLastname");

    if (
      event &&
      event.ApplicantInfo &&
      event.ApplicantInfo.Name
    ) {
      firstNameResponse = event.ApplicantInfo.Name.First;
      lastNameResponse = event.ApplicantInfo.Name.Last;
      firstName.setText(firstNameResponse);
      lastName.setText(lastNameResponse);
    } else {
      firstName.setText("Johnny");
      lastName.setText("Depp");
    }

    if (event && event.SpouseInfo2 && event.SpouseInfo2.Name) {
      spouseFirstname.setText(event.SpouseInfo2.Name.First);
      spouseLastname.setText(event.SpouseInfo2.Name.Last);
    } else {
      spouseFirstname.setText("Black");
      spouseLastname.setText("Canary");
    }

    console.log("setting up S3...");

    AWS.config.update({ region: "us-east-1" });
    s3 = new AWS.S3({ apiVersion: "2006-03-01" });
    const uploadParams = {
      Bucket: "medicareforms3",
      Key: path.basename(
        `${firstNameResponse.toLowerCase()}-${lastNameResponse.toLowerCase()}-medicare.pdf`
      ),
      Body: await pdfDoc.save(),
    };

    console.log("sending file to S3...");

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
