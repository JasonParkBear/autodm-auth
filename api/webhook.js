/**
 * Instagram 댓글 감지 Webhook + DM 자동 발송
 * 조건  : media_id === 18023659113770918  &&  댓글 내용에 '나트랑' 포함
 * 응답 DM: '나트랑 좋아요'
 */

const VERIFY_TOKEN = "jasonVerify123";          // Meta > Webhooks 등록 때 입력할 Verify Token
const IG_BUSINESS_ID = "17841462814371773";     // Jason님의 Instagram 비즈니스 계정 ID
const TARGET_MEDIA_ID = "18023659113770918";    // 리일(media) ID
const ACCESS_TOKEN = "EAAUSrPVzDKQBPOSUZAVqZANNUaQj6WoqzZAU8oTN2TdVx8s7lVwAnF8QpgAmZBd2c7GewNKcEZA6ofBZApG86JZBjrHt8W6ebSLZAn0IbogTr4nBWDZCWzCnnMNKqkty6ZAKLCWaFasxjW4kfh5OMBbnVDIr7X837emFr3gy62aZCsiqZAZCkanym0bks3H3LZBz1ZCyE7IH38v4ZCfI2VUOWvpQZAFkTvy6OEDnWN0pM8jSByud2pZBkeA8necTnsVOZBlEAZDZD"; // 새로 받은 Access Token ★필수★

export default async function handler(req, res) {
  // ① Webhook URL 검증 (페이스북이 GET 호출)
  if (req.method === "GET") {
    const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query;
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Verification failed");
  }

  // ② 댓글 이벤트 POST 수신
  if (req.method === "POST") {
    try {
      const body = req.body;

      // 이벤트 안에 media_id  및 comment 텍스트 파싱
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;

      const mediaId = value.media_id;                 // 댓글이 달린 게시물 ID
      const commentText = value.text?.toLowerCase();  // 댓글 내용
      const senderId = value.from?.id;                // 댓글 작성자 Instagram ID

      // ▶︎ 조건 체크 (media ID + 키워드 '나트랑')
      const keywordMatched = commentText?.includes("나트랑");

      if (mediaId === TARGET_MEDIA_ID && keywordMatched && senderId) {
        // ③ DM 전송
        const dmResp = await fetch(`https://graph.facebook.com/v19.0/${IG_BUSINESS_ID}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: { id: senderId },
            message: { text: "나트랑 좋아요" },
            access_token: ACCESS_TOKEN,
          }),
        });
        const dmJson = await dmResp.json();
        console.log("DM result:", dmJson);
      }

      res.status(200).send("EVENT_RECEIVED");
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(500).send("Server error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
