// index.js
const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Jason님의 인증 서버 작동 중입니다!");
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send("❌ 인증 코드가 전달되지 않았습니다.");
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/oauth/access_token`,
      {
        params: {
          client_id: "1427908945185956",
          client_secret: "c2643c795f622d25289d992c074c1c2f",
          redirect_uri: "https://autodm-jason.vercel.app/auth/callback",
          code: code,
        },
      }
    );

    const token = response.data.access_token;
    res.send(`✅ 인증 성공! Access Token: ${token}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send("❌ Access Token 발급에 실패했습니다.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});