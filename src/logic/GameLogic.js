import Timer from "../utils/timer";

export default class GameLogic{
    constructor(maze, player, renderer){
        this.maze = maze;
        this.player = player;
        this.renderer = renderer;

        this.tile = null;
        this.minigame = null;

        this.gamedata = {};
        this.gameresult = {};
        this.userSelections = {};

        this.timer = new Timer();
    }

    calcPlayerBounds(x, y){
        let w = [parseInt(x), Math.max(0, parseInt(y) - 1)];
        let e = [parseInt(x), Math.min(6, parseInt(y) + 1)];
        let n = [Math.max(0, parseInt(x) - 1), parseInt(y)];
        let s = [Math.min(6, parseInt(x) + 1), parseInt(y)];
        this.player.setBounds(w, e, n, s)
    }

    calcMoveable(){
        Object.values(this.player.bounds).forEach(bound => {
            let x = bound[0];
            let y = bound[1];
            this.maze.getTile(x, y).moveable = true;
            let element = document.querySelector(`[data-row="${x}"][data-col="${y}"]`)
            element.classList.remove("inactive")
        })
    }
    
    checkExit(){
        if(this.tile.type === "exit"){
            console.log("you found the exit!")
        }
    }

    getMazeTile(x, y){
        return this.maze.getTile(x, y);
    }

    getUserSelections(){
        return this.userSelections;
    }

    setMiniGame(){
        this.minigame = this.tile.event;
    }

    handleTileEvent(){
        if(typeof this.minigame === "object"){
            this.miniGameStart()
        }
        else{
            console.log(this.tile.event)
        }
    }

    minigameCallback(action, data){
        //console.log(data)
        if(action === "update"){
            this.userSelections = {...this.userSelections, ...data}
            console.log(this.userSelections)
        }

        else if(action === "update-realtime"){
            this.userSelections = {data}
            this.gameresult = this.tile.event.validateSelection(this.userSelections)
            this.miniGameUpdate()

            if(this.gameresult?.isComplete === true){
                this.miniGameStop()
                this.miniGameCleanUp()
            }

        }

        else if(action === "cancel"){
            this.miniGameClear()
        }

        else if(action === "submit"){
            this.gameresult = this.tile.event.validateSelection(this.userSelections)
            this.miniGameStop()
            this.miniGameCleanUp()
        }
    }

    miniGameClear(){
        this.userSelections = {}
    }

    miniGameCleanUp(){
        this.tile = null;
        this.minigame = null;
        this.gamedata = {};
        this.gameresult = {};
        this.userSelections = {};
    }

    miniGameUpdate(){
        this.renderer.update(this.gameresult)
    }

    miniGameStart(){
        console.log("GameLogic: starting minigame")
        this.minigame.isRunning = true;
        this.gamedata = this.minigame.getMiniGameData();
        this.timerInit()
        this.observeGame()
        this.renderer.displayMiniGame(this.gamedata.type, this.gamedata.data, this.minigameCallback.bind(this))
    }

    miniGameStop(){
        console.log("GameLogic: stopping minigame")
        this.minigame.isRunning = false;
        this.renderer.clearMiniGame(this.gameresult);
    }

    movePlayer(x, y){
        this.tile = this.getMazeTile(x, y)
        this.setMiniGame();
        this.player.setPosition(parseInt(x), parseInt(y));
        this.checkExit()
        this.handleTileEvent()
    }

    observeGame(){
        const target = document.querySelector(".content");
        if(!target){
            console.error("no target for timer found");
            return;
        }
        const observer = new MutationObserver((mutations, obs) => {
            const timerElement = document.querySelector(".timer-container")
            if(timerElement){
                //console.log(this.minigame.constructor.name)
                this.timer.setContainer(timerElement)
                this.timer.setTimerCallback(this.timerCallback.bind(this));
                this.timer.startTimer()
                obs.disconnect()
            }
            else{
                if(this.minigame === null){
                    obs.disconnect()
                    console.log("observer disconnected")
                };
                
            }
        })
        observer.observe(target, {childList: true, subtree: true})
    }

    timerInit(){
        const timemap = {
            "MatchingGame": 30000,
            "QuizGame": 15000,
            "TypingGame": 30000
        }
        this.timer.setTimer(timemap[this.minigame.constructor.name])
    }

    timerCallback(){
        this.miniGameStop();
    }

    updateMazeTiles(){
        for(let i = 0; i < this.maze.rows; i++){
            for(let j = 0; j < this.maze.cols; j++){
                let element = document.querySelector(`[data-row='${i}'][data-col='${j}']`)
                if((Object.values(this.player.bounds).some(coord => coord[0] === i && coord[1] === j)) || (this.player.position.x === i && this.player.position.y === j)){
                    continue;
                }
                else{
                    element.classList.add("inactive")
                }
            }
        }
    }

}