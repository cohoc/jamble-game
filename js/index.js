import { element, max } from "three/tsl";
import { words } from "../backend/data/words"
import { getWords, getRandomWords, getMatching } from "./getWords";

let maze = new Array();
let deathpit;
let player;
let movesleft = 11;
//let events;
let wordevent;

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
    //create maze and fill with events 
    createMaze(Array.from(getWords()));
    drawMaze();

    //create exit in maze
    createExit();
    drawExit();

    createPlayer();
    createEvents();

    drawCounter();
    //console.log(getRandomWeighted(events));
}


/******************* 
*
*

    MAZE METHODS

*
*
********************/
function createMaze(array){
    let currentIndex = 0;
    for(let i = 0; i < 7; i++){
        maze[i] = [];
        for(let j = 0; j < 7; j++){
            let event = getRandomWeighted(createEvents());

            let word = words[array[currentIndex]];
            maze[i][j] = {
                active: false,
                visited: false,
                viewable: false,
                moveable: (i === 0 ? true: false),
                exit: false,
                event: event,
                vocab: word,
            }
            currentIndex++;
        }
    }
}

function createExit(){
    let index = Math.floor(Math.random() * 7)
    let element = grid.querySelector(`[data-row='${6}'][data-col='${index}']`)
    maze[6][index].exit = true;

    /* FOR TESTING */
    maze[6][index].moveable = true;
    element.classList.remove("inactive")
    element.setAttribute('data-exit', true);
}

function checkExit(row, col){
    if(maze[row][col].exit === true){
        console.log("you found the exit!")
    }
}

function createPlayer(){
    player = {
        moves: 0,
        position: {
            x: null,
            y: null
        },
        preview: {
            x: 0,
            y: 3
        },
        direction: null,
        bounds: {
            xw: null,
            xe: null,
            yn: null,
            ys: null
        }
    }
}

function createEvents(){
    let events = [
        {type: "wordevent", chance: 75},
        {type: "none", chance: 10},
        {type: "gold", chance: 10},
        {type: "treasure", chance: 5},
    ]
    return events;
}

function createTreasure(){
    treasure = [
        {type: "swordmulti", chance: 10},
        {type: "tilelens", chance: 50},
        {type: "timepotion", chance: 50},
        {type: "revealer", chance: 50},
        {type: "swordmulti", chance: 50}
    ]
}

function wordEvents(){
    wordevent = [
        {type: "easy", chance: 40},
        {type: "novice", chance: 30},
        {type: "normal", chance: 15},
        {type: "hard", chance: 10},
        {type: "impossible", chance: 5}
    ]
}


