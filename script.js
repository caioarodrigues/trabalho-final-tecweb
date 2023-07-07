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
    async bufferizaVelocidade(){
        if(bufferVelocidadeAcionado)
            return;

        setTimeout(async () => {
            const velocidadeAtual = this.getVelocidadeAtual();
            const velocidadeFinal = velocidadeAtual - 1;

            if(velocidadeFinal > 0)
                this.docVel.innerHTML = velocidadeFinal;
            
            return await this.bufferizaVelocidade();
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
    setY(className, posAtual = 0, velocidade = 10){
        const entidade = document.querySelector(`.${className}`);
        const entidadeLeft = entidade.style.left.split("px")[0];
        const playerLeft = document.querySelector(".player").style.left.split("px")[0];

        if(className === "ponto"){
            const chances = Math.floor(Math.random() * 10_000);
            velocidade = 15;
            
            if(chances > 100 && posAtual === 0){
                entidade.style.display = "none";

                return;
            }

            entidade.style.display = "inline-block";
        }

        if(posAtual === 0 || posAtual > 0){
            entidade.style.top = `${posAtual + velocidade}px`;
            toggleYPonto = true;
        }
        if (posAtual > 440) {
            entidade.style.top = `0px`;
            toggleYPonto = false;
        }
        if(posAtual > 400 && className === "ponto" && 
            (Math.abs(playerLeft - entidadeLeft) <= 20) && !toggleYPonto){
            const pontuacao = new EscoreController();
            
            pontuacao.edita(1);
            this.setY(className);
        }
        if(posAtual > 400 && className === "obstaculo" && 
            (Math.abs(playerLeft - entidadeLeft) <= 20)){
                divGameOver.style.display = "flex";
                isFimDeJogo = true;
        }
    }
    setX(obstaculo){
        const limite = 750;
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
    }
    getObstaculo(){
        return [new Obstaculo()];
    }
}
class Posto {
    constructor(){
        this.elemento = novoElemento('span', 'gasolina');
        this.velocidade = 10;
    }

    getPosto(){
        return this.elemento;
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
    movimentaHorizotal(x){
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
        this.entidadeController = new EntidadeController();
        this.ponto = new Ponto();
        this.velController = new VelController();
        this.posto = new Posto();

        document.addEventListener('keyup', event => {
            const teclaSolta = event.key;

            if(teclaSolta.toLocaleLowerCase() === 'w'){
                bufferVelocidadeAcionado = true;
            }
        })
        document.addEventListener('keydown', async (event) => {
            const teclaPressionada = event.key || String.fromCharCode(event.keyCode);

            if (teclaPressionada.toLowerCase() === 'd') {
                this.carro.movimentaHorizotal(20);
            }
            else if (teclaPressionada.toLowerCase() === 'a') {
                this.carro.movimentaHorizotal(-20);
            }
            else if (teclaPressionada.toLowerCase() === 'w') {
                this.carro.movientaVertical(10);
                await this.carro.velController.bufferizaVelocidade();
                
                bufferVelocidadeAcionado = false;
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
        let travaEntidade = false;

        setTimeout(() => {
            entidades.forEach(entidade => {
                const className = entidade.classList.value.split(' ')[0];
                const top = entidade.style.top.split('px')[0];

                if(this.velController.getVelocidadeAtual() === 0 || isFimDeJogo)
                    return;

                if(top > 0 && top < 16){
                    this.obstaculoController.setX(entidade);
                }

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
        const posto = this.posto.getPosto();
        const [obstaculoSpan] = this.fabricaDeObstaculo.getObstaculos();
        const elementos = [jogador];
        const entidades = [obstaculoSpan, pontoSpan, posto];

        this.insereNoPlayground(...elementos);
        this.insereEntidade(...entidades);
        this.timer.inicia();
        this.movimentaEntidade(...entidades);
        this.distanciaController.atualizaDistancia();
    }
}

new Jogo().inicia();