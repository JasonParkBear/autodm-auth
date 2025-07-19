export default async function handler(req, res) {
  const accessToken = "EAAUSrPVzDKQBPAvZAaxUhBRfgfb488SB1IicgRu1L2DSvAanZArKRLhX5u3GLZBSVXSEKhOM5iZB7B0cNEsMottVEZB2ZBlWJ2DakhzZA40vjMSCywt6hMyu9YHmiDVNXZCMJ3f4dw6vXFrzVerX2IDXroOPFuoNOP7hjIZBrZAzniQUcd0aa2pEVDPVQdJUhsKPkat2CMTOoCiwJgXkYIiZAevBQBI3Dae6ZCtADXN5hQOZBBv3Pcs63jc8sEIWIowZDZD";

  try {
    // 1. Facebook 페이지 ID 조회
    const pagesResp = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    const pagesData = await pagesResp.json();
    const pageId = pagesData.data[0].id;

    // 2. 연결된 Instagram 계정 ID 조회
    const igResp = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=connected_instagram_account&access_token=${accessToken}`);
    const igData = await igResp.json();
    const igAccountId = igData.connected_instagram_account.id;

    // 3. 인스타 게시물 목록 조회
    const mediaResp = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media?fields=id,caption,permalink&access_token=${accessToken}`);
    const mediaData = await mediaResp.json();

    // 4. permalink에 shortcode 포함된 게시물 찾기
    const targetMedia = mediaData.data.find((post) => post.permalink.includes("DIitwQ_vGE_"));

    if (targetMedia) {
      res.status(200).json({
        message: "✅ media ID 찾기 성공!",
        media_id: targetMedia.id,
        permalink: targetMedia.permalink,
        caption: targetMedia.caption,
      });
    } else {
      res.status(404).json({ error: "해당 shortcode를 포함한 게시물이 없습니다." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류 발생", detail: err.message });
  }
}
