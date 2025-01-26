import { words } from "../backend/data/words";

const wordset = new Set();

export const getWords = () => {
    
    while(wordset.size < 49){
        let index = Math.floor(Math.random() * words.length);
        wordset.add(index);
    }
    return wordset; 
}

export const getRandomWords = () => {
    let randomset = new Set();
    while(randomset.size < 3){
        let index = Math.floor(Math.random() * words.length);
        randomset.add(words[index]);
    }
    return randomset;
}

export const getMatching = () => {
    let randomset = new Set();
    while(randomset.size < 4){
        let index = Math.floor(Math.random() * words.length);
        randomset.add(words[index]);
    }
    return randomset;
}