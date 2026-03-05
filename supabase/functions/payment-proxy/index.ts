import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const APP_ORIGIN = Deno.env.get("APP_ORIGIN") ?? "https://lior-ai.com";
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": APP_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-idempotency-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      ...securityHeaders,
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: { ...corsHeaders, ...securityHeaders } });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ ok: false, error: "Missing required env vars" }, 500);
    }

    const origin = req.headers.get("origin") || "";
    if (origin && origin !== APP_ORIGIN) {
      return json({ ok: false, error: "Origin is not allowed" }, 403);
    }

    const idempotencyKey = req.headers.get("x-idempotency-key") || crypto.randomUUID();
    const payload = await req.json().catch(() => null) as null | {
      amount_ils?: number;
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
      description?: string;
      source?: string;
    };

    if (!payload) return json({ ok: false, error: "Invalid JSON" }, 400);

    const amountIls = Number(payload.amount_ils ?? 0);
    if (!Number.isFinite(amountIls) || amountIls < 10 || amountIls > 50000) {
      return json({ ok: false, error: "amount_ils out of allowed range" }, 400);
    }

    const amountAgorot = Math.round(amountIls * 100);
    const customerName = String(payload.customer_name ?? "").trim().slice(0, 120);
    const customerEmail = String(payload.customer_email ?? "").trim().slice(0, 200);
    const customerPhone = String(payload.customer_phone ?? "").trim().slice(0, 40);
    const description = String(payload.description ?? "שירותי lior-ai").trim().slice(0, 300);
    const source = String(payload.source ?? "site_checkout").trim().slice(0, 60);

    if (!customerName || !customerEmail) {
      return json({ ok: false, error: "customer_name and customer_email are required" }, 400);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    const { data: existing, error: selectError } = await supabase
      .from("payment_requests")
      .select("id, provider_payment_intent_id, client_secret, amount_agorot, status")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    if (selectError) return json({ ok: false, error: selectError.message }, 500);

    if (existing?.provider_payment_intent_id && existing?.client_secret) {
      return json({
        ok: true,
        payment_intent_id: existing.provider_payment_intent_id,
        client_secret: existing.client_secret,
        amount_agorot: existing.amount_agorot,
        status: existing.status,
        idempotent: true,
      });
    }

    const stripeBody = new URLSearchParams({
      amount: String(amountAgorot),
      currency: "ils",
      "automatic_payment_methods[enabled]": "true",
      description,
      receipt_email: customerEmail,
      "metadata[source]": source,
      "metadata[customer_name]": customerName,
      "metadata[customer_phone]": customerPhone,
    });

    const stripeResp = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "content-type": "application/x-www-form-urlencoded",
        "Idempotency-Key": idempotencyKey,
      },
      body: stripeBody.toString(),
    });

    const stripeJson = await stripeResp.json().catch(() => ({}));
    if (!stripeResp.ok) {
      return json({ ok: false, error: stripeJson?.error?.message ?? "Stripe error" }, 502);
    }

    const insertPayload = {
      idempotency_key: idempotencyKey,
      provider: "stripe",
      provider_payment_intent_id: String(stripeJson.id ?? ""),
      client_secret: String(stripeJson.client_secret ?? ""),
      amount_agorot: amountAgorot,
      currency: "ILS",
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      source,
      status: String(stripeJson.status ?? "requires_payment_method"),
      raw_provider_response: stripeJson,
    };

    const { error: insertError } = await supabase.from("payment_requests").upsert(insertPayload, { onConflict: "idempotency_key" });
    if (insertError) return json({ ok: false, error: insertError.message }, 500);

    return json({
      ok: true,
      payment_intent_id: stripeJson.id,
      client_secret: stripeJson.client_secret,
      amount_agorot: amountAgorot,
      currency: "ILS",
      status: stripeJson.status,
      idempotent: false,
    });
  } catch (e) {
    return json({ ok: false, error: String((e as Error).message || e) }, 500);
  }
});
