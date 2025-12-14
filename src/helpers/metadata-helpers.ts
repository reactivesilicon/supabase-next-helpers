import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { throwError } from "../error-utils.ts";
import type { SupabaseMetadata, UserData } from "../types.ts";

function validateMetadata<Metadata extends SupabaseMetadata>(
  metadata: Metadata,
  metadataSchema: z.ZodType<Metadata>
): Metadata {
  const parseResult = metadataSchema.safeParse(metadata);
  if (parseResult.error) {
    const errorMessage = z.treeifyError(parseResult.error);
    const error = new Error(`validateMetadata-Metadata validation failed: ${errorMessage}`);
    throwError(error, "validateMetadata", {
      extra: {
        validationError: errorMessage,
        metadata: metadata,
      },
      level: "fatal",
      tags: {
        method: "validateMetadata",
      },
    });
  }
  return parseResult.data;
}

type UpdateMetadataParams<Metadata extends SupabaseMetadata> = {
  adminClient: SupabaseClient;
  metadata: Partial<Metadata>;
  metadataSchema: z.ZodType<Metadata>;
};

type UpdateUserMetadataParams<Metadata extends SupabaseMetadata> = {
  userData: UserData<any, Metadata>;
} & UpdateMetadataParams<Metadata>;

export async function updateUserMetadata<Metadata extends object>({
  adminClient,
  userData,
  metadata,
  metadataSchema,
}: UpdateUserMetadataParams<Metadata>) {
  const data: Metadata = { ...userData.userMetadata, ...metadata };
  const validatedData = validateMetadata<Metadata>(data, metadataSchema);
  await adminClient.auth.admin.updateUserById(userData.id, { user_metadata: validatedData });
}

type UpdatePrivateUserMetadataParams<Metadata extends SupabaseMetadata> = {
  userData: UserData<Metadata, any>;
} & UpdateMetadataParams<Metadata>;

export async function updatePrivateUserMetadata<Metadata extends object>({
  adminClient,
  userData,
  metadata,
  metadataSchema,
}: UpdatePrivateUserMetadataParams<Metadata>) {
  const data: Metadata = { ...userData.appMetadata, ...metadata };
  const validatedData = validateMetadata<Metadata>(data, metadataSchema);
  await adminClient.auth.admin.updateUserById(userData.id, { app_metadata: validatedData });
}
