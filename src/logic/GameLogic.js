export default class GameLogic{
    constructor(maze, player, renderer){
        this.maze = maze;
        this.player = player;
        this.renderer = renderer;

        this.gamedata = {};
        this.gameresult = {};
        this.tile = null;
        this.userSelections = {};
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

    handleTileEvent(){
        if(typeof this.tile.event === "object"){
            this.startGame()
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
                this.stopGame()
                this.miniGameCleanUp()
            }

        }

        else if(action === "cancel"){
            this.miniGameClear()
        }

        else if(action === "submit"){
            this.gameresult = this.tile.event.validateSelection(this.userSelections)
            this.stopGame()
            this.miniGameCleanUp()
        }
    }

    miniGameClear(){
        this.userSelections = {}
    }

    miniGameCleanUp(){
        this.gamedata = {};
        this.gameresult = {};
        this.tile = null;
        this.userSelections = {};
    }

    miniGameUpdate(){
        this.renderer.update(this.gameresult)
    }

    movePlayer(x, y){
        this.tile = this.getMazeTile(x, y)
        this.player.setPosition(parseInt(x), parseInt(y));
        this.checkExit()
        this.handleTileEvent()
    }

    startGame(){
        this.userSelections = [];
        this.gamedata = this.tile.event.start();
        this.renderer.displayMiniGame(this.gamedata.type, this.gamedata.data, this.minigameCallback.bind(this))
    }

    stopGame(){
        this.renderer.clearMiniGame(this.gameresult);
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