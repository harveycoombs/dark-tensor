import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime";

const client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT ?? "",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? ""
    }
});

export async function uploadFile(source: string, destination: string): Promise<any> {
    const stream = fs.createReadStream(source);
  
    const result = await client.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET ?? "",
        Key: destination,  
        Body: stream,
        ContentType: mime.getType(source) ?? ""
    }));

    return result;
}

export async function deleteFile(key: string): Promise<any> {
    const result = await client.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET ?? "",
        Key: key
    }));

    return result;
}

export async function getFileMetadata(key: string): Promise<any> {
    const result = await client.send(new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET ?? "",
        Key: key
    }));

    return result;
}