document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('checkbox');
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.getElementById('back-to-top');

    // --- THEME MANAGEMENT ---
    const setTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            if (themeSwitch) themeSwitch.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            if (themeSwitch) themeSwitch.checked = false;
        }
        window.dispatchEvent(new Event('themeChanged'));
    };

    // Forcer le mode sombre à chaque rechargement
    setTheme(true);

    if (themeSwitch) {
        themeSwitch.addEventListener('change', () => setTheme(themeSwitch.checked));
    }

    // --- NAVIGATION & SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }

            if (navLinks && navLinks.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    // --- BACK TO TOP BUTTON ---
    const handleScroll = () => {
        if (window.scrollY > 500) {
            if (backToTop) backToTop.classList.add('show');
        } else {
            if (backToTop) backToTop.classList.remove('show');
        }
        revealOnScroll();
    };

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', handleScroll);
    revealOnScroll(); // Initial check

    // --- CHATBOT LOGIC ---
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotBody = document.getElementById('chatbot-body');

    if (chatbotIcon && chatbotWindow) {
        chatbotIcon.addEventListener('click', () => chatbotWindow.classList.toggle('active'));
        if (closeChatbot) closeChatbot.addEventListener('click', () => chatbotWindow.classList.remove('active'));

        const sendMessage = () => {
            const msg = chatbotInput.value.trim();
            if (msg) {
                const userDiv = document.createElement('p');
                userDiv.className = 'chatbot-message user';
                userDiv.textContent = msg;
                chatbotBody.appendChild(userDiv);
                chatbotInput.value = '';
                chatbotBody.scrollTop = chatbotBody.scrollHeight;

                setTimeout(() => {
                    const botDiv = document.createElement('p');
                    botDiv.className = 'chatbot-message bot';
                    botDiv.innerHTML = `
                        <strong>À propos de KOULOU Crepin :</strong><br><br>
                        🎓 <strong>Formation & Profil :</strong> Étudiant à l'ISSEA, Crepin est un expert pluridisciplinaire en Data Science, Économie et Statistique, spécialisé dans la transformation des données en solutions stratégiques.<br><br>
                        💼 <strong>Expériences Professionnelles :</strong><br>
                        - <strong>AI Engineer chez MAXA :</strong> Lead sur le projet <em>Maxagen Engine</em>, un système d'IA générative pour les concours d'entrée aux grandes écoles (ISSEA, ENSAE, ENSEA, Polytech).<br>
                        - <strong>Co-fondateur de NKStatConsulting :</strong> Expert en automatisation bancaire et formation aux outils statistiques (R, Shiny, Excel).<br>
                        - <strong>Missions au MINFI :</strong> Expérience solide en analyse de données au Ministère des Finances.<br><br>
                        🏆 <strong>Excellence & Compétitions :</strong> Lauréat de plusieurs hackathons prestigieux, dont la <strong>1ère Place à l'IndabaX</strong> et la <strong>1ère Place au Datatour Afrique</strong>.<br><br>
                        📜 <strong>Certifications Internationales :</strong><br>
                        - <strong>DataCamp (4x) :</strong> Associate AI Engineer & Statisticien.<br>
                        - <strong>Coursera :</strong> Supervised Machine Learning.<br>
                        - <strong>Udemy (3x) :</strong> Expert VBA, Power BI et Data Science.<br>
                        - <strong>WorldQuant University :</strong> Certification en analyse quantitative.<br><br>
                        🚀 <strong>Projets Phares :</strong> Développement de systèmes RAG intelligents, modélisation de scoring crédit et tableaux de bord RH dynamiques.<br><br>
                        <em>Pour toute collaboration, n'hésitez pas à utiliser le formulaire de contact !</em>
                    `;
                    chatbotBody.appendChild(botDiv);
                    chatbotBody.scrollTop = chatbotBody.scrollHeight;
                }, 1000);
            }
        };

        if (chatbotSend) chatbotSend.addEventListener('click', sendMessage);
        if (chatbotInput) chatbotInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    }

    // --- CONTACT FORM AJAX ---
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const button = contactForm.querySelector('button');
            const originalText = button.innerHTML;
            
            // État de chargement
            button.disabled = true;
            button.innerHTML = 'Envoi en cours... <i class="fas fa-spinner fa-spin"></i>';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    alert('Merci ! Votre message a été envoyé avec succès.');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Oups ! Un problème est survenu lors de l'envoi.");
                    }
                }
            } catch (error) {
                alert("Erreur : Impossible d'envoyer le message. Vérifiez que vous utilisez un serveur web (Live Server) pour tester.");
            } finally {
                button.disabled = false;
                button.innerHTML = originalText;
            }
        });
    }

    // --- SCROLL SPY (DOTS) ---
    const dots = document.querySelectorAll('.dot');
    const sections = document.querySelectorAll('section[id]');
    const scrollSpy = () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        dots.forEach(dot => {
            dot.classList.remove("active");
            if (dot.getAttribute("href").includes(current)) {
                dot.classList.add("active");
            }
        });
    };
    window.addEventListener('scroll', scrollSpy);

    // --- STAR ANIMATION ---
    initStarAnimation();
});

function initStarAnimation() {
    let canvas = document.getElementById('star-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'star-canvas';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width, height, stars = [];
    const starCount = window.innerWidth < 768 ? 50 : 120;

    const getThemeColors = () => {
        const isDark = document.body.classList.contains('dark-mode');
        return {
            bg: isDark ? '#0F172A' : '#F8F9FC',
            star: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 123, 255, 0.15)'
        };
    };

    let themeColors = getThemeColors();

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        stars = Array.from({length: starCount}, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3
        }));
    };

    const animate = () => {
        ctx.fillStyle = themeColors.bg;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = themeColors.star;

        stars.forEach(s => {
            s.x = (s.x + s.vx + width) % width;
            s.y = (s.y + s.vy + height) % height;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('themeChanged', () => { themeColors = getThemeColors(); });
    
    resize();
    animate();
    document.body.style.backgroundColor = 'transparent';
}
