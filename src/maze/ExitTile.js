import Tile from "./Tile";

export default class ExitTile extends Tile{
    
    constructor(x, y){
        super(x, y)
        this.type = "exit"
    }
}