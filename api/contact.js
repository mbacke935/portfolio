export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const { name, email, subject, message, adminEmail } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim() || !adminEmail?.trim()) {
    return res.status(400).json({ error: 'Champs manquants.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Service email non configuré côté serveur.' });
  }

  const emailSubject = subject?.trim() || `Nouveau message de ${name.trim()} — Portfolio`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#102033">
      <div style="background:#061a40;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#ffffff;font-size:20px;margin:0">Message via portfolio</h1>
      </div>
      <div style="border:1px solid #d6e4f2;border-top:none;padding:28px 32px;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr>
            <td style="padding:8px 0;font-weight:700;width:100px;color:#5b6b80;font-size:13px;text-transform:uppercase">Nom</td>
            <td style="padding:8px 0">${escapeHtml(name.trim())}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:700;color:#5b6b80;font-size:13px;text-transform:uppercase">Email</td>
            <td style="padding:8px 0"><a href="mailto:${escapeHtml(email.trim())}" style="color:#1f7ae0">${escapeHtml(email.trim())}</a></td>
          </tr>
          ${subject?.trim() ? `
          <tr>
            <td style="padding:8px 0;font-weight:700;color:#5b6b80;font-size:13px;text-transform:uppercase">Sujet</td>
            <td style="padding:8px 0">${escapeHtml(subject.trim())}</td>
          </tr>` : ''}
        </table>
        <hr style="border:none;border-top:1px solid #d6e4f2;margin:0 0 20px" />
        <p style="white-space:pre-wrap;line-height:1.7;margin:0">${escapeHtml(message.trim())}</p>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [adminEmail.trim()],
        reply_to: email.trim(),
        subject: emailSubject,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      console.error('Resend error:', body);
      return res.status(502).json({ error: "Échec de l'envoi email." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
