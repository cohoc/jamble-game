export default class Player{
    constructor(){
        this.powerups = null;
        this.position = null;
        this.bounds = {
            w: null,
            e: null,
            n: null,
            s: null
        };
        this.perview = null;
    }

    getPosition(){
        return this.position;
    }

    getBounds(){
        return this.bounds;
    }

    setPosition(x, y){
        this.position = { x, y };
    }

    setBounds(w, e, n, s){
        this.bounds.w = w;
        this.bounds.e = e;
        this.bounds.n = n;
        this.bounds.s = s;
    }
}