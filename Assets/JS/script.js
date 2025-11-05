// Animação de Digitação
        const roles = ['Developer', 'Designer' ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingElement = document.querySelector('.typing');
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseTime = 2000;

        function type() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIndex === currentRole.length) {
                speed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }

            setTimeout(type, speed);
        }

        // Começar a animação de digitação
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(type, 500);

            // Animação de Progresso
            const circles = document.querySelectorAll('.progress');
            circles.forEach(circle => {
                const percentageText = circle.parentElement.nextElementSibling.querySelector('span');
                const percentage = parseInt(percentageText.textContent.replace('%', ''));
                const circumference = 2 * Math.PI * 50;
                const offset = circumference - (percentage / 100) * circumference;

                // Circulo cheio
                circle.style.strokeDashoffset = circumference;

                // Animação até o deslocamento máximo
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                }, 1000); // Delay no inicio do carregamento da página (vou me arrepender depois de deixar os comentários confusos e não entender depois
            });
        });

        // Ativar animação de scroll do menu
        const navLinks = document.querySelectorAll('.nav-menu a');
        const sections = document.querySelectorAll('section');

        function updateActiveLink() {
            let current = '';

            // Força Home quando no topo da página
            if (window.scrollY < 100) {
                current = 'Home';
            } else {
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (pageYOffset >= sectionTop - sectionHeight / 3) {
                        current = section.getAttribute('id');
                    }
                });
            }

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink);
        window.addEventListener('hashchange', updateActiveLink);
        // Atualiza estado ativo no carregamento
        document.addEventListener('DOMContentLoaded', updateActiveLink);

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Clique no logo leva ao topo e ativa Home
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navLinks.forEach(l => l.classList.remove('active'));
                const homeLink = document.querySelector('.nav-menu a[href="#Home"]');
                if (homeLink) homeLink.classList.add('active');
                history.pushState(null, '', '#Home');
            });
        }

        // Hamburger menu 
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('nav');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });



        // Formulário de contato
        const contactForm = document.getElementById('contactForm');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Validação Simples
            if (!name || !email || !message) {
                alert('Harap isi semua field!');
                return;
            }

            alert(`Terima kasih ${name}! Pesan Anda telah dikirim.`);

            contactForm.reset();
        });

        // Carrossel de certificações (mudei para as linguagens de programação)
        const certCarouselWrapper = document.querySelector('.carousel-wrapper');
        const certPrevBtn = document.querySelector('.carousel-btn.prev');
        const certNextBtn = document.querySelector('.carousel-btn.next');

        if (certCarouselWrapper && certPrevBtn && certNextBtn) {
            let certCurrentIndex = 0;
            let certSlidesToShow = window.innerWidth > 768 ? 3 : 1;
            const certTotalSlides = document.querySelectorAll('.certificate-card').length;
            let certMaxIndex = certTotalSlides - certSlidesToShow;

            function updateCertCarousel() {
                const translateX = -certCurrentIndex * (100 / certSlidesToShow);
                certCarouselWrapper.style.transform = `translateX(${translateX}%)`;
            }

            certPrevBtn.addEventListener('click', () => {
                if (certCurrentIndex > 0) {
                    certCurrentIndex--;
                    updateCertCarousel();
                }
            });

            certNextBtn.addEventListener('click', () => {
                if (certCurrentIndex < certMaxIndex) {
                    certCurrentIndex++;
                    updateCertCarousel();
                }
            });

            window.addEventListener('resize', () => {
                const newSlidesToShow = window.innerWidth > 768 ? 3 : 1;
                if (newSlidesToShow !== certSlidesToShow) {
                    certSlidesToShow = newSlidesToShow;
                    certMaxIndex = certTotalSlides - certSlidesToShow;
                    certCurrentIndex = Math.min(certCurrentIndex, certMaxIndex);
                    updateCertCarousel();
                }
            });
        }

        // Linguagens de Programação: sem barras de progresso
        
        // Interações da seção Linguagens: filtros e animações
        const filterButtons = document.querySelectorAll('.lang-filter');
        const langItems = document.querySelectorAll('.lang-item');

        // Mostrar todos ao carregar com animação suave
        function showAllLangs() {
            langItems.forEach((item, idx) => {
                item.style.display = 'flex';
                setTimeout(() => item.classList.add('show'), 40 + idx * 30);
            });
        }

        // Filtragem por categoria
        function applyFilter(category) {
            langItems.forEach((item, idx) => {
                const match = category === 'all' || item.dataset.category === category;
                if (match) {
                    item.style.display = 'flex';
                    setTimeout(() => item.classList.add('show'), 20 + idx * 20);
                } else {
                    item.classList.remove('show');
                    setTimeout(() => { item.style.display = 'none'; }, 200);
                }
            });
        }

        // Atualiza botão ativo + aplica filtro
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.getAttribute('data-filter');
                applyFilter(cat);
            });
        });

        // Hover com efeito de spotlight acompanhando o mouse
        langItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;
                item.style.setProperty('--mx', `${mx}px`);
                item.style.setProperty('--my', `${my}px`);
            });
        });

        // Anima itens ao entrar no viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('show');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.12 });

        langItems.forEach(el => observer.observe(el));

        // Inicialização
        if (filterButtons.length && langItems.length) {
            showAllLangs();
        }
