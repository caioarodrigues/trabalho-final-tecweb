const playground = document.querySelector('.playground');
const espacoJogador = document.querySelector('.espaco-jogador');
const main = document.querySelector('main');
const larguraTela = main.clientWidth;
const larguraPlayground = playground.clientWidth;
const larguraMargem = (larguraTela - larguraPlayground) / 2
const larguraPlayer = 50;
const ptoInicialPlayround = 0 + larguraPlayer;
const ptoFinalPlayground = larguraTela - larguraMargem * 2 - larguraPlayer;

console.log(larguraPlayground, larguraTela, larguraMargem)
function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName);
    elemento.className = className;
    
    return elemento;
}

class Player {
    constructor(largura) {
        this.elemento = novoElemento('span', 'player');
        this.largura = largura;
    }

    adicionaPlayer(){
        espacoJogador.appendChild(this.elemento);
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
    
    inicia(){
        this.jogador.adicionaPlayer();
    }
}

const jogo = new Jogo();
jogo.inicia();