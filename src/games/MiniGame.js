import Timer from "../utils/timer";

export default class MiniGame{
    constructor(type){
        this.type = type;
        this.timer = new Timer();
    }

    displayGame(){
        console.log("display")
    }
    
}