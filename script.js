const playground = document.querySelector('.playground');
const espacoJogador = document.querySelector('.espaco-jogador');
const main = document.querySelector('main');
const alturaEspacoJogador = espacoJogador.clientHeight; 
const larguraTela = main.clientWidth;
const larguraPlayground = playground.clientWidth;
const larguraMargem = (larguraTela - larguraPlayground) / 2
const larguraPlayer = 100;
const ptoInicialPlayround = 0 + larguraPlayer;
const ptoFinalPlayground = larguraTela - larguraMargem * 2 - larguraPlayer;
let selecaoDificuldade=2000; //valor padrao faacil

var hours;



class Dificuldade {
  constructor() {
    this.dificuldade = document.getElementById("selecao-dificuldade");
   // this.selecao = 1100;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.dificuldade.addEventListener("change", () => {
      this.selecao = parseInt(this.dificuldade.value);
    });
  }

  escolhaDificuldade(callback) {
    // Chamamos o callback com o valor selecionado após o evento de mudança
    this.dificuldade.addEventListener("change", () => {
      this.selecao = parseInt(this.dificuldade.value);
      callback(this.selecao);
    });
  }
}

const dificuldade = new Dificuldade();
dificuldade.escolhaDificuldade((selecaoValue) => {
  selecaoDificuldade = selecaoValue;
});

const tempo = document.querySelector('.timer');
const posto = document.querySelector('.gasolina');
const distancia = document.querySelector('.metros');
const lugar = document.querySelector('.rank');
const hour = document.querySelector('.hora-input');

// Função para atualizar as informações
function atualizarInformacoes() {
  // Obter os valores dos inputs
  const metrosInseridos = parseInt(document.querySelector('.metros-input').value);
  const postoInserido = parseInt(document.querySelector('.gasolina-input').value);
  const lugarInserido = parseInt(document.querySelector('.rank-input').value);
  const horaInserido = parseInt(document.querySelector('.hora-input').value);
  

  // Verificar se os valores inseridos são números válidos (números ou NaN)
  const metrosValidos = !isNaN(metrosInseridos);
  const postoValido = !isNaN(postoInserido);
  const lugarValido = !isNaN(lugarInserido);
  const horaValido = !isNaN(horaInserido);

  // Atualizar as informações na página
  if (metrosValidos) {
      distancia.innerHTML = metrosInseridos;
  } else {
      distancia.innerHTML = 10000;
  }

  if (postoValido) {
      posto.innerHTML = postoInserido; 
  } else {
      posto.innerHTML = 30; // Valor padrão se não for inserido um número válido
  }

  if (lugarValido) {
      lugar.innerHTML = lugarInserido;
  } else {
      lugar.innerHTML = 30; // Valor padrão se não for inserido um número válido
  }
  if (horaValido) {
       hours = horaInserido;
} else {
       hours = 5; // Valor padrão se não for inserido um número válido
}





}

const lugarWin = document.querySelector('.posicaoWin');
const distanciaWin = document.querySelector('.percorreuWin');


const lugarLoss = document.querySelector('.posicaoLoss');
const distanciaLoss = document.querySelector('.percorreuLoss');




function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName);
    elemento.className = className;
    
    return elemento;
}

class Timer {
  constructor() {
    this.timer = document.querySelector('.timer');
    this.segundos = 0;
    this.minutos = 0;
    this.horas = 0;
    this.cronometroRodando = false;
    this.cronometroInterval = null;
  }

  iniciarTemporizador(minutos) {
    if (!this.cronometroRodando) {
      const segundosTotais = minutos * 60;
      this.segundos = segundosTotais % 60;
      this.minutos = Math.floor(segundosTotais / 60);
      this.horas = 0;

      this.timer.innerText = this.formatarTempo(this.horas, this.minutos, this.segundos);
      this.cronometroInterval = setInterval(() => this.atualizarTemporizador(), 1000);
      this.cronometroRodando = true;
    }
  }

  atualizarTemporizador() {
    if (this.segundos === 0 && this.minutos === 0 && this.horas === 0) {
      this.parar();
      
    }

    if (this.segundos === 10 && this.minutos === 0 && this.horas === 0) {
      this.timer.classList.add('red-blink');
    }

    if (this.segundos === 0) {
      if (this.minutos > 0) {
        this.minutos--;
        this.segundos = 59;
      }
      if (this.minutos === 0 && this.horas > 0) {
        this.horas--;
        this.minutos = 59;
      }
    } else {
      this.segundos--;
    }

    this.timer.innerHTML = this.formatarTempo(this.horas, this.minutos, this.segundos);
  }
  parar() {
    clearInterval(this.cronometroInterval);
    this.cronometroRodando = false;
  }

  formatarTempo(horas, minutos, segundos) {
    return `${this.adicionarZeroEsquerda(horas)}:${this.adicionarZeroEsquerda(minutos)}:${this.adicionarZeroEsquerda(segundos)}`;
  }

  adicionarZeroEsquerda(numero) {
    return numero < 10 ? `0${numero}` : numero;
  }
}
let timer = new Timer();

class TimerPassa {
  constructor() {
    this.timerPassaLoss = document.querySelector('.timerPassaLoss');
    this.timerPassaWin = document.querySelector('.timerPassaWin');

    this.segundos = 0;
    this.minutos = 0;
    this.horas = 0;
    this.cronometroRodando = false;
    this.cronometroInterval = null;
  }

