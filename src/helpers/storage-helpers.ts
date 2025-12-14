import type { SupabaseClient } from "@supabase/supabase-js";
import { throwIfError } from "../error-utils.ts";

export type FileUpload = {
  id: string;
  path: string;
  fullPath: string;
  bucket: string;
  fileName: string;
  fileSize: number;
  fileType: string;
};

export type PublicFileUpload = FileUpload & { publicUrl: string };

type UploadParams = {
  client: SupabaseClient;
  bucket: string;
  filePath: string;
  file: File;
  upsert?: boolean;
};

export async function uploadFile({
  client,
  bucket,
  filePath,
  file,
  upsert,
}: UploadParams): Promise<FileUpload> {
  const { data, error } = await client.storage
    .from(bucket)
    .upload(filePath, file, { upsert: upsert });

  throwIfError(error, "uploadFile", {
    bucket: bucket,
    fileBody: file,
    upsert: upsert,
  });

  return {
    ...data,
    bucket: bucket,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  };
}

export async function uploadPublicFile({
  client,
  bucket,
  filePath,
  file,
  upsert,
}: UploadParams): Promise<PublicFileUpload> {
  const { data, error } = await client.storage
    .from(bucket)
    .upload(filePath, file, { upsert: upsert });

  throwIfError(error, "uploadPublicFile", {
    bucket: bucket,
    fileBody: file,
    upsert: upsert,
  });

  const {
    data: { publicUrl },
  } = client.storage.from(bucket).getPublicUrl(filePath);

  return {
    ...data,
    bucket: bucket,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    publicUrl: publicUrl,
  };
}

export async function getAttachmentSignedUrl(client: SupabaseClient, bucket: string, path: string) {
  const { data, error } = await client.storage.from(bucket).createSignedUrl(path, 60); // 60 seconds expiry

  throwIfError(error, "getAttachmentSignedUrl", { bucket: bucket, path: path });
  return data.signedUrl;
}

type DeleteParams = {
  client: SupabaseClient;
  bucket: string;
  filePaths: string[] | string;
};

export async function deleteFiles({ client, bucket, filePaths }: DeleteParams) {
  const { data, error } = await client.storage.from(bucket).remove(Array.from(filePaths));

  throwIfError(error, "deleteFiles", {
    bucket: bucket,
    filePaths: filePaths,
  });
}
