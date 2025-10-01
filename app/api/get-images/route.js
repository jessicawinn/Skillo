import { BlobServiceClient } from "@azure/storage-blob";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return new Response(JSON.stringify({ message: "Missing courseId" }), { status: 400 });
    }

    const containerName = process.env.AZURE_CONTAINER_NAME || "skillo-images";
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const prefix = `${courseId}/`;
    const urls = [];

    for await (const blob of containerClient.listBlobsFlat({ prefix })) {
      // Construct the public URL directly
      const publicUrl = `https://skillo.blob.core.windows.net/${containerName}/${blob.name}`;
      urls.push(publicUrl);
    }

    return new Response(JSON.stringify({ urls }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Failed to fetch images" }), { status: 500 });
  }
}
