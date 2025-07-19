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
        code,
      },
    });

    const accessToken = response.data.access_token;
    res.status(200).send(`✅ 인증 성공! Access Token: ${accessToken}`);
  } catch (err) {
    res.status(500).send("❌ Access Token 발급 실패");
  }
}
