import { BlobServiceClient } from "@azure/storage-blob";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const instructorId = formData.get("instructorId");
    const courseId = formData.get("courseId");
    if (!file || !instructorId || !courseId) {
      return new Response(JSON.stringify({ message: "Missing file or IDs" }), { status: 400 });
    }
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const blobPath = `${instructorId}/${courseId}/${fileName}`;

    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient("skillo-images");
    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

    await blockBlobClient.uploadData(fileBuffer);

    return new Response(JSON.stringify({ url: blockBlobClient.url }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Image upload failed" }), { status: 500 });
  }
}
