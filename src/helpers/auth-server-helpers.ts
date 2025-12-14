import "server-only";
import type { SupabaseClient, User, UserResponse } from "@supabase/supabase-js";
import { z } from "zod";
import { throwError, throwIfError } from "../error-utils.ts";

export async function getUser(supabase: SupabaseClient): Promise<User> {
  const startTime = Date.now();
  const response: UserResponse = await supabase.auth.getUser();
  throwIfError(response.error, "getUser");
  const endTime = Date.now();
  console.log(`getUser took ${endTime - startTime}ms`);
  return response.data.user;
}

/**
 * Fetches a user by their ID from Supabase.
 */
export async function getUserById(client: SupabaseClient, userId: string): Promise<User> {
  const {
    data: { user },
  } = await client.auth.admin.getUserById(userId);
  if (user === null) {
    const error = new Error(`User not found for id: ${userId}`);
    throwError(error, "getUserById", { userId: userId });
  }
  return user;
}

export function getUserMetadata<Metadata>(
  user: User,
  metadataSchema: z.ZodType<Metadata>
): Metadata {
  const { provider, ...metadata } = user.user_metadata;

  const parseResult = metadataSchema.safeParse(metadata);

  if (parseResult.error) {
    const errorMessage = z.treeifyError(parseResult.error);
    const error = new Error(`Metadata validation failed: ${errorMessage}`);
    throwError(error, "getUserMetadata", {
      validationError: errorMessage,
      metadata: metadata,
      user: user,
    });
  }

  return parseResult.data;
}

export function getPrivateUserMetadata<Metadata>(
  user: User,
  metadataSchema: z.ZodType<Metadata>
): Metadata {
  const { provider, ...metadata } = user.app_metadata;

  const parseResult = metadataSchema.safeParse(metadata);

  if (parseResult.error) {
    const errorMessage = z.treeifyError(parseResult.error);
    const error = new Error(`Metadata validation failed: ${errorMessage}`);
    throwError(error, "getPrivateUserMetadata", {
      validationError: errorMessage,
      metadata: metadata,
      user: user,
    });
  }

  return parseResult.data;
}
