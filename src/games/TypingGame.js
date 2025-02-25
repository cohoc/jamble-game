import { getTyping } from "../utils/getWords";

export default class TypingGame{
    constructor(player, tile){
        this.player = player;
        this.tile = tile;
        this.words = this.setTypingWords();
        this.current = this.setCurrentWord();
        this.userinput = "";
        this.correctWords = 0;
        this.targetWords = 5;
        this.isRunning = false;
    }

    setCurrentWord(){
        let index = Math.floor(Math.random() * this.words.length);
        return (this.words[index])
    }

    setTypingWords(){
        return Array.from(getTyping());
    }

    setUserInput(){
        let inputStr = "" + this.current.charAt(0);
        return inputStr;
    }

    getMiniGameData(){
        //console.log("typing minigame started")
        console.log(this.current)
        return {
            type: "typing", 
            data: {
                "definition": this.current.definition,
                "type": this.current.type,
                "letter": this.current.word.charAt(0)
            },
        }
    }

    validateSelection(userType){
        
        let typed = userType.data;
        let isCorrect;
        let isComplete;
                
            if(typed === this.current.word){
                isCorrect = true;
                isComplete = true;
                return {
                    "gametype": "typing",
                    isCorrect,
                    isComplete,
                    "correct": this.current.word
                }
            }

            else{
                let length = typed.length;
                if(typed === this.current.word.substring(0, length)){
                    isCorrect = true;
                    isComplete = false;
                    return {
                        "gametype": "typing",
                        isComplete,
                        isCorrect,
                        length,
                        correctLength: this.current.word.length
                    }
                }
                else{
                    isCorrect = false;
                    isComplete = false;
                    return {
                        "gametype": "typing",
                        isComplete,
                        isCorrect,
                        length,
                        correctLength: this.current.word.length

                    }
                }
            }
        
    }

}