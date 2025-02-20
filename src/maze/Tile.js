export default class Tile{
    constructor(x, y){
        this.position = { x, y };
        this.active = false;
        this.visited = false;
        this.viewable = false;
        this.moveable = (x === 0 ? true : false); 
    }

    setActive(state){
        this.active = state;
    }
    
    setPosition(x, y){
        return this.position = { x, y };
    }
}