// Máscara para telefone
function formatPhone(value) {
    // Remove tudo que não é dígito
    let cleaned = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    cleaned = cleaned.substring(0, 11);
    
    // Aplica a máscara baseada no tamanho
    if (cleaned.length <= 2) {
        return cleaned;
    } else if (cleaned.length <= 6) {
        return cleaned.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    } else if (cleaned.length <= 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
}

// Aplicar máscara no campo telefone
document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('telefone');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = formatPhone(e.target.value);
            
            e.target.value = newValue;
            
            // Ajusta a posição do cursor para permitir edição natural
            if (newValue.length < oldValue.length) {
                // Se o texto ficou menor (deletou algo), mantém cursor na posição
                e.target.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
        
        // Permite deletar caracteres especiais
        telefoneInput.addEventListener('keydown', function(e) {
            // Permite backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Permite setas
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            // Permite apenas números
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }
});

// Envio do formulário para webhook
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('agendamentoForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validação dos campos
            const nome = document.getElementById('nome');
            const telefone = document.getElementById('telefone');
            const area = document.getElementById('area');
            
            if (!nome || !telefone || !area) {
                alert('Erro: Campos do formulário não encontrados.');
                return;
            }
            
            if (!nome.value.trim() || !telefone.value.trim() || !area.value) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            const formData = {
                nome: nome.value.trim(),
                telefone: telefone.value.trim(),
                area: area.value
            };
            
            try {
                const response = await fetch('https://lara-n8n.e8hydi.easypanel.host/webhook/96e6f0bc-ffda-49b5-bc53-96c3f9c3d696', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('Solicitação enviada com sucesso! Entraremos em contato em breve.');
                    form.reset();
                } else {
                    const errorText = await response.text();
                    console.error('Erro do servidor:', errorText);
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                console.error('Erro completo:', error);
                
                // Se for erro de CORS, tenta uma abordagem alternativa
                if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                    try {
                        // Alternativa usando form data para evitar CORS preflight
                        const formDataAlt = new FormData();
                        formDataAlt.append('nome', formData.nome);
                        formDataAlt.append('telefone', formData.telefone);
                        formDataAlt.append('area', formData.area);
                        
                        const responseAlt = await fetch('https://lara-n8n.e8hydi.easypanel.host/webhook/96e6f0bc-ffda-49b5-bc53-96c3f9c3d696', {
                            method: 'POST',
                            body: formDataAlt
                        });
                        
                        if (responseAlt.ok) {
                            alert('Solicitação enviada com sucesso! Entraremos em contato em breve.');
                            form.reset();
                            return;
                        }
                    } catch (altError) {
                        console.error('Erro na alternativa:', altError);
                    }
                }
                
                alert('Erro ao enviar solicitação. Tente novamente ou entre em contato por telefone: (15) 99697-2911');
            }
        });
    }
});

// Menu Mobile
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Fechar menu ao clicar em um link
nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        nav.classList.remove('active');
    }
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// Animações de entrada
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar todos os elementos com classe fade-in
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validação básica
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const area = document.getElementById('area').value;
    
    if (!nome || !email || !telefone || !area) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }
    
    // Simulação de envio
    const button = this.querySelector('.cta-button');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    button.disabled = true;
    
    setTimeout(() => {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
});

