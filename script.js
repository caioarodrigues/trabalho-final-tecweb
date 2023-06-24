const playground = document.querySelector('.playground');
const espacoJogador = document.querySelector('.espaco-jogador');
const main = document.querySelector('main');
const alturaEspacoJogador = espacoJogador.clientHeight; 
const larguraTela = main.clientWidth;
const larguraPlayground = playground.clientWidth;
const larguraMargem = (larguraTela - larguraPlayground) / 2
const larguraPlayer = 50;
const ptoInicialPlayround = 0 + larguraPlayer;
const ptoFinalPlayground = larguraTela - larguraMargem * 2 - larguraPlayer;
let bufferVelocidadeAcionado = false;

function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName);
    elemento.className = className;
    
    return elemento;
}

class Timer{
    constructor(){
        this.docTimer = document.querySelector('.timer');
    }
    inicia(contador = 0){
        this.docTimer.innerText = `${contador.toFixed(3)}`;
        
        setTimeout(() => {
            const fracSegundo = 0.001;

            this.inicia(contador + fracSegundo);
        }, 1);
    }
}

class velController {
    constructor(){
        this.docVel = document.querySelector('.velocidade-span');
    }
    getVelocidadeAtual(){
        return parseInt(this.docVel.innerHTML);
    }

/*////////////FUNÇÃO DE ATUALIZAÇÃO DO SOM DO CARRO DE ACORDO COM A VELOCIDADE//////////*/
    atualizaFrequenciaOscilador(velocidadeFinal) {
        const frequenciaMinima = 20; // Defina a frequência mínima desejada
        const frequenciaMaxima = 120; // Defina a frequência máxima desejada
        const intervaloVelocidade = 120; // Defina o intervalo de velocidade em que a frequência deve variar
    
        // Mapeia a velocidade final para um intervalo entre 0 e 1
        const proporcao = (velocidadeFinal - 0) / (120 - 0);
    
        // Calcula a frequência com base na proporção e no intervalo de frequência desejado
        const frequencia = frequenciaMinima + (proporcao * (frequenciaMaxima - frequenciaMinima));
    
        playground.audio.oscillator.frequency.value = frequencia;
      }
/*////////////FUNÇÃO DE ATUALIZAÇÃO DO SOM DO CARRO DE ACORDO COM A VELOCIDADE//////////*/




    acelera(valor){
        const velocidadeAtual = this.getVelocidadeAtual();
        const velocidadeFinal = velocidadeAtual + valor;

        if(velocidadeFinal > 0 && velocidadeFinal <= 120)
            this.docVel.innerHTML = velocidadeFinal;
/*////////////atualização do som do carro de acordo com a velocidade//////////*/
            
            this.atualizaFrequenciaOscilador(velocidadeFinal);
/*////////////atualização do som do carro de acordo com a velocidade//////////*/
    }
    bufferizaVelocidade(contRepeticoes = 0){
        const limiteRepeticoes = 2;
        bufferVelocidadeAcionado = true;
        //pause
        if(contRepeticoes === limiteRepeticoes){
            bufferVelocidadeAcionado = false;

            return;
        }

        setTimeout(() => {
            const velocidadeAtual = this.getVelocidadeAtual();
            const velocidadeFinal = velocidadeAtual - 1;

            if(velocidadeFinal > 0)
                this.docVel.innerHTML = velocidadeFinal;
            
            this.bufferizaVelocidade(++contRepeticoes);
        }, 300);
    }



    
}
class BordaDaPista{
    constructor(){
        this.elemento = novoElemento('div', 'borda-da-pista');
        this.elemento.style.height = `${alturaEspacoJogador}px`;
        this.elemento.style.backgroundColor = 'black';
    }
    getBorda(){
        return this.elemento;
    }
}

class Pista {
    constructor(){
        this.elemento = novoElemento('div', 'pista');
        this.bordaEsquerda = new BordaDaPista().getBorda();
        this.bordaDireita = new BordaDaPista().getBorda();

        this.elemento.appendChild(this.bordaEsquerda);
        this.elemento.appendChild(this.bordaDireita);
    }

