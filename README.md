# Telos Tech App

This application reads a Texas Human Health Services Medicare application pdf modifies a few fields and saves the file to an S3 bucket. To run the app:

- `npm i`
- `node testHandler.js`

## Bundling and uploading to S3

- `cd` into root directory
- run `zip -r9 <zip-name-here>.zip .`
- upload zip file to S3 using AWS Console