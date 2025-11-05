// Animação de Digitação
        const rolesPT = ['Desenvolvedor', 'Designer'];
        const rolesEN = ['Developer', 'Designer'];
        let roles = rolesEN;
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



        // Formulário de contato com FormSubmit (AJAX - sem redirecionamento)
        const contactForm = document.getElementById('contactForm');
        const submitBtn = contactForm.querySelector('.contact-submit');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Validação simples
            if (!name || !email || !message) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            // Desabilita o botão durante o envio
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            try {
                // Envia via AJAX usando FormData
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    redirect: 'manual' // Não seguir redirects - previne redirecionamento automático
                });

                // FormSubmit retorna status 302 (redirect) quando bem-sucedido
                // Com redirect: 'manual', não seguimos o redirect, mas o envio foi bem-sucedido
                if (response.type === 'opaqueredirect' || response.status === 0 || response.ok || response.status === 302) {
                    // Sucesso - o FormSubmit recebeu os dados
                    alert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso.`);
                    contactForm.reset();
                } else {
                    throw new Error('Erro ao enviar mensagem');
                }
            } catch (error) {
                // Se houver erro de rede, mostra mensagem de erro
                // Mas se for apenas o redirect sendo bloqueado, ainda é sucesso
                if (error.message && error.message.includes('redirect')) {
                    // Redirect bloqueado = envio bem-sucedido
                    alert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso.`);
                    contactForm.reset();
                } else {
                    alert('Erro ao enviar mensagem. Por favor, tente novamente mais tarde.');
                    console.error('Erro:', error);
                }
            } finally {
                // Restaura o botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
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

        // =========================
        // Internacionalização (PT/EN)
        // =========================
        const i18n = {
            pt: {
                nav: ['Home', 'Sobre Mim', 'Habilidades', 'Portfólio', 'Contato'],
                hero_h3: "Hey, I'm ",
                hero_p: 'Sou um desenvolvedor apaixonado por criar soluções inovadoras digitais. Com o desenvolvimento web e o\n                    design, você pode fazer o que quiser.',
                cta_portfolio: 'Conheça meu Portfólio',
                cta_contact: 'Contato',
                about_h2: 'Sobre Mim',
                card1: 'Clean Code',
                card2: 'Desenvolvedor Web',
                card3: '+ 2 anos de experiência',
                about_h3: "Hello, I'm Thales Timbó Fernandes",
                about_p1: 'Olá! Sou um desenvolvedor web e mobile que gosta de criar soluções práticas, bonitas e funcionais.\n                        Tenho um olhar atento aos detalhes e curto deixar cada projeto com a minha identidade, unindo \n                        criatividade, design e um código bem estruturado. Acredito que um bom trabalho nasce do equilíbrio \n                        entre estética e desempenho.',
                about_p2: 'A tecnologia sempre me fascinou — especialmente a forma como ela pode transformar ideias em algo real \n                        e acessível. Gosto de aprender novas ferramentas, experimentar linguagens e buscar formas mais eficientes \n                        de resolver problemas. Cada projeto é uma chance de evoluir, de criar algo melhor que o anterior e de \n                        deixar uma marca positiva no que faço.',
                about_p3: 'Tenho 16 anos e estudo no curso técnico em Informática. Gosto de explorar o mundo da programação, design \n                        e tudo que envolve tecnologia. No meu tempo livre, costumo ouvir música, jogar e aprender coisas novas. \n                        Sou uma pessoa curiosa, que acredita que dedicação e paciência sempre abrem caminho pra algo maior.',
                quote: '"Um sonho custa caro, mas desistir vai lhe custar um sonho."',
                btn_curriculo1: 'Curriculo Lattes (Em Breve)',
                btn_curriculo2: 'Meu Curriculo (Em Breve)',
                certificados_h2: 'Certificados',
                cert1_p: 'Design Gráfico - FIAP',
                cert2_p: 'UX Design - FIAP',
                cert3_p: 'Cinegrafia - ESCULT ',
                servicos_h2: 'Serviços',
                serv1_h3: 'Desenvolvedor Web',
                serv1_p: 'Crio sites modernos, rápidos e responsivos, sempre \n                                 focando na experiência do usuário e em um design bem estruturado. \n                                 Gosto de escrever códigos limpos e pensar em cada detalhe para \n                                 entregar algo funcional e bonito.',
                serv2_h3: 'Desenvolvedor Mobile',
                serv2_p: 'Desenvolvo aplicativos práticos e intuitivos, com foco em performance e \n                                usabilidade. Busco unir tecnologia e design para criar soluções que \n                                realmente façam sentido no dia a dia das pessoas.',
                serv3_h3: 'Designer de Interfaces',
                serv3_p: 'Transformo ideias em interfaces visualmente agradáveis e fáceis de usar. \n                                Me preocupo com cada interação e acredito que o design certo pode mudar \n                                completamente a forma como alguém vê um produto.',
                serv4_h3: 'Designer Gráfico',
                serv4_p: 'Crio identidades visuais e artes que comunicam de \n                                forma clara e criativa. Gosto de brincar com cores, tipografia e \n                                formas pra dar personalidade a cada projeto.',
                serv5_h3: 'Fotográfo',
                serv5_p: 'Registro momentos e emoções com um olhar voltado pra composição e \n                                autenticidade. A fotografia me ajuda a capturar detalhes que contam \n                                histórias de um jeito único.',
                serv6_h3: 'Gamer',
                serv6_p: 'Sou apaixonado por jogos e por tudo que envolve esse universo. \n                                Além de me divertir, gosto de observar o design, a mecânica e as \n                                ideias por trás de cada experiência.',
                langs_h2: 'Linguagens de Programação',
                filter_all: 'Tudo',
                filter_front: 'Frontend',
                filter_back: 'Backend',
                filter_db: 'Banco de Dados',
                filter_tools: 'Ferramentas',
                filter_uiux: 'UI/UX',
                filter_mobile: 'Mobile',
                projects_h2: 'Meus Trabalhos',
                proj1_p: 'Site do Urubu Racing Festival, a maior prova de cross-country do Norte e Nordeste do Brasil. Meu primeiro site está no ar.',
                proj2_p: 'Foi minha primeira calculadora, feita em JavaScript. Eu a desenvolvi no meu segundo ano do ensino médio para a minha aula de Programação Web.',
                proj3_p: 'TaskFlow é um projeto de site para gerenciamento de tarefas. O projeto foi muito educativo para mim, pois me ensinou a usar a função `localStorage` do JavaScript. E usei IA para desenvolver o front-end.',
                proj4_p: 'O Gerador de Senhas é um projeto web para gerar senhas. Eu o criei durante o meu segundo ano do ensino médio para a minha aula de Programação Web, servindo como uma prova prática da disciplina.',
                proj5_p: 'O Questionário de Estudo ENEM é uma ferramenta online offline com 40 questões no estilo ENEM que analisa o desempenho por área e habilidade, gerando dicas de estudo personalizadas diretamente no navegador.',
                proj6_p: 'Foi um projeto que fiz para a minha aula de POO (Programação Orientada a Objetos) e foi um dos projetos mais divertidos que já fiz. É uma coisa que ajuda com bastante aprendizado, pois é uma coisa que não é tão comum de se ver em um projeto de programação.',
                contact_h2: 'Contato',
                email_h3: 'E-mail',
                location_h3: 'Guaraciaba do Norte – CE',
                location_p: 'Ceará, Brasil',
                availability_h3: 'Disponibilidade',
                availability_p: 'Aberto a projetos',
                connect_h3: 'Conecte-se Comigo',
                form_name_label: 'Nome Completo',
                form_name_ph: 'Seu nome completo',
                form_email_label: 'E-mail',
                form_email_ph: 'seu@email.com',
                form_subject_label: 'Assunto',
                form_subject_ph: 'Assunto da mensagem',
                form_message_label: 'Mensagem',
                form_message_ph: 'Escreva sua mensagem aqui...',
                form_button: 'Enviar Mensagem',
                toggle: 'EN'
            },
            en: {
                nav: ['Home', 'About Me', 'Skills', 'Portfolio', 'Contact'],
                hero_h3: "Hey, I'm ",
                hero_p: 'I am a developer passionate about creating innovative digital solutions. With web\n                    development and design, you can build anything you want.',
                cta_portfolio: 'View my Portfolio',
                cta_contact: 'Contact',
                about_h2: 'About Me',
                card1: 'Clean Code',
                card2: 'Web Developer',
                card3: '+ 2 years of experience',
                about_h3: "Hello, I'm Thales Timbó Fernandes",
                about_p1: 'Hello! I am a web and mobile developer who enjoys creating practical, beautiful, and functional\n                        solutions. I pay close attention to details and like to give each project my own identity, combining\n                        creativity, design, and well-structured code. I believe good work comes from the balance between\n                        aesthetics and performance.',
                about_p2: 'Technology has always fascinated me — especially how it can turn ideas into something real and\n                        accessible. I enjoy learning new tools, trying languages, and seeking more efficient ways to solve\n                        problems. Each project is a chance to evolve, to build something better than the last, and to leave\n                        a positive mark on what I do.',
                about_p3: "I'm 16 years old and currently studying an Informatics technical course. I like exploring the world\n                        of programming, design, and everything involving technology. In my free time, I usually listen to music,\n                        play games, and learn new things. I’m curious and believe dedication and patience always open the way\n                        to something bigger.",
                quote: '"A dream is expensive, but giving up will cost you a dream."',
                btn_curriculo1: 'Lattes Resume (Coming Soon)',
                btn_curriculo2: 'My Resume (Coming Soon)',
                certificados_h2: 'Certificates',
                cert1_p: 'Graphic Design - FIAP',
                cert2_p: 'UX Design - FIAP',
                cert3_p: 'Cinematography - ESCULT ',
                servicos_h2: 'Services',
                serv1_h3: 'Web Developer',
                serv1_p: 'I build modern, fast, and responsive websites, focusing on user experience and well-structured\n                                 design. I like to write clean code and think through every detail to deliver something functional\n                                 and beautiful.',
                serv2_h3: 'Mobile Developer',
                serv2_p: 'I develop practical and intuitive apps with a focus on performance and usability. I aim to combine\n                                technology and design to create solutions that truly make sense in everyday life.',
                serv3_h3: 'UI Designer',
                serv3_p: 'I turn ideas into visually pleasing and easy-to-use interfaces. I care about every interaction and\n                                believe the right design can completely change how someone perceives a product.',
                serv4_h3: 'Graphic Designer',
                serv4_p: 'I create visual identities and artwork that communicate clearly and creatively. I enjoy playing with\n                                colors, typography, and shapes to give each project its own personality.',
                serv5_h3: 'Photographer',
                serv5_p: 'I capture moments and emotions with attention to composition and authenticity. Photography helps me\n                                capture details that tell stories in a unique way.',
                serv6_h3: 'Gamer',
                serv6_p: 'I’m passionate about games and everything involving that universe. Besides having fun, I like to\n                                observe the design, mechanics, and ideas behind each experience.',
                langs_h2: 'Programming Languages',
                filter_all: 'All',
                filter_front: 'Frontend',
                filter_back: 'Backend',
                filter_db: 'Databases',
                filter_tools: 'Tools',
                filter_uiux: 'UI/UX',
                filter_mobile: 'Mobile',
                projects_h2: 'My Work',
                proj1_p: 'Website for the Urubu Racing Festival, the biggest XC race in the North and Northeast of Brazil. My first website is online.',
                proj2_p: 'It was my first calculator, made in JavaScript. I developed it in my sophomore year of high school for my Web Programming class.',
                proj3_p: 'TaskFlow is a task management website project. The project was very educational for me, as it taught me how to use the JavaScript `localStorage` function. And I used IA to develop the front-end.',
                proj4_p: 'The Password Generator is a web project for generating passwords. I created it during my sophomore year of high school for my Web Programming class, serving as a practical exam for the subject.',
                proj5_p: 'The ENEM Study Questionnaire is an offline online tool with 40 ENEM-style questions that analyzes performance by area and skill, generating personalized study tips directly in your browser.',
                proj6_p: 'The ENEM Study Quiz is an offline web tool with 40 ENEM-style questions that analyzes performance by area and skill, generating personalized study tips directly in the browser. It’s something that provides a lot of learning, as it’s not very common to see in a programming project.',
                contact_h2: 'Contact',
                email_h3: 'E-mail',
                location_h3: 'Guaraciaba do Norte – CE',
                location_p: 'Ceará, Brazil',
                availability_h3: 'Availability',
                availability_p: 'Open to projects',
                connect_h3: 'Connect with Me',
                form_name_label: 'Full Name',
                form_name_ph: 'Your full name',
                form_email_label: 'E-mail',
                form_email_ph: 'your@email.com',
                form_subject_label: 'Subject',
                form_subject_ph: 'Message subject',
                form_message_label: 'Message',
                form_message_ph: 'Write your message here...',
                form_button: 'Send Message',
                toggle: 'PT'
            }
        };

        function applyTranslations(t) {
            // Nav
            const navLinksArr = document.querySelectorAll('.nav-menu li a');
            if (navLinksArr.length >= 5) {
                navLinksArr[0].textContent = t.nav[0];
                navLinksArr[1].textContent = t.nav[1];
                navLinksArr[2].textContent = t.nav[2];
                navLinksArr[3].textContent = t.nav[3];
                navLinksArr[4].textContent = t.nav[4];
            }
            const toggleBtn = document.querySelector('.lang-toggle');
            if (toggleBtn) toggleBtn.textContent = t.toggle;

            // Hero
            const heroH3 = document.querySelector('.hero-content h3');
            if (heroH3) {
                const nameSpan = heroH3.querySelector('.name');
                if (nameSpan) heroH3.innerHTML = `${t.hero_h3}<span class="name">${nameSpan.textContent}</span>`;
            }
            const heroP = document.querySelector('.hero-content p');
            if (heroP) heroP.innerHTML = t.hero_p;
            const ctas = document.querySelectorAll('.cta-buttons .btn');
            if (ctas.length >= 2) {
                ctas[0].textContent = t.cta_portfolio;
                ctas[1].textContent = t.cta_contact;
            }

            // Sobre
            const aboutH2 = document.querySelector('#Sobre h2');
            if (aboutH2) aboutH2.textContent = t.about_h2;
            const floatingCards = document.querySelectorAll('.floating-card span');
            if (floatingCards.length >= 3) {
                floatingCards[0].textContent = t.card1;
                floatingCards[1].textContent = t.card2;
                floatingCards[2].textContent = t.card3;
            }
            const aboutH3 = document.querySelector('.about-text h3');
            if (aboutH3) aboutH3.textContent = t.about_h3;
            const aboutParas = document.querySelectorAll('.about-text p');
            if (aboutParas.length >= 3) {
                aboutParas[0].innerHTML = t.about_p1;
                aboutParas[1].innerHTML = t.about_p2;
                aboutParas[2].innerHTML = t.about_p3;
            }
            const quote = document.querySelector('blockquote');
            if (quote) quote.textContent = t.quote;
            const aboutBtns = document.querySelectorAll('.about-buttons .btn');
            if (aboutBtns.length >= 2) {
                aboutBtns[0].textContent = t.btn_curriculo1;
                aboutBtns[1].textContent = t.btn_curriculo2;
            }

            // Certificados
            const certTitle = document.querySelector('.about-certificates h2');
            if (certTitle) certTitle.textContent = t.certificados_h2;
            const certPs = document.querySelectorAll('.about-certificates .certificate-card p');
            if (certPs.length >= 3) {
                certPs[0].textContent = t.cert1_p;
                certPs[1].textContent = t.cert2_p;
                certPs[2].textContent = t.cert3_p;
            }

            // Serviços
            const servTitle = document.querySelector('.about-services h2');
            if (servTitle) servTitle.textContent = t.servicos_h2;
            const servCards = document.querySelectorAll('.about-services .service-card');
            if (servCards.length >= 6) {
                servCards[0].querySelector('h3').textContent = t.serv1_h3;
                servCards[0].querySelector('p').innerHTML = t.serv1_p;
                servCards[1].querySelector('h3').textContent = t.serv2_h3;
                servCards[1].querySelector('p').innerHTML = t.serv2_p;
                servCards[2].querySelector('h3').textContent = t.serv3_h3;
                servCards[2].querySelector('p').innerHTML = t.serv3_p;
                servCards[3].querySelector('h3').textContent = t.serv4_h3;
                servCards[3].querySelector('p').innerHTML = t.serv4_p;
                servCards[4].querySelector('h3').textContent = t.serv5_h3;
                servCards[4].querySelector('p').innerHTML = t.serv5_p;
                servCards[5].querySelector('h3').textContent = t.serv6_h3;
                servCards[5].querySelector('p').innerHTML = t.serv6_p;
            }

            // Linguagens
            const langsH2 = document.querySelector('#Linguagens .section-title');
            if (langsH2) langsH2.textContent = t.langs_h2;
            const filterBtns = document.querySelectorAll('.lang-filters .lang-filter');
            if (filterBtns.length >= 7) {
                filterBtns[0].textContent = t.filter_all;
                filterBtns[1].textContent = t.filter_front;
                filterBtns[2].textContent = t.filter_back;
                filterBtns[3].textContent = t.filter_db;
                filterBtns[4].textContent = t.filter_tools;
                filterBtns[5].textContent = t.filter_uiux;
                filterBtns[6].textContent = t.filter_mobile;
            }

            // Portfólio
            const projectsH2 = document.querySelector('#Portfólio .section-title');
            if (projectsH2) projectsH2.textContent = t.projects_h2;
            const projCards = document.querySelectorAll('.projects-grid .project-card');
            if (projCards.length >= 6) {
                projCards[0].querySelector('.project-info p').textContent = t.proj1_p;
                projCards[1].querySelector('.project-info p').textContent = t.proj2_p;
                projCards[2].querySelector('.project-info p').textContent = t.proj3_p;
                projCards[3].querySelector('.project-info p').textContent = t.proj4_p;
                projCards[4].querySelector('.project-info p').textContent = t.proj5_p;
                projCards[5].querySelector('.project-info p').textContent = t.proj6_p;
            }

            // Contato
            const contactH2 = document.querySelector('#Contato h2');
            if (contactH2) contactH2.textContent = t.contact_h2;
            const emailH3 = document.querySelector('.info-card:nth-child(1) .info-content h3');
            if (emailH3) emailH3.textContent = t.email_h3;
            const locationH3 = document.querySelector('.info-card:nth-child(2) .info-content h3');
            if (locationH3) locationH3.textContent = t.location_h3;
            const locationP = document.querySelector('.info-card:nth-child(2) .info-content p');
            if (locationP) locationP.textContent = t.location_p;
            const availH3 = document.querySelector('.info-card:nth-child(3) .info-content h3');
            if (availH3) availH3.textContent = t.availability_h3;
            const availP = document.querySelector('.info-card:nth-child(3) .info-content p');
            if (availP) availP.textContent = t.availability_p;
            const connectH3 = document.querySelector('.connect-card h3');
            if (connectH3) connectH3.textContent = t.connect_h3;

            const nameLabel = document.querySelector('label[for="name"]');
            const nameInput = document.getElementById('name');
            if (nameLabel) nameLabel.textContent = t.form_name_label;
            if (nameInput) nameInput.placeholder = t.form_name_ph;

            const emailLabel = document.querySelector('label[for="email"]');
            const emailInput = document.getElementById('email');
            if (emailLabel) emailLabel.textContent = t.form_email_label;
            if (emailInput) emailInput.placeholder = t.form_email_ph;

            const subjectLabel = document.querySelector('label[for="subject"]');
            const subjectInput = document.getElementById('subject');
            if (subjectLabel) subjectLabel.textContent = t.form_subject_label;
            if (subjectInput) subjectInput.placeholder = t.form_subject_ph;

            const messageLabel = document.querySelector('label[for="message"]');
            const messageInput = document.getElementById('message');
            if (messageLabel) messageLabel.textContent = t.form_message_label;
            if (messageInput) messageInput.placeholder = t.form_message_ph;

            const submitBtn = document.querySelector('.contact-submit');
            if (submitBtn) {
                // Preserve icon inside
                const icon = submitBtn.querySelector('i');
                submitBtn.textContent = t.form_button + ' ';
                if (icon) submitBtn.appendChild(icon);
            }
        }

        function setLanguage(lang) {
            const dict = i18n[lang] || i18n.pt;
            applyTranslations(dict);
            // Update roles for typing effect
            roles = lang === 'en' ? rolesEN : rolesPT;
            localStorage.setItem('site_lang', lang);
        }

        // Initialize language
        document.addEventListener('DOMContentLoaded', () => {
            const saved = localStorage.getItem('site_lang') || 'pt';
            setLanguage(saved);
        });

        // Toggle button
        const langToggleBtn = document.querySelector('.lang-toggle');
        if (langToggleBtn) {
            langToggleBtn.addEventListener('click', () => {
                const current = localStorage.getItem('site_lang') || 'pt';
                const next = current === 'pt' ? 'en' : 'pt';
                setLanguage(next);
            });
        }

        // Hide loader when everything is ready
        window.addEventListener('load', () => {
            const pageLoader = document.querySelector('.page-loader');
            if (pageLoader) {
                pageLoader.classList.add('hide');
                setTimeout(() => pageLoader.remove(), 600);
            }
        });

        // =========================
        // Lazy Loading: Reveal on Scroll
        // =========================
        function markReveal(elements, variant = 'reveal-up', baseDelay = 60) {
            if (!elements) return;
            const arr = elements instanceof NodeList || Array.isArray(elements) ? elements : [elements];
            arr.forEach((el, idx) => {
                if (!el) return;
                el.classList.add('reveal', variant);
                el.style.setProperty('--reveal-delay', `${idx * baseDelay}ms`);
            });
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    el.classList.add('in-view');
                } else {
                    el.classList.remove('in-view');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

        function observeReveal(elements) {
            const arr = elements instanceof NodeList || Array.isArray(elements) ? elements : [elements];
            arr.forEach(el => el && revealObserver.observe(el));
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Hero
            markReveal(document.querySelector('.hero-content h3'), 'reveal-up', 0);
            markReveal(document.querySelector('.hero-content h1'), 'reveal-up', 0);
            markReveal(document.querySelector('.hero-content p'), 'reveal-up', 0);
            markReveal(document.querySelectorAll('.cta-buttons .btn'), 'reveal-left', 80);
            markReveal(document.querySelectorAll('.social-icons a'), 'reveal-up', 50);

            // Sobre
            markReveal(document.querySelector('#Sobre h2'), 'reveal-up', 0);
            markReveal(document.querySelector('.image-container .profile-image'), 'reveal-scale', 0);
            markReveal(document.querySelectorAll('.floating-card'), 'reveal-right', 120);
            markReveal(document.querySelector('.about-text h3'), 'reveal-left', 0);
            markReveal(document.querySelectorAll('.about-text p'), 'reveal-up', 70);
            markReveal(document.querySelector('blockquote'), 'reveal-left', 0);
            markReveal(document.querySelectorAll('.about-buttons .btn'), 'reveal-up', 80);

            // Serviços
            markReveal(document.querySelector('.about-services h2'), 'reveal-up', 0);
            markReveal(document.querySelectorAll('.about-services .service-card'), 'reveal-up', 90);

            // Linguagens
            markReveal(document.querySelector('#Linguagens .section-title'), 'reveal-up', 0);
            markReveal(document.querySelectorAll('.lang-filter'), 'reveal-up', 40);
            markReveal(document.querySelectorAll('.lang-item'), 'reveal-scale', 30);

            // Projetos
            markReveal(document.querySelector('#Portfólio .section-title'), 'reveal-up', 0);
            markReveal(document.querySelectorAll('.projects-grid .project-card'), 'reveal-up', 90);

            // Contato
            markReveal(document.querySelector('#Contato h2'), 'reveal-up', 0);
            markReveal(document.querySelectorAll('.info-card'), 'reveal-left', 100);
            markReveal(document.querySelector('.connect-card'), 'reveal-up', 0);
            markReveal(document.querySelector('.form-card'), 'reveal-right', 0);

            // Certificados dentro de Sobre
            markReveal(document.querySelector('.about-certificates h2'), 'reveal-up', 0);
            markReveal(document.querySelectorAll('.about-certificates .certificate-card'), 'reveal-up', 80);

            // Observe all reveals
            observeReveal(document.querySelectorAll('.reveal'));

            // Lazy attribute for images (skip very first above-the-fold if needed)
            const allImgs = document.querySelectorAll('img');
            allImgs.forEach((img, idx) => {
                if (!img.hasAttribute('loading')) {
                    img.loading = idx === 0 ? 'eager' : 'lazy';
                    img.decoding = 'async';
                }
            });
        });
