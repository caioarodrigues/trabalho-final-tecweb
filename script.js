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
    
    acelera(valor){
        const velocidadeAtual = this.getVelocidadeAtual();
        const velocidadeFinal = velocidadeAtual + valor;

        if(velocidadeFinal > 0 && velocidadeFinal <= 120)
            this.docVel.innerHTML = velocidadeFinal;

/*////////////atualização do som do carro de acordo com a velocidade//////////*/
          playgroundAudio.play();
          playgroundAudio.playMusic();
          playgroundAudio.atualizaFrequenciaOscilador(velocidadeFinal);
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
            if (bgColor === "red") 

            /*Parte modificada para dano no carro após deixar os limites da estrada, desativa o filtro de dano*/ 
                this.elemento.style.backgroundColor = "transparent";
                this.elemento.style['filter'] = 'none';
            /*Parte modificada para dano no carro após deixar os limites, desativa o filtro de dano*/  
            
            this.setX(soma);
        }
        else if(soma <= ptoInicialPlayround || soma >= ptoFinalPlayground)

        /*Parte modificada para dano no carro após bater nos limites da estrada, ativa o filtro de dano*/ 
        this.elemento.style['filter'] = 'grayscale(10%) sepia(200%) brightness(50%)';

            
    }


      
}

/*///////CLASSE COM OS MÉTODOS PARA AUDIO E ATUALIZAÇÃO DO AUDIO DO CARRO PRINCIPAL/////////////////////*/
class PlaygroundAudio {
    constructor() {
      this.context = new AudioContext();
      this.volume = this.context.createGain();   
      this.volume.connect(this.context.destination);
      this.oscillator = null;
      this.audio = new Audio('/music/musicCar.mp3');
      this.audio.loop = true;
      this.volumeFixo = 0.2; // Valor fixo para o volume (por exemplo, 0.5)
      this.volume.gain.value = this.volumeFixo;
    }
  
    play() {
      if (this.oscillator) {
        this.oscillator.stop(this.context.currentTime);
        this.oscillator.disconnect(this.volume);
        this.oscillator = null;
      }
  
      this.oscillator = this.context.createOscillator();
      this.oscillator.frequency.value = 0;
      this.oscillator.detune.value = 0;
      this.oscillator.type = 'sawtooth';
      this.oscillator.connect(this.volume);
      this.oscillator.start(0);
    }
  
    atualizaFrequenciaOscilador(velocidadeFinal) {
      const frequenciaMinima = 20;
      const frequenciaMaxima = 120;
      const proporcao = (velocidadeFinal - 0) / (120 - 0);
      const frequencia = frequenciaMinima + (proporcao * (frequenciaMaxima - frequenciaMinima));
      this.oscillator.frequency.value = frequencia;
    }
  /*adição de trilha sonora do jogo, resta ainda ativa-la assim qque iniciar o jogo, por enquanto é só ativada ao acelerar*/
    playMusic() {
    
      this.audio.play();
    }
  
    stopMusic() {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

/*Expressão necessária para instanciar a classe audio*/ 
const playgroundAudio = new PlaygroundAudio();

/*///////CLASSE COM OS MÉTODOS PARA AUDIO E ATUALIZAÇÃO DO AUDIO DO CARRO PRINCIPAL/////////////////////*/





/*////////////////PARTE ADICIONADA PARA ANIMAÇÃO DO CARRO INDO PARA OS LADOS/////////////*/
  
document.addEventListener('keydown', (event) => {
    const teclaPressionada = event.key || String.fromCharCode(event.keyCode);
    const player = document.querySelector('.player');
    
    if (teclaPressionada === 'w') {
      player.classList.add('w');
      player.classList.remove('a', 'd', 's');
    } else if (teclaPressionada === 'a') {
      player.classList.add('a');
      player.classList.remove('w', 'd', 's');
    } else if (teclaPressionada === 'd') {
      player.classList.add('d');
      player.classList.remove('w', 'a', 's');
    } else if (teclaPressionada === 's') {
      player.classList.add('s');
      player.classList.remove('w', 'a', 'd');
    }
  });
 /*////////////////PARTE ADICIONADA PARA ANIMAÇÃO DO CARRO INDO PARA OS LADOS/////////////*/ 

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


const jogo = new Jogo();
jogo.inicia();




