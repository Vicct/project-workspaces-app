
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    const containerName = req.query.container;
    const fileName = req.query.filename;
    const accountName = "webstoragefiles";

    const credential = new DefaultAzureCredential({
        managedIdentityClientId: "8ac2cfb8-30bb-40cc-83bc-6d1c71c0759a"
    });

    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        credential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const content = req.body;
    const uploadBlobResponse = await blockBlobClient.upload(content, Buffer.byteLength(content));

    context.res = {
        status: 200,
        body: { message: "File uploaded successfully", requestId: uploadBlobResponse.requestId }
    };
};