async function drawMaze(){ 
    maze.forEach((array, i) => {
        array.forEach((item, j) => {
            let html = `
                <button 
                    data-row=${i} 
                    data-col=${j} 
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


function checkTile(element){
    //if player has selected a tile
    if(!Object.values(player.position).every(x => x == null)){
        //set position of hovered tile
        let row = element.getAttribute("data-row")
        let col = element.getAttribute("data-col")
        let pos = [parseInt(row), parseInt(col)];
        //if the hovered tile is within the player bounds of movement ie. one tile north, east, south, west of current position
        if(Object.values(player.bounds).some( coord =>JSON.stringify(coord) === JSON.stringify(pos))){
            maze[i][j].moveable === true;
            element.classList.add("moveable")
        }  
        else{
            maze[i][j].moveable === false;
            element.classList.remove("moveable")
        }
    }
}

function setMoveable(){
    Object.values(player.bounds).forEach(bound => {
        let x = bound[0];
        let y = bound[1];
        maze[x, y].moveable = true;
        let element = document.querySelector(`[data-row='${x}'][data-col='${y}']`)
        if(element.classList.contains("inactive")){
            element.classList.remove("inactive")
        }
    })
}

function updateTiles(){
    for(let i = 0; i < maze.length; i++){
        for(let j = 0; j < maze.length; j++){
            let element = document.querySelector(`[data-row='${i}'][data-col='${j}']`)
            if((Object.values(player.bounds).some(coord => coord[0] === i && coord[1] === j)) || (player.position.x === i && player.position.y === j)){
                continue;
            }
            else{
                element.classList.add("inactive")
            }
        }
    }
}

function getRandomWeighted(items){
    let weight = items.reduce((sum, item) =>  sum + item.chance , 0);
    let random = Math.random() * weight;
    let cumulative = 0;
    for(let item of items){
        cumulative += item.chance;
        if(random <= cumulative){
            return item.type;
        }
    }
    
}


/*******************  
*
*

    PLAYER METHODS

*
*
********************/
function setBounds(row, col){
    player.bounds.xw = [parseInt(row), Math.max(0, parseInt(col) - 1)];
    player.bounds.xe = [parseInt(row), Math.min(maze.length - 1, parseInt(col) + 1)];
    player.bounds.yn = [Math.max(0, parseInt(row) - 1), parseInt(col)];
    player.bounds.ys = [Math.min(maze.length - 1, parseInt(row) + 1), parseInt(col)];
}
    


function setPreview(element, eventtype){
    let row = element.getAttribute("data-row")
    let col = element.getAttribute("data-col")
    player.preview = [parseInt(row), parseInt(col)];
    if(Object.values(player.bounds).some(coord => JSON.stringify(coord) === JSON.stringify(player.preview)) || (maze[row][col].moveable === true )){
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



function gameType(row, col){
    let tile = maze[row][col];
    let element;
    let game;

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
                let randomgame = Math.floor(Math.random() * 3) + 1;
                //let randomgame = 2;
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
                        
                    case 2:

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

                    case 3: 
                        console.log("reached word fill quiz")
                        break;    
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
                <section class="game__matching" data-game="matching-game">
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

function gameTyping(){
    let html = `
        <section class="game__alert">
            <div class="game__screen">
                
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

function dragHandler(game){
    let cloned = null;
    let containerRect = null;
    let dataval = null;
    let currentDrop = null;
    let isDragging = false;
    let isMouseDown = false;

    let minX, minY, maxX, maxY = 0;
    let startX, startY = 0;

    game.addEventListener("dragstart", event => {
        event.preventDefault()
    })

    game.addEventListener("mousedown", event => {
        
        if(event.target.dataset.draggable === "true"){   
            isDragging = true;
            isMouseDown = true;
            document.body.style.overflow = "hidden"
            document.body.style.cursor = "grabbing"

            // Get size of game screen to calc bounds of drag
            containerRect = game.getBoundingClientRect();
            minX = containerRect.left;
            maxX = containerRect.right;
            minY = containerRect.bottom;
            maxY = containerRect.top;

            // Get size of drag element to calc clone drag offset
            const rect = event.target.getBoundingClientRect();
            startX = event.clientX - rect.left;
            startY = event.clientY - rect.top;

            
            cloned = event.target.cloneNode(true);
            cloned.style.left = `${event.clientX - startX}px`;
            cloned.style.top = `${event.clientY - startY}px`;
            cloned.style.width = `${rect.width}px`;
            cloned.style.height = `${rect.height}px`
            cloned.classList.add("dragging__clone")
            document.body.appendChild(cloned)

            dataval = event.target.dataset.value;

            event.target.style.zIndex = "9998"
            event.target.style.display = "none"

            game.style.userSelect = "none"
        }
    })

    game.addEventListener("mousemove", event => {
        
        if(isDragging && cloned){
            let newX = event.clientX - startX;
            let newY = event.clientY - startY;

            newX = Math.max(minX, Math.min(maxX - cloned.offsetWidth, newX))
            newY = Math.max(maxY, Math.min(minY - cloned.offsetHeight, newY))

            //console.log("X: ", newX, " Y: ", newY)
            cloned.style.left = `${newX}px`
            cloned.style.top = `${newY}px`

            let element = document.elementFromPoint(event.clientX, event.clientY);
            let droppable = element?.closest("[data-droppable='true']")
            dragHighlight(droppable);
        }
    })

    game.addEventListener("mouseup", event => {

        if(isDragging && cloned){
            const droppable = event.target.closest("[data-droppable='true']")
            const dragged = game.querySelector(`[data-value="${dataval}"]`)
            if(droppable){            
                // Create and append div placeholder to draggable
                const div = document.createElement("div");
                div.textContent = dragged.textContent;
                div.className = "matching__dropped";
                div.dataset.value = dragged.dataset.value;
                droppable.appendChild(div);
    
                // Edit the initial dragged element so it is omitted from the list 
                dragged.style.display = "none";
                dragged.dataset.draggable = "false"
    
                // Edit the draggable so that no other elements can be dragged in
                droppable.setAttribute("data-droppable", false);
                dragHighlight(null)

            }
            else if(!droppable){
                dragged.style.display = "";

            }
            dragCleanUp();
        }
    })

    game.addEventListener("mouseleave", () => {
        if(isDragging){
            let element = game.querySelector(`[data-value="${dataval}"]`);
            element.style.display = "";
            dragCleanUp();
            dragHighlight(null);
        } 
    })

    function dragCleanUp(){

        if(cloned){
            document.body.removeChild(cloned);
            cloned = null;
        }

        dataval = null;
        isDragging = false;
        isMouseDown = false;
        document.body.style.overflow = "";
        document.body.style.cursor = ""
        game.style.userSelect = ""

    }

    function dragHighlight(droppable){
        if(currentDrop){
            currentDrop.classList.remove("drag-highlight")
        }
        if(droppable){
            droppable.classList.add("drag-highlight")
        }
        currentDrop = droppable;
    }
}

function drawCounter(){
    let main = document.querySelector(".content");
    let html = `
        <div class="content__moves">
            <h3 class="moves">
                <span id="player-moves">${player.moves}</span> / 
                <span id="total-moves">${movesleft}</span>
            </h3>
        </div>
    `
    main.insertAdjacentHTML("afterbegin", html);
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

function setFocus(element){
    let prevFocus = document.querySelector(".focused");
    if(prevFocus){
        prevFocus.classList.remove("focused")
        prevFocus.firstElementChild.style.color = "white";
    }
    element.parentNode.classList.add("focused")
    element.style.color = "black";
}

function addEvents(){
    grid.addEventListener("click", (event) => {
        if(event.target.tagName === ("BUTTON") && !event.target.classList.contains("inactive")){
            event.target.classList.remove("moveable")
            event.target.classList.add("visited");
            let row = event.target.getAttribute("data-row");
            let col = event.target.getAttribute("data-col");
            maze[row][col].visited = true;
            player.position.x = row;
            player.position.y = col;
            checkExit(row, col);
            setBounds(row, col);
            setMoveable();
            updateTiles();
            updateAnimation(row, col);
            gameType(row, col);
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