    getPista(){
        return this.elemento;
    }
}
class Carro {
    constructor(largura) {
        this.elemento = novoElemento('span', 'player');
        this.largura = largura;
        this.velocidade = 0;
        this.velController = new velController();
    }
    getCarro(){
        return this.elemento;
    }
    getX(){
        const x = parseInt(this.elemento.style.left.split('px')[0]) || 375;

        return x;
    }
    setX(x){
        this.elemento.style.left = `${x}px`;
    }
    movientaVertical(valor){
        this.velController.acelera(valor);
    }
    movimentaHorinzotal(x){
        const coordX = this.getX();
        const soma = x + coordX;
        const bgColor = this.elemento.style.backgroundColor;
        
        if(soma < ptoFinalPlayground && soma > 0){
            if(bgColor === "red")
                this.elemento.style.backgroundColor = "yellow";
            
            this.setX(soma);
        }
        else if(soma <= ptoInicialPlayround || soma >= ptoFinalPlayground)
            this.elemento.style.backgroundColor = "red";
    }
}

class Jogo {

    constructor(){
        this.pontos = 0;
        this.areaDoJogo = document.querySelector(".playground");
        this.altura = this.areaDoJogo.clientHeight;
        this.largura = this.areaDoJogo.clientWidth;
        this.carro = new Carro(this.largura);
        this.timer = new Timer();
        this.pista = new Pista();

        document.addEventListener('keydown', (event) => {
            const teclaPressionada = event.key || String.fromCharCode(event.keyCode);

            if (teclaPressionada.toLowerCase() === 'd') {
                this.carro.movimentaHorinzotal(10);
            }
            else if (teclaPressionada.toLowerCase() === 'a') {
                this.carro.movimentaHorinzotal(-10);
            }
            else if (teclaPressionada.toLowerCase() === 'w') {
                this.carro.movientaVertical(10);
                !bufferVelocidadeAcionado && this.carro.velController.bufferizaVelocidade();
            }
            else if (teclaPressionada.toLowerCase() === 's') {
                this.carro.movientaVertical(-10);
            }
        });
    }
    insereNoPlayground(...array){
        array.forEach(el => {
            espacoJogador.appendChild(el);
        });
    }
    inicia(){
        const pista = this.pista.getPista();
        const jogador = this.carro.getCarro();
        const elementos = [jogador, pista];

        this.insereNoPlayground(...elementos);
        this.timer.inicia();
        
        
    }
}

/*Parte modificada voltada ao audio do jogo ainda não implementado*/
/*Modo de uso (Todos os métodos abaixo são relativos a velocidade do carro, podendo ser usado tal característica para manipular o som pela frequência).
- playground.audio() Quando iniciar o jogo
-playground.audio.oscillator.frequency.value += car.acc * 10; Aumento da frequência do oscilador, passando a impressão de aumento da velocidade
- playground.audio.oscillator.frequency.value -= car.break * 10; Diminução da frequência do oscilador, passando a impressão de redução da velocidade
-playground.audio.oscillator.stop(); Carro após bater
*/

playground.audio = function () {
    if (playground.audio.oscillator) {
      playground.audio.oscillator.stop(playground.audio.context.currentTime);
      playground.audio.oscillator.disconnect(playground.audio.volume);
      delete playground.audio.oscillator;
    }
    playground.audio.context = new AudioContext();
    playground.audio.volume = playground.audio.context.createGain();
    playground.audio.volume.gain.value = 0.1;
    playground.audio.volume.connect(playground.audio.context.destination);  
    var o = playground.audio.context.createOscillator();
    o.frequency.value = 0;
    o.detune.value = 0;
    o.type = 'sawtooth';
    o.connect(playground.audio.volume);
    playground.audio.oscillator = o;
    playground.audio.oscillator.start(0);
  };









const jogo = new Jogo();
jogo.inicia();
playground.audio();

