const playground = document.querySelector('.playground');
const espacoJogador = document.querySelector('.espaco-jogador');
const main = document.querySelector('main');
const alturaEspacoJogador = espacoJogador.clientHeight; 
const larguraTela = main.clientWidth;
const larguraPlayground = playground.clientWidth;
const larguraMargem = (larguraTela - larguraPlayground) / 2
const larguraPlayer = 130;
const ptoInicialPlayround = 0 + larguraPlayer;
const ptoFinalPlayground = larguraTela - larguraMargem * 2 - larguraPlayer;
let bufferVelocidadeAcionado = false;


function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName);
    elemento.className = className;
    
    return elemento;
}
/*//////////////adição CAIOÃ //////////////////*/
function geraDelayAleatorio(){
  const inteiro = Math.floor(Math.random() * 5)
  const delay = Math.random() * 10;
  const resultado = inteiro + delay;

  return resultado;
}
/*//////////////adição CAIOÃ //////////////////*/

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
    
    
     
    getValor() {
      return this.contador;
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

        if(velocidadeFinal===0){
            const manager = new ImageDivManager('.container', '.div-layer', 6, 517, '/cenarios/pista/frame1.png');
            manager.distributeImage();}
        if(velocidadeFinal>0 && velocidadeFinal<30){
            const manager = new ImageDivManager('.container', '.div-layer', 6, 517, '/cenarios/pista/devagar.gif');
            manager.distributeImage();
            }
        if(velocidadeFinal>30 && velocidadeFinal<60){
            const manager = new ImageDivManager('.container', '.div-layer', 6, 517, '/cenarios/pista/medio.gif');
            manager.distributeImage();
            }
        if(velocidadeFinal>60 && velocidadeFinal<90){
            const manager = new ImageDivManager('.container', '.div-layer', 6, 517, '/cenarios/pista/rapido.gif');
            manager.distributeImage();
            }
        if(velocidadeFinal>90&&velocidadeFinal<120){
            const manager = new ImageDivManager('.container', '.div-layer', 6, 517, '/cenarios/pista/muito_rapido.gif');
            manager.distributeImage();
            }

          
           
          
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
        const pistAnima = new PistaAnimacao();
        pistAnima.criarDivs();
        pistAnima.empilhamento();
        
    }

    getPista(){
        return this.elemento;
    }
}

/*//////////////adição CAIOÃ //////////////////*/
class ObstaculoController{
  getY(className){
      const el = document.querySelector(`.${className}`);
      const pos = parseInt(el.style.top) || 0;
      
      return pos;
  }
  setY(className, posAtual = 0){
      const velocidade = 10;
      const obstaculo = document.querySelector(`.${className}`);

      if(posAtual === 0 || posAtual > 0) obstaculo.style.top = `${posAtual + velocidade}px`;
      if (posAtual > 440) obstaculo.style.top = `0px`;
  }
  setPosicaoInicial(className){
      this.setY(className);
  }
  acelera(className){
      const velocidade = 10;
      const pos = this.getY(className); 
      const obstaculo = document.querySelector(`.${className}`);

      this.setY(className, pos);
  }
}
class Obstaculo {
  constructor(id){
      this.id = id;
      this.elemento = novoElemento('span', `obstaculo obs-${id}`);
      this.velocidade = 10;
      this.obstaculoController = new ObstaculoController();
  }
  getObstaculo(qtde = 0){
      if(qtde > 0){
          const obstaculos = [];

          for(let i = 0; i < qtde; i++)
              obstaculos.push(new Obstaculo(i));

          return obstaculos; 
      }

      return this.elemento;
  }
  anima(){
      setTimeout(() => {
          this.movimentaY();
      }, 100);
      this.anima();
  }
}

class FabricaDeObstaculo {
  constructor(limite = 8){
      this.obstaculo = new Obstaculo();
      this.obstaculos = this.obstaculo.getObstaculo(limite);
  }
  getObstaculos(){
      return this.obstaculos.map(({ elemento }) => elemento);
  }
}
/*//////////////adição CAIOÃ //////////////////*/



/*////////////////////////////////criação da pista //////////////////////////////////////////*/
class PistaAnimacao {
    constructor() {
      this.container = document.querySelector('.container');
      
    }
  
    novoElemento(tagName, className) {
      const elemento = document.createElement(tagName);
      elemento.className = className;
      return elemento;
    }
  
    criarDivs() {
        for (let i = 0; i < 100; i++) {
          const div = this.novoElemento('div', 'div-layer');
          const primeiraDiv = this.container.firstChild;
          if (primeiraDiv) {
            this.container.insertBefore(div, primeiraDiv);
          } else {
            this.container.appendChild(div);
          }
        }
      }
      
  
    empilhamento() {
      const divLayers = document.querySelectorAll('.container .div-layer');
      
      for (let i = 0; i < divLayers.length; i++) {
        const widthPercentage =(i * 1);
  
        divLayers[i].style.width = widthPercentage + '%';   
        
        if (i >= 0 && i < 30) {
            divLayers[i].remove();
          }
      }
    }
    
    moveDivsToRight(tempoDeTransicao) {
      const divLayers = document.querySelectorAll('.container .div-layer'); 
      const montanha = document.querySelector('.montanha');
     
      for (var i = 0; i < 70; i++) {
        var div = divLayers[i];
        var currentMargin = parseInt(window.getComputedStyle(div).marginLeft || 0);
        var newMargin = currentMargin + Math.exp((50 - i/2) / 8);      
        div.style.marginLeft = newMargin + 'px';
        div.style.transition = `margin-left ${tempoDeTransicao}s ease`;
      }
      montanha.style.marginRight = 200 + 'px';
      montanha.style.transition = `margin-right ${tempoDeTransicao*5}s ease`;
      
    }
    
    
    moveDivsToLeft(tempoDeTransicao) {
      const divLayers = document.querySelectorAll('.container .div-layer'); 
      const montanha = document.querySelector('.montanha');
      
      for (var i = 0; i < 70; i++) {
        var div = divLayers[i];
        var currentMargin = parseInt(window.getComputedStyle(div).marginRight || 0);
        var newMargin = currentMargin + Math.exp((50 - i / 2) / 8);      
        div.style.marginRight = newMargin + 'px';
        div.style.transition = `margin-right ${tempoDeTransicao}s ease`;
      }
      
      montanha.style.marginLeft = 200 + 'px';
      montanha.style.transition = `margin-left ${tempoDeTransicao*5}s ease`;
    }
   
    


  }

  
/*////////////////////////////////criação da pista //////////////////////////////////////////*/








/*FATIAMENTO DA IMAGEM E READEQUAÇÃO NAS 70 DIVS QUE REPRESENTAM A PISTA*/

class ImageDivManager {
  constructor(containerSelector, divSelector, divHeight, imageHeight, imagePath) {
    this.container = document.querySelector(containerSelector);
    this.divs = this.container.querySelectorAll(divSelector);
    this.divHeight = divHeight;
    this.imageHeight = imageHeight;
    this.imagePath = imagePath;
  }

  distributeImage() {
    this.container.style.position = 'relative';

    this.divs.forEach((div, index) => {
      const offsetY = -index * this.divHeight;
      div.style.backgroundImage = `url(${this.imagePath})`;
      div.style.backgroundSize = 'cover';
      div.style.backgroundPosition = `center ${offsetY}px`;
      div.style.overflow = 'hidden';
      
      div.style.top = '0';
      div.style.left = '0';
      div.style.height = `${this.divHeight}px`;
     
    });
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
    const pistAnima2 = new PistaAnimacao();
    if (teclaPressionada === 'w') { 
        
       // pistAnima2.moveDivsToRight(3);
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
     
     // pistAnima2.moveDivsToLeft(3);
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
        this.fabricaDeObstaculo = new FabricaDeObstaculo();  //CAIOÃ
        this.obstaculoController = new ObstaculoController();//CAIOÃ

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


    insereObstaculo(...obstaculos){
      const divObstaculos = document.querySelector(".obstaculos");

      obstaculos.forEach(obs => divObstaculos.appendChild(obs));
  }
  movimentaObstaculos(indice = 0, ...obstaculos){
      const delay = geraDelayAleatorio();
      const obstaculo = obstaculos[indice];
      const className = obstaculo.classList.value.split(' ')[1];
      
      console.log(`indice = ${indice}`)
      this.obstaculoController.acelera(className);

      
      setTimeout(() => {
          if(indice === obstaculos.length - 1) indice = -1;

          this.movimentaObstaculos(++indice, ...obstaculos);
      }, delay);
  }
    inicia(){
       
        const pista = this.pista.getPista();
        const jogador = this.carro.getCarro();
        const elementos = [jogador, pista];
        const obstaculosSpan = this.fabricaDeObstaculo.getObstaculos();
        this.timer.inicia();

        this.insereNoPlayground(...elementos);
        this.insereObstaculo(...obstaculosSpan); //CAIOÃ
        const manager = new ImageDivManager('.container', '.div-layer', 6, 517, '/cenarios/pista/frame1.png');
        manager.distributeImage(); 
        this.movimentaObstaculos(0, ...obstaculosSpan);//OBSTÁCULOS
        curvasAnimacao();
        
    }
}



function curvasAnimacao(velocidade) {
  var startTime = Date.now();

  function atualizarTimer() {
    var currentTime = Date.now();
    var elapsedTime = currentTime - startTime;
    const pistaAnimacao = new PistaAnimacao();
    
  
    // Verifique o valor do elapsedTime e ative o método da outra classe, se necessário
    if (elapsedTime > 500 && elapsedTime < 1500 /*&& velocidade>0*/) {
      pistaAnimacao.moveDivsToLeft(1);
      
    } else if (elapsedTime > 29500 && elapsedTime < 30500 /*&& velocidade>0*/) {
      pistaAnimacao.moveDivsToRight(1);
      
    } else if (elapsedTime > 31500 && elapsedTime < 32500 /*&& velocidade>0*/) {
      pistaAnimacao.moveDivsToRight(10);
      
    } else if (elapsedTime > 43500 && elapsedTime < 44500 /*&& velocidade>0*/) {
      pistaAnimacao.moveDivsToLeft(10);
      
    } else if (elapsedTime > 62500 && elapsedTime < 63500 /*&& velocidade>0*/) {
      pistaAnimacao.moveDivsToLeft(1);
      
    } else if (elapsedTime > 73500 && elapsedTime < 74500 /*&& velocidade>0*/) {
      pistaAnimacao.moveDivsToRight(1);
      
    } else if (elapsedTime > 75500 && elapsedTime < 76500 /*&& velocidade>0*/) {
      pistaAnimacao.moveDivsToLeft(10);
      
    } else if (elapsedTime > 95500 && elapsedTime < 96500 /*&& velocidade>0*/) {
      pistaAnimacao.moveDivsToRight(10);
      
    }else if(elapsedTime > 107500 /*&& velocidade>0*/) {
      // Reinicie o elapsedTime com um novo startTime e currentTime
      startTime = Date.now();
      elapsedTime = 0;
    }

    // Atualize o timer a cada segundo (1000ms)
    setTimeout(atualizarTimer, 1000);
  }

  // Inicie o timer pela primeira vez
  atualizarTimer();
}









const jogo = new Jogo();
jogo.inicia();








