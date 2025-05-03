const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express(); // app burada tanımlanmalı
const port = 3000;

// Middleware'ler
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Statik dosyalar (HTML, CSS, JS) frontend klasöründen servis edilecek
app.use(express.static("frontend"));

// Form verilerini işlemek için POST endpoint
app.post("/submit-form", (req, res) => {
  const { name, email, phone, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ismailhgndgd@gmail.com",
      pass: "satpvgpjoegbfzqc", // Gmail uygulama şifresi
    },
  });
  // Gönderilecek e-posta içeriği
  const mailOptions = {
    from: email,
    to: "isog183400@gmail.com",
    subject: "Yeni Mesaj (Web Form)",
    text: `Ad: ${name}\nE-posta: ${email}\nTelefon: ${phone}\nMesaj: ${message}`,
  };

  // E-posta gönderme
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("E-posta gönderim hatası:", error);
      res.status(500).send("Hata oluştu.");
    } else {
      console.log("E-posta gönderildi:", info.response);
      res.status(200).send("Mesajınız başarıyla gönderildi!");
    }
  });
});

// Sunucu başlatılıyor
app.listen(port, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${port}`);
});
