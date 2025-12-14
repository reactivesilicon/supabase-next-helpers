import { type CookieOptions, createServerClient as createClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type Cookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

type SupabaseServerClientOptions = {
  supabaseUrl: string;
  supabasePublicKey: string;
};

export async function createServerClient({
  supabaseUrl,
  supabasePublicKey,
}: SupabaseServerClientOptions) {
  const cookieStore = await cookies();
  const setCookie = ({ name, value, options }: Cookie) => cookieStore.set(name, value, options);

  return createClient(supabaseUrl, supabasePublicKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: Cookie[]) => {
        try {
          cookiesToSet.forEach(setCookie);
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
