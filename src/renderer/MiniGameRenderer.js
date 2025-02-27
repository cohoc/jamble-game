import { element } from "three/tsl";

export default class MiniGameRenderer{
    constructor(registry){
        this.container = document.querySelector(".content__game-grid");
        this.registry = registry;
        this.template = null;
        this.gamescreen = null;
        this.timerContainer = null;
        this.handlers = {
            matching: this.handleMatchingGame.bind(this),
            quiz: this.handleQuizGame.bind(this),
            typing: this.handleTypingGame.bind(this)
        }
    }

    setFocus(element, callback){
        let prevFocus = document.querySelector(".focused");
        if(prevFocus){
            prevFocus.classList.remove("focused")
            //prevFocus.firstElementChild.style.color = "white";
            callback("cancel")
        }
        element.parentNode.classList.add("focused")
        //element.style.color = "black";
    }

    displayMiniGame(gametype, data, callback){
        this.gametype = gametype;
        this.template = this.registry.getTemplate(gametype, data)
        this.container.insertAdjacentHTML("afterend", this.template)
        this.gamescreen = document.querySelector(`.game__${gametype}`)

        setTimeout(() => {
            let element = document.querySelector(".game__screen");
            element.classList.add("expand");
        }, 0)

        this.handlers[gametype](callback);
    }

    handleMatchingGame(callback){
        this.dragHandler(callback);
        this.checkMatching(callback);
    }

    handleQuizGame(callback){
        this.quizHandler(callback);
    }

    handleTypingGame(callback){
        this.typingHandler(callback)
    }

