
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    const containerName = req.query.container;
    const accountName = "webstoragefiles";

    const credential = new DefaultAzureCredential({
        managedIdentityClientId: "8ac2cfb8-30bb-40cc-83bc-6d1c71c0759a"
    });

    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        credential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobs = [];

    for await (const blob of containerClient.listBlobsFlat()) {
        blobs.push({
            name: blob.name,
            lastModified: blob.properties.lastModified,
            contentLength: blob.properties.contentLength
        });
    }

    context.res = {
        status: 200,
        body: blobs
    };
};
