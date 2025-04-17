const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { replyTelegram } = require('./services/telegram');
const { getNickname, saveNickname, saveNote } = require('./services/sheets');

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const message = req.body.message;
  if (!message || !message.text) return res.sendStatus(200);

  const userId = message.from.id.toString();
  const text = message.text.trim();

  const nicknameMatch = text.match(/ชื่อเล่น.*(คือ|=)\s*(.+)/i);
  if (nicknameMatch) {
    const nickname = nicknameMatch[2].trim();
    await saveNickname(userId, nickname);
    await replyTelegram(userId, `น้องมีสุขจะจำชื่อคุณว่า "${nickname}" นะคะ 😊`);
    return res.sendStatus(200);
  }

  const name = await getNickname(userId) || 'เพื่อนใหม่';
  await saveNote(userId, text);

  let reply = '';
  if (/สวัสดี|hello|hi/i.test(text)) {
    reply = `สวัสดีค่ะคุณ ${name} 😊 น้องมีสุขอยู่ตรงนี้แล้วนะ`;
  } else if (/เหนื่อย|ท้อ|ไม่ไหว/i.test(text)) {
    reply = `ไม่เป็นไรนะคะคุณ ${name} 🌷 พักก่อน แล้วค่อยไปต่อ น้องมีสุขเป็นกำลังใจให้เสมอค่ะ`;
  } else if (/ขอบคุณ|thank/i.test(text)) {
    reply = `น้องมีสุขดีใจมากเลยค่ะคุณ ${name} ขอบคุณเช่นกันนะคะ 🌟`;
  } else {
    reply = `คุณ ${name} พิมพ์ว่า: "${text}" น้องมีสุขรับรู้แล้วนะคะ หากต้องการให้ช่วยอะไร พิมพ์มาได้เลยค่ะ 💬`;
  }

  await replyTelegram(userId, reply);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('น้องมีสุขพร้อมทำงานแล้วค่ะ 😊');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot is running on port ${PORT}`));
