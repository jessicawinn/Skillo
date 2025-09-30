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
  const blobPath = `${courseId}/${fileName}`;

    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient("skillo-images");
    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

    // Detect MIME type from file name (basic)
    const mimeType = file.type || (file.name.endsWith('.png') ? 'image/png' : file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') ? 'image/jpeg' : file.name.endsWith('.webp') ? 'image/webp' : 'application/octet-stream');
    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: {
        blobContentType: mimeType,
        blobContentDisposition: 'inline',
      },
    });

    return new Response(JSON.stringify({ url: blockBlobClient.url }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Image upload failed" }), { status: 500 });
  }
}
