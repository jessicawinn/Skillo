import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_BLOB_CONTAINER || "skillo-images";

export const config = { api: { bodyParser: false } };

async function deleteBlob(blobUrl) {
  if (!blobUrl) return;
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    // Extract blob name from URL (courseId/image)
    const urlParts = blobUrl.split("/");
    // Find the courseId/image part after the container name
    const containerIndex = urlParts.findIndex(p => p === CONTAINER_NAME);
    const blobName = urlParts.slice(containerIndex + 1).join("/");
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
  } catch (err) {
    console.error("Error deleting blob:", err);
  }
}

async function uploadBlob(file, courseId) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  // Always store as courseId/image
  const blobName = `${courseId}/${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await blockBlobClient.uploadData(buffer);
  const publicUrl = `https://skillo.blob.core.windows.net/${CONTAINER_NAME}/${blobName}`;
  return publicUrl;
}

export async function POST(req) {
  const formData = await req.formData();
  const courseId = formData.get('courseId');
  const oldImageUrl = formData.get('oldImageUrl');
  const newImage = formData.get('newImage');

  if (!courseId || !newImage) {
    return NextResponse.json({ error: "Missing courseId or newImage" }, { status: 400 });
  }

  // Delete old image
  await deleteBlob(oldImageUrl);

  // Upload new image
  let newImageUrl = "";
  if (newImage) {
    newImageUrl = await uploadBlob(newImage, courseId);
  }

  return NextResponse.json({ url: newImageUrl });
}