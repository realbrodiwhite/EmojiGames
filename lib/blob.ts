import { BlobServiceClient } from '@azure/storage-blob';

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONNECTION_STRING);

export async function uploadImage(containerName: string, blobName: string, file: File) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();
  
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadBrowserFile(file);
  
  return blockBlobClient.url; // Return the URL of the uploaded image
}

export async function getImageUrl(containerName: string, blobName: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  return blockBlobClient.url; // Return the URL of the image
}
