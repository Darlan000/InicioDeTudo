document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.getElementById('btn-calcular');
    const btnImprimir = document.getElementById('btn-imprimir');
    const larguraInput = document.getElementById('largura');
    const alturaInput = document.getElementById('altura');
    const lombadaInput = document.getElementById('lombada');
    const larguraOrelhaInput = document.getElementById('largura-orelha');
    const temOrelhaEsquerdaInput = document.getElementById('tem-orelha-esquerda');
    const temOrelhaDireitaInput = document.getElementById('tem-orelha-direita');
    const temDebrumInput = document.getElementById('tem-debrum');
    const gabaritoContainer = document.getElementById('gabarito-container');
    const avisoDimensoes = document.getElementById('aviso-dimensoes');

    const retanguloEsquerda = document.getElementById('retangulo-interno-esquerda');
    const retanguloDireita = document.getElementById('retangulo-interno-direita');
    const retanguloLombada = document.getElementById('retangulo-lombada');
    const orelhaEsquerda = document.getElementById('orelha-esquerda');
    const orelhaDireita = document.getElementById('orelha-direita');

    const mmParaPx = 3.78;
    const debrumDistancia = 15;
    const margemBranca = 10;
    const margemGeral = 30;

    function desenharGabarito() {
        const larguraCapa = parseFloat(larguraInput.value);
        const alturaCapa = parseFloat(alturaInput.value);
        const larguraLombada = parseFloat(lombadaInput.value);
        const larguraOrelha = parseFloat(larguraOrelhaInput.value);
        const temOrelhaEsquerda = temOrelhaEsquerdaInput.checked;
        const temOrelhaDireita = temOrelhaDireitaInput.checked;
        const temDebrum = temDebrumInput.checked;

        let larguraTotalVisual = (larguraCapa * 2) + larguraLombada;
        if (temOrelhaEsquerda) larguraTotalVisual += larguraOrelha;
        if (temOrelhaDireita) larguraTotalVisual += larguraOrelha;

        if (temDebrum && !temOrelhaEsquerda && !temOrelhaDireita) {
            gabaritoContainer.classList.add('debrum-ativo');
            larguraTotalVisual += debrumDistancia * 2;
        } else {
            gabaritoContainer.classList.remove('debrum-ativo');
        }

        if (larguraTotalVisual * mmParaPx > window.innerWidth - 40) {
            avisoDimensoes.style.display = 'block';
        } else {
            avisoDimensoes.style.display = 'none';
        }

        const larguraCapaPx = larguraCapa * mmParaPx;
        const alturaCapaPx = alturaCapa * mmParaPx;
        const larguraLombadaPx = larguraLombada * mmParaPx;
        const larguraOrelhaPx = larguraOrelha * mmParaPx;

        gabaritoContainer.style.height = `${alturaCapaPx}px`;

        let currentPosition = 0;
        if (temDebrum && !temOrelhaEsquerda && !temOrelhaDireita) {
            currentPosition = debrumDistancia * mmParaPx;
        }

        orelhaEsquerda.style.display = temOrelhaEsquerda ? 'block' : 'none';
        if (temOrelhaEsquerda) {
            orelhaEsquerda.style.width = `${larguraOrelhaPx}px`;
            orelhaEsquerda.style.height = `${alturaCapaPx}px`;
        }

        retanguloEsquerda.style.width = `${larguraCapaPx}px`;
        retanguloEsquerda.style.height = `${alturaCapaPx}px`;
        retanguloLombada.style.width = `${larguraLombadaPx}px`;
        retanguloLombada.style.height = `${alturaCapaPx}px`;
        retanguloDireita.style.width = `${larguraCapaPx}px`;
        retanguloDireita.style.height = `${alturaCapaPx}px`;

        orelhaDireita.style.display = temOrelhaDireita ? 'block' : 'none';
        if (temOrelhaDireita) {
            orelhaDireita.style.width = `${larguraOrelhaPx}px`;
            orelhaDireita.style.height = `${alturaCapaPx}px`;
        }
    }

    function imprimirGabaritoPDF() {
        if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
            console.error('jsPDF library not loaded.');
            alert('A biblioteca jsPDF ainda não foi carregada. Tente novamente em alguns segundos.');
            return;
        }

        const { jsPDF } = window.jspdf;

        const larguraCapa = parseFloat(larguraInput.value);
        const alturaCapa = parseFloat(alturaInput.value);
        const larguraLombada = parseFloat(lombadaInput.value);
        const larguraOrelha = parseFloat(larguraOrelhaInput.value);
        const temOrelhaEsquerda = temOrelhaEsquerdaInput.checked;
        const temOrelhaDireita = temOrelhaDireitaInput.checked;
        const temDebrum = temDebrumInput.checked;
        const debrumDistancia = 15;
        const margemDebrum = 10;

        let larguraTotal = (larguraCapa * 2) + larguraLombada;
        const alturaGabarito = alturaCapa;

        if (temOrelhaEsquerda) larguraTotal += larguraOrelha;
        if (temOrelhaDireita) larguraTotal += larguraOrelha;

        let larguraDocumento, alturaDocumento;
        let doc;
        let currentX, y;

        larguraDocumento = (larguraTotal + (debrumDistancia * 2)) + (margemDebrum * 2);
        alturaDocumento = (alturaGabarito + (debrumDistancia * 2)) + (margemDebrum * 2);

        doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [larguraDocumento, alturaDocumento]
        });

        currentX = margemDebrum + debrumDistancia;
        y = margemDebrum + debrumDistancia;

        if (temDebrum && !temOrelhaEsquerda && !temOrelhaDireita) {
            doc.setDrawColor(255, 0, 0);
            doc.setLineWidth(0.5);
            doc.rect(margemDebrum, margemDebrum, larguraDocumento - (margemDebrum * 2), alturaDocumento - (margemDebrum * 2), 'S');
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.2);
        }

        const desenharSetaETexto = (x, y, dim, orientacao, texto) => {
            const ponta = 2;
            const deslocamento = 2;
            doc.setFontSize(7);
            doc.setLineWidth(0.2);
            doc.setDrawColor(0, 0, 0);

            if (orientacao === 'horizontal') {
                const xMeio = x + dim / 2;
                const espacoTexto = doc.getTextWidth(texto) + 2; 
                const ySeta = y + 5;
                doc.line(x + deslocamento, ySeta, xMeio - espacoTexto / 2, ySeta);
                doc.line(xMeio + espacoTexto / 2, ySeta, x + dim - deslocamento, ySeta);
                doc.line(x + deslocamento, ySeta, x + deslocamento + ponta, ySeta - ponta);
                doc.line(x + deslocamento, ySeta, x + deslocamento + ponta, ySeta + ponta);
                doc.line(x + dim - deslocamento, ySeta, x + dim - deslocamento - ponta, ySeta - ponta);
                doc.line(x + dim - deslocamento, ySeta, x + dim - deslocamento - ponta, ySeta + ponta);
                doc.text(texto, xMeio, ySeta + 1, { align: 'center' });
            } else {
                const yMeio = y + dim / 2;
                const xSeta = x + 5;
                const textoLargura = doc.getTextWidth(texto);
                const espacoTexto = textoLargura + 2;
                doc.line(xSeta, y + deslocamento, xSeta, yMeio - espacoTexto / 2);
                doc.line(xSeta, yMeio + espacoTexto / 2, xSeta, y + dim - deslocamento);
                doc.line(xSeta, y + deslocamento, xSeta - ponta, y + deslocamento + ponta);
                doc.line(xSeta, y + deslocamento, xSeta + ponta, y + deslocamento + ponta);
                doc.line(xSeta, y + dim - deslocamento, xSeta - ponta, y + dim - deslocamento - ponta);
                doc.line(xSeta, y + dim - deslocamento, xSeta + ponta, y + dim - deslocamento - ponta);
                doc.text(texto, xSeta + 5, yMeio, { align: 'right' });
            }
        };

        const desenharSetaDebrumHorizontal = (x, y, dim, texto) => {
            const ponta = 2;
            const espacoTexto = doc.getTextWidth(texto) + 2;
            doc.setFontSize(7);
            doc.setLineWidth(0.2);
            doc.setDrawColor(255, 0, 0);

            const ySeta = y + 5;
            const xMeio = x + dim / 2;

            doc.line(x, ySeta, xMeio - espacoTexto / 2, ySeta);
            doc.line(xMeio + espacoTexto / 2, ySeta, x + dim, ySeta);

            doc.line(x, ySeta, x + ponta, ySeta - ponta);
            doc.line(x, ySeta, x + ponta, ySeta + ponta);

            doc.line(x + dim, ySeta, x + dim - ponta, ySeta - ponta);
            doc.line(x + dim, ySeta, x + dim - ponta, ySeta + ponta);
            
            doc.text(texto, xMeio, ySeta + 1, { align: 'center' });
        };
        
        const desenharSetaDebrumVertical = (x, y, dim, texto, placement) => {
            const ponta = 2;
            const espacoTexto = doc.getTextWidth(texto) + 2;
            doc.setFontSize(7);
            doc.setLineWidth(0.2);
            doc.setDrawColor(255, 0, 0);

            let xSeta;
            let yTexto, xTexto;
            let alignTexto;

            const yMeio = y + dim / 2;

            if (placement === 'left') {
                xSeta = x - 5;
                xTexto = xSeta - 5;
                yTexto = yMeio;
                alignTexto = 'right';
            } else if (placement === 'bottom') {
                xSeta = x;
                xTexto = x;
                yTexto = y + dim / 2 + 1;
                alignTexto = 'center';
            }

            doc.line(xSeta, y, xSeta, yMeio - espacoTexto / 2);
            doc.line(xSeta, yMeio + espacoTexto / 2, xSeta, y + dim);

            doc.line(xSeta, y, xSeta - ponta, y + ponta);
            doc.line(xSeta, y, xSeta + ponta, y + ponta);

            doc.line(xSeta, y + dim, xSeta - ponta, y + dim - ponta);
            doc.line(xSeta, y + dim, xSeta + ponta, y + dim - ponta);
            
            doc.text(texto, xTexto, yTexto, { align: alignTexto, baseline: 'middle' });
        };

        let capaEsquerdaX;
        let lombadaX;
        let capaDireitaX;

        if (temOrelhaEsquerda) {
            doc.rect(currentX, y, larguraOrelha, alturaGabarito);
            capaEsquerdaX = currentX + larguraOrelha;
        } else {
            capaEsquerdaX = currentX;
        }

        doc.rect(capaEsquerdaX, y, larguraCapa, alturaGabarito);
        lombadaX = capaEsquerdaX + larguraCapa;
        doc.rect(lombadaX, y, larguraLombada, alturaGabarito);
        capaDireitaX = lombadaX + larguraLombada;
        doc.rect(capaDireitaX, y, larguraCapa, alturaGabarito);

        if (temOrelhaDireita) {
            const orelhaDireitaX = capaDireitaX + larguraCapa;
            doc.rect(orelhaDireitaX, y, larguraOrelha, alturaGabarito);
        }

        const ySetasLargura = y;
        const xSetaAltura = currentX;

        desenharSetaETexto(capaEsquerdaX, ySetasLargura, larguraCapa, 'horizontal', `${larguraCapa}mm`);
        desenharSetaETexto(lombadaX, ySetasLargura, larguraLombada, 'horizontal', `${larguraLombada}mm`);
        desenharSetaETexto(capaDireitaX, ySetasLargura, larguraCapa, 'horizontal', `${larguraCapa}mm`);
        desenharSetaETexto(xSetaAltura, ySetasLargura, alturaGabarito, 'vertical', `${alturaCapa}mm`);

        if (temOrelhaEsquerda) {
            desenharSetaETexto(currentX, ySetasLargura, larguraOrelha, 'horizontal', `${larguraOrelha}mm`);
        }
        if (temOrelhaDireita) {
            desenharSetaETexto(capaDireitaX + larguraCapa, ySetasLargura, larguraOrelha, 'horizontal', `${larguraOrelha}mm`);
        }
        
        if (temDebrum && !temOrelhaEsquerda && !temOrelhaDireita) {
            const xHorizontalDebrum = margemDebrum;
            const yHorizontalDebrum = y + (alturaGabarito / 2) - 1;
            desenharSetaDebrumHorizontal(xHorizontalDebrum, yHorizontalDebrum, debrumDistancia, '15mm');

            const xVerticalDebrum = currentX + (larguraTotal / 2);
            const yVerticalDebrum = y + alturaGabarito;
            desenharSetaDebrumVertical(xVerticalDebrum, yVerticalDebrum, debrumDistancia, '15mm', 'bottom');
        }

        doc.save('gabarito-livro.pdf');
    }

    btnCalcular.addEventListener('click', desenharGabarito);
    btnImprimir.addEventListener('click', imprimirGabaritoPDF);
    temOrelhaEsquerdaInput.addEventListener('change', desenharGabarito);
    temOrelhaDireitaInput.addEventListener('change', desenharGabarito);
    temDebrumInput.addEventListener('change', () => {
        const temOrelhaEsquerda = temOrelhaEsquerdaInput.checked;
        const temOrelhaDireita = temOrelhaDireitaInput.checked;
        const temDebrum = temDebrumInput.checked;
        
        if (temDebrum && (temOrelhaEsquerda || temOrelhaDireita)) {
            alert('A opção de debrum só pode ser habilitada com as orelhas desativadas.');
            temDebrumInput.checked = false;
        }
        desenharGabarito();
    });
    larguraInput.addEventListener('change', desenharGabarito);
    alturaInput.addEventListener('change', desenharGabarito);
    lombadaInput.addEventListener('change', desenharGabarito);
    larguraOrelhaInput.addEventListener('change', desenharGabarito);

    desenharGabarito();
    window.addEventListener('resize', desenharGabarito);
});