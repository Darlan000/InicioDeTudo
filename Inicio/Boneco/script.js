document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.getElementById('btn-calcular');
    const btnImprimir = document.getElementById('btn-imprimir');
    const larguraInput = document.getElementById('largura');
    const alturaInput = document.getElementById('altura');
    const lombadaInput = document.getElementById('lombada');
    const avisoDimensoes = document.getElementById('aviso-dimensoes');
    const bonecoContainer = document.getElementById('boneco-container');

    const retanguloEsquerda = document.getElementById('retangulo-interno-esquerda');
    const retanguloDireita = document.getElementById('retangulo-interno-direita');
    const retanguloLombada = document.getElementById('retangulo-lombada');
    const retanguloRegua = document.getElementById('retangulo-regua');

    const dimEsquerdaLargura = document.getElementById('dim-esquerda-largura');
    const dimEsquerdaAltura = document.getElementById('dim-esquerda-altura');
    const dimLombadaLargura = document.getElementById('dim-lombada-largura');
    const dimDireitaLargura = document.getElementById('dim-direita-largura');
    const dimDireitaAltura = document.getElementById('dim-direita-altura');
    const dimReguaLargura = document.getElementById('dim-regua-largura');
    
    // Fator de conversão: 1mm = 3.78px (baseado em 96 DPI)
    const mmParaPx = 3.78;

    function calcularECriar() {
        const larguraCapaOriginal = parseFloat(larguraInput.value);
        const alturaCapa = parseFloat(alturaInput.value);
        const larguraLombadaOriginal = parseFloat(lombadaInput.value);

        // Cálculos
        const larguraCapa = larguraCapaOriginal - 2;
        const alturaBlocos = alturaCapa + 6;
        const larguraLombada = larguraLombadaOriginal + 2;
        const larguraRegua = larguraLombada + 16;
        
        if (larguraRegua <= larguraLombada) {
            avisoDimensoes.classList.remove('aviso-escondido');
            return;
        } else {
            avisoDimensoes.classList.add('aviso-escondido');
        }

        const larguraTotalVisual = (larguraCapa * 2) + larguraRegua;
        
        const larguraCapaPx = larguraCapa * mmParaPx;
        const alturaBlocosPx = alturaBlocos * mmParaPx;
        const larguraReguaPx = larguraRegua * mmParaPx;
        
        // Define o tamanho do boneco-container com base nas dimensões reais
        bonecoContainer.style.width = `${larguraTotalVisual * mmParaPx}px`;
        bonecoContainer.style.height = `${alturaBlocosPx}px`;
        
        // Posição central do boneco-container
        const centroReguaHorizontal = (larguraTotalVisual * mmParaPx) / 2;

        // Centralizar a régua
        retanguloRegua.style.width = `${larguraReguaPx}px`;
        retanguloRegua.style.height = `${alturaBlocosPx}px`;
        retanguloRegua.style.left = `${centroReguaHorizontal - (larguraReguaPx / 2)}px`;
        retanguloRegua.style.top = `0px`;

        // Posicionar as capas em relação ao centro da régua
        retanguloEsquerda.style.width = `${larguraCapaPx}px`;
        retanguloEsquerda.style.height = `${alturaBlocosPx}px`;
        retanguloEsquerda.style.left = `${centroReguaHorizontal - (larguraReguaPx / 2) - larguraCapaPx}px`;
        retanguloEsquerda.style.top = `0px`;

        retanguloDireita.style.width = `${larguraCapaPx}px`;
        retanguloDireita.style.height = `${alturaBlocosPx}px`;
        retanguloDireita.style.left = `${centroReguaHorizontal + (larguraReguaPx / 2)}px`;
        retanguloDireita.style.top = `0px`;

        // Atualizar textos de dimensões
        dimEsquerdaLargura.textContent = `L: ${larguraCapa}mm`;
        dimEsquerdaAltura.textContent = `A: ${alturaBlocos}mm`;
        dimLombadaLargura.textContent = `B: ${larguraLombada}mm`;
        dimDireitaLargura.textContent = `L: ${larguraCapa}mm`;
        dimDireitaAltura.textContent = `A: ${alturaBlocos}mm`;
        dimReguaLargura.textContent = `Régua: ${larguraRegua}mm`;
    }

    // --- NOVA FUNÇÃO PARA GERAR O PDF com tamanho ilimitado e margem ---
    function imprimirBonecoPDF() {
        const { jsPDF } = window.jspdf;

        const larguraCapaOriginal = parseFloat(larguraInput.value);
        const alturaCapa = parseFloat(alturaInput.value);
        const larguraLombadaOriginal = parseFloat(lombadaInput.value);

        const larguraCapa = larguraCapaOriginal - 2;
        const alturaBlocos = alturaCapa + 6;
        const larguraLombada = larguraLombadaOriginal + 2;
        const larguraRegua = larguraLombada + 16;
        const larguraTotalBoneco = (larguraCapa * 2) + larguraRegua;
        
        // Define a margem de 10mm (1cm)
        const margem = 10;
        
        // Calcula as novas dimensões totais do documento, incluindo a margem
        const larguraDocumento = larguraTotalBoneco + (margem * 2);
        const alturaDocumento = alturaBlocos + (margem * 2);

        // Crie uma nova instância de jsPDF com as dimensões exatas do seu projeto + margem
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [larguraDocumento, alturaDocumento]
        });

        // Calcule as posições dos retângulos a partir da margem
        const capaEsquerdaX = margem;
        const capaEsquerdaY = margem;
        const reguaX = margem + larguraCapa;
        const reguaY = margem;
        const capaDireitaX = margem + larguraCapa + larguraRegua;
        const capaDireitaY = margem;

        // Desenhe os retângulos no PDF
        doc.rect(capaEsquerdaX, capaEsquerdaY, larguraCapa, alturaBlocos); // Capa esquerda
        doc.rect(reguaX, reguaY, larguraRegua, alturaBlocos); // Régua
        doc.rect(capaDireitaX, capaDireitaY, larguraCapa, alturaBlocos); // Capa direita
        
        // Salve o PDF com um nome de arquivo
        doc.save('boneco-livro.pdf');
    }

    btnCalcular.addEventListener('click', calcularECriar);
    btnImprimir.addEventListener('click', imprimirBonecoPDF);
    
    calcularECriar();
});