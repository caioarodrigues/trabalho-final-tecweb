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
class ScoreController {

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
    }
    getVelocidadeAtual(){
        return parseInt(this.docVel.innerHTML);
    }
    acelera(valor){
        const velocidadeAtual = this.getVelocidadeAtual();
        const velocidadeFinal = velocidadeAtual + valor;

        if(velocidadeFinal > 0 && velocidadeFinal <= 120)
            this.docVel.innerHTML = velocidadeFinal;
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
        const obstaculo = document.querySelector(`.${className}`);

        if(posAtual === 0 || posAtual > 0) obstaculo.style.top = `${posAtual + velocidade}px`;
        if (posAtual > 440) obstaculo.style.top = `0px`;
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
}

class FabricaDeObstaculo {
    constructor(limite = 1){
        this.obstaculo = new Obstaculo();
        this.obstaculos = this.obstaculo.getObstaculo(limite);
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
        this.fabricaDeObstaculo = new FabricaDeObstaculo();
        this.obstaculoController = new ObstaculoController();
        this.distanciaController = new DistanciaController();
        this.ponto = new Ponto();

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
    insereObstaculo(obstaculo){
        const divObstaculos = document.querySelector(".obstaculos");

        divObstaculos.appendChild(obstaculo);
    }
    movimentaObstaculo(obstaculo){
        const delay = geraDelayAleatorio();
        const className = obstaculo.classList.value.split(' ')[1];
        
        return setTimeout(() => {
            this.obstaculoController.acelera(className);
            
            if(obstaculo.style.top > '600px')
                this.obstaculoController.setX(obstaculo);
                
            return this.movimentaObstaculo(obstaculo);
        }, delay);
    }
    inicia(){
        const pista = this.pista.getPista();
        const jogador = this.carro.getCarro();
        const pontoSpan = this.ponto.getPonto();
        const [obstaculoSpan] = this.fabricaDeObstaculo.getObstaculos();
        const elementos = [jogador, pontoSpan];

        this.insereNoPlayground(...elementos);
        this.insereObstaculo(obstaculoSpan);
        this.timer.inicia();
        this.movimentaObstaculo(obstaculoSpan);
        this.distanciaController.atualizaDistancia();
    }
}

new Jogo().inicia();