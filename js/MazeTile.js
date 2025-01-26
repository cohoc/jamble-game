class MazeTile{
    constructor(){
        this.x = x || 0;
        this.y = y || 0;
        this.active = active || false;
        this.moveable = (x === 0 ? true : false); 
        this.visited = visited || false;
        this.viewable = viewable || false;
        this.exit = exit || false;

    }
}