    dragHandler(callback){

        const dragState = {
            cloned: null,
            gameBounds: null,
            draggedWord: null,
            draggedDef: null,
            currentDrop: null, 
            coords: {
                startX: 0,
                startY: 0,
                minX: 0,
                maxX: 0,
                minY: 0,
                maxY: 0,
            },
            isDragging: false,
            isMouseDown: false
        }

        this.gamescreen.addEventListener("dragstart", event => event.preventDefault())
        this.gamescreen.addEventListener("mousedown", event => dragStart(event))
        this.gamescreen.addEventListener("mousemove", event => dragMove(event))
        this.gamescreen.addEventListener("mouseup", event => dragEnd(event, callback))
        this.gamescreen.addEventListener("mouseleave", () => dragCancel())

        const dragStart = (event) => {
            if(event.target.dataset.draggable === "true"){   
                dragState.isDragging = true;
                dragState.isMouseDown = true;
                document.body.style.overflow = "hidden"
                document.body.style.cursor = "grabbing"
    
                // Get size of game screen to calc bounds of drag
                dragState.gameBounds = this.gamescreen.getBoundingClientRect();
                dragState.coords.minX = dragState.gameBounds.left;
                dragState.coords.maxX = dragState.gameBounds.right;
                dragState.coords.minY = dragState.gameBounds.bottom;
                dragState.coords.maxY = dragState.gameBounds.top;
    
                // Get size of drag element to calc clone drag offset
                const rect = event.target.getBoundingClientRect();
                dragState.coords.startX = event.clientX - rect.left;
                dragState.coords.startY = event.clientY - rect.top;
    
                
                dragState.cloned = event.target.cloneNode(true);
                dragState.cloned.style.left = `${event.clientX - dragState.coords.startX}px`;
                dragState.cloned.style.top = `${event.clientY - dragState.coords.startY}px`;
                dragState.cloned.style.width = `${rect.width}px`;
                dragState.cloned.style.height = `${rect.height}px`
                dragState.cloned.classList.add("dragging__clone")
                document.body.appendChild(dragState.cloned)
    
                dragState.draggedWord = event.target.dataset.word;
    
                event.target.style.zIndex = "9998"
                event.target.style.display = "none"
    
                this.gamescreen.style.userSelect = "none"
            }
        }

        const dragMove = (event) => {
            if(dragState.isDragging && dragState.cloned){
                let newX = event.clientX - dragState.coords.startX;
                let newY = event.clientY - dragState.coords.startY;
    
                newX = Math.max(dragState.coords.minX, Math.min(dragState.coords.maxX - dragState.cloned.offsetWidth, newX))
                newY = Math.max(dragState.coords.maxY, Math.min(dragState.coords.minY - dragState.cloned.offsetHeight, newY))
    
                dragState.cloned.style.left = `${newX}px`
                dragState.cloned.style.top = `${newY}px`
    
                let element = document.elementFromPoint(event.clientX, event.clientY);
                let droppable = element?.closest("[data-droppable='true']")
                dragHighlight(droppable);
            }
        }

        const dragEnd = (event, callback) => {
            if(dragState.isDragging && dragState.cloned){
                const droppable = event.target.closest("[data-droppable='true']")
                const dragged = this.gamescreen.querySelector(`[data-word="${dragState.draggedWord}"]`)
                if(droppable){            
                    // Create and append div placeholder to draggable
                    const div = document.createElement("div");
                    div.textContent = dragged.textContent;
                    div.className = "matching__dropped";
                    div.dataset.word = dragged.dataset.word;
                    droppable.appendChild(div);
        
                    // Edit the initial dragged element so it is omitted from the list 
                    dragged.style.display = "none";
                    dragged.dataset.draggable = "false"
        
                    // Edit the draggable so that no other elements can be dragged in
                    droppable.setAttribute("data-droppable", false);
                    dragState.draggedDef = droppable.dataset.def;
                    dragHighlight(null)
                    callback("update", {[dragState.draggedWord]: dragState.draggedDef})
                }
                else if(!droppable){
                    dragged.style.display = "";
    
                }
                dragCleanUp();
            }
        }

        const dragCancel = () => {
            if(dragState.isDragging){
                let element = this.gamescreen.querySelector(`[data-word="${dragState.draggedWord}"]`);
                element.style.display = "";
                dragCleanUp();
                dragHighlight(null);
            } 
        }
    
        const dragCleanUp = () => {
            if(dragState.cloned){
                document.body.removeChild(dragState.cloned);
                dragState.cloned = null;
            }
            dragState.draggedWord = null;
            dragState.draggedDef = null;
            dragState.isDragging = false;
            dragState.isMouseDown = false;
            document.body.style.overflow = "";
            document.body.style.cursor = ""
            //element.style.userSelect = ""
    
        }
    
        const dragHighlight = (droppable) => {
            if(dragState.currentDrop){
                dragState.currentDrop.classList.remove("drag-highlight")
            }
            if(droppable){
                droppable.classList.add("drag-highlight")
            }
            dragState.currentDrop = droppable;
        }
    }

    quizHandler(callback){
        const submit = this.gamescreen.querySelector(".game__submit");
        const definition = this.gamescreen.querySelector(".game__quiz-definition").dataset.def
        this.gamescreen.addEventListener("click", (event) => {
            if(event.target.tagName === "INPUT"){
                this.setFocus(event.target, callback);
                let word = event.target.getAttribute("data-word")
                callback("update", {[word]: definition})
                submit.style.height = "3rem";
                submit.style.marginBottom = "2rem";
            }
            if(event.target.tagName === "BUTTON" && event.target.type === "submit"){
                callback("submit")
            }
        })
    }

    typingHandler(callback){
        //let correct = word;
        let textinput = this.gamescreen.querySelector(".typing-input")

        textinput.addEventListener("input", () => {
            let currentword = textinput.value;
            textinput.setAttribute("value", currentword)
            callback("update-realtime", currentword)
        })
    }