  inicia() {
    if (!this.cronometroRodando) {
      this.cronometroInterval = setInterval(() => this.atualizarCronometro(), 1000);
      this.cronometroRodando = true;
    }
  }

  atualizarCronometro() {
    this.segundos++;
    if (this.segundos === 60) {
      this.segundos = 0;
      this.minutos++;
      if (this.minutos === 60) {
        this.minutos = 0;
        this.horas++;
      }
    }  
    this.timerPassaLoss.innerText = this.formatarTempo(this.horas, this.minutos, this.segundos);
    this.timerPassaWin.innerText = this.formatarTempo(this.horas, this.minutos, this.segundos);
  }

  formatarTempo(horas, minutos, segundos) {
    return `${this.adicionarZeroEsquerda(horas)}:${this.adicionarZeroEsquerda(minutos)}:${this.adicionarZeroEsquerda(segundos)}`;
  }

  adicionarZeroEsquerda(numero) {
    return numero < 10 ? `0${numero}` : numero;
  }

  parar() {
    clearInterval(this.cronometroInterval);
    this.cronometroRodando = false;
  }
  
  reiniciar() {
    this.parar();
    this.segundos = 0;
    this.minutos = 0;
    this.horas = 0;
    this.timerPassa.innerText = this.formatarTempo(this.horas, this.minutos, this.segundos);
  }
}
let timerPassa = new TimerPassa();


class Pista {
    constructor(){
        this.elemento = novoElemento('div', 'pista');
       
        const pistAnima = new MovingDiv();
        pistAnima.criarDivs();
        pistAnima.empilhamento();
        
    }

    getPista(){
        return this.elemento;
    }
}

/*//////MUDANÇA NO MOVIMENTO DA ESTRADA BASEADO NA VELOCIDADE RECEBIDA, USANDO GIFS/////*/
class IfPista{
  constructor(){
  this.distancia = document.querySelector('.metros');
  this.metros = parseInt(distancia.innerHTML);
  
  }
  
  usarIf(velocidadeFinal){
    const velocidadeRanges = [
      { start: 0, end: 0, velocidadePista: 'pistaParada', index: 1, subtracao: 0, tipoArquivo: 'png' },
      { start: 1, end: 60, velocidadePista: 'pistaLenta', index: 2, subtracao: 1, tipoArquivo: 'gif' },
      { start: 61, end: 130, velocidadePista: 'pistaMedia', index: 3, subtracao: 2, tipoArquivo: 'gif' },
      { start: 130, end: 200, velocidadePista: 'pistaRapida', index: 4, subtracao: 3, tipoArquivo: 'gif' },
    ];

    let selectedRange = velocidadeRanges.find(
      (range) => velocidadeFinal >= range.start && velocidadeFinal <= range.end);

    if (selectedRange) {
      this.metros -= selectedRange.subtracao;
      this.distancia.innerHTML = (this.metros);

      if(this.metros <0){
        this.metros = 0;
        this.distancia.innerHTML = (this.metros);

      }

      const imageUrl = `/cenarios/pista/${selectedRange.velocidadePista}.${selectedRange.tipoArquivo}`;
      const manager = new ImageDivManager('#container', '.div-layer', 4, 517, imageUrl);
      manager.distributeImage();
    }
  }
}

/*///////FATIAMENTO DA IMAGEM EM CADA DIV QUE FORMA A ESTRADA/////////////////////*/
class ImageDivManager {
  constructor(containerW, divizinha, alturadiv, alturaImagem, imagemCaminho) {
    this.container = document.querySelector(containerW);
    this.divs = this.container.querySelectorAll(divizinha);
    this.alturadiv = alturadiv;
    this.alturaImagem = alturaImagem;
    this.imagemCaminho = imagemCaminho;
  }
  distributeImage() {
    this.container.style.position = 'relative';
    this.divs.forEach((div, index) => {
      const offsetY = -index * this.alturadiv*5;
      div.style.backgroundImage = `url(${this.imagemCaminho})`;
      div.style.backgroundSize = '100%';
      div.style.backgroundPosition = `center ${offsetY}px`;
      div.style.overflow = 'hidden';
      
      div.style.top = '0';
      div.style.left = '0';
      div.style.height = `${this.alturadiv}px`;
     
    });
  }
}

/*///////CLASSE COM OS MÉTODOS PARA AUDIO E EFEITOS SONOROSL/////////////////////*/

