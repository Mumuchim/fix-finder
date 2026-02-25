// supabase/functions/send-email-notifications/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as nodemailer from "https://esm.sh/nodemailer@6.9.8";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: Deno.env.get("GMAIL_USER"),
    pass: Deno.env.get("GMAIL_PASSWORD"),
  },
});

serve(async (req) => {
  try {
    const { type, table, record } = await req.json();
    
    // New report created - notify admin
    if (table === "reports" && type === "INSERT") {
      await transporter.sendMail({
        from: '"FixFinder" <fixfinder3jp@gmail.com>',
        to: "fixfinder3jp@gmail.com", // Admin email
        subject: `New Report: ${record.title}`,
        text: `New ${record.type} report submitted by ${record.name}:\n\n${record.details}`,
      });
    }

    // Report status updated - notify user
    if (table === "reports" && type === "UPDATE") {
      const { data: user } = await supabase.auth.admin.getUserById(record.user_uid);
      
      const messages = {
        "In Progress": {
          subject: "Report Accepted",
          text: `Your ${record.type} report at ${record.specific_place} has been accepted and is being processed`,
        },
        "Denied": {
          subject: "Report Denied",
          text: `Your ${record.type} report at ${record.specific_place} has been denied. Reason: ${record.denied_reason}`,
        },
        "Resolved": {
          subject: "Report Resolved",
          text: `Your ${record.type} report at ${record.specific_place} has been resolved!`,
        }
      };

      if (messages[record.status] && user?.user?.email) {
        await transporter.sendMail({
          from: '"FixFinder" <fixfinder3jp@gmail.com>',
          to: user.user.email,
          subject: messages[record.status].subject,
          text: messages[record.status].text,
        });
      }
    }

    return new Response("OK");
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});