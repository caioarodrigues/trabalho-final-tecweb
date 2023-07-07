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
const divGameOver = document.querySelector(".game-over");
let isFimDeJogo = false;
let toggleYPonto = false;
let bufferVelocidadeAcionado = false;

function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName);
    elemento.className = className;
    
    return elemento;
}
function geraDelayAleatorio(){
    const inteiro = Math.floor(Math.random() * 50)
    const delay = Math.random() * 10;
    const resultado = inteiro + delay;

    return resultado;
}

async function esperaUmSeg(){
    return new Promise(async (resolve, reject) => {
        const umSeg = 1000;
        
        setTimeout(async () => {
            resolve();
        }, umSeg);
    })
}
class Ponto {
    constructor(){
        this.elemento = novoElemento('span', 'ponto');
        this.pontoController = new PontoController();
    }

    getPonto(){
        return this.elemento;
    }
}
class EscoreController {
    constructor(){
        this.escore = document.querySelector(".pontos");
        this.escoreAtual = parseInt(this.escore.innerHTML);
    }
    edita(quantidade){
        this.escoreAtual += quantidade;
        this.escore.innerHTML = this.escoreAtual;
    }
}
class DistanciaController{
    constructor(){
        this.distInicial = 0;
        this.velController = new VelController();
    }
    atualizaDistancia(){
        const delay = 1000;
        const velAtual = this.velController.getVelocidadeAtual();
        const distancia = document.querySelector(".distancia");
        const distAtual = parseInt(distancia.innerHTML);

        distancia.innerHTML = `${(distAtual + velAtual/60).toFixed(2)} km`;
        
        setTimeout(() => {
            this.atualizaDistancia();
        }, delay);
    }
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

class VelController {
    constructor(){
        this.docVel = document.querySelector('.velocidade-span');
        // Seleciona a div com a classe "playground"
         



    }
    getVelocidadeAtual(){
        return parseInt(this.docVel.innerHTML);
    }
    acelera(valor){
        const velocidadeAtual = this.getVelocidadeAtual();
        const velocidadeFinal = velocidadeAtual + valor;
        const playgroundDiv = document.querySelector('.playground');

        if(velocidadeFinal > 0 && velocidadeFinal <= 120)
            this.docVel.innerHTML = velocidadeFinal;


            if(velocidadeFinal===0){
                playgroundDiv.style.backgroundImage = `url('/cenario/pistaParada.png')`;}
            if(velocidadeFinal>0 && velocidadeFinal<40){
                playgroundDiv.style.backgroundImage = `url('/cenario/pistaLenta.gif')`;}
            if(velocidadeFinal> 40 && velocidadeFinal<80){
                playgroundDiv.style.backgroundImage = `url('/cenario/pistaMedia.gif')`;}
            if(velocidadeFinal>80 && velocidadeFinal<120){
                playgroundDiv.style.backgroundImage = `url('/cenario/pistaRapida.gif')`;}
          


    /*////////////atualização do som do carro de acordo com a velocidade//////////*/
    playgroundAudio.play();
    playgroundAudio.playMusic();
    

    playgroundAudio.atualizaFrequenciaOscilador(velocidadeFinal);
/*////////////atualização do som do carro de acordo com a velocidade//////////*/
    }
    bufferizaVelocidade(contRepeticoes = 0){
        const limiteRepeticoes = 2;
        bufferVelocidadeAcionado = true;

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
class EntidadeController{
    getY(className){
        const el = document.querySelector(`.${className}`);
        const pos = parseInt(el.style.top) || 0;
        
        return pos;
    }
    setY(className, posAtual = 0){
        const velocidade = 10;
        const entidade = document.querySelector(`.${className}`);
        const entidadeLeft = entidade.style.left.split("px")[0];
        const playerLeft = document.querySelector(".player").style.left.split("px")[0];

        if(posAtual === 0 || posAtual > 0){
            entidade.style.top = `${posAtual + velocidade}px`;
            toggleYPonto = true;
        }
        if (posAtual > 440) {
            entidade.style.top = `0px`;
            toggleYPonto = false;
        }
        if(posAtual > 400 && className === "ponto" && 
            (Math.abs(playerLeft - entidadeLeft) <= 60) && !toggleYPonto){
            const _ = new EscoreController();
            _.edita(1);
        }
        if(posAtual > 400 && className === "obstaculo" && 
            (Math.abs(playerLeft - entidadeLeft) <= 60)){
                divGameOver.style.display = "flex";
                isFimDeJogo = true;
                playgroundAudio.stopMusic();
                playgroundAudio.stopOscillator();
        }
    }
    setX(obstaculo){
        const limite = 800;
        const xAleatorio = Math.random() * limite;

        obstaculo.style.left = `${xAleatorio}px`;
    }
    setPosicaoInicial(className){
        this.setY(className);
    }
    acelera(className){
        const pos = this.getY(className); 
        
        this.setY(className, pos);
    }
}
class ObstaculoController extends EntidadeController {}
class PontoController extends EntidadeController {}
class Obstaculo {
    constructor(){
        this.elemento = novoElemento('span', `obstaculo obs`);
        this.velocidade = 10;
        this.obstaculoController = new ObstaculoController();
        const randomColor = Math.random()*360;
        const randomLight = 2.5 + (Math.random() * 2);
        this.elemento.style['filter'] = 'hue-rotate('+randomColor+'deg) brightness('+randomLight+')';
            
    }
    getObstaculo(){
        return [new Obstaculo()];
    }
}

class FabricaDeObstaculo {
    constructor(){
        this.obstaculo = new Obstaculo();
        this.obstaculos = this.obstaculo.getObstaculo();
       
        
    }


    getObstaculos(){
        return this.obstaculos.map(({ elemento }) => elemento);
    }
}
class Carro {
    constructor(largura) {
        this.elemento = novoElemento('span', 'player');
        this.largura = largura;
        this.velocidade = 0;
        this.velController = new VelController();
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

class Jogo {
    constructor(){
        this.pontos = 0;
        this.areaDoJogo = document.querySelector(".playground");
        this.altura = this.areaDoJogo.clientHeight;
        this.largura = this.areaDoJogo.clientWidth;
        this.carro = new Carro(this.largura);
        this.timer = new Timer();
        this.pista = new Pista();
        this.fabricaDeObstaculo = new FabricaDeObstaculo();
        this.obstaculoController = new ObstaculoController();
        this.distanciaController = new DistanciaController();
        this.entidadeController = new EntidadeController();
        this.ponto = new Ponto();
        this.velController = new VelController();

        document.addEventListener('keydown', (event) => {
            const teclaPressionada = event.key || String.fromCharCode(event.keyCode);

            if (teclaPressionada.toLowerCase() === 'd') {
                this.carro.movimentaHorinzotal(20);
            }
            else if (teclaPressionada.toLowerCase() === 'a') {
                this.carro.movimentaHorinzotal(-20);
            }
            else if (teclaPressionada.toLowerCase() === 'w') {
                this.carro.movientaVertical(10);
                !bufferVelocidadeAcionado && this.carro.velController.bufferizaVelocidade();
            }
            else if (teclaPressionada.toLowerCase() === 's') {
                this.carro.movientaVertical(-10);
            }
            else if (teclaPressionada.toLowerCase() === 'r') {
                location.reload();
            }
        });
    }
    insereNoPlayground(...array){
        array.forEach(el => {
            espacoJogador.appendChild(el);
        });
    }
    insereEntidade(...entidades){
        const divEntidades = document.querySelector(".entidades");

        entidades.forEach(entidade => {
            entidade.style.display = "none";

            divEntidades.appendChild(entidade);
        });
    }
    movimentaEntidade(...entidades){
        const delay = geraDelayAleatorio();

        setTimeout(() => {
            entidades.forEach(entidade => {
                const className = entidade.classList.value.split(' ')[0];

                if(this.velController.getVelocidadeAtual() === 0 || isFimDeJogo)
                    return;

                if(entidade.style.top > '600px')
                    this.obstaculoController.setX(entidade);

                if(entidade.style.display === "none")
                    entidade.style.display = "inline-block";

                this.entidadeController.acelera(className);
            });

            this.movimentaEntidade(...entidades);
        }, delay);
    }
    inicia(){
        const pista = this.pista.getPista();
        const jogador = this.carro.getCarro();
        const pontoSpan = this.ponto.getPonto();
        const [obstaculoSpan] = this.fabricaDeObstaculo.getObstaculos();
        const elementos = [jogador];
        const entidades = [obstaculoSpan, pontoSpan];

        this.insereNoPlayground(...elementos);
        this.insereEntidade(...entidades);
        this.timer.inicia();
        this.movimentaEntidade(...entidades);
        this.distanciaController.atualizaDistancia();
        const periodoDia = new PeriodoDia();
        periodoDia.startAnimation();
        
    }
}

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
    
    // Define um temporizador para remover gradualmente a classe de direção após soltar a tecla
    clearTimeout(player.timer);
    player.timer = setTimeout(() => {
      player.classList.remove('w', 'a', 'd', 's');
    }, 500); // Tempo em milissegundos para remover a classe
  });
  




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
  
    playMusic() {
      this.audio.play();
    }
  
    stopMusic() {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  
    stopOscillator() {
      if (this.oscillator) {
        this.oscillator.stop(this.context.currentTime);
        this.oscillator.disconnect(this.volume);
        this.oscillator = null;
      }
    }
  }

  class PeriodoDia {
    constructor() {
      this.playground = document.querySelector('.playground');
      this.filters = [
        'brightness(120%) contrast(100%) saturate(120%)',  // DIA
        'brightness(15%) contrast(100%) saturate(1500%)',    // NOITE
        'brightness(180%) contrast(100%) saturate(10%)',   // NEVE
        
        'brightness(20%) contrast(50%) saturate(200%) blur(1px)' // CERRADO
      ];
      this.currentIndex = 0;
    }
  
    startAnimation() {
      this.aplicarFiltro();
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.filters.length;
        this.aplicarFiltro();
      }, 30000);
    }
  
    aplicarFiltro() {
      const currentFilter = this.filters[this.currentIndex];
      this.playground.style.filter = currentFilter;
    }
  }
  

  


  
  

/*Expressão necessária para instanciar a classe audio*/ 
const playgroundAudio = new PlaygroundAudio();

/*///////CLASSE COM OS MÉTODOS PARA AUDIO E ATUALIZAÇÃO DO AUDIO DO CARRO PRINCIPAL/////////////////////*/
new Jogo().inicia();