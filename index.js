var AWS = require("aws-sdk");

exports.handler = async (event, context, call) => {
  let S3 = new AWS.S3({ region: process.env.AWS_REGION });

  var payload = {
    id: event.id,
    email: event.email,
    path: event.path,
  };

  var params = {
    Bucket: "medicareforms3",
    Key: event.id + ".txt",
    Body: JSON.stringify(payload),
    ContentType: "text/plain",
  };

  try {
    let s3Response = await S3.upload(params).promise();

    let res = {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: event.id,
        email: event.email,
        path: event.path,
        s3Path: s3Response.Location,
      }),
    };

    return res;
  } catch (error) {
    let fail = {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error,
      }),
    };

    return fail;
  }
};
