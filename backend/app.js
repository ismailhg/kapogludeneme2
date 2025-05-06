const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

// reCAPTCHA gizli anahtar
const RECAPTCHA_SECRET = "6LeN9y8rAAAAAFti9VK9U3xk1uQs0YatBW3SXtan";

// Mail hesap bilgileri
const MAIL_USER = "ismailhgndgd@gmail.com"; // Gönderen e-posta adresi
const MAIL_PASS = "satpvgpjoegbfzqc"; // E-posta şifresi
const MAIL_TO = "isog183400@gmail.com"; // Alıcı e-posta adresi

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("frontend"));

// İletişim formu verisini al ve reCAPTCHA doğrulaması yap
app.post("/submit-form", async (req, res) => {
  const {
    name,
    email,
    phone,
    message,
    "g-recaptcha-response": recaptchaToken,
  } = req.body;

  // reCAPTCHA token kontrolü
  if (!recaptchaToken) {
    return res
      .status(400)
      .json({ message: "Lütfen reCAPTCHA doğrulamasını tamamlayın." });
  }

  try {
    // reCAPTCHA doğrulaması
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`;
    const recaptchaResponse = await axios.post(verificationURL);

    if (!recaptchaResponse.data.success) {
      return res
        .status(400)
        .json({ message: "reCAPTCHA doğrulaması başarısız." });
    }

    // Nodemailer ile e-posta gönderimi
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: MAIL_TO,
      subject: "Yeni İletişim Formu Mesajı",
      text: `Ad: ${name}\nE-posta: ${email}\nTelefon: ${phone}\nMesaj: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Mesajınız başarıyla gönderildi!" });
  } catch (err) {
    console.error("Hata:", err);
    return res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${port}`);
});
