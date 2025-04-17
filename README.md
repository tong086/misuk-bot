# น้องมีสุข (Misuk Bot)

ระบบแชทบอทอัจฉริยะสำหรับ Telegram + Google Sheets ด้วย Node.js

## วิธีใช้ (บน Vercel)

1. อัปโหลดโปรเจกต์นี้ไป GitHub
2. สมัคร Vercel และเชื่อมกับ GitHub
3. ตั้ง Environment Variables:
   - TELEGRAM_TOKEN = token ของ Telegram Bot
   - SPREADSHEET_ID = รหัส Google Sheets (จาก URL)
4. สร้าง Service Account และอัปโหลด `credentials.json`
5. แชร์ชีตให้กับ Service Account Email
6. Deploy แล้วนำ URL ไป set webhook:

```
https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://<your-vercel-url>/webhook
```

เรียบร้อยแล้วน้องมีสุขจะเริ่มทำงานได้ทันที 😊
