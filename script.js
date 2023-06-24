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
class Player {
    constructor(largura) {
        this.elemento = novoElemento('span', 'player');
        this.largura = largura;
    }
    getJogador(){
        return this.elemento;
    }
    getX(){
        const x = parseInt(this.elemento.style.left.split('px')[0]) || 375;

        return x;
    }
    setX(x){
        this.elemento.style.left = `${x}px`;
    }
    movimenta(x){
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
        this.jogador = new Player(this.largura);
        this.timer = new Timer();
        this.pista = new Pista();

        document.addEventListener('keydown', (event) => {
            const teclaPressionada = event.key || String.fromCharCode(event.keyCode);

            if (teclaPressionada.toLowerCase() === 'd') {
                this.jogador.movimenta(10);
            }
            if (teclaPressionada.toLowerCase() === 'a') {
                this.jogador.movimenta(-10);
            }
        });
    }
    inserePlayground(...array){
        array.forEach(el => {
            espacoJogador.appendChild(el);
        });
    }
    inicia(){
        const pista = this.pista.getPista();
        const jogador = this.jogador.getJogador();
        const elementos = [jogador, pista];

        this.inserePlayground(...elementos);
        this.timer.inicia();
    }
}

const jogo = new Jogo();
jogo.inicia();