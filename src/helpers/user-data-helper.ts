import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { z } from "zod";
import { throwError } from "../error-utils.ts";
import { buildUserDataSchema, type SupabaseMetadata, type UserData } from "../types.ts";
import { getUser } from "./auth-server-helpers.ts";

type MetadataSchemaParams<
  AppMetadata extends SupabaseMetadata,
  UserMetadata extends SupabaseMetadata,
> = {
  appMetadataSchema: z.ZodSchema<AppMetadata>;
  userMetadataSchema: z.ZodSchema<UserMetadata>;
};

type ParseUserDataParams<
  AppMetadata extends SupabaseMetadata,
  UserMetadata extends SupabaseMetadata,
> = { user: User } & MetadataSchemaParams<AppMetadata, UserMetadata>;

export function parseUserData<
  AppMetadata extends SupabaseMetadata,
  UserMetadata extends SupabaseMetadata,
>({
  user,
  appMetadataSchema,
  userMetadataSchema,
}: ParseUserDataParams<AppMetadata, UserMetadata>): UserData<AppMetadata, UserMetadata> {
  const userDataObject = {
    id: user.id,
    // biome-ignore lint/style/noNonNullAssertion: false positive
    email: user.email!,
    appMetadata: user.app_metadata,
    userMetadata: user.user_metadata,
  };

  const userDataSchema = buildUserDataSchema<AppMetadata, UserMetadata>(
    appMetadataSchema,
    userMetadataSchema
  );
  const parsedData = userDataSchema.safeParse(userDataObject);

  if (parsedData.error) {
    const message = `Parse error: ${z.treeifyError(parsedData.error)}`;
    const error = new Error(message);
    throwError(error, "parseBasicUserData", {
      extra: {
        claims: userDataObject,
        parsedData: parsedData,
        message: message,
      },
      level: "fatal",
      tags: {
        method: "parseBasicUserData",
      },
    });
  }
  return parsedData.data;
}

type GetUserDataFromUserParams<
  AppMetadata extends SupabaseMetadata,
  UserMetadata extends SupabaseMetadata,
> = { client: SupabaseClient } & MetadataSchemaParams<AppMetadata, UserMetadata>;

export async function getUserDataFromUser<
  AppMetadata extends SupabaseMetadata,
  UserMetadata extends SupabaseMetadata,
>({
  client,
  appMetadataSchema,
  userMetadataSchema,
}: GetUserDataFromUserParams<AppMetadata, UserMetadata>): Promise<{
  userData: UserData<AppMetadata, UserMetadata>;
  user: User;
}> {
  const user = await getUser(client);
  return {
    user: user,
    userData: parseUserData({
      user: user,
      appMetadataSchema: appMetadataSchema,
      userMetadataSchema: userMetadataSchema,
    }),
  };
}
