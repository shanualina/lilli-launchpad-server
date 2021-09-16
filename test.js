const AWS = require('aws-sdk');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME
} = require('dotenv').config().parsed;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET_NAME) {
    throw new Error('Invalid .env config');
}
const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const uploadDirectoryPath = path.join(__dirname, './public/images');

const uploadFiles = (directoryPath, s3client) => promisify(fs.readdir)(directoryPath)
    .then(files => files.map(fileName => getUploadFileOptions(fileName, directoryPath, AWS_S3_BUCKET_NAME)))
    .then(uploadOptions => Promise.all(uploadOptions.map(option => uploadFile(option, s3client))))
    .catch(e => {
        console.log('Failed to upload files');
        throw e;
    });

const getUploadFileOptions = (fileName, uploadDirectoryPath, bucketName) => ({
    Bucket: bucketName,
    Key: fileName,
    Body: fs.readFileSync(path.join(uploadDirectoryPath, fileName)),
    ContentType: 'text/html',
    ACL: 'public-read'
});

const uploadFile = (options, s3client) => s3client.upload(options).promise()
    .then(data => {
        console.log('Uploaded', data.Key);
        return data;
    })
    .catch(err => {
        console.log('Falied do upload', err);
        throw err;
    });


uploadFiles(uploadDirectoryPath, s3)
    .then(() => console.log('💪 Successful upload'));