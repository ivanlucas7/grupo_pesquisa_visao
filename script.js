/* ============================================
    VISAO - Veículos Inteligentes e Sistemas Autônomos Otimizados
   JavaScript Puro - Funcionalidades Interativas
   ============================================ */

// ===== INICIALIZAÇÃO DO DOM =====
document.addEventListener('DOMContentLoaded', function() {
    initCanvasBackground();
    initScrollAnimations();
    initBackToTopButton();
    initFormValidation();
    initSmoothScroll();
    initNavbarInteraction();
});

// ===== CANVAS ANIMATION (HERO BACKGROUND) =====
/**
 * Cria uma animação de fundo com elementos geométricos
 * representando circuitos, sensores e IA
 */
function initCanvasBackground() {
    const canvas = document.getElementById('canvasBackground');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Configurar tamanho do canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Cores do tema
    const colors = {
        primary: '#003d7a',
        secondary: '#0066cc',
        accent: '#28a745',
        light: '#a0c4ff'
    };
    
    // Partículas para animação
    let particles = [];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = [colors.primary, colors.secondary, colors.accent, colors.light][Math.floor(Math.random() * 4)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Warp around canvas edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Inicializar partículas
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    // Função de animação
    function animate() {
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'transparent';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar linhas conectando partículas próximas
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.globalAlpha = (1 - distance / 100) * 0.2;
                    ctx.strokeStyle = colors.secondary;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Redimensionar canvas em mudanças de tamanho
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== SCROLL ANIMATIONS =====
/**
 * Ativa animações quando elementos entram no viewport
 * Monitora elementos com classes 'fade-in' e 'scale-in'
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Opcional: remover observador após animação
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar todos os cards e elementos animáveis
    document.querySelectorAll(
        '.feature-box, .card-research, .tech-card, .project-card, .team-card, .publication-item'
    ).forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===== BOTÃO VOLTAR AO TOPO =====
/**
 * Mostra/esconde botão de volta ao topo baseado no scroll
 * Evento de clique para voltar suavemente ao topo
 */
function initBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    
    // Mostrar/esconder botão ao fazer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Voltar ao topo ao clicar
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== VALIDAÇÃO DO FORMULÁRIO DE CONTATO =====
/**
 * Valida e trata envio do formulário de contato
 * Inclui validação de email e feedback visual
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validação
        if (!name || !email || !subject || !message) {
            showFormAlert('Por favor, preencha todos os campos!', 'warning');
            return;
        }
        
        // Validar email
        if (!isValidEmail(email)) {
            showFormAlert('Por favor, insira um email válido!', 'warning');
            return;
        }
        
        // Validação de tamanho mínimo
        if (message.length < 10) {
            showFormAlert('A mensagem deve ter pelo menos 10 caracteres!', 'warning');
            return;
        }
        
        // Simular envio
        showFormAlert('Validando formulário...', 'info');
        
        // Aqui você enviaria os dados para um backend
        // Exemplo: 
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name, email, subject, message })
        // })
        
        // Simulação de sucesso
        setTimeout(() => {
            showFormAlert('✓ Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
        }, 1000);
    });
}

/**
 * Valida formato de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Mostra alerta no formulário
 */
function showFormAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : type === 'info' ? 'info' : 'warning'} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const contactForm = document.getElementById('contactForm');
    contactForm.parentElement.insertBefore(alertDiv, contactForm);
    
    // Auto-remover alerta após 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// ===== SMOOTH SCROLL =====
/**
 * Smooth scroll para links internos com href="#"
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Não prevenir comportamento padrão para link vazio
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Fechar menu mobile se estiver aberto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    document.querySelector('.navbar-toggler').click();
                }
            }
        });
    });
}

// ===== INTERAÇÃO COM NAVBAR =====
/**
 * Marca links ativos no navbar enquanto faz scroll
 * Adiciona efeito visual ao item de menu correspondente
 */
function initNavbarInteraction() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Detectar seção ativa durante scroll
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 100) && window.scrollY < (sectionTop + sectionHeight - 100)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Remover classe active de todos os links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Adicionar classe active ao link correspondente
        if (currentSection) {
            const activeLink = document.querySelector(`.navbar-nav a[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// ===== LAZY LOADING DE IMAGENS (FUTURO) =====
/**
 * Pronto para implementar lazy loading de imagens
 * Usar com data-src em vez de src
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== FUNÇÕES UTILITÁRIAS =====

/**
 * Debounce para otimizar eventos que disparam múltiplas vezes
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle para limitar frequência de execução
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== DARK MODE TOGGLE (OPCIONAL) =====
/**
 * Sistema de alternância entre modo claro e escuro
 * Salva preferência no localStorage
 */
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (!darkModeToggle) return;
    
    // Carregar preferência salva
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.style.colorScheme = 'dark';
    }
    
    darkModeToggle.addEventListener('click', function() {
        const isDarkMode = document.body.style.colorScheme === 'dark';
        document.body.style.colorScheme = isDarkMode ? 'light' : 'dark';
        localStorage.setItem('darkMode', !isDarkMode);
    });
}

// ===== ANIMAÇÃO DE NÚMEROS (CONTADOR) =====
/**
 * Anima números quando entram em vista
 * Uso: adicionar classe 'counter' com data-target
 */
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 200;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        // Iniciar quando elemento estiver visível
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                updateCount();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
}

// ===== ANIMAÇÃO DE PROGRESSO (SKILL BARS) =====
/**
 * Anima barras de progresso quando entram em vista
 * Uso: adicionar classe 'progress-bar' com data-width
 */
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar[data-width]');
    
    progressBars.forEach(bar => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
                observer.unobserve(bar);
            }
        });
        
        observer.observe(bar);
    });
}

// ===== MODAL DE PROJETOS =====
/**
 * Abre modal com detalhes completos do projeto
 * Pronto para expansão futura
 */
function initProjectModals() {
    const projectButtons = document.querySelectorAll('.btn-custom-small');
    
    projectButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Implementar lógica de modal aqui
            console.log('Abrir modal do projeto');
        });
    });
}

// ===== CARROUSEL DE DEPOIMENTOS =====
/**
 * Carrousel de depoimentos de usuários/parceiros
 * Pronto para implementação
 */
class Carousel {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        this.currentIndex = 0;
        this.items = this.element.querySelectorAll('.carousel-item');
        this.options = {
            interval: options.interval || 5000,
            autoplay: options.autoplay !== false
        };
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }
    
    show(index) {
        this.items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        this.currentIndex = index;
    }
    
    next() {
        this.show((this.currentIndex + 1) % this.items.length);
    }
    
    prev() {
        this.show((this.currentIndex - 1 + this.items.length) % this.items.length);
    }
    
    startAutoplay() {
        this.interval = setInterval(() => this.next(), this.options.interval);
    }
    
    stopAutoplay() {
        clearInterval(this.interval);
    }
}

// ===== FUNÇÃO AUXILIAR: OBTER ELEMENTO COM FALLBACK =====
function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Elemento não encontrado: ${selector}`);
    }
    return element;
}

// ===== FUNÇÃO AUXILIAR: ADICIONAR CLASSE COM DELAY =====
function addClassWithDelay(element, className, delay) {
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
}

// ===== EVENTO DE JANELA REDIMENSIONADA =====
/**
 * Trata eventos de redimensionamento com debounce
 */
window.addEventListener('resize', debounce(function() {
    console.log('Janela redimensionada');
    // Reajustar canvas se necessário
}, 250));

// ===== TRATAMENTO DE ERROS GLOBAL =====
/**
 * Captura erros globais para debugging
 */
window.addEventListener('error', function(event) {
    console.error('Erro global capturado:', event.error);
});

// ===== CONSOLE MENSAGEM =====
console.log('%cVISAO - Veículos Inteligentes e Sistemas Autônomos Otimizados', 'color: #003d7a; font-size: 20px; font-weight: bold;');
console.log('%cSite moderno e responsivo carregado com sucesso!', 'color: #0066cc; font-size: 14px;');

// ===== PRONTO PARA BACKEND INTEGRATION =====
/**
 * Exemplo de função para enviar dados para backend
 * Descomentar e ajustar endpoint conforme necessário
 */
/*
async function sendContactToBackend(data) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken() // Se necessário
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao enviar contato:', error);
        throw error;
    }
}

function getCsrfToken() {
    // Implementar obtenção de token CSRF
    return document.querySelector('meta[name="csrf-token"]')?.content || '';
}
*/

// ===== OBSERVAR MUDANÇAS DE REDE =====
/**
 * Monitora conexão de rede
 */
window.addEventListener('online', function() {
    console.log('Conexão de rede restaurada!');
    showNotification('Conexão restaurada', 'success');
});

window.addEventListener('offline', function() {
    console.log('Conexão de rede perdida!');
    showNotification('Sem conexão de internet', 'warning');
});

/**
 * Função auxiliar para mostrar notificações
 */
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '9999';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// ===== EXPORTAR FUNÇÕES PARA ACESSO GLOBAL (DESENVOLVIMENTO) =====
window.VISAOApp = {
    carousel: Carousel,
    debounce: debounce,
    throttle: throttle,
    showNotification: showNotification,
    animateCounters: animateCounters,
    animateProgressBars: animateProgressBars
};
