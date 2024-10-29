module.exports = {
    "awsS3": {
        "accessKeyId": process.env.awsAccessKey,
        "secretAccessKey": process.env.awsSecretKey,
        "Bucket": process.env.AWS_S3_BUCKET,
        "expireTime": parseInt(process.env.AWS_S3_EXPIRY_TIME),
        "signatureVersion": process.env.AWS_S3_SIGNATURE_VERSION,
        "region": process.env.AWS_S3_REGION
    }
};