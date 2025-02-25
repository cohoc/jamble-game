import { getMatching } from "../utils/getWords";

export default class MatchingGame{

    #correct;
    constructor(player, tile){
        this.player = player;
        this.tile = tile;
        this.words = this.setMatchingWords();
        this.#correct = this.setCorrectWords(this.words);
        this.shuffled = this.setShuffled(this.words);
    }

    getCorrect(){
        return this.#correct;
    }

    getWords(){
        return this.words;
    }

    setMatchingWords(){
        return Array.from(getMatching());
    }

    setCorrectWords(words){
        return Object.fromEntries(words.map(item => [item.word, item.definition]));
    }

    setShuffled(words){
        let shuffledwords = words.map(item => item.word).sort(() => Math.random() - .5)
        let shuffledef = words.map(item => item.definition).sort(() => Math.random() - .5)
        //console.log(shuffled)
        return {
            "words": shuffledwords,
            "definitions": shuffledef
        }
    }

    getMiniGameData(){
        return { type: "matching", data: this.shuffled};
    }

    validateSelection(userPairings){
        let isCorrect;
        let wrongPairings = {};
        let correctPairings = this.getCorrect()
        Object.entries(userPairings).forEach(([word, definition]) => {
            if(correctPairings[word] !== definition){
                wrongPairings = {...wrongPairings, ...{[word]: definition}}
            }
        })
        isCorrect = (Object.keys(wrongPairings).length > 0 ? false : true)
        return {
            "gametype": "matching",
            isCorrect,
            wrongPairings,
        };
    }
}