// Efeito parallax suave no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroHeight = hero.offsetHeight;
    
    if (scrolled < heroHeight) {
        const parallaxElements = document.querySelectorAll('.floating-element');
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// Contador animado (se necessário no futuro)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Lazy loading para imagens (otimização)
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Prevenção de spam no formulário
let formSubmitted = false;
const form = document.querySelector('form');

form.addEventListener('submit', function(e) {
    if (formSubmitted) {
        e.preventDefault();
        alert('Aguarde antes de enviar outra mensagem.');
        return;
    }
    
    formSubmitted = true;
    setTimeout(() => {
        formSubmitted = false;
    }, 30000); // 30 segundos de cooldown
});

// Melhorar acessibilidade - navegação por teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});

// Detectar se é dispositivo touch
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

// Sistema de Dublagem/Narração
class SpeechSystem {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentIndex = 0;
        this.textElements = [];
        this.sections = [];
        this.currentSection = 0;
        this.rate = 1;
        this.volume = 1;
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadTextElements();
        this.setupSections();
        this.setupVoice();
    }
    
    setupElements() {
        this.speechToggle = document.getElementById('speechToggle');
        this.speechControls = document.getElementById('speechControls');
        this.closeSpeech = document.getElementById('closeSpeech');
        this.playPause = document.getElementById('playPause');
        this.stopSpeech = document.getElementById('stopSpeech');
        this.prevSection = document.getElementById('prevSection');
        this.nextSection = document.getElementById('nextSection');
        this.speechRate = document.getElementById('speechRate');
        this.speechVolume = document.getElementById('speechVolume');
        this.rateValue = document.getElementById('rateValue');
        this.volumeValue = document.getElementById('volumeValue');
        this.currentSectionSpan = document.getElementById('currentSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressCurrent = document.getElementById('progressCurrent');
        this.progressTotal = document.getElementById('progressTotal');
    }
    
    setupEventListeners() {
        this.speechToggle.addEventListener('click', () => this.toggleControls());
        this.closeSpeech.addEventListener('click', () => this.closeControls());
        this.playPause.addEventListener('click', () => this.togglePlayPause());
        this.stopSpeech.addEventListener('click', () => this.stop());
        this.prevSection.addEventListener('click', () => this.previousSection());
        this.nextSection.addEventListener('click', () => this.nextSectionMethod());
        
        this.speechRate.addEventListener('input', (e) => this.updateRate(e.target.value));
        this.speechVolume.addEventListener('input', (e) => this.updateVolume(e.target.value));
        
        // Eventos do SpeechSynthesis
        this.synth.addEventListener('voiceschanged', () => this.setupVoice());
    }
    
    setupVoice() {
        const voices = this.synth.getVoices();
        // Procurar por vozes em português brasileiro
        const ptBRVoices = voices.filter(voice => 
            voice.lang.includes('pt-BR') || voice.lang.includes('pt')
        );
        
        // Preferir vozes femininas ou masculinas de qualidade
        this.selectedVoice = ptBRVoices.find(voice => 
            voice.name.includes('Google') || 
            voice.name.includes('Microsoft') ||
            voice.name.includes('Luciana') ||
            voice.name.includes('Daniel')
        ) || ptBRVoices[0] || voices[0];
    }
    
    loadTextElements() {
        this.textElements = Array.from(document.querySelectorAll('[data-speech-text]'))
            .map(element => ({
                element,
                text: element.getAttribute('data-speech-text'),
                section: this.findSection(element)
            }));
        
        this.progressTotal.textContent = this.textElements.length;
    }
    
    setupSections() {
        this.sections = Array.from(document.querySelectorAll('[data-speech-section]'))
            .map(section => ({
                element: section,
                name: section.getAttribute('data-speech-section'),
                elements: this.textElements.filter(item => 
                    section.contains(item.element)
                )
            }));
    }
    
    findSection(element) {
        const section = element.closest('[data-speech-section]');
        return section ? section.getAttribute('data-speech-section') : 'Geral';
    }
    
    toggleControls() {
        const isActive = this.speechControls.classList.contains('active');
        if (isActive) {
            this.closeControls();
        } else {
            this.openControls();
        }
    }
    
    openControls() {
        this.speechControls.classList.add('active');
        this.speechToggle.classList.add('active');
        this.updateCurrentSection();
    }
    
    closeControls() {
        this.speechControls.classList.remove('active');
        this.speechToggle.classList.remove('active');
        if (this.isPlaying) {
            this.stop();
        }
    }
    
    togglePlayPause() {
        if (this.isPlaying && !this.isPaused) {
            this.pause();
        } else if (this.isPaused) {
            this.resume();
        } else {
            this.play();
        }
    }
    
    play() {
        if (this.currentIndex >= this.textElements.length) {
            this.currentIndex = 0;
        }
        
        this.isPlaying = true;
        this.isPaused = false;
        this.updatePlayPauseButton();
        this.speakCurrent();
    }
    
    pause() {
        this.synth.pause();
        this.isPaused = true;
        this.updatePlayPauseButton();
    }
    
    resume() {
        this.synth.resume();
        this.isPaused = false;
        this.updatePlayPauseButton();
    }
    
    stop() {
        this.synth.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.currentIndex = 0;
        this.updatePlayPauseButton();
        this.updateProgress();
        this.clearHighlight();
    }
    
    speakCurrent() {
        if (this.currentIndex >= this.textElements.length) {
            this.stop();
            return;
        }
        
        const currentItem = this.textElements[this.currentIndex];
        this.highlightElement(currentItem.element);
        this.updateProgress();
        this.updateCurrentSection();
        
        // Scroll para o elemento atual
        currentItem.element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        this.utterance = new SpeechSynthesisUtterance(currentItem.text);
        this.utterance.voice = this.selectedVoice;
        this.utterance.rate = this.rate;
        this.utterance.volume = this.volume;
        this.utterance.pitch = 1;
        
        this.utterance.onend = () => {
            this.clearHighlight();
            this.currentIndex++;
            if (this.isPlaying && this.currentIndex < this.textElements.length) {
                setTimeout(() => this.speakCurrent(), 500); // Pausa entre elementos
            } else {
                this.stop();
            }
        };
        
        this.utterance.onerror = (event) => {
            console.error('Erro na síntese de voz:', event);
            this.currentIndex++;
            if (this.isPlaying && this.currentIndex < this.textElements.length) {
                setTimeout(() => this.speakCurrent(), 500);
            } else {
                this.stop();
            }
        };
        
        this.synth.speak(this.utterance);
    }
    
    previousSection() {
        if (this.currentSection > 0) {
            this.currentSection--;
            this.jumpToSection(this.currentSection);
        }
    }
    
    nextSectionMethod() {
        if (this.currentSection < this.sections.length - 1) {
            this.currentSection++;
            this.jumpToSection(this.currentSection);
        }
    }
    
    jumpToSection(sectionIndex) {
        const section = this.sections[sectionIndex];
        if (section && section.elements.length > 0) {
            const firstElementIndex = this.textElements.findIndex(
                item => item.element === section.elements[0].element
            );
            
            if (firstElementIndex !== -1) {
                this.stop();
                this.currentIndex = firstElementIndex;
                this.currentSection = sectionIndex;
                this.updateCurrentSection();
                
                // Scroll para a seção
                section.element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }
    
    updateRate(value) {
        this.rate = parseFloat(value);
        this.rateValue.textContent = `${this.rate.toFixed(1)}x`;
        
        if (this.utterance && this.isPlaying) {
            this.utterance.rate = this.rate;
        }
    }
    
    updateVolume(value) {
        this.volume = parseFloat(value);
        this.volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
        
        if (this.utterance && this.isPlaying) {
            this.utterance.volume = this.volume;
        }
    }
    
    updatePlayPauseButton() {
        const icon = this.playPause.querySelector('i');
        const text = this.playPause.querySelector('span');
        
        if (this.isPlaying && !this.isPaused) {
            icon.className = 'fas fa-pause';
            text.textContent = 'Pausar';
            this.playPause.setAttribute('aria-label', 'Pausar narração');
        } else {
            icon.className = 'fas fa-play';
            text.textContent = 'Reproduzir';
            this.playPause.setAttribute('aria-label', 'Reproduzir narração');
        }
    }
    
    updateProgress() {
        const progress = (this.currentIndex / this.textElements.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressCurrent.textContent = this.currentIndex;
    }
    
    updateCurrentSection() {
        if (this.currentIndex < this.textElements.length) {
            const currentItem = this.textElements[this.currentIndex];
            const sectionIndex = this.sections.findIndex(section =>
                section.elements.some(item => item.element === currentItem.element)
            );
            
            if (sectionIndex !== -1) {
                this.currentSection = sectionIndex;
                this.currentSectionSpan.textContent = this.sections[sectionIndex].name;
            }
        }
    }
    
    highlightElement(element) {
        this.clearHighlight();
        element.classList.add('speech-highlight');
    }
    
    clearHighlight() {
        document.querySelectorAll('.speech-highlight').forEach(el => {
            el.classList.remove('speech-highlight');
        });
    }
}

// Inicializar o sistema de dublagem quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar classe para animações CSS
    document.body.classList.add('loaded');
    
    // Verificar se há elementos para animar
    const elementsToAnimate = document.querySelectorAll('.fade-in');
    if (elementsToAnimate.length === 0) {
        console.warn('Nenhum elemento com classe .fade-in encontrado');
    }
    
    // Inicializar sistema de dublagem
    if ('speechSynthesis' in window) {
        window.speechSystem = new SpeechSystem();
    } else {
        console.warn('Speech Synthesis não é suportado neste navegador');
        // Ocultar o botão se não for suportado
        const speechToggle = document.getElementById('speechToggle');
        if (speechToggle) {
            speechToggle.style.display = 'none';
        }
    }
});