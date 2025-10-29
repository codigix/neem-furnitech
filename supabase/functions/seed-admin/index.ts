import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase environment variables" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // 1) Check if an admin already exists (safety - run only once)
    const { data: existingAdmins, error: checkError } = await adminClient
      .from("profiles")
      .select("id")
      .eq("is_admin", true)
      .limit(1);

    if (checkError) {
      console.error("Error checking existing admins:", checkError);
      return new Response(JSON.stringify({ error: checkError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({ message: "Admin already exists. Aborting seed." }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2) Create the initial admin user
    const adminEmail = "admin@neemfurnitech.com";
    const adminPassword = "Admin@12345"; // You can change this after login

    const { data: created, error: createUserError } = await adminClient.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (createUserError || !created?.user?.id) {
      console.error("Error creating admin user:", createUserError);
      return new Response(
        JSON.stringify({ error: createUserError?.message || "Failed to create user" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = created.user.id;

    // 3) Ensure profile exists and mark as admin
    const { error: upsertError } = await adminClient.from("profiles").upsert(
      { id: userId, email: adminEmail, is_admin: true },
      { onConflict: "id" }
    );

    if (upsertError) {
      console.error("Error upserting admin profile:", upsertError);
      return new Response(JSON.stringify({ error: upsertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const loginUrl = `${new URL(req.url).origin.replace(
      /\/$/,
      ""
    )}/admin`;

    return new Response(
      JSON.stringify({
        message: "Admin created successfully",
        credentials: { email: adminEmail, password: adminPassword },
        adminLoginUrl: "/admin",
        hint: `Open ${loginUrl} and sign in with the credentials above. Please change the password immediately after login.`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Unhandled error in seed-admin:", e);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