class PlaygroundAudio {
    constructor() {
      this.context = new AudioContext();
      this.volume = this.context.createGain();   
      this.volume.connect(this.context.destination);
      this.oscillator = null;
      this.audio = new Audio('/music/MusicCarJimmyFontanez.mp3');
      this.audio.volume =0.1;
      this.audio.loop = true;
      this.volumeFixo = 0.03; // Valor fixo para o volume (por exemplo, 0.5)
      this.volume.gain.value = this.volumeFixo;
      this.timer = document.querySelector('.timer');
      this.varTimer3 = (this.timer.innerHTML);

      this.audioWin = new Audio('/music/win.mp3');
      this.audioLoss = new Audio('/music/loss.mp3');
      this.audioGas = new Audio('/music/gasolina.mp3');
      this.audioStar = new Audio('/music/estrelas.mp3');
      this.audioPower = new Audio('music/power.mp3');
      this.audioWin.volume =0.1;
      this.audioLoss.volume =0.1;
      this.audioGas.volume =0.1;
      this.audioStar.volume =0.1;  
      this.audioPower.volume =0.2;    
     
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
    stop() {
      if (this.oscillator) {
        this.oscillator.stop(this.context.currentTime);
        this.oscillator.disconnect(this.volume);
        this.oscillator = null;
      }
    }
  
    atualizaFrequenciaOscilador(velocidadeFinal) {

      const frequenciaMinima = 20;
      const frequenciaMaxima = 200;
      const proporcao = (velocidadeFinal - 0) / (200 - 0);
      const frequencia = frequenciaMinima + (proporcao * (frequenciaMaxima - frequenciaMinima));
      this.oscillator.frequency.value = frequencia; 
    }
    playMusic() { this.audio.play();}
    playWin() { this.audioWin.play();}
    playLoss() { this.audioLoss.play();}
    playGas() { this.audioGas.play();}
    playStar() { this.audioStar.play();}
    playPower() { this.audioPower.play();}
    stopMusic() { this.audio.pause();
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
      this.elemento.style['filter'] = 'grayscale(10%) sepia(200%) brightness(50%)';
    }
  }
  // Função para atualizar o movimento horizontal e velocidade do carro de forma contínua
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
        const periodoDia = new PeriodoDia();
        periodoDia.startAnimation();
        this.insereNoPlayground(...elementos);
        const manager = new ImageDivManager('#container', '.div-layer', 4, 517, '/cenarios/pista/pistaParada.png');
        manager.distributeImage(); 
        const animationController = new AnimationController();
        playgroundAudio.playMusic();
        timer.iniciarTemporizador(hours);
        timerPassa.inicia();

        const verificar = new MovingDiv();
        verificar.verificaCondicoes();
      
        
    }
}

class AnimationController {
  constructor() {
    this.anim = 0;
    this.step = 0; // Valor inicial do incremento
    this.movingDiv = new MovingDiv(); 
    this.animationActivated = Array(9).fill(false);

    this.gasolina = parseInt(posto.innerHTML);
    this.relogio = (tempo.innerHTML);
    this.metros = parseInt(distancia.innerHTML);
    this.rank = lugar.innerHTML;
   
   
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
      this.relogio = (tempo.innerHTML);
      this.metros = parseInt(distancia.innerHTML);

      this.incrementInterval = setInterval(() => {
        this.gasolina = parseFloat(posto.innerHTML);
        this.relogio = (tempo.innerHTML);
  
        this.changeAnimation(this.step);
        this.step -= 1;
        if (this.step < 0) {
          this.step = 0; // Define um valor mínimo para o incremento
        }  
        if(this.relogio === '00:00:00'|| this.metros === 0 || this.gasolina === 0){
          
          this.stopIncrement();
        }
        
      }, 1000); 
    }
    stopIncrement() {
      // Parar o setInterval para interromper o incremento contínuo
      clearInterval(this.incrementInterval);
    }
  
  changeAnimation(amount) {
    
    
    this.gasolina = parseFloat(posto.innerHTML);
    this.relogio = (tempo.innerHTML);
    this.metros = parseInt(distancia.innerHTML);
    this.rank = lugar.innerHTML;
    if (this.relogio === '00:00:00' || this.metros === 0 || this.gasolina === 0) {
      amount = 0;
    }

    this.anim += amount;

    const animationRanges = [
      { start: 3000, end: 3500, moveDirection: 'left', index: 1 },
      { start: 4000, end: 4500, moveDirection: 'right', index: 2 },
      { start: 7500, end: 8000, moveDirection: 'right', index: 3 },
      { start: 9000, end: 10500, moveDirection: 'left', index: 4 },
      { start: 13500, end: 14000, moveDirection: 'left', index: 5 },
      { start: 15500, end: 15600, moveDirection: 'right', index: 6 },
      { start: 21500, end: 22000, moveDirection: 'left', index: 7 },
      { start: 25000, end: 25500, moveDirection: 'right', index: 8 },
    ];

    for (const range of animationRanges) {
      if (this.anim > range.start && this.anim < range.end && !this.animationActivated[range.index]) {
        if (range.moveDirection === 'left') {
          this.movingDiv.moveDivsToLeft(1);//esquerda
        } else if (range.moveDirection === 'right') {
          this.movingDiv.moveDivsToRight(1);
        }
        this.animationActivated[range.index] = true;
        break;
      }
    }
    if (this.anim > 29500) {
      this.anim = 0;
      this.animationActivated = Array(9).fill(false);
    }
  }
}

