export default async function handler(req, res) {
  const accessToken = "EAAUSrPVzDKQBPFpSt6o1UzMowOg6V2wvR6Mm1WTmM4ETuKlWJsJZAJ6gCvSNIg9Y0WTFb7Kfq603XiwGVZBoBgUQJ6SqbaweZBfLaIT5EUf9p2Yzp1EZBepVAPIOs3jQKBkvnWZA9bar2gbMfZCnKMnyPZBVW8CIUPTprbXFG38U61HyeUIkq3WoMI5YtTWVw4Mj9faL071MFdIjZC41CdfPyZAcPZCCSd6w8ajIiF1rwrFq3TNyNhHloPk6GWpwZDZD";

  try {
    // 1. Facebook 페이지 ID 조회
    const pagesResp = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    const pagesData = await pagesResp.json();
    const pageId = pagesData.data?.[0]?.id;

    if (!pageId) {
      return res.status(400).json({ error: "페이지 ID를 찾을 수 없습니다." });
    }

    // 2. 연결된 Instagram 계정 ID 조회
    const igResp = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=connected_instagram_account&access_token=${accessToken}`);
    const igData = await igResp.json();
    const igAccountId = igData.connected_instagram_account?.id;

    if (!igAccountId) {
      return res.status(400).json({ error: "Instagram 계정이 연결되어 있지 않거나, API에서 인식되지 않습니다." });
    }

    // 3. 인스타 게시물 목록 조회
    const mediaResp = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media?fields=id,caption,permalink&access_token=${accessToken}`);
    const mediaData = await mediaResp.json();

    const targetMedia = mediaData.data.find((post) => post.permalink.includes("DIitwQ_vGE_"));

    if (targetMedia) {
      return res.status(200).json({
        message: "✅ media ID 찾기 성공!",
        media_id: targetMedia.id,
        permalink: targetMedia.permalink,
        caption: targetMedia.caption,
      });
    } else {
      return res.status(404).json({ error: "해당 리일 shortcode를 포함한 게시물이 없습니다." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류 발생", detail: err.message });
  }
}
