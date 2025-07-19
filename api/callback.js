import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("❌ 인증 코드가 없습니다.");
  }

  try {
    const response = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
      params: {
        client_id: "1427908945185956",
        client_secret: "c2643c795f622d25289d992c074c1c2f",
        redirect_uri: "https://autodm-auth.vercel.app/api/callback",
        code: code,
      },
    });

    const accessToken = response.data.access_token;

    res.status(200).send(`
      <h2>✅ 인증 성공!</h2>
      <p><strong>Access Token:</strong></p>
      <code style="word-break:break-all; white-space:normal; background:#f2f2f2; padding:10px; display:block;">
        ${accessToken}
      </code>
    `);
  } catch (err) {
    console.error("Access Token 요청 실패:", err.response?.data || err.message);
    res.status(500).send("❌ Access Token 발급에 실패했습니다.");
  }
}
