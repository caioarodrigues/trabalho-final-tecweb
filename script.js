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
            const manager = new ImageDivManager('#container', '.div-layer', 6, 517, '/cenarios/pista/pistaParada.png');
            manager.distributeImage();}
        if(velocidadeFinal>0 && velocidadeFinal<40){
            const manager = new ImageDivManager('#container', '.div-layer', 6, 517, '/cenarios/pista/pistaLenta.gif');
            manager.distributeImage();
            }
        if(velocidadeFinal>40 && velocidadeFinal<80){
            const manager = new ImageDivManager('#container', '.div-layer', 6, 517, '/cenarios/pista/pistaMedia.gif');
            manager.distributeImage();
            }
        if(velocidadeFinal>80 && velocidadeFinal<120){
            const manager = new ImageDivManager('#container', '.div-layer', 6, 517, '/cenarios/pista/pistaRapida.gif');
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
        const pistAnima = new MovingDiv();
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





/*////////////////PARTE ADICIONADA PARA ANIMAÇÃO DO CARRO INDO PARA OS LADOS/////////////
  
document.addEventListener('keydown', (event) => {
    const teclaPressionada = event.key || String.fromCharCode(event.keyCode);
    const player = document.querySelector('.player');
   
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
                this.carro.movientaVertical(5);
                !bufferVelocidadeAcionado && this.carro.velController.bufferizaVelocidade();
            }
            else if (teclaPressionada.toLowerCase() === 's') {
                this.carro.movientaVertical(-5);
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
        const manager = new ImageDivManager('#container', '.div-layer', 6, 517, '/cenarios/pista/pistaParada.png');
        manager.distributeImage(); 
        this.movimentaObstaculos(0, ...obstaculosSpan);//OBSTÁCULOS
        curvasAnimacao();
        
    }
}



function curvasAnimacao() {
  var startTime = Date.now();
  

  function atualizarTimer() {
    var currentTime = Date.now();
    var elapsedTime = currentTime - startTime;
    const movingDiv = new MovingDiv();
    
  
    // Verifique o valor do elapsedTime e ative o método da outra classe, se necessário
    if (elapsedTime > 500 && elapsedTime < 1500 ) {
      movingDiv.moveDivsToLeft(1);
      
    } else if (elapsedTime > 2500 && elapsedTime < 3500 ) {
      movingDiv.moveDivsToRight(1);
      
    } else if (elapsedTime > 5500 && elapsedTime < 6500 ) {
      movingDiv.moveDivsToRight(1);
      
    } else if (elapsedTime > 9500 && elapsedTime < 10500 ) {
      movingDiv.moveDivsToLeft(1);
      
    } else if (elapsedTime > 12500 && elapsedTime < 13500 ) {
      movingDiv.moveDivsToLeft(1);
      
    } else if (elapsedTime > 17500 && elapsedTime < 18500 ) {
      movingDiv.moveDivsToRight(1);
      
    } else if (elapsedTime > 21500 && elapsedTime < 22500 ) {
      movingDiv.moveDivsToLeft(1);
      
    } else if (elapsedTime > 23500 && elapsedTime < 24500 ) {
      movingDiv.moveDivsToRight(1);
      
    }else if(elapsedTime > 24500 ) {
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
/////////////////////////////////////////////////////////
class MovingDiv {
  constructor(containerId) {
    this.speed = 1; // Velocidade inicial
    this.maxSpeed = 5; // Velocidade máxima
    this.minSpeed = -5; // Velocidade mínima
    this.interval = null;
    this.isPageVisible = true;
    this.container = document.getElementById(containerId);
    this.container2= document.querySelector('#container');

    document.addEventListener("keydown", (event) => {
      if (event.key === "w") {
        this.speed += 0.2; // Aumenta a velocidade ao pressionar 'w'
        if (this.speed > this.maxSpeed) {
          this.speed = this.maxSpeed; // Define a velocidade máxima
        }
      } else if (event.key === "s") {
        this.speed -= 0.2; // Diminui a velocidade ao pressionar 's'
        if (this.speed < this.minSpeed) {
          this.speed = this.minSpeed; // Define a velocidade mínima
        }
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.isPageVisible = true; // A página está visível, retome o setInterval
      } else {
        this.isPageVisible = false; // A página não está visível, pare o setInterval
      }
    });
  }

  start() {
    this.interval = setInterval(() => {
      this.moveDiv();
    }, 1000); // Cria uma nova div a cada 1 segundo
  }

  stop() {
    clearInterval(this.interval);
  }

  moveDiv() {
    const divLayers = document.querySelectorAll('#container .div-layer');
    if (this.speed > 0.5 && this.isPageVisible) {
      var divInimigo = document.createElement("div");
      divInimigo.id = "movingDiv";

      let numeroAleatorio = Math.floor(Math.random() * 51) - 10; // Gera um número aleatório entre -20 e 20
      divInimigo.style.left = numeroAleatorio + 'px';



      let containerWidth = this.container.offsetWidth;
      let containerHeight = this.container.offsetHeight;
      
      let containerLeft = this.container.offsetLeft;
      
      let varMarginInitial =containerLeft + (containerWidth/2)-80 ;

      let randomMarginLeft = Math.floor(
        Math.random() * (containerWidth - 200)
      ); // Ajuste o valor "100" de acordo com a largura desejada para as divs




      

      let horizontal = Math.floor(varMarginInitial - randomMarginLeft);
      let taxaHorPorVert = horizontal / containerHeight;

      divInimigo.style.marginLeft = varMarginInitial + "px";

      // Generate a random filter color
      const randomColor = this.generateRandomColor();
      divInimigo.style.filter = `hue-rotate(${randomColor})`;

      this.container.appendChild(divInimigo);

      let currentPos = 0;
      let frameInterval = setInterval(() => {
      

        if (currentPos >= containerHeight) {
          clearInterval(frameInterval);
          this.container.removeChild(divInimigo); // Remove a div quando atinge o limite inferior
        } else {
          currentPos += this.speed;
          divInimigo.style.bottom = containerHeight - currentPos + "px";

          

          if (taxaHorPorVert >= 0) {
            divInimigo.style.marginLeft =
              varMarginInitial - (currentPos) * taxaHorPorVert*0.50 + "px";
          } else {
            divInimigo.style.marginLeft =
              varMarginInitial - (currentPos) * taxaHorPorVert*2 + "px";
          }

          divInimigo.style.width = 14+currentPos / 3 + "px";
          divInimigo.style.height =8+ currentPos / 4 + "px";
          divInimigo.style.opacity = 5*currentPos / containerHeight;

        
          const divBottom =402-parseInt(divInimigo.style.bottom);
          const constIndice = Math.floor(parseInt(divBottom/6));

          const divLayer = divLayers[constIndice];  


        const divLayerMarginLeft = divLayer.offsetLeft;
        
          var MarginLeft = divLayerMarginLeft;
        
        divInimigo.style.marginLeft = parseInt(divInimigo.style.marginLeft) + MarginLeft - 220+"px";
        }
      }, this.speed);
    }
  }

  generateRandomColor() {
    const hue = Math.floor(Math.random() * 360); // Random hue value between 0 and 360
    return `${hue}deg`;
  }

  
  novoElemento(tagName, className) {
    const elemento = document.createElement(tagName);
    elemento.className = className;
    return elemento;
  }

  criarDivs() {
      for (let i = 0; i < 100; i++) {
        const div = this.novoElemento('div', 'div-layer');
        const primeiraDiv = this.container2.firstChild;
        if (primeiraDiv) {
          this.container2.insertBefore(div, primeiraDiv);
         // this.inimigos.style.marginLeft='1px';
        } else {
          this.container2.appendChild(div);
        }
      }
    }
    

  empilhamento() {
    const divLayers = document.querySelectorAll('#container .div-layer');
    
    for (let i = 0; i < divLayers.length; i++) {
      const widthPercentage =(i * 1);

      divLayers[i].style.width = widthPercentage + '%';   
      
      if (i >= 0 && i < 30) {
          divLayers[i].remove();
        }
    }
  }

  moveDivsToRight(tempoDeTransicao) {
    const divLayers = document.querySelectorAll('#container .div-layer'); 
    const montanha = document.querySelector('.montanha');
    let currentMargin2 = parseInt(window.getComputedStyle(montanha).marginRight || 0);
   
    for (var i = 0; i < 70; i++) {
      var div = divLayers[i];
      var currentMargin = parseInt(window.getComputedStyle(div).marginLeft || 0);
      var newMargin = currentMargin + Math.exp((50 - i/2) / 8);      
      div.style.marginLeft = newMargin + 'px';
     
      
      div.style.transition = `margin-left ${tempoDeTransicao}s ease`;
    }
    
    montanha.style.marginRight = currentMargin2+200 + 'px';
    montanha.style.transition = `margin-right ${tempoDeTransicao*3}s ease`;
    
  }
  
  
  moveDivsToLeft(tempoDeTransicao) {
    const divLayers = document.querySelectorAll('#container .div-layer'); 
    const inimigos = document.querySelectorAll('#container #movingDiv');
    const montanha = document.querySelector('.montanha');
    let currentMargin2 = parseInt(window.getComputedStyle(montanha).marginRight || 0);
    
    for (var i = 0; i < 70; i++) {
      var div = divLayers[i];
      var currentMargin = parseInt(window.getComputedStyle(div).marginRight || 0);
      var newMargin = currentMargin + Math.exp((50 - i / 2) / 8);      
      div.style.marginRight = newMargin + 'px';
      
      div.style.transition = `margin-right ${tempoDeTransicao}s ease`;
    }
    
    montanha.style.marginLeft = currentMargin2+200 + 'px';
    montanha.style.transition = `margin-left ${tempoDeTransicao*3}s ease`;
  }
}

const movingDivInstance = new MovingDiv("container");
movingDivInstance.start();




////////////////////////////////////////////////////////////////
const jogo = new Jogo();
jogo.inicia();








