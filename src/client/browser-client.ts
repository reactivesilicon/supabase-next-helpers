import { createBrowserClient as createClient } from "@supabase/ssr";

type SupabaseBrowserClientOptions = {
  supabaseUrl: string;
  supabasePublicKey: string;
};

export default function createBrowserClient({
  supabaseUrl,
  supabasePublicKey,
}: SupabaseBrowserClientOptions) {
  return createClient(supabaseUrl, supabasePublicKey);
}
