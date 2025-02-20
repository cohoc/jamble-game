import { getRandomWords } from "../utils/getWords";

export default class QuizGame{
    constructor(player, tile){
        this.player = player;
        this.tile = tile;
        this.words = this.setQuizWords();
        this.choices = this.setChoices(this.words);
        this.correct = this.setCorrect(this.words);
    }

    setQuizWords(){
        const words = Array.from(getRandomWords());
        return words;
    }

    setCorrect(words){
        return words[Math.floor(Math.random() * words.length)];
    }

    setChoices(array){
        return array.map(item => item.word);
    }

    start(){
        //console.log("quiz minigame started")
        let obj = {
            correct: {type: `${this.correct.type}`, definition: this.correct.definition},
            choices: this.choices
        }
        return {type: "quiz", data: obj}
    }

    validateSelection(userChoice){
        let isCorrect;
        let wrongChoices = {}
        if(userChoice[this.correct.word]){
            isCorrect = true;
        }
        else{
            isCorrect = false;
        }
        return {
            "gametype": "quiz",
            isCorrect,
            "correct": this.correct.word,
            "user": Object.keys(userChoice)[0]
        }
    }
}