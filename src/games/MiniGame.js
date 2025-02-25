import Timer from "../utils/timer";

export default class MiniGame{
    constructor(type, player, tile){
        this.type = type;
        this.tile = tile;
        this.player = player;
        this.duration = null;
        this.tickrate = null;
        this.timer = new Timer();
        
    }

    startGame(){
        this.timer.start();
    }

    stopGame(){
        this.timer.stop();
    }
    
}