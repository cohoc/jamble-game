import path from "path";
import fs from "fs";
import axios from "axios";
import { __dirname } from "./config.js";
import { words } from "./data/words.js";
import { pathToFileURL } from "url";
import { results } from "./data/results.js";

let index = 0;
const filtered = [];
const updated = [];

const filtered_path = path.join(__dirname, "filtered.js");
const unfiltered_path = path.join(__dirname, "unfiltered.js");
const result_path = path.join(__dirname, "results.js");

const url = "https://api.dictionaryapi.dev/api/v2/entries/en";


function init(){
    const target = path.join(__dirname, "target.js");
    const exists = fs.existsSync(target);
    if(exists){
       replaceWords(target); 
    }
    else{
        console.log("Creating a filtered dataset ...")
    }
}

async function filterWords(){
    results.forEach((item) => {
        let wordlen = item.definition.trim().split(/\s+/).length;
        if(wordlen < 4){
            filtered.push(item); 
        }
    })
    fs.writeFileSync(unfiltered_path, JSON.stringify(filtered, null, 4), "utf-8");
}

async function processWords(){
    try{
        if(index < filtered.length){
            let current = filtered[index++];
            let response = await axios.get(`${url}/${current.word}`);
            let meaning = response.data[0].meanings;
            let word = meaning.find((element) => element.partOfSpeech == current.type);
            let {
                partOfSpeech: type,
                definitions: [{definition}]
            } = word;

            let wordobj = {
                word: current.word,
                type: type,
                definition: definition
            }
            updated.push(wordobj);
            fs.writeFileSync(filtered_path, JSON.stringify(updated, null, 4), "utf-8");
        }
        else{
            console.log("end of array");
            process.exit(1);
        }
    }
    catch(error){
        console.log("Error processing word: ",filtered[index], "error message: ", error.message);
    }
    setTimeout(processWords, 5000);
}

async function replaceWords(targetpath){
    console.log("time to start replacing");
    let targetarr = await getTarget(targetpath);
    let filterarr = await getFiltered();
    filterarr.forEach( (element) => {  
        index = targetarr.findIndex(item => item.word === element.word); 
        targetarr[index] = element;
    })
    fs.writeFileSync(result_path, JSON.stringify(targetarr, null, 4), "utf-8");
}

async function getTarget(targetpath){
    let fileurl = pathToFileURL(targetpath).href;
    let { datatarget } = await import(fileurl);
    let targetarr = [...datatarget];
    return targetarr;
}

async function getFiltered(){
    let fileurl = pathToFileURL(filtered_path).href;
    let { datafilter } = await import(fileurl);
    let filterarr = [...datafilter]
    return filterarr;
}

//await filterWords();
//setTimeout(processWords, 5000);
//init();


