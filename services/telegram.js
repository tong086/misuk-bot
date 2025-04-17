const axios = require('axios');
require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

async function replyTelegram(chatId, text) {
  try {
    await axios.post(TELEGRAM_URL, {
      chat_id: chatId,
      text: text
    });
  } catch (error) {
    console.error('Telegram error:', error.message);
  }
}

module.exports = { replyTelegram };
