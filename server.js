require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// E-posta gönderme yapılandırması
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true // Hata ayıklama modunu aktifleştir
});

// E-posta gönderme fonksiyonu
async function sendEmail(options) {
    try {
        const info = await transporter.sendMail(options);
        console.log('E-posta gönderildi:', info.messageId);
        return true;
    } catch (error) {
        console.error('E-posta gönderme hatası:', error);
        return false;
    }
}

app.post('/send-email', async (req, res) => {
    try {
        const { fullName, email, phone, message } = req.body;
        console.log('Gelen form verileri:', { fullName, email, phone, message });

        // Bana gelen e-posta içeriği
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: 'Yeni İletişim Formu Mesajı',
            html: `
                <h2>Yeni İletişim Formu Mesajı</h2>
                <p><strong>İsim Soyisim:</strong> ${fullName}</p>
                <p><strong>E-posta:</strong> ${email}</p>
                <p><strong>Telefon:</strong> ${phone}</p>
                <p><strong>Mesaj:</strong></p>
                <p>${message}</p>
            `
        };

        // Kullanıcıya gönderilecek otomatik yanıt e-postası
        const autoReplyOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mesajınız Alındı - Selim Karadaş',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Merhaba ${fullName},</h2>
                    <p>Ben Selim Karadaş. Mesajınızı aldım, en kısa zamanda size dönüş yapacağım.</p>
                    <p>İyi günler dilerim.</p>
                    <br>
                    <p style="color: #666; font-size: 14px;">Bu e-posta otomatik olarak gönderilmiştir.</p>
                </div>
            `
        };

        console.log('E-posta gönderme işlemi başlatılıyor...');
        console.log('Gönderen:', process.env.EMAIL_USER);
        console.log('Alıcı:', email);

        // Her iki e-postayı da gönder
        const [mainEmailSent, autoReplySent] = await Promise.all([
            sendEmail(mailOptions),
            sendEmail(autoReplyOptions)
        ]);

        if (!mainEmailSent || !autoReplySent) {
            throw new Error('E-postalardan biri veya her ikisi gönderilemedi');
        }

        console.log('Tüm e-postalar başarıyla gönderildi');
        res.status(200).json({ success: true, message: 'E-posta başarıyla gönderildi.' });
    } catch (error) {
        console.error('Detaylı hata:', error);
        res.status(500).json({ 
            success: false, 
            message: 'E-posta gönderilirken bir hata oluştu.',
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
}); 