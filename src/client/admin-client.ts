import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SupabaseAdminClientOptions = {
  url: string;
  serviceRoleKey: string;
};

/**
 * Creates a Supabase client with admin privileges using the service role key.
 * - This client should only be used in server-side code to perform administrative tasks.
 * - NEVER! expose the service role key to the client side, as it has full access to your database.
 * - NEVER! use this client in client-side code.
 */
export default function createAdminClient({
  url,
  serviceRoleKey,
}: SupabaseAdminClientOptions): SupabaseClient {
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