    checkMatching(callback){

        let submit = this.gamescreen.querySelector(".game__submit");
        let submitbutton = submit.lastElementChild;

        this.gamescreen.addEventListener("mouseup", event => matchingCheckDrop(event))
        this.gamescreen.addEventListener("click", event => matchingButtonHandler(event, callback))

        const matchingCheckDrop = (event) => {
            const draggedItems = this.gamescreen.querySelectorAll(`[data-droppable="false"]`)            
            if(event.target.dataset.droppable === "false" && event.target.firstElementChild){
                if(draggedItems.length < 4){
                    submit.style.height = "3rem";
                    submit.style.marginTop = "2rem"
                    submitbutton.style.display = "none"
                }
                else{
                    submitbutton.style.display = "block"
                }
            }
        }

        const matchingButtonHandler = (event) => {
            if(event.target.tagName === "BUTTON" && event.target.type === "submit"){
                event.preventDefault();
                callback("submit")
            }
    
            else if(event.target.tagName === "BUTTON" && event.target.classList.contains("clear__button")){
                callback("cancel")
                const draggedItems = this.gamescreen.querySelectorAll("[data-draggable='false']");
                draggedItems.forEach(element => {
                    // Reset words list so that items can be dragged again
                    element.style.display = ""
                    element.style.zIndex = ""
                    element.dataset.draggable = "true"
                    let word = element.dataset.word;
    
                    // Clear elements in draggables that have been dragged
                    let drop = this.gamescreen.querySelector(`.matching__dropped[data-word='${word}']`)
                    let dropend = drop.parentElement;
                    drop.remove();
                    dropend.dataset.droppable = "true";
    
                    // Remove elements from matching object 
                    submit.style.height = "0rem";
                    submit.style.marginTop = "0rem"
                })
            }
        }

    }

    update(gamedata){

        const progress = this.gamescreen.querySelector(".timer-container")
        const progressfill = this.gamescreen.querySelector(".timer-progress");
        const circle = this.gamescreen.querySelector(".progress-circle-container")
        const circlefill = this.gamescreen.querySelector(".progress-circle-fill")
        const circleLeft = circle.getBoundingClientRect().left;

        const scaleValue = gamedata.length / gamedata.correctLength;
        const scalePx = scaleValue * progress.clientWidth;
        const fillValue = Math.min(Math.max(scalePx - circleLeft, 0) / circle.clientWidth , 1);

        if (gamedata.isComplete === true){
            progressfill.style.transform = "scaleX(1)"
            progressfill.style.background = "var(--green)"
        }

        else if(gamedata.length === 0){
            progressfill.style.transform = "scaleX(0)";
            progressfill.style.background = "var(--green)"
        }

        else if(gamedata.length > 0){

            if(gamedata.isCorrect === true){
                progressfill.style.background = "var(--green)"
                progressfill.style.transform = `scaleX(${scaleValue})`
                circlefill.style.background = "var(--green)"
                circlefill.style.transform = `scaleX(${fillValue})`
            }

            else if(gamedata.isCorrect === false){
                progressfill.style.background = "var(--red)"
                progressfill.style.width = `100%`
                circlefill.style.background = "var(--red)"
            }
        }
    }

    clearMiniGame(gameresult){
        console.log(gameresult)
        const clearMatching = () => {
            this.gamescreen.querySelectorAll(".matching__dropped").forEach(element => {
                if(element.dataset.word in gameresult.wrongPairings){
                    element.classList.add("wrong")
                }
                else{
                    element.classList.add("correct")
                }
            })
        }

        const clearQuiz = () => {
            this.gamescreen.querySelectorAll(".question-input").forEach(element => {
                let parent = element.parentElement;
                if(element.dataset.word === gameresult.correct){
                    parent.classList.add("correct")
                    element.style.color = "white"
                }
                else if(element.dataset.word === gameresult.user){
                    parent.classList.add("wrong")
                    element.style.color = "white"
                }
            });
        }

        const type = {
            "matching": clearMatching,
            "quiz": clearQuiz,
        }

        type[gameresult.gametype]?.()

        setTimeout(() => {
            this.gamescreen.remove();
            document.querySelector(".game__alert").remove();
            this.rendererCleanUp()
        }, 1500)
    }

    rendererCleanUp(){
        this.template = null;
        this.gamescreen = null;
    }

}