/////////////////////////////////////////////////////////
class MovingDiv {
  constructor(containerId) {
    this.speed = -0.5; // Initial speed
    this.maxSpeed = 1.0; // Maximum speed
    this.minSpeed = -1.0; // Minimum speed
    this.interval = null;
    this.isPageVisible = true;
    this.container = document.getElementById(containerId);
    this.container2 = document.querySelector('#container');
    this.interval = null;
    this.quilometragem=0;
    this.maxQuilometragem =200;
    this.minQuilometragem =0;
    this.ponteiroV=-45;
    this.maxVel =45;
    this.minVel =-45;
    this.reductionInterval = null;
    this.medidorVel = document.querySelector('.velocidade-span');

    this.power = document.querySelector('.pontos');
    this.pontao = 0;

    this.gas = parseFloat(posto.innerHTML);
    this.gasolina = (posto.innerHTML);
    this.relogio = (tempo.innerHTML);
    this.metros = parseInt(distancia.innerHTML);
    this.total = parseInt(distancia.innerHTML);
    this.rank = lugar.innerHTML;

    this.loss = document.querySelector('.loss');
    this.win = document.querySelector('.win');

    this.ifpista= new IfPista();
    this.elementoNeedle = document.querySelector('.needle');

    this.mensagemWin = document.querySelector('.winRazao');
    this.mensagemLoss = document.querySelector('.lossRazao');
    this.keysPressed = {}; 
   // this.start();
   //this.verificaCondicoes();
   
    document.addEventListener('keydown', this.apertaTecla.bind(this));
    document.addEventListener('keyup', this.liberaTecla.bind(this));
    window.addEventListener('blur', this.stopIncrement2.bind(this));
    playgroundAudio.play(); 
  }
  apertaTecla(event) {
    playgroundAudio.atualizaFrequenciaOscilador( this.quilometragem);
     this.ifpista.usarIf(this.quilometragem);

    if (event.key === 'w') {
      
      this.speed += 0.005;
      this.quilometragem+= 0.5;
      this.ponteiroV+=0.225;
      this.medidorVel.innerHTML= Math.ceil(this.quilometragem);
     
      this.elementoNeedle.style.transform = `translate(-50%, -50%) rotate(${this.ponteiroV}deg)`;
      this.gas -= 0.005;
      posto.innerHTML = Math.ceil(this.gas);
      
      
      

      if (this.speed > this.maxSpeed) {
        this.speed = this.maxSpeed; 
      }

     
      if (this.gas <= 0) {
        this.gas = 0; 
        posto.innerHTML= (this.gas);
        
      }

      if( this.quilometragem>this.maxQuilometragem){
        this.quilometragem = this.maxQuilometragem;
      this.medidorVel.innerHTML =this.quilometragem;}
      
      if(this.ponteiroV>this.maxVel){
        this.ponteiroV=this.maxVel;
      }

      this.stopIncrement2();
     
    } else if (event.key === 's') {
    
     this.speed -= 0.005; 
     this.quilometragem-= 0.5;
     this.ponteiroV-= 0.225;
     this.medidorVel.innerHTML= Math.ceil(this.quilometragem);
     this.elementoNeedle.style.transform = `translate(-50%, -50%) rotate(${this.ponteiroV}deg)`;

     if (this.speed < this.minSpeed) {
       this.speed = this.minSpeed; 

     }

     if(this.quilometragem <this.minQuilometragem){
      this.quilometragem=this.minQuilometragem;
      this.medidorVel.innerHTML= Math.ceil(this.quilometragem);
    }
    
    if(this.ponteiroV<this.minVel){
      this.ponteiroV=this.minVel;
    }
      this.stopIncrement2();  
    }
  }
    liberaTecla(event) {
      playgroundAudio.atualizaFrequenciaOscilador( this.quilometragem);
      
      this.stopIncrement2();
      this.startIncrement2(); 
    }
    startIncrement2() {
    this.relogio = (tempo.innerHTML);
 
     
      this.incrementInterval2 = setInterval(() => {
        this.gasolina = parseInt(posto.innerHTML);
        this.relogio = (tempo.innerHTML);
        this.metros = parseInt(distancia.innerHTML);
        this.rank = lugar.innerHTML;

        playgroundAudio.atualizaFrequenciaOscilador( this.quilometragem);
        this.ifpista.usarIf(this.quilometragem);

        if(this.relogio === '00:00:00'|| this.metros === 0 || this.gasolina === 0){
          this.stopIncrement2();
        }
        
        this.ifpista.usarIf(this.quilometragem);
    
        this.speed -= 0.005;
        this.quilometragem-= 0.5;
        this.ponteiroV-=0.225;
        this.medidorVel.innerHTML= Math.ceil(this.quilometragem);
        this.elementoNeedle.style.transform = `translate(-50%, -50%) rotate(${this.ponteiroV}deg)`;

        if (this.speed < this.minSpeed) {
         this.speed = this.minSpeed; 
        }
        if(this.ponteiroV<this.minVel){
         this.ponteiroV=this.minVel;
        }

        if(this.quilometragem <this.minQuilometragem){
         this.quilometragem=this.minQuilometragem;
         this.medidorVel.innerHTML= Math.ceil(this.quilometragem);
        }


      }, 100); 
    }
  
    stopIncrement2() {
      
      clearInterval(this.incrementInterval2);
    }


  updateInterval() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const movingDivElements = document.querySelectorAll('.movingDiv');
      const numberOfMovingDivs = movingDivElements.length;
      if(numberOfMovingDivs>=0 && numberOfMovingDivs<=4){
      this.moveDiv();
    }
      this.gasolina = parseInt(posto.innerHTML);
      this.relogio = (tempo.innerHTML);
      this.metros = parseInt(distancia.innerHTML);
      this.rank = lugar.innerHTML;
       
      if(this.relogio === '00:00:00'|| this.metros === 0 || this.gasolina === 0){
        this.stop();
      }
      

    }, selecaoDificuldade);
  }

  updateIntervalPonto() {
    clearInterval(this.interval2);
    this.interval2 = setInterval(() => {

      const movingPontosElements = document.querySelectorAll('.pontoDiv');
      const numberOfPontosDivs = movingPontosElements.length;

      if(numberOfPontosDivs >=0 && numberOfPontosDivs<=5){
        this.moveDivPonto();
    }
    }, (selecaoDificuldade+5231));
  }

  updateIntervalPosto() {
    clearInterval(this.interval3);
    this.interval3 = setInterval(() => {
      const movingDivElements = document.querySelectorAll('.postoDiv');
      const numberOfPostosDivs = movingDivElements.length;


      if(numberOfPostosDivs >=0 && numberOfPostosDivs<=5){      
      this.moveDivPosto();
    }      

    }, (selecaoDificuldade+10234));
  }

  start() {
    this.updateInterval();
    this.updateIntervalPonto();
    this.updateIntervalPosto();
  }

  stop() {
    clearInterval(this.interval);
    clearInterval(this.interval2);
    clearInterval(this.interval3);
    
  }

  verificaCondicoes(){

    this.intervalVerifica = setInterval(() => {
    this.gasolina = parseInt(posto.innerHTML);
    this.relogio = (tempo.innerHTML);
    this.metros = parseInt(distancia.innerHTML);
    
    this.rank = lugar.innerHTML;
    lugarWin.innerHTML = this.rank;
    distanciaWin.innerHTML = this.total - this.metros;
     
    lugarLoss.innerHTML = this.rank;
    distanciaLoss.innerHTML = this.total - this.metros;

    if(this.relogio === '00:00:00'|| this.metros === 0 || this.gasolina === 0){ 
    distancia.innerHTML = this.metros;

    if(this.relogio !== '00:00:00' && this.metros === 0 && this.gasolina >= 1 && this.rank == 1){
                   
        playgroundAudio.playWin();
        this.mensagemWin.innerHTML='Parabéns campeão!';
        this.win.style.display='flex';
          
    }else{
        if(this.relogio == '00:00:00' && this.metros > 0 ){
        this.mensagemLoss.innerHTML='Você estorou o tempo limite para terminar a corrida, está eliminado'; 
        }
        if(this.gasolina == 0 && this.metros > 0 ){
        this.mensagemLoss.innerHTML='Você não possui mais combustível para terminar a corrida, está eliminado';
        }
        if(this.relogio !== '00:00:00' && this.metros === 0 && this.gasolina >= 1 && this.rank > 1){
        this.mensagemLoss.innerHTML='Você terminou a corrida, mas não a venceu';
        }
        playgroundAudio.playLoss();
        this.loss.style.display='flex';
                   
        }
                
        timer.parar();
        timerPassa.parar();
        playgroundAudio.stop();
        playgroundAudio.stopMusic();
        this.ifpista.usarIf(0);
        clearInterval(this.intervalVerifica);
                  
    }

  }, 10);

  }

  moveDiv() {
    const fatiasEstrada = document.querySelectorAll('#container .div-layer');

    if (this.speed >= -0.5 && this.isPageVisible) { 
      
      //criando novo elemento para carros

      let novoInimigo = novoElemento('div', 'movingDiv');
      this.container.appendChild(novoInimigo);// o carro torna-se "filho" do elemento container

      let numeroAleatorio = Math.floor(Math.random() * 31) - 10; // Gera um número aleatório entre -20 e 20
      novoInimigo.style.left = numeroAleatorio + 'px';


      //informações do container
      this.containerWidth = this.container.offsetWidth;
      this.containerHeight = this.container.offsetHeight;
      this.containerLeft = this.container.offsetLeft;
      this.varMarginInitial = this.containerLeft + (this.containerWidth/2)- 160 ;

      let randomMarginLeft = Math.floor(Math.random() * (this.containerWidth - 200)); //margem inferior que o elemento irá alacançar

      let horizontal = Math.floor(this.varMarginInitial - randomMarginLeft); //variação nas posições de surgimento dos elementos no entorno do meio do container

      let taxaHorPorVert = horizontal/this.containerHeight;/* conforme o elemento desce pele container, ele varia à uma taxa horizontal relativo a uma  taxa vertical, dependendo da posição aletória que o elemento vai alcançar a margem inferior do container*/

      novoInimigo.style.marginLeft = this.varMarginInitial + "px";

      // Generate a random filter color
      const randomColor = this.generateRandomColor();
      novoInimigo.style.filter = `hue-rotate(${randomColor})`;// variação nas cores dos elementos(carros inimigos)

      let posicaoAtual = 0;   
      this.gasolina = parseInt(posto.innerHTML);
      this.relogio = (tempo.innerHTML);
      this.metros = parseInt(distancia.innerHTML);
      this.rank = lugar.innerHTML;

      let frameInterval = setInterval(() => {

        if(this.relogio === '00:00:00'|| this.metros === 0 || this.gasolina === 0){
          clearInterval(frameInterval);

        }

        

        if (posicaoAtual >= (this.containerHeight)) {    //se o elemento chegar na base do container ele será deletado       
          this.container.removeChild(novoInimigo); 
          
          this.rank -=1;   //caso o player tenha estrelas, ele poderá usá-las para eliminar alguns carros que impedem sua passagem
          lugar.innerHTML= this.rank;

          if(this.rank <1){
            this.rank = 1;
            lugar.innerHTML= this.rank;
          }
          

        } else {
          posicaoAtual += this.speed;  //a posição atual dependerá da variável speed que é influenciada por diversas variaveis, evento de teclas e a falta de tais eventos, simulando o efeito do carro desacelerar caso não haja nenhum comando no carro do player.
          novoInimigo.style.bottom = this.containerHeight - posicaoAtual + "px";

          if (taxaHorPorVert >= 0) {  //controle do carro desde a margem inicial até a margem final, com um certo intervalo de aleatoriedade
            novoInimigo.style.marginLeft =
              this.varMarginInitial - (posicaoAtual) * taxaHorPorVert*0.4 + "px"; //esquerda
          } else {
            novoInimigo.style.marginLeft =
              this.varMarginInitial - (posicaoAtual) * taxaHorPorVert*1.6 + "px"; //direita
          }

          //uso do posicionamento do carro para simular a perspectiva de aumento ou diminuição do tamanho co carro conforme se distancia ou se aproxima do player
          novoInimigo.style.width = 10+posicaoAtual / 4 + "px";
          novoInimigo.style.height =8+ posicaoAtual / 6 + "px";
          novoInimigo.style.opacity = 10*posicaoAtual / this.containerHeight;


          if (posicaoAtual >= (this.containerHeight-5)) { //animacao momentos antes dos elementos sumirem
             novoInimigo.classList.add('diminuirAlturaAnimation');
          }

          //caso o player fique mais lento que os demais elementos, estes elementos irão até o horizonte da pista e serão apagados em
          //virtude de não sobrecarregar o container com divs ultrapassando o limite superior.
          const limSup= parseInt(novoInimigo.style.bottom);
          if(limSup> 315){
            this.container.removeChild(novoInimigo);    
          }  
          
          
          //nessa lógica, conforme o bottom do inimigo abaixa a cada multiplo de 6px do divBottom(altura de cada div da pista), ele toma pra si a margem dessa div e mais uma margem adicional adiquirida anteriormente, respeitando o formato da curva, seja curvada ou reta.
          //da div corres)
          const divBottom = 315-parseInt(novoInimigo.style.bottom);
          const constIndice = Math.floor(parseInt(divBottom/4)); //indices de cada div, Ex: div[3], possui bottom 420 - 402= 18(6*3).

          const fatias = fatiasEstrada[constIndice];  
          const fatiasMarginLeft = fatias.offsetLeft;
          var MarginLeft = fatiasMarginLeft;
        
        novoInimigo.style.marginLeft = parseInt(novoInimigo.style.marginLeft) + MarginLeft - 200+"px";  //movimento guiado pelas divs da estrada, com ajuste de 200 para que os ellementos venham pela pista

        const inimigosTodos= document.querySelectorAll('.movingDiv');

        const player= document.querySelector('.player');
        
        this.margemEsquerdaDoPlayer = parseInt(player.style.left.split('px')[0]) || 375;   
        this.larguraDoPlayer = parseInt(player.offsetWidth);

        for (let i = 0; i < inimigosTodos.length; i++) {
         let bottomNovoInimigo = parseInt(inimigosTodos[i].style.bottom);
       // const inimigos= document.querySelector('.movingDiv');        
        //identificação de batidas ou obtenção de gasolina e pontos nos outros metodos abaixo.(75 é a altura do carro do player, que é fixo)
        if (bottomNovoInimigo < 60) {
     
        let margemEsquerdaDoInimigo = parseInt(inimigosTodos[i].style.marginLeft);
        let larguraDoInimigo = parseInt(inimigosTodos[i].offsetWidth);
        let diferencaMargem = Math.abs(this.margemEsquerdaDoPlayer - margemEsquerdaDoInimigo);
        let maiorLargura = Math.max(this.larguraDoPlayer, larguraDoInimigo);

         if(diferencaMargem < (maiorLargura)){//aplicação de redução de velocidade
          this.speed -= 0.05;
          this.quilometragem -= 5;
          playgroundAudio.atualizaFrequenciaOscilador(this.quilometragem);
          this.ponteiroV -=2.5;  
          
          
        if(this.pontao>0){ //caso, eu tenha pontos de "poderes", posso eliminar os carros na frente do player com um simples "toque"
          this.container.removeChild(inimigosTodos[i]); 
          this.pontao -= 1;
          this.power.innerHTML= this.pontao;
          playgroundAudio.playPower();
          player.classList.add('powerAnimation'); 

          this.rank -=1;   
          lugar.innerHTML= this.rank;

          if(this.rank <1){
            this.rank = 1;
            lugar.innerHTML= this.rank;
          }
          
          setTimeout(function() {
            player.classList.remove('powerAnimation');
          }, 500);
          

          
        }    
        //limites impostos as variáveis
          if (this.speed < this.minSpeed) {
            this.speed = this.minSpeed; 
          }
          if(this.ponteiroV<this.minVel){
            this.ponteiroV=this.minVel;
          }  
          if(this.quilometragem <this.minQuilometragem){
            this.quilometragem=0;
            this.medidorVel.innerHTML= Math.ceil(this.quilometragem);
          }
          if(this.pontao <0){
            this.pontao=0;
            this.power.innerHTML= this.pontao;
          }

          this.elementoNeedle.style.transform = `translate(-50%, -50%) rotate(${this.ponteiroV}deg)`; //manipulação do medidor    
            }       
          }

        }

        }
      }, this.speed);
    }
  }
  //as mesmas lógicas foram aplicadas a estes outros métodos que manipulam os pontos e combustivel
  moveDivPonto() {
    const fatiasPista = document.querySelectorAll('#container .div-layer');

    if (this.speed >= -0.5 && this.isPageVisible) { 
      
      let divPonto = novoElemento('div', 'pontoDiv');
      let numeroAleatorio2 = Math.floor(Math.random() * 31) - 10; // Gera um número aleatório entre -20 e 20

      divPonto.style.left = numeroAleatorio2 + 'px';

      let randomMarginLeft2 = Math.floor(Math.random() * (this.containerWidth - 200)); // Ajuste o valor "100" de acordo com a largura desejada para as divs  

      let horizontal2 = Math.floor(this.varMarginInitial - randomMarginLeft2);
      let taxaHorPorVert2 = horizontal2 / this.containerHeight;

      divPonto.style.marginLeft = this.varMarginInitial + "px";
      this.container.appendChild(divPonto);

      let posicaoAtual2 = 0;

      let frameInterval2 = setInterval(() => {
        this.gasolina = parseInt(posto.innerHTML);
        this.relogio = (tempo.innerHTML);
        this.metros = parseInt(distancia.innerHTML);
        this.rank = lugar.innerHTML;

        if(this.relogio === '00:00:00'|| this.metros === 0 || this.gasolina === 0){   
          clearInterval(frameInterval2);
        }
        
        if (posicaoAtual2 >= (this.containerHeight)) {
          
          this.container.removeChild(divPonto); 
          clearInterval(frameInterval2);
        } else {
          posicaoAtual2 += this.speed;
          divPonto.style.bottom = this.containerHeight - posicaoAtual2 + "px";

          if (taxaHorPorVert2 >= 0) {
            divPonto.style.marginLeft =
              this.varMarginInitial - (posicaoAtual2) * taxaHorPorVert2*0.40 + "px"; //taxa de curvatura da parte esquerda
          } else {
            divPonto.style.marginLeft =
              this.varMarginInitial - (posicaoAtual2) * taxaHorPorVert2*1.5 + "px"; //taxa de curvatura da parte direita
          }

          divPonto.style.width = 2+posicaoAtual2 / 8 + "px";
          divPonto.style.height =6+ posicaoAtual2 / 6 + "px";
          divPonto.style.opacity = 5*posicaoAtual2 / this.containerHeight;



          if (posicaoAtual2 >= (this.containerHeight-5)) {
            divPonto.classList.add('diminuirAlturaAnimation');
          }
          const limSup2= parseInt(divPonto.style.bottom);

          if(limSup2>315){
            this.container.removeChild(divPonto);    
          }        
          const divBottom2 = 315-parseInt(divPonto.style.bottom);
          const constIndice2 = Math.floor(parseInt(divBottom2/4));

          const fatias2 = fatiasPista[constIndice2];  
          const fatiasMarginLeft2 = fatias2.offsetLeft;
          var MarginLeft2 = fatiasMarginLeft2;
        
        divPonto.style.marginLeft = parseInt(divPonto.style.marginLeft) + MarginLeft2 - 220+"px";   

        const divPonto2= document.querySelector('.pontoDiv');


        let bottomDivPonto2 = parseInt(divPonto2.style.bottom);
       if (bottomDivPonto2 < 60) {

        let margemEsquerdaDoInimigo2 = parseInt(divPonto2.style.marginLeft);
        let larguraDoInimigo2 = parseInt(divPonto2.offsetWidth);
        let diferencaMargem2 = Math.abs(this.margemEsquerdaDoPlayer - margemEsquerdaDoInimigo2);
        let maiorLargura2 = Math.max(this.larguraDoPlayer, larguraDoInimigo2);

         if(diferencaMargem2 < (maiorLargura2)){
          playgroundAudio.playStar(); 
          this.pontao += 1;
          this.power.innerHTML= this.pontao;
          this.container.removeChild(divPonto);
          clearInterval(frameInterval2);      
            }
          }
        }
      }, this.speed);
    }
  }

  moveDivPosto() {
    const fatiasEstrada3 = document.querySelectorAll('#container .div-layer');

    if (this.speed >= -0.5 && this.isPageVisible) { 
      
      let divPosto = novoElemento('div', 'postoDiv');
      let numeroAleatorio3 = Math.floor(Math.random() * 31) - 10; // Gera um número aleatório entre -20 e 20
      divPosto.style.left = numeroAleatorio3 + 'px';

      let randomMarginLeft3 = Math.floor(Math.random() * (this.containerWidth - 200)); // Ajuste o valor "100" de acordo com a largura desejada para as divs  

      let horizontal3 = Math.floor(this.varMarginInitial - randomMarginLeft3);
      let taxaHorPorVert3 = horizontal3 / this.containerHeight;

      divPosto.style.marginLeft = this.varMarginInitial + "px";

      // Generate a random filter color
      const randomColor3 = this.generateRandomColor();
      divPosto.style.filter = `hue-rotate(${randomColor3})`;

      this.container.appendChild(divPosto);
      let posicaoAtual3 = 0;

      let frameInterval3 = setInterval(() => {
        this.gasolina = parseFloat(posto.innerHTML);
        this.relogio = (tempo.innerHTML);
        this.metros = parseInt(distancia.innerHTML);
        this.rank = lugar.innerHTML;
        if(this.relogio === '00:00:00'|| this.metros === 0 || this.gasolina === 0){
          clearInterval(frameInterval3);
        }     
        if (posicaoAtual3 >= (this.containerHeight)) {      
          this.container.removeChild(divPosto); // Remove a div quando atinge o limite inferior
          clearInterval(frameInterval3);
        } else {
          posicaoAtual3 += this.speed;
          divPosto.style.bottom = this.containerHeight - posicaoAtual3 + "px";
          if (taxaHorPorVert3 >= 0) {
            divPosto.style.marginLeft =
              this.varMarginInitial - (posicaoAtual3) * taxaHorPorVert3*0.40 + "px"; //taxa de curvatura da parte esquerda
          } else {
            divPosto.style.marginLeft =
              this.varMarginInitial - (posicaoAtual3) * taxaHorPorVert3*1.5 + "px"; //taxa de curvatura da parte direita
          }
          divPosto.style.width = 2+posicaoAtual3 / 8 + "px";
          divPosto.style.height =6+ posicaoAtual3 / 6 + "px";
          divPosto.style.opacity = 5*posicaoAtual3 / this.containerHeight;
          if (posicaoAtual3 >= (this.containerHeight-5)) {
            divPosto.classList.add('diminuirAlturaAnimation');
          }
          const limSup3= parseInt(divPosto.style.bottom);

          if(limSup3>315){
            this.container.removeChild(divPosto);    
          }        
          const divBottom3 =315-parseInt(divPosto.style.bottom);
          const constIndice3 = Math.floor(parseInt(divBottom3/4));

          const fatias3 = fatiasEstrada3[constIndice3];  
          const fatiasMarginLeft3 = fatias3.offsetLeft;
          var MarginLeft3 = fatiasMarginLeft3;
        
        divPosto.style.marginLeft = parseInt(divPosto.style.marginLeft) + MarginLeft3 - 220+"px";    
 
        const divPosto3= document.querySelector('.postoDiv');
       
       let bottomDivPosto3 = parseInt(divPosto3.style.bottom);
       if (bottomDivPosto3 < 60) {

        let margemEsquerdaDoInimigo3 = parseInt(divPosto3.style.marginLeft);
        let larguraDoInimigo3 = parseInt(divPosto3.offsetWidth);
        let diferencaMargem3 = Math.abs(this.margemEsquerdaDoPlayer - margemEsquerdaDoInimigo3);
        let maiorLargura3 = Math.max(this.larguraDoPlayer, larguraDoInimigo3);

         if(diferencaMargem3 < (maiorLargura3)){
          playgroundAudio.playGas(); 
          this.gas += 1;
          posto.innerHTML= Math.ceil(this.gas);
          this.container.removeChild(divPosto); // Remove a div quando atinge o limite inferior
          clearInterval(frameInterval3);  
            }
          }
        }
      }, this.speed);
    }
  }

  generateRandomColor() {
    const cor = Math.floor(Math.random() * 360); // Random hue value between 0 and 360
    return `${cor}deg`;
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
        } else {
          this.container2.appendChild(div);
        }
      }
    }  

  empilhamento() {
    const fatiasEstrada = document.querySelectorAll('#container .div-layer');  
    for (let i = 0; i < fatiasEstrada.length; i++) {
      const widthPercentage =(i * 1);
      fatiasEstrada[i].style.width = widthPercentage + '%';   
      
      if (i >= 0 && i < 8) {
          fatiasEstrada[i].remove();
        }
    }
  }
  moveDivsToRight(tempoDeTransicao) {
    const fatiasEstrada = document.querySelectorAll('#container .div-layer'); 
    const montanha = document.querySelector('.montanha');
    let currentMargin2 = parseInt(window.getComputedStyle(montanha).marginRight || 0);
   
    for (var i = 0; i < 90; i++) {
      var div = fatiasEstrada[i];
      var currentMargin = parseInt(window.getComputedStyle(div).marginLeft || 0);
      var newMargin = currentMargin + Math.exp((6.055 - 0.04*i));       
      div.style.marginLeft = newMargin + 'px';  
     div.style.transition = `margin-left ${tempoDeTransicao}s ease`;
    }
    montanha.style.marginRight = currentMargin2+200 + 'px';
    montanha.style.transition = `margin-right ${tempoDeTransicao*3}s ease`;
    
  }
  //Math.exp((6.055 - 0.04*i));
  moveDivsToLeft(tempoDeTransicao) {
    const fatiasEstrada = document.querySelectorAll('#container .div-layer'); 
    const montanha = document.querySelector('.montanha');
    let currentMargin2 = parseInt(window.getComputedStyle(montanha).marginRight || 0); 
    for (var i = 0; i < 90; i++) {
      var div = fatiasEstrada[i];
      var currentMargin = parseInt(window.getComputedStyle(div).marginRight || 0);
      var newMargin = currentMargin + Math.exp((6.055 - 0.04*i));     
      div.style.marginRight = newMargin + 'px';
      
      div.style.transition = `margin-right ${tempoDeTransicao}s ease`;
    }
    montanha.style.marginLeft = currentMargin2+200 + 'px';
    montanha.style.transition = `margin-left ${tempoDeTransicao*1}s ease`;
  }
}

