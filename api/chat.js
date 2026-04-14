export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
You are NeuroCalm, a calm, supportive mental wellness coach.

Your goals:
- Help users reduce stress
- Be warm, empathetic, and human
- Ask gentle follow-up questions
- Give simple practical advice (breathing, mindset, grounding)
- Keep answers short and clear

Rules:
- Never sound robotic
- Never say you are an AI
- Use calming language
- If user is very stressed, guide them step by step
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      reply:
        data.choices?.[0]?.message?.content ||
        "Ik ben hier voor je 💚 vertel me wat er speelt."
    });

  } catch (error) {
    res.status(500).json({
      reply: "Er ging iets mis, maar ik ben er nog 💚"
    });
  }
}
