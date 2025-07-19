export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("❌ 인증 코드가 없습니다.");
  }

  const params = new URLSearchParams({
    client_id: "1427908945185956",
    client_secret: "c2643c795f622d25289d992c074c1c2f",
    redirect_uri: "https://autodm-auth.vercel.app/api/callback",
    code: code,
  });

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${params}`);
    const data = await response.json();

    if (data.access_token) {
      res.status(200).send(`
        <h2>✅ 인증 성공!</h2>
        <p><strong>Access Token:</strong></p>
        <code style="word-break:break-all; white-space:normal; background:#f2f2f2; padding:10px; display:block;">
          ${data.access_token}
        </code>
      `);
    } else {
      res.status(500).send("❌ 인증 실패: " + JSON.stringify(data));
    }
  } catch (error) {
    console.error("Token 요청 실패:", error);
    res.status(500).send("❌ 서버 오류 발생");
  }
}
