import Tile from "./Tile";

export default class MazeTile extends Tile{
    constructor(x, y, eventtype){
        super(x, y)
        this.event = eventtype;
        this.type = "maze"
    }
    
}