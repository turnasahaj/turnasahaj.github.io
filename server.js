import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

/* ==============================
   SUPABASE
============================== */

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* ==============================
   EXPRESS
============================== */

const app = express();
app.use(cors());
app.use(express.json());

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FRONTEND SERVE KARNE KE LIYE
app.use(express.static(path.join(__dirname, "../")));

const PORT = process.env.PORT || 5000;

/* ==============================
   CHAT ROUTE
============================== */

app.post("/chat", async (req, res) => {
  console.log("CHAT HIT");
  console.log("BODY:", req.body);

  const { message, user_id, session_id } = req.body;

  if (!message || !session_id) {
    return res.status(400).json({
      reply: "Message or Session ID missing"
    });
  }

  try {

    if (user_id) {
      await supabase.from("chat_messages").insert([
        {
          user_id,
          session_id,
          role: "user",
          content: message
        }
      ]);
    }

    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are Turna AI, a premium intelligent assistant."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply = aiResponse.data.choices[0].message.content;

    if (user_id) {
      await supabase.from("chat_messages").insert([
        {
          user_id,
          session_id,
          role: "assistant",
          content: aiReply
        }
      ]);
    }

    return res.json({ reply: aiReply });

  } catch (err) {

    console.log("===== GROQ ERROR START =====");
    console.log(err.response?.data || err.message || err);
    console.log("===== GROQ ERROR END =====");

    return res.status(500).json({
      reply: "AI ERROR - CHECK TERMINAL"
    });
  }
});

/* ==============================
   START SERVER
============================== */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
