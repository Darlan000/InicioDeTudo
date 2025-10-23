// Arquivo de script.js - Animações de Entrada (Scroll)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona todos os cards com a classe 'projeto-card'
    const cards = document.querySelectorAll('.projeto-card');

    // 2. Cria as opções para o IntersectionObserver
    // rootMargin: '0px' - Ponto de referência é a viewport
    // threshold: 0.5 - O elemento só será observado quando 50% dele estiver visível
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.3 // O card aparece quando 30% dele estiver visível
    };

    // 3. Função a ser executada quando a intersecção ocorrer
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // Se o elemento estiver visível (intersecting)
            if (entry.isIntersecting) {
                // Adiciona a classe 'animate-in' para disparar a animação CSS
                entry.target.classList.add('animate-in');
                // Para de observar o elemento, pois a animação já foi disparada
                observer.unobserve(entry.target); 
            }
        });
    };

    // 4. Cria o observador
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // 5. Começa a observar cada card
    cards.forEach(card => {
        observer.observe(card);
    });

});