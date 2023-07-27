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

class Timer{
    constructor(){
        this.docTimer = document.querySelector('.timer');}
    inicia(contador = 0){
        this.docTimer.innerText = `${contador.toFixed(3)} s`;
        
        setTimeout(() => {
            const fracSegundo = 0.001;

            this.inicia(contador + fracSegundo);
        }, 1);      
    }    
    getValor() {
      return (this.contador);
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

/*FATIAMENTO DA IMAGEM E READEQUAÇÃO NAS 70 DIVS QUE REPRESENTAM A PISTA*/

class IfPista{
  
  usarIf(velocidadeFinal){
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
  }
}

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

/*///////CLASSE COM OS MÉTODOS PARA AUDIO E ATUALIZAÇÃO DO AUDIO DO CARRO PRINCIPAL/////////////////////*/

class PlaygroundAudio {
    constructor() {
      this.context = new AudioContext();
      this.volume = this.context.createGain();   
      this.volume.connect(this.context.destination);
      this.oscillator = null;
      this.audio = new Audio('/music/musicCar.mp3');
      this.audio.volume =0.2;
      this.audio.loop = true;
      this.volumeFixo = 0.05; // Valor fixo para o volume (por exemplo, 0.5)
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
      const frequenciaMaxima = 200;
      const proporcao = (velocidadeFinal - 0) / (200 - 0);
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

const playgroundAudio = new PlaygroundAudio();

class Carro {
  constructor(largura) {
    this.elemento = novoElemento('span', 'player');
    this.largura = largura;
    this.velocidade = 0;
    this.teclasPressionadas = {};

    document.addEventListener('keydown', (event) => {
      this.teclasPressionadas[event.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', (event) => {
      this.teclasPressionadas[event.key.toLowerCase()] = false;
    });

    // Inicia o loop de atualização contínua para a movimentação horizontal e vertical
    this.atualizarMovimento();
  }

  getCarro() {
    return this.elemento;
  }

  getX() {
    const x = parseInt(this.elemento.style.left.split('px')[0]) || 375;
    return x;
  }
  setX(x) {
    this.elemento.style.left = `${x}px`;
  }
  movimentaHorizontal(x) {
    const coordX = this.getX();
    const soma = x + coordX;

    if (soma < ptoFinalPlayground && soma > 0) {
        this.elemento.style['filter'] = 'none';     
      this.setX(soma);
    } else if(soma <= ptoInicialPlayround || soma >= ptoFinalPlayground)
    {
      // Aplica dano caso saia dos limites da estrada
      this.elemento.style['filter'] = 'grayscale(10%) sepia(200%) brightness(50%)';
    }
  }

  // Função para atualizar o movimento horizontal e vertical do carro de forma contínua
  atualizarMovimento() {
    if (this.teclasPressionadas['d']) {
      this.movimentaHorizontal(10); // Ajuste a velocidade horizontal como desejar
    } else if (this.teclasPressionadas['a']) {
      this.movimentaHorizontal(-10); // Ajuste a velocidade horizontal como desejar
    }
    requestAnimationFrame(this.atualizarMovimento.bind(this));
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
        this.timer.inicia();
         const periodoDia = new PeriodoDia();
        periodoDia.startAnimation();
        this.insereNoPlayground(...elementos);
        const manager = new ImageDivManager('#container', '.div-layer', 6, 517, '/cenarios/pista/pistaParada.png');
        manager.distributeImage(); 
       const animationController = new AnimationController();
       const playgroundAudio = new PlaygroundAudio();
      playgroundAudio.playMusic();
        
    }
}

class AnimationController {
  constructor() {
    this.anim = 0;
    this.step = 0; // Valor inicial do incremento
    this.movingDiv = new MovingDiv(); // Assuming MovingDiv is a class that handles animations of the divs.
    this.animationActivated_1 = false;
    this.animationActivated_2 = false;
    this.animationActivated_3 = false;
    this.animationActivated_4 = false;
    this.animationActivated_5 = false;
    this.animationActivated_6 = false;
    this.animationActivated_7 = false;
    this.animationActivated_8 = false;
    this.animationActivated_9 = false;
   document.addEventListener('keydown', this.handleKeyPress.bind(this));
   document.addEventListener('keyup', this.handleKeyRelease.bind(this));
    window.addEventListener('blur', this.stopIncrement.bind(this));
  }
  handleKeyPress(event) {
    if (event.key === 'w') {
      this.changeAnimation(this.step);
      this.step += 1; // aumenta o incremento
      if (this.step > 10) {
        this.step = 10; // Define um valor máximo para o incremento
      }
      this.stopIncrement();
     
    } else if (event.key === 's') {
      this.changeAnimation(this.step);
      this.step -= 1; // Diminui o incremento
      if (this.step < 0) {
        this.step = 0; // Define um valor mínimo para o incremento
      }
      this.stopIncrement();
    
    }
  }
    handleKeyRelease(event) {
      this.stopIncrement();
      this.startIncrement(); 
    }
  
    startIncrement() {
      // Iniciar o setInterval para incrementar this.step continuamente
      this.incrementInterval = setInterval(() => {
        this.changeAnimation(this.step);
        this.step -= 1;      
      }, 1000); 
    }
    stopIncrement() {
      // Parar o setInterval para interromper o incremento contínuo
      clearInterval(this.incrementInterval);
    }
  
  changeAnimation(amount) {
    this.anim += amount;

    if (this.anim > 1000 && this.anim < 1500 && !this.animationActivated_1) {
      this.movingDiv.moveDivsToLeft(1);//esquerda
      this.animationActivated_1 = true;
    } else if (this.anim > 2500 && this.anim < 3000 && !this.animationActivated_2) {
      this.movingDiv.moveDivsToRight(1);//fica reto
      this.animationActivated_2 = true;
    } else if (this.anim > 7500 && this.anim < 8000 && !this.animationActivated_3) {
      this.movingDiv.moveDivsToRight(1);//direita
      this.animationActivated_3 = true;
    } else if (this.anim > 9000 && this.anim < 10500 && !this.animationActivated_4) {
      this.movingDiv.moveDivsToLeft(1);//fica reto
      this.animationActivated_4 = true;
    } else if (this.anim > 13500 && this.anim < 14000 && !this.animationActivated_5) {
      this.movingDiv.moveDivsToLeft(1);//esquerda
      this.animationActivated_5 = true;
    } else if (this.anim > 15500 && this.anim < 15600 && !this.animationActivated_6) {
      this.movingDiv.moveDivsToRight(1);//fica reto
      this.animationActivated_6 = true;
    } else if (this.anim > 21500 && this.anim < 22000 && !this.animationActivated_7) {
      this.movingDiv.moveDivsToLeft(1);//esquerda
      this.animationActivated_7 = true;
    } else if (this.anim > 25000 && this.anim < 25500 && !this.animationActivated_8) {
      this.movingDiv.moveDivsToRight(1);//fica reto
      this.animationActivated_8 = true;
    } else if (this.anim > 29500) {
      this.anim = 0;//recomeça
      this.animationActivated_1 = false;
    this.animationActivated_2 = false;
    this.animationActivated_3 = false;
    this.animationActivated_4 = false;
    this.animationActivated_5 = false;
    this.animationActivated_6 = false;
    this.animationActivated_7 = false;
    this.animationActivated_8 = false;
    this.animationActivated_9 = false;
    }
  }
}


/////////////////////////////////////////////////////////
class MovingDiv {
  constructor(containerId) {
    this.speed = 0; // Initial speed
    this.maxSpeed = 2; // Maximum speed
    this.minSpeed = -2; // Minimum speed
    this.interval = null;
    this.isPageVisible = true;
    this.container = document.getElementById(containerId);
    this.container2 = document.querySelector('#container');
    this.interval = null;
    this.selectedDifficulty = 1000;
    this.docInitial=0;
    this.maxDoc =200;
    this.minDoc =0;
    this.reductionInterval = null;
    this.docVel = document.querySelector('.velocidade-span');
    this.ifpista= new IfPista();
    
    this.difficultySelect = document.getElementById("difficulty-select");
    this.difficultySelect.addEventListener("change", () => {
      this.selectedDifficulty = parseInt(this.difficultySelect.value);
      this.updateInterval();
    });
    this.keysPressed = {}; // Track which keys are currently pressed
    this.start();
    document.addEventListener('keydown', this.handleKeyPress2.bind(this));
   document.addEventListener('keyup', this.handleKeyRelease2.bind(this));
    window.addEventListener('blur', this.stopIncrement2.bind(this));
    playgroundAudio.play(); 
  }
  handleKeyPress2(event) {
    playgroundAudio.atualizaFrequenciaOscilador( this.docInitial);
    this.ifpista.usarIf(this.docInitial);

    if (event.key === 'w') {
      
      this.speed += 0.02;
      this.docInitial+= 1;
      this.docVel.innerHTML= this.docInitial;
      

      if (this.speed > this.maxSpeed) {
        this.speed = this.maxSpeed; 
        
      }

      if( this.docInitial>this.maxDoc){
        this.docInitial = 200
      this.docVel.innerHTML =this.docInitial;}
      
      this.stopIncrement();
     
    } else if (event.key === 's') {
    
     this.speed -= 0.02; 
     this.docInitial-= 1;
     this.docVel.innerHTML= this.docInitial;

     if (this.speed < this.minSpeed) {
       this.speed = this.minSpeed; 

     }

     if(this.docInitial <this.minDoc){
      this.docInitial=0;
      this.docVel.innerHTML= this.docInitial;
    }     
      this.stopIncrement();
      this.stopIncrement2();  
    }
  }
    handleKeyRelease2(event) {
      playgroundAudio.atualizaFrequenciaOscilador( this.docInitial);
      this.ifpista.usarIf(this.docInitial);
      this.stopIncrement2();
      this.startIncrement2(); 
    }
    startIncrement2() {
   
      this.incrementInterval2 = setInterval(() => {
        playgroundAudio.atualizaFrequenciaOscilador( this.docInitial);
        
        this.ifpista.usarIf(this.docInitial);
    
     this.speed -= 0.02;
     this.docInitial-= 1;
     this.docVel.innerHTML= this.docInitial;

     if (this.speed < this.minSpeed) {
      this.speed = this.minSpeed; 
    }

    if(this.docInitial <this.minDoc){
      this.docInitial=0;
      this.docVel.innerHTML= this.docInitial;
    }


      }, 100); 
    }
  
    stopIncrement2() {
      
      clearInterval(this.incrementInterval2);
    }


  updateInterval() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.moveDiv();
      

    }, this.selectedDifficulty);
  }

  start() {
    this.updateInterval();
  }

  stop() {
    clearInterval(this.interval);
    
  }



  moveDiv() {
    const divLayers = document.querySelectorAll('#container .div-layer');
    

    

    if (this.speed > 0.5 && this.isPageVisible) { 
      
      let divInimigo = novoElemento('div', 'movingDiv');

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
        
        if (currentPos >= (containerHeight+5)) {
          
          this.container.removeChild(divInimigo); // Remove a div quando atinge o limite inferior
          clearInterval(frameInterval);
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


          if (currentPos >= (containerHeight-5)) {
             divInimigo.classList.add('diminuirAlturaAnimation');
          }
          const limSup= parseInt(divInimigo.style.bottom);

          if(limSup>420){
            this.container.removeChild(divInimigo);    
          }        
          const divBottom =402-parseInt(divInimigo.style.bottom);
          const constIndice = Math.floor(parseInt(divBottom/6));

          const divLayer = divLayers[constIndice];  
          const divLayerMarginLeft = divLayer.offsetLeft;
          var MarginLeft = divLayerMarginLeft;
        
        divInimigo.style.marginLeft = parseInt(divInimigo.style.marginLeft) + MarginLeft - 220+"px";    
        const divInimigo2= document.querySelectorAll('#container .movingDiv'); 

        for (let i = 0; i < divInimigo2.length; i++) {
          let bottomDivInimigo = parseInt(divInimigo2[i].style.bottom);
       if (bottomDivInimigo < 100) {
        const player= document.querySelector('.player');
        let margemEsquerdaDoPlayer = parseInt(player.style.left.split('px')[0]) || 375;
        let larguraDoPlayer = parseInt( player.offsetWidth);

        let margemEsquerdaDoInimigo = parseInt(divInimigo2[i].style.marginLeft);
        let larguraDoInimigo = parseInt(divInimigo2[i].offsetWidth);
        let diferencaMargem = Math.abs(margemEsquerdaDoPlayer - margemEsquerdaDoInimigo);
        let maiorLargura = Math.max(larguraDoPlayer, larguraDoInimigo);

         if(diferencaMargem < (maiorLargura)){
          this.speed = -0.5;
          this.docInitial = 45;
          playgroundAudio.atualizaFrequenciaOscilador( this.docInitial);
          
        }
      }
    }
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

class PeriodoDia {
  constructor() {
    this.espacoJogador = document.querySelector('.espaco-jogador');
    this.montanha = document.querySelector('.montanha');
    this.horizonte = document.querySelector('.horizonte');
    this.container = document.querySelector('#container');

    this.filters = [
      {
        backgroundColor: 'green', // Dia
        montanhaBackgroundImage: 'url(/cenarios/montanhas/montanha1.png)',
        horizonteBackgroundImage: 'url(cenarios/tempo_dia/nuvens.gif)',
        containerFilter: 'brightness(120%) contrast(100%) saturate(120%)'
      },
      {
        backgroundColor: 'black', // Noite
        montanhaBackgroundImage: 'url(/cenarios/montanhas/montanha1.png)',
        horizonteBackgroundImage: 'url(cenarios/tempo_dia/noite.gif)',
        containerFilter: 'brightness(15%) contrast(100%) saturate(1000%)'
      },
      {
        backgroundColor: 'white', // Neve
        montanhaBackgroundImage: 'url(/cenarios/montanhas/montanha2.png)',
        horizonteBackgroundImage: 'url(cenarios/tempo_dia/neve.gif)',
        containerFilter: 'brightness(120%) contrast(100%) saturate(10%)'
      },
      {
        backgroundColor: 'DarkSlateGray', // Cerrado
        montanhaBackgroundImage: 'url(/cenarios/montanhas/montanha1.png)',
        horizonteBackgroundImage: 'url(cenarios/tempo_dia/cerrado.gif)',
        containerFilter: 'brightness(40%) contrast(80%) saturate(90%) blur(2px)'
      }
    ];
    this.currentIndex = 0;
  }
  startAnimation() {
    this.changeColors();
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.filters.length;
      this.changeColors();
    }, 30000);
  }

  changeColors() {
    if (this.currentIndex === 3) {
      this.montanha.style.filter = 'brightness(20%)';
      const fumacaDiv = document.createElement('div');
      fumacaDiv.classList.add('fumaca');
      this.espacoJogador.appendChild(fumacaDiv);
    } else {
      const fumacaDiv = document.querySelector('.fumaca');
      if (fumacaDiv) {
        this.espacoJogador.removeChild(fumacaDiv);
      }
    }
    const currentFilter = this.filters[this.currentIndex];
    
    this.espacoJogador.style.backgroundColor = currentFilter.backgroundColor;
    this.montanha.style.backgroundImage = currentFilter.montanhaBackgroundImage;
    this.montanha.style.filter = currentFilter.containerFilter;
    this.horizonte.style.backgroundImage = currentFilter.horizonteBackgroundImage;
    this.container.style.filter = currentFilter.containerFilter;   
  }
}

// script.js
document.addEventListener("DOMContentLoaded", function () {
  // Obtém elementos do DOM
  const startScreen = document.querySelector(".start-screen");
  const startButton = document.querySelector(".start-button");
  const difficultyButtons = document.querySelectorAll(".difficulty-button");

  // Adiciona um ouvinte de evento para o botão de início
  startButton.addEventListener("click", function () {
      startScreen.style.display = "none"; // Esconde a tela de start
      const jogo = new Jogo();
jogo.inicia();
const movingDivInstance = new MovingDiv("container");
movingDivInstance.start();

  });
  
});