class PeriodoDia {
  constructor() {
    this.espacoJogador = document.querySelector('.espaco-jogador');
    this.montanha = document.querySelector('.montanha');
    this.horizonte = document.querySelector('.horizonte');
    this.container = document.querySelector('#container');

    this.gasolina = parseInt(posto.innerHTML);
    this.relogio = (tempo.innerHTML);
    this.metros = parseInt(distancia.innerHTML);
    this.rank = lugar.innerHTML;

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
      let frame = setInterval(() => {
        this.gasolina = parseFloat(posto.innerHTML);
        this.relogio = (tempo.innerHTML);
        this.metros = parseInt(distancia.innerHTML);
        this.rank = lugar.innerHTML;
      
      if(this.relogio === '00:00:00'|| this.metros === 0 || this.gasolina === 0){
        clearInterval(frame);
      }
      this.currentIndex = (this.currentIndex + 1) % this.filters.length;
      this.changeColors();
    }, 45000);
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
  const parametros = document.querySelector('.parametros');

  // Adiciona um ouvinte de evento para o botão de início
  startButton.addEventListener("click", function () {
  startScreen.style.display = "none";
  parametros.style.display = "none";

  const jogo = new Jogo();
  jogo.inicia();
  const movingDivInstance = new MovingDiv("container");
  movingDivInstance.start();    
  });
});
