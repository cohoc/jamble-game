export default class MiniGameRegistry{
    constructor(){
        this.template = null;
    }

    getTemplate(gametype, data){

        const minigame = {
            "matching": () => this.renderMatchingGame(data),
            "quiz": () => this.renderQuizGame(data),
            "typing": () => this.renderTypingGame(data)
        }
        
        return minigame[gametype]?.();
    }

    renderMatchingGame({words, definitions}){

        let html = `
            <section class="game__alert">
                <div class="game__screen">
                    <section class="game__matching" data-game="matching">
                        <ul class="matching__list-def">
                            ${
                                definitions.map((def, index) => 
                                    `<li class="matching__list-item inter">
                                        <p>
                                            <span>${index + 1}. </span>
                                            ${def}                                
                                        </p>
                                        <div class="matching__dragend"
                                            data-droppable="true"
                                            data-def="${def}"
                                        >
                                        </div>
                                    </li>`
                                ).join('')
                            }
                        </ul>
    
                        <ul class="matching__list-words">
                            ${
                                words.map(word => 
                                    `<li class="matching__list-item question-input indie"
                                        data-draggable="true"
                                        data-word="${word}"
                                    >
                                        ${word}                                  
                                    </li>`
                                ).join('')
                            }
                        </ul>
    
                        <div class="game__submit">
                            <button class="clear__button button--game button--matching" type="button">
                                Clear
                            </button>
                            <button class="submit__button button--game button--matching" type="submit">
                                Submit
                            </button>
                        </div>
                    </section>  
                </div>
            </section>
        `
        return (html);
    }

    renderQuizGame({correct, choices}){

        let html = `
            <section class="game__alert">
                <div class="game__screen">
                    <div class="game__quiz" data-game="vocab-quiz">
                        <div class="game__prompt">
                            
                            <p class="game__quiz-definition indie typing--responsive" data-def="${correct.definition}">
                                <b class="inter">
                                    ${correct.type}.
                                </b>
                                ${correct.definition}
                            </p>
                        </div>
                        <ul class="game__quiz-list">
                            <li class="game__word">
                                <input class="question-input indie" 
                                    type="button" 
                                    data-choice="a" 
                                    data-word="${choices[0]}"
                                    value="a. ${choices[0]}"
                                />
                            </li>

                            <li class="game__word">
                                <input class="question-input indie" 
                                    type="button" 
                                    data-choice="b" 
                                    data-word="${choices[1]}"
                                    value="b. ${choices[1]}"
                                />      
                            </li>

                            <li class="game__word">
                                <input class="question-input indie" 
                                    type="button" 
                                    data-choice="c" 
                                    data-word="${choices[2]}" 
                                    value="c. ${choices[2]}"
                                />
                            </li>

                            <li class="game__word">
                                <input class="question-input indie" 
                                    type="button" 
                                    data-choice="d" 
                                    data-word="${choices[3]}" 
                                    value="d. ${choices[3]}"
                                />
                            </li>
                        </ul>
                        <div class="game__submit">
                            <button class="submit__button" type="submit">
                                Submit
                            </button>
                        </div>
                    </div
                </div>
            </section>
        `
        return (html);
    }

    renderTypingGame({definition, type, letter}){

        let html = `
            <section class="game__alert">
                <div class="game__screen">
                    <section class="game__typing" data-game="typing">
                        <div class="game__typing-definition ">
                            <p class="indie typing--responsive">
                                <b class="inter">
                                    ${type}.
                                </b>
                                ${definition}
                            </p>
                        </div>

                        <div class="timer-container" class="inter">
                            <div class="timer-progress">
                            </div>
                        </div>

                        <div class="game__typing-word">
                            <input 
                                class="typing-input inter typing--responsive"
                                type="text"
                                tabindex=1
                                placeholder="Starts with ${letter.toUpperCase()}"
                                value=""
                                >
                        
                            </input>
                        </div>
                    </section
                </div>
            </section>
        `
        return (html);
    }
}