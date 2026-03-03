// supabase/functions/claude-proxy/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Supabase CORS headers pattern (wildcard) – adjust origin if you want to lock it down
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ChatMsg = { role: "user" | "assistant"; content: string };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json; charset=utf-8" },
  });
}

function text(body: string, status = 200) {
  return new Response(body, { status, headers: { ...corsHeaders, "content-type": "text/plain; charset=utf-8" } });
}

// Very strict "JSON only" helper
function safeParseJson(s: string): any | null {
  try { return JSON.parse(s); } catch { return null; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ANTHROPIC_API_KEY) {
      return text("Missing env vars: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / ANTHROPIC_API_KEY", 500);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const payload = await req.json().catch(() => ({}));
    const lead = payload?.lead as
      | { name?: string; phone?: string; email?: string; source?: string; page_url?: string; notes?: string }
      | undefined;

    // 1) If lead is included — save lead to DB
    if (lead && (lead.name || lead.phone || lead.email)) {
      const toInsert = {
        name: String(lead.name ?? "").trim() || null,
        phone: String(lead.phone ?? "").trim() || null,
        email: String(lead.email ?? "").trim() || null,
        source: String(lead.source ?? "chat_widget"),
        page_url: String(lead.page_url ?? payload?.page_url ?? ""),
        notes: String(lead.notes ?? ""),
      };
      const { error } = await supabase.from("leads").insert(toInsert);
      if (error) return json({ ok: false, error: error.message }, 500);
      return json({ ok: true });
    }

    // 2) Otherwise — chat request
    const incoming = (payload?.messages ?? []) as Array<{ role?: string; content?: string }>;
    const messages: ChatMsg[] = incoming
      .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string")
      .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content) }))
      .slice(-18);

    const system = `
את/ה "סוכנת lior_Ai" – עוזרת מכירות/שירות באתר www.lior-ai.com.
שפה: עברית בלבד, RTL, קצרה, מדויקת, חמה ומקצועית.
ידע עסקי:
- מותג: lior_Ai. מנוהל על ידי ליאור בלול.
- ניסיון: 18+ שנות ניסיון בנדל"ן ובנייה בישראל.
- התמחות: נדל״ן, בנייה, התחדשות עירונית, עורכי דין, עסקים קטנים-בינוניים.
- בידול: לא מוכרים "אתר יפה" אלא תהליך שמייצר לידים.
שירותים ומחירים:
- דף נחיתה: החל מ-1,200 ₪ + מע״מ
- אתר תדמית: החל מ-2,200 ₪ + מע״מ
- סוכן AI (צ׳אטבוט): 200 ₪/חודש
- פרופיל עסקי בגוגל: שירות נפרד
- סוכנת קולית AI: בהשקה
- ייעוץ AI / קידום: לעסקים שרוצים לגדול
יצירת לידים:
- כשלקוח מביע עניין (רוצה להתחיל/מחיר/הצעה/לחזור אליו), בקש בעדינות להשאיר:
שם + טלפון + אימייל.
- אל תמציא פרטים.
- אם שואלים איך ליצור קשר: וואטסאפ https://wa.me/972508668022 ואימייל liorbll100@gmail.com.
חשוב: החזר *רק JSON תקין* בלי טקסט מסביב. הפורמט:
{
  "reply": "…טקסט תשובה בעברית…",
  "collect_lead": true/false,
  "quick_actions": ["שאלה קצרה 1", "שאלה קצרה 2", "שאלה קצרה 3"]
}
`;

    if (messages.length === 0) {
      return json({
        reply: "שלום! במה אפשר לעזור? אפשר לשאול על מחירים, שירותים, או להשאיר פרטים להצעה.",
        collect_lead: false,
        quick_actions: ["כמה עולה סוכן AI?", "כמה עולה דף נחיתה?", "אני רוצה הצעה"],
      });
    }

    const anthropicBody = {
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    };

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(anthropicBody),
    });

    if (!r.ok) {
      const errTxt = await r.text().catch(() => "");
      return json({ reply: "יש תקלה זמנית בחיבור. אפשר להשאיר פרטים או לפנות בוואטסאפ 🙏", collect_lead: true, error: errTxt }, 200);
    }

    const out = await r.json();
    // Anthropic returns: content: [{type:"text", text:"..."}]
    const textBlock = Array.isArray(out?.content) ? out.content.find((c: any) => c?.type === "text") : null;
    let rawText = String(textBlock?.text ?? "").trim();

    // Strip markdown code fences (e.g. ```json ... ```) that the model sometimes wraps around JSON
    rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    // Our system instructs JSON only, so try parse:
    const parsed = safeParseJson(rawText);
    if (parsed && typeof parsed.reply === "string") {
      // Normalize
      return json({
        reply: parsed.reply,
        collect_lead: !!parsed.collect_lead,
        quick_actions: Array.isArray(parsed.quick_actions) ? parsed.quick_actions.slice(0, 3) : [],
      });
    }

    // Fallback if model didn't comply:
    return json({
      reply: rawText || "איך אפשר לעזור? אפשר לשאול מחיר/תהליך/או להשאיר פרטים להצעה.",
      collect_lead: false,
      quick_actions: ["כמה עולה סוכן AI?", "כמה עולה דף נחיתה?", "אני רוצה הצעה"],
    });
  } catch (e) {
    return json({ reply: "משהו השתבש. אפשר להשאיר פרטים או לפנות בוואטסאפ 🙏", collect_lead: true, error: String((e as any)?.message ?? e) }, 200);
  }
});
