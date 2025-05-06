document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuLinks = mobileMenu.querySelectorAll("a");

  function toggleMenu() {
    mobileMenu.classList.toggle("open");
  }

  menuToggle.addEventListener("click", toggleMenu);

  menuLinks.forEach((link) => {
    link.addEventListener("click", toggleMenu);
  });

  document.addEventListener("click", function (event) {
    const isInsideMenu = mobileMenu.contains(event.target);
    const isMenuToggle = menuToggle.contains(event.target);

    if (
      !isInsideMenu &&
      !isMenuToggle &&
      mobileMenu.classList.contains("open")
    ) {
      toggleMenu();
    }
  });

  // Hero resim geçişi
  const heroSection = document.getElementById("hero");
  const images = [
    "assests/img/image3.jpg",
    "assests/img/image1.jpg",
    "assests/img/image2.jpg",
  ];
  let current = 0;
  let next = 1;

  // İlk resmi hemen göster
  heroSection.style.background = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${images[current]}') center/cover no-repeat`;

  // Arkaplan resmini değiştiren fonksiyon
  function changeBackground() {
    const overlay = document.createElement("div");
    overlay.className = "hero-overlay";
    overlay.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${images[next]}')`;
    heroSection.appendChild(overlay);

    setTimeout(() => {
      overlay.style.opacity = 1;
    }, 50);

    setTimeout(() => {
      heroSection.style.background = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${images[next]}') center/cover no-repeat`;
      heroSection.removeChild(overlay);

      current = next;
      next = (next + 1) % images.length;
    }, 1000);
  }

  setInterval(changeBackground, 5000);

  // AOS Animasyon Başlatma
  AOS.init({
    duration: 600,
    once: false,
    mirror: true,
  });

  // Testimonial Slider Başlatma
  const testimonialSwiper = new Swiper("#testimonialSwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  // Markalar Slider Başlatma
  const brandsSwiper = new Swiper("#brandsSwiper", {
    slidesPerView: 2,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    breakpoints: {
      640: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      1024: { slidesPerView: 5 },
    },
  });

  // Animasyonlu Sayaçlar
  const counters = document.querySelectorAll(".counter-value");
  const speed = 50;

  counters.forEach((counter) => {
    const animate = () => {
      const value = +counter.getAttribute("data-target");
      const data = +counter.innerText;

      const time = value / speed;
      if (data < value) {
        counter.innerText = Math.ceil(data + time);
        setTimeout(animate, 50);
      } else {
        if (
          counter.parentElement.querySelector("p").innerText === "Memnuniyet"
        ) {
          counter.innerText = "%" + value;
        } else {
          counter.innerText = value;
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(counter);
  });

  // Whatsapp Linki
  const phoneNumber = "905xxxxxxxxx";
  const message = "Merhaba, websiteniz aracılığıyla size ulaşıyorum.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  document.getElementById("whatsappLink").setAttribute("href", whatsappLink);

  // İletişim Formu
  const form = document.getElementById("iletisimFormu");
  const emailInput = form.querySelector('input[name="email"]');
  const phoneInput = form.querySelector('input[name="phone"]');
  const emailFeedback = document.getElementById("emailFeedback");
  const phoneFeedback = document.getElementById("phoneFeedback");

  const phoneMask = new Inputmask("+\\9\\0 (599) 999 99 99");
  phoneMask.mask(phoneInput);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const setValidationState = (input, isValid, feedbackEl, message = "") => {
    if (isValid) {
      input.classList.remove("is-invalid");
      feedbackEl.textContent = "";
    } else {
      input.classList.add("is-invalid");
      if (message) feedbackEl.textContent = message;
    }
  };

  emailInput.addEventListener("input", () => {
    const isValid = validateEmail(emailInput.value);
    setValidationState(
      emailInput,
      isValid,
      emailFeedback,
      "Geçerli bir e-posta adresi giriniz."
    );
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    let isFormValid = true;

    form.querySelectorAll("[required]").forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add("is-invalid");
        isFormValid = false;
      } else {
        input.classList.remove("is-invalid");
      }
    });

    const email = formData.get("email");
    if (!validateEmail(email)) {
      setValidationState(
        emailInput,
        false,
        emailFeedback,
        "Geçerli bir e-posta adresi giriniz."
      );
      isFormValid = false;
    }

    if (!isFormValid) return;

    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
      alert("Lütfen reCAPTCHA doğrulamasını tamamlayın.");
      return;
    }

    formData.append("g-recaptcha-response", recaptchaResponse);

    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3000/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ " + result.message);
        form.reset();
        grecaptcha.reset();
      } else {
        alert("❌ " + result.message);
      }
    } catch (error) {
      alert("⚠️ Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin.");
    }
  });
});
