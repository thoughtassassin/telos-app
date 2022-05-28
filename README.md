# Telos Tech App

This application reads a Texas Human Health Services Medicare application pdf and lists the active fields. To run the app:

- `npm i`
- `node index.js`

## Bundling and uploading to S3

- `cd` into root directory
- run `zip -r9 <zip-name-here>.zip .`
- upload zip file to S3 using AWS Console