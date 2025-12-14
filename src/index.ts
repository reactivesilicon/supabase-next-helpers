/** biome-ignore-all lint/performance/noBarrelFile: library entry point */
// Client exports
export { createAdminClient } from "./client/admin-client.ts";
export { createBrowserClient } from "./client/browser-client.ts";
export { createMiddlewareClient } from "./client/middleware-client.ts";
export { createServerClient } from "./client/server-client.ts";

// Error utility exports
export {
  logError,
  logIfError,
  throwError,
  throwIfError,
} from "./error-utils.ts";

// Helper exports
export {
  getPrivateUserMetadata,
  getUser,
  getUserById,
  getUserMetadata,
} from "./helpers/auth-server-helpers.ts";
export {
  updatePrivateUserMetadata,
  updateUserMetadata,
} from "./helpers/metadata-helpers.ts";
export {
  deleteFiles,
  type FileUpload,
  getAttachmentSignedUrl,
  type PublicFileUpload,
  uploadFile,
  uploadPublicFile,
} from "./helpers/storage-helpers.ts";
export {
  getUserDataFromUser,
  parseUserData,
} from "./helpers/user-data-helper.ts";

// Type exports
export type {
  SupabaseMetadata,
  UserData,
} from "./types.ts";
