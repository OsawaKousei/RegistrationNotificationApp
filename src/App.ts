// --- 型定義 ---
interface FormSubmitEvent {
  response: GoogleAppsScript.Forms.FormResponse;
}

// .envから注入されたWebhook URL
const DISCORD_WEBHOOK_URL: string = process.env.DISCORD_WEBHOOK_URL || "";

export const App = (e: FormSubmitEvent) => {
  try {
    const itemResponses = e.response.getItemResponses();
    let applicantName = "（名前未入力）"; // デフォルト値を設定

    // すべての回答をループして「お名前」の項目を探す
    for (const itemResponse of itemResponses) {
      if (itemResponse.getItem().getTitle() === "お名前") {
        applicantName = itemResponse.getResponse() as string;
        break; // 見つかったらループを抜ける
      }
    }

    // Discordに送信するメッセージを作成
    const payload = {
      content: "新しい入会申請がありました。",
      embeds: [
        {
          title: "申請内容",
          fields: [{ name: "申請者名", value: applicantName }],
          color: 15258703,
        },
      ],
    };

    // DiscordのWebhook URLにPOSTリクエストを送信
    UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
    });
  } catch (error) {
    // エラーが発生した場合、GASのログに出力
    console.error("フォーム送信通知処理でエラーが発生しました:", error);
  }
};
