import { z } from "zod";

export type SupabaseMetadata = { [key: string]: any };

export type UserData<
  AppMetadata extends SupabaseMetadata,
  UserMetadata extends SupabaseMetadata,
> = {
  id: string;
  email: string;
  appMetadata: AppMetadata;
  userMetadata: UserMetadata;
};

export function buildUserDataSchema<
  AppMetadata extends SupabaseMetadata,
  UserMetadata extends SupabaseMetadata,
>(appMetadataSchema: z.ZodSchema<AppMetadata>, userMetadataSchema: z.ZodSchema<UserMetadata>) {
  return z.object({
    id: z.uuid(),
    email: z.email(),
    appMetadata: appMetadataSchema,
    userMetadata: userMetadataSchema,
  });
}
