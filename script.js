const playground = document.querySelector('.playground');
const espacoJogador = document.querySelector('.espaco-jogador');

function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName);
    elemento.className = className;
    
    return elemento;
}

class Player {
    constructor(largura) {
        this.elemento = novoElemento('span', 'player');
    }

    adicionaPlayer(){
        espacoJogador.appendChild(this.elemento);
    }
    getX(){
        const x = parseInt(this.elemento.style.left.split('px')[0]) || 0;
    
        console.log(`x = ${x}`, this.elemento.style.left);
        return x;
    }
    setX(x){
        this.elemento.style.left = `${x}vw`;
    }
    movimenta(x){
        const coordX = this.getX();
        const soma = x + coordX;
        const bgColor = this.elemento.style.backgroundColor;
        
        
        if(soma > 0 && soma < 100){
            if(bgColor === "red")
                this.elemento.style.backgroundColor = "yellow";
            
            this.setX(soma);
        }
        else if(soma === 0 || soma === 100)
            this.elemento.style.backgroundColor = "red";
    }
}

class Jogo {
    constructor(){
        this.pontos = 0;
        this.areaDoJogo = document.querySelector(".playground");
        //this.altura = this.areaDoJogo.clientHeight;
        this.largura = this.areaDoJogo.clientWidth;
        this.jogador = new Player();

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
        this.jogador.adicionaPlayer({ largura: this.largura });
    }
}

const jogo = new Jogo();
jogo.inicia();