import MatchingGame from "../games/MatchingGame";
import QuizGame from "../games/QuizGame";
import TypingGame from "../games/TypingGame";
import { getWords } from "../utils/getWords";
import ExitTile from "./ExitTile";
import MazeTile from "./MazeTile";
export default class Maze{
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.grid = this.createMaze();
    }

    createMaze(){
        const array = new Array();
        const exitIndex = Math.floor(Math.random() * 7)
        //console.log(exitIndex)
        for(let i = 0; i < this.rows; i++){
            let row = [];
            for(let j = 0; j < this.cols; j++){
                if(j === exitIndex && i === 6){
                    row.push(new ExitTile(i, j));
                }
                else{
                    let event = this.createRandomEvent(this.eventList())
                    let subevent = this.subEventList(event);
                    let TileEvent = (subevent ? this.createRandomEvent(subevent) : event)
                    //console.log(typeof tileevent)
                    if(typeof TileEvent === "function"){
                        TileEvent = new TileEvent();
                    }
                    row.push(new MazeTile(i, j, TileEvent))
                }
            }
            array.push(row)
        }
        return array;
    }

    createRandomEvent(list){

        let weight = list.reduce((sum, item) =>  sum + item.chance , 0);
        let random = Math.random() * weight;
        let cumulative = 0;

        for(let item of list){
            cumulative += item.chance;
            if(random <= cumulative){
                return item.type;
            }
        }
    }

    eventList(){
        const events = [
            {type: "wordevent", chance: 70},
            {type: "none", chance: 15},
            {type: "gold", chance: 10},
            {type: "treasure", chance: 5},
        ]
        return events;
    }

    subEventList(listtype){

        const treasure = [
            {type: "hint", chance: 20},
            {type: "multi", chance: 20},
            {type: "extratime", chance: 20},
            {type: "revealer", chance: 20},
            {type: "shield", chance: 20},
        ]

        const minigames = [
            {type: QuizGame, chance: 50},
            {type: MatchingGame, chance: 30},
            {type: TypingGame, chance: 20},
        ]

        const listchoice = {
            "wordevent": minigames,
            "treasure": treasure,
        }

        return listchoice[listtype] || null;
    }

    getTile(x, y){
        return this.grid[x]?.[y] || null;
    }
}