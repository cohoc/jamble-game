
/** 
 * Timer counts down and updates for minigames
 * 
 * 
**/

export default class Timer{
    constructor(){
        this.displayElement = null;
        this.tickrate = 1000;
        this.endTime = null;
        this.currentTime = null;
        this.interval = null;
        this.onTimerEnd = null;
    }

    createDisplay(){

        const svgNS = "http://www.w3.org/2000/svg";

        this.svg = document.createElementNS(svgNS, "svg");
        this.svg.setAttribute("width", "80px");
        this.svg.setAttribute("height", "80px");
        this.svg.setAttribute("viewBox", "0 0 80 80");
        this.svg.classList.add("timer-svg")
        this.svg.style.position = "absolute"
        this.svg.style.top = "50%"
        this.svg.style.left = "50%"
        this.svg.style.transform = "translate(-50%, -50%)"
        this.svg.style.background = "var(--dark-gray)"
        this.svg.style.borderRadius = "50%"
 
        this.defs = document.createElementNS(svgNS, "defs")
        this.mask = document.createElementNS(svgNS, "mask")
        this.mask.setAttribute("id", "timerMask");

        this.maskBg = document.createElementNS(svgNS, "rect")
        this.maskBg.setAttribute("width", "80px");
        this.maskBg.setAttribute("height", "80px");
        this.maskBg.setAttribute("fill", "white");

        this.maskPath = document.createElementNS(svgNS, "path");
        this.maskPath.setAttribute("fill", "black");

        this.mask.appendChild(this.maskBg);
        this.mask.appendChild(this.maskPath);
        this.defs.appendChild(this.mask)

        this.bgCircle = document.createElementNS(svgNS, "circle");
        this.bgCircle.setAttribute("cx", "40");
        this.bgCircle.setAttribute("cy", "40");
        this.bgCircle.setAttribute("r", "36");
        this.bgCircle.setAttribute("fill", "#6BB464");
        this.bgCircle.setAttribute("mask", "url(#timerMask)")

        this.svg.appendChild(this.defs);
        this.svg.appendChild(this.bgCircle);
        this.displayElement.appendChild(this.svg);
    }

    updateMask(){
        const elapsedTime = this.endTime - this.currentTime;
        const progress = elapsedTime / this.endTime;
        const angle = Math.max(progress * 360, -1)

        const radius = 40, cx = 40, cy = 40;
        const radians = (angle - 90) * (Math.PI / 180)
        const x = cx + radius * Math.cos(radians);
        const y = cy + radius * Math.sin(radians);
        const largeArc = angle > 180 ? 1 : 0;
    
        let pathData;
        if(angle < 360){
            pathData = `
                M ${cx} ${cy}
                L ${cx} 0
                A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}
                L ${cx} ${cy} Z
            `;
        }
        else{
            pathData = `
                M 0 0 H 80 V 80 H 0 Z
            `;
        }
        this.maskPath.setAttribute("d", pathData)
    }

    setContainer(containerElemenet){
        this.displayElement = containerElemenet;
        this.createDisplay();
    }

    setTimer(endTime){
        this.endTime = endTime;
        this.currentTime = endTime;
    }

    setTimerCallback(callback){
        this.onTimerEnd = callback;
    }

    startTimer(){
        console.log("timer starting ...")
        this.updateMask();
        this.interval = setInterval(() => {
            this.currentTime -= this.tickrate;
            this.updateMask();

            if(this.currentTime <= 0){
                this.onTimerEnd();
                this.stopTimer();
            }
        }, this.tickrate)
    }

    stopTimer(){
        clearInterval(this.interval);
        this.displayElement = null;
        this.endTime = null;
        this.currentTime = null;
        this.interval = null;
        this.onTimerEnd = null;
        //this.bgCircle.setAttribute("fill", "");
        //this.maskBg.setAttribute("fill", "");
    }

    updateDisplay(){
        this.timerDiv.innerText = this.time;
    }
}