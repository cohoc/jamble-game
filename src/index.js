import { element, max } from "three/tsl";
import { words } from "../backend/data/words"
import { getWords, getRandomWords, getMatching, getTyping } from "./utils/getWords";
import Maze from "./maze/Maze";
import Player from "./player/Player"
import GameLogic from "./logic/GameLogic";
import MiniGameRenderer from "./renderer/MiniGameRenderer";
import MiniGameRegistry from "./renderer/MiniGameRegistry";

let maze, player, logic, renderer, registry;

let grid,
    dialog,
    popup,
    btnclose,
    btnhelp;

    grid = document.querySelector(".content__game-grid");
    dialog = document.querySelector(".content__popup");
    popup = document.querySelector(".popup");
    btnclose = document.querySelector("#btn-close");
    btnhelp = document.getElementById("btn-help");

function init(){
    maze = new Maze(7, 7);
    player = new Player();
    registry = new MiniGameRegistry();
    
    renderer = new MiniGameRenderer(registry);
    logic = new GameLogic(maze, player, renderer);

    drawMaze();
    drawExit();
    console.log(maze.grid)
}


/******************* 
*
*

    MAZE METHODS

*
*
********************/

async function drawMaze(){ 
    maze.grid.forEach((array, i) => {
        array.forEach((item, j) => {
            let html = `
                <button 
                    data-row=${i} 
                    data-col=${j} 
                    ${logic.getMazeTile(i,j).type === "exit" ? "data-exit=true" : ""}
                    data-state=""
                    data-animation="idle"
                    class="${item.moveable === false ? "inactive" : ""} game-grid__tile"
                >
                </button>
            `
            grid.insertAdjacentHTML("beforeend", html)
        })
    });
}


function drawExit(){
    let element = grid.querySelector(`[data-exit=${true}]`)
    element.classList.add("animate-glow");
}

/*******************  
*
*

    PLAYER METHODS

*
*
********************/

function setPreview(element, eventtype){
    let x = element.getAttribute("data-row")
    let y = element.getAttribute("data-col")
    player.preview = [parseInt(x), parseInt(y)];
    if(Object.values(player.bounds).some(coord => JSON.stringify(coord) === JSON.stringify(player.preview)) || (maze.getTile(x, y).moveable === true )){
        if(eventtype === "mouseover"){
            element.classList.add("moveable")
        }
        if(eventtype === "mouseout"){
            element.classList.remove("moveable")
        }
    }
}


/*******************  
*
*

    GAME LOGIC

*
*
********************/



/*function gameType(row, col){
    let tile = maze[row][col];
    let element;
    let game;
    let timerElement;

    if(tile.exit === true){
        grid.insertAdjacentHTML("afterend", gameVictory());
        element = grid.querySelector(".game__alert");
    }
    else{
        switch(tile.event){
            case "none":
                updateCounter();
                break;

            case "wordevent":
                //let randomgame = Math.floor(Math.random() * 3) + 1;
                let randomgame = 3;
                switch(randomgame){

                    case 1:
                        grid.insertAdjacentHTML("afterend", gameVocab(tile.vocab));
                        game = document.querySelector(".game__vocab");

                        setTimeout(() => {
                            element = document.querySelector(".game__screen");
                            element.classList.add("expand");
                        }, 0)
        
                        checkVocab(game, tile.vocab.word)
                        break;
                        
                    case 2: {
                        let array = Array.from(getMatching());
                        let correct = Object.fromEntries(array.map(item => [item.word, item.definition]));
                        let shuffleword = array.map(item => item.word).sort(() => Math.random() - .5);
                        let shuffledef = array.map(item => item.definition).sort(() => Math.random() - .5);

                        grid.insertAdjacentHTML("afterend", gameMatching(shuffledef, shuffleword));
                        game = document.querySelector(".game__matching");

                        setTimeout(() => {
                            element = document.querySelector(".game__screen");
                            element.classList.add("expand");
                        }, 0)

                        dragHandler(game);
                        checkMatching(game, correct);
                        break;
                    }

                    case 3: {
                        let array = Array.from(getTyping())
                        let randindex = Math.floor(Math.random() * array.length); 
                        let randword = array[randindex].word;
                        let randtype = array[randindex].type;
                        let randdef = array[randindex].definition;
                        console.log(randword)


                        grid.insertAdjacentHTML("afterend", gameTyping(randword, randtype, randdef));
                        game = document.querySelector(".game__typing")
                        document.querySelector(".typing-input").focus();
                        timerElement = document.querySelector(".timer-container");
                        console.log(timerElement);

                        setTimeout(() => {
                            element = document.querySelector(".game__screen");
                            element.classList.add("expand");
                        }, 0)

                        const timer = new Timer(60000, 1000, timerElement)
                        timer.start();
                        if(timer.currentTime === 0){
                            console.log("timer has reached zero game over ...")
                        }

                        checkTyping(game, randword);
                        break;  
                    }
                          
                }

            default:
                //console.log(`event ${tile.event} selected`)
                updateCounter();
                
        }
    }
    
}

function gameVictory(){
    let html = `
        <section class="game__alert">
            <div class="game__screen">
                <div class="game__victory">
                    <h3>
                        Congratulations! 
                    </h3>     
                    <p>
                        You have completed the jamble daily puzzle!
                    </p> 
                </div>
            </div>
        </section>
    `
    return (html);
}

function gameVocab(vocab){
    let randomwords = Array.from(getRandomWords())
    let randomindex = Math.floor(Math.random() * randomwords.length + 1)
    randomwords.splice(randomindex, 0, vocab);
    let html = `
        <section class="game__alert">
            <div class="game__screen">
                <div class="game__vocab" data-game="vocab-quiz">
                    <div class="game__prompt">
                        <h3 class="game__category">
                            Vocab Quiz
                        </h3>
                        <p class="game__definition">
                            ${vocab.definition}
                        </p>
                    </div>
                    <ul class="game__quiz">
                        <li class="game__word">
                            <input class="question-input indie" 
                                type="button" 
                                data-choice="a" 
                                data-value="${randomwords[0].word}"
                                value="a. ${randomwords[0].word}"
                            />
                        </li>

                        <li class="game__word">
                            <input class="question-input indie" 
                                type="button" 
                                data-choice="b" 
                                data-value="${randomwords[1].word}"
                                value="b. ${randomwords[1].word}"
                            />      
                        </li>

                        <li class="game__word">
                            <input class="question-input indie" 
                                type="button" 
                                data-choice="c" 
                                data-value="${randomwords[2].word}" 
                                value="c. ${randomwords[2].word}"
                            />
                        </li>

                        <li class="game__word">
                            <input class="question-input indie" 
                                type="button" 
                                data-choice="d" 
                                data-value="${randomwords[3].word}" 
                                value="d. ${randomwords[3].word}"
                            />
                        </li>
                    </ul>
                    <div class="game__submit">
                        <button class="submit__button" type="submit">
                            Submit
                        </button>
                    </div>
                </div
            </div>
        </section>
    `
    return (html);
}

function gameMatching(shuffledef, shuffleword){

    let html = `
        <section class="game__alert">
            <div class="game__screen">
                <section class="game__matching" data-game="matching">
                    <ul class="matching__list-def">
                        ${
                            shuffledef.map((def, index) => 
                                `<li class="matching__list-item inter">
                                    <p>
                                        <span>${index + 1}. </span>
                                        ${def}                                
                                    </p>
                                    <div class="matching__dragend"
                                        data-droppable="true"
                                    >
                                    </div>
                                </li>`
                            ).join('')
                        }
                    </ul>

                    <ul class="matching__list-words">
                        ${
                            shuffleword.map(word => 
                                `<li class="matching__list-item question-input indie"
                                    data-draggable="true"
                                    data-value="${word}"
                                >
                                    ${word}                                  
                                </li>`
                            ).join('')
                        }
                    </ul>

                    <div class="game__submit">
                        <button class="clear__button button--game button--matching" type="button">
                            Clear
                        </button>
                        <button class="submit__button button--game button--matching" type="submit">
                            Submit
                        </button>
                    </div>
                </section>  
            </div>
        </section>
    `
    return (html);
}

function gameTyping(randword, randtype, randdef){
  
    let html = `
        <section class="game__alert">
            <div class="game__screen">
                <section class="game__typing" data-game="typing">
                    <div class="game__typing-definition ">
                        <p class="indie typing--responsive">
                            <b class="inter">
                                ${randtype}.
                            </b>
                            ${randdef}
                        </p>
                    </div>

                    <div class="timer-container" class="inter">
                    
                    </div>

                    <div class="game__typing-word">
                        <input 
                            class="typing-input inter typing--responsive"
                            type="text"
                            tabindex=1
                            placeholder="Starts with ${randword.charAt(0)}"
                            value=""
                            >
                    
                        </input>
                    </div>
                </section
            </div>
        </section>
    `
    return (html);
}

function checkVocab(game, word){
    let timer = 0;
    let selection;
    let submit = document.querySelector(".game__submit");
    game.addEventListener("click", (event) => {
        if(event.target.tagName === "INPUT"){
            setFocus(event.target);
            selection = event.target.getAttribute("data-value")
            submit.style.height = "3rem";
            submit.style.marginBottom = "2rem";
        }
        if(event.target.tagName === "BUTTON" && event.target.type === "submit"){
            submitAnswer(event, word, selection, game);
            updateCounter();
        }
    },)
}

function checkMatching(game, correct){
    let matching = {};
    let submit = game.querySelector(".game__submit");
    let submitbutton = submit.lastElementChild;
    game.addEventListener("mouseup", event => {

        if(event.target.dataset.droppable === "false" && event.target.firstElementChild && Object.keys(matching).length < 4){
            // Get the definition of the dropped item
            let ptag = event.target.previousElementSibling;
            let span = ptag.querySelector("span").textContent;
            let definition = ptag.textContent.replace(span, "").trim();

            // Get the word from the element that was dropped in
            let dropped = event.target.children[0];
            let word = dropped.dataset.value;

            matching[word] = definition;

            if(Object.keys(matching).length < 4){
                submit.style.height = "3rem";
                submit.style.marginTop = "2rem"
                submitbutton.style.display = "none"
            }
    
            else{
                submitbutton.style.display = "block"
            }
        }  
    })

    game.addEventListener("click", event => {
        if(event.target.tagName === "BUTTON" && event.target.type === "submit"){
            event.preventDefault();
            let isMatch;
            Object.entries(matching).forEach(item => {
                let itemkey = item[0];
                let itemdef = item[1];
                let element = game.querySelector(`.matching__dropped[data-value='${itemkey}']`)
                isMatch = (itemdef === correct[itemkey]);
                
                if(isMatch === true){
                    element.classList.add("correct")
                    element.style.color = "white"
                }
                else if(isMatch === false){
                    element.classList.add("wrong")
                    element.style.color = "white";
                }
            })

            setTimeout(() => {
                game.remove();
                document.querySelector(".game__alert").remove();
            }, 1000)
        }

        else if(event.target.tagName === "BUTTON" && event.target.classList.contains("clear__button")){
            
            let words = game.querySelectorAll("[data-draggable='false']");
            words.forEach(element => {
                // Reset words list so that items can be dragged again
                element.style.display = ""
                element.style.zIndex = ""
                element.dataset.draggable = "true"
                let value = element.dataset.value;

                // Clear elements in draggables that have been dragged
                let drop = game.querySelector(`.matching__dropped[data-value='${value}']`)
                let dropend = drop.parentElement;
                drop.remove();
                dropend.dataset.droppable = "true";

                // Remove elements from matching object 
                matching = {}
                submit.style.height = "0rem";
                submit.style.marginTop = "0rem"
            })
        }
    })
}

function checkTyping(game, word){
    let correct = word;
    let textinput = game.querySelector(".typing-input")

    textinput.addEventListener("input", () => {
        let currentword = textinput.value;
        textinput.setAttribute("value", currentword)
        //console.log(currentword)
        if(currentword === correct){
            textinput.value = ""
        }    
    })
}

function submitAnswer(event, word, selection, game){
    event.preventDefault();
    let gameType = null;
    switch(gameType){
        case "vocab":
            break;
        case "matching":
            break;
        case "typing":
            break;
    }
    let choice = document.querySelector(`[data-value='${selection}']`)
    if(word === selection){
        choice.parentNode.classList.add("correct")
        choice.style.color = "white";
    }
    else if(word !== selection){
        choice.parentNode.classList.add("wrong")
        choice.style.color = "white";
    }
    setTimeout(()=>{
        game.remove();
        document.querySelector(".game__alert").remove();
    }, 1000)
}

*/

/*******************  
*
*

    DOM METHODS

*
*
********************/


function closeDialog(){
    dialog.classList.remove("animate-fadein");
    dialog.classList.add("animate-fadeout");

    popup.classList.remove("animate-slideup");
    popup.classList.add("animate-slidedown");

    popup.addEventListener("animationend", () => {
        dialog.classList.remove("animate-fadeout")
        popup.classList.remove("animate-slidedown")
        dialog.close();
    }, {once: true})
}

function updateCounter(){
    let element = document.getElementById("player-moves");
    player.moves = player.moves + 1;
    element.innerHTML = player.moves;
}

function updateAnimation(row, col){
    let element = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    element.setAttribute("data-animation", "popout");
    element.addEventListener("animationend", (event) => {
        event.target.setAttribute("data-animation", "idle");
    })
}

function addEvents(){
    grid.addEventListener("click", (event) => {
        if(event.target.tagName === ("BUTTON") && !event.target.classList.contains("inactive")){
            event.target.classList.remove("moveable")
            event.target.classList.add("visited");
            let row = event.target.getAttribute("data-row");
            let col = event.target.getAttribute("data-col");
            logic.movePlayer(row, col)
            logic.calcPlayerBounds(row, col)
            logic.calcMoveable();
            logic.updateMazeTiles();
            updateAnimation(row, col);
            //console.log(logic.getMazeTile(row, col))
        }
    })

    grid.addEventListener("mouseover", (event) => {
        if(event.target.tagName === ("BUTTON") ){
            //checkTile(event.target);
            setPreview(event.target, "mouseover")
            //checkTile(event.target)
        }
    })

    grid.addEventListener("mouseout", (event) => {
        if(event.target.tagName === ("BUTTON")){
            setPreview(event.target, "mouseout")
        }
    })

    btnhelp.addEventListener("click", () => {
        popup.classList.add("animate-slideup")
        dialog.classList.add("animate-fadein")
        dialog.show();
    },)

    btnclose.addEventListener("click", () => { 
        closeDialog();
    })

    dialog.addEventListener("click", (event) => {
        if(event.target.nodeName === "DIALOG"){
            closeDialog();
        }
    })
    
}

window.addEventListener("load", async function(){
    init();
    addEvents(); 
})

