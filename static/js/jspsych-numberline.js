var jsPsychNumberline = (function (jspsych) {
    'use strict';

    const info = {
        name: "numberline",
        parameters: {
        }
    }


    class NumberlinePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {

            display_element.innerHTML = `
            <div id="beginning-message" class="message-container"></div>
                <div class="line-pair-container"></div>
                <div class="button-message-container">
                    <div id="incomplete-message" class="message-container"></div>
                    <button id="numberlineButton"></button>    
                </div>
            `;

            $(".jspsych-content-wrapper").css("display", "block");

            const linePairContainer = document.querySelector(".line-pair-container");
            const beginningMessage = $('#beginning-message');
            const numberlineButton = $("#numberlineButton");
            const winningNum = winningNums[mainTrialsCompleted];
            const rememberNote = "<p>Remember, the winning number is already chosen, so your choice only affects what information you learn ahead of the memory game about the outcome; it does not affect the outcome itself.</p>";


            function createInstructionsEarlyTrials(){

                beginningMessage.html(`<p>The balls represent the ${numOfWheelNumbers} numbers from the wheel. We\'re going to tell you now whether the winning number is one of the numbers on the top or bottom line. We\'ll then tell you exactly what the winning number was after the upcoming memory game.</p>`);
                numberlineButton.html("Reveal bar with winning number");

                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted];
                const linePairAndBarWithWinningNum = createLinePair("only", wheelNumbersSplit);
                const barWithWinningNumber = linePairAndBarWithWinningNum[1];

                function firstClickFunction(){
                    
                    numberlineButton.off("click");

                    // $("#line-wrapper-top").animate({opacity: 0}, 1000);
                    const barNotWithWinningNumber = ["top", "bottom"].filter(x => ![barWithWinningNumber].includes(x));
                    $(`.dot-${barNotWithWinningNumber}-only`).animate({opacity: 0}, 1000);

                    let numsRemaining;
                    console.log(barWithWinningNumber)
                    console.log(wheelNumbersSplit)
                    if (barWithWinningNumber == "top"){
                        numsRemaining = wheelNumbersSplit[0]
                    } else if (barWithWinningNumber == "bottom"){
                        numsRemaining = wheelNumbersSplit[1]
                    }

                    setTimeout(function() {
                        const numsOnBarWithWinningNumber = document.querySelectorAll(`.dot-${barWithWinningNumber}-only`).length;
                        beginningMessage.html(`<p>The winning number is one of the ${numsRemaining.length} numbers on the ${barWithWinningNumber} line.</p><br><br><br>`);
                        // beginningMessage.html(`<p>The balls represent the ${numOfWheelNumbers} numbers from the wheel. We\'re going to tell you now whether the winning number is one of the numbers from the top or bottom. We\'ll then tell you exactly what the winning number was after the upcoming memory game.</p>`);
                    }, 1);
                    //   }, 2000);

                    setTimeout(function() {
                        numberlineButton.on("click", secondClickFunction);
                        numberlineButton.html("Continue to memory game");
                    }, 1)
                    // }, 5000)
                }

                function secondClickFunction(){
                    jsPsych.finishTrial({
                        // selectedNums: selectedNums,
                        winningNum: winningNum,
                        wheelNumbersSplit: wheelNumbersSplit,
                        // topOrBottom: topOrBottom,
                    })
                }

                setTimeout(function() {
                    numberlineButton.on("click", firstClickFunction);
                }, 1);
                // }, 7000);

            }

            function createInstructionsForFirstChoice(nextStage){         
                
                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted - 1];
                let linePairAndBarWithWinningNum;

                beginningMessage.html(`<p>In previous trials, at this point we would show you a pair of horizontal lines, and you would see whether the winning number is on the top or bottom line. <span style='color: white'>You had no ability to choose which numbers were on which line, and hence, what you would learn about the winning number prior to playing the memory game.</span></p>`);
                numberlineButton.html("Continue");

                if (choiceType == "multiple_choice"){
                    // setTimeout(function() {
                    //     numberlineButton.on("click", secondClickFunction);
                    // }, 5000);
                    beginningMessage.specificallyNote = `<p>Specifically, we\'ll present two pairs, instead of one pair, of horizontal lines. You can then choose whether you prefer the top split or the bottom split.</p>`;
                    beginningMessage.beginNowInstructions = `<p>Click one of these two pairs now, and click the button below to submit your choice. We\'ll tell you whether the winning number is on the top or bottom of that pair.</p>`
                } else if (choiceType == "open_ended"){
                    beginningMessage.specificallyNote = `<p>Specifically, you have to click which numbers you would like on each line. When you are finished, all ${numOfWheelNumbers} numbers should appear on one of the two lines.</p>`;
                    beginningMessage.beginNowInstructions = `<p>Now, click the balls to assign them to a line. You can also drag your mouse to select several more quickly than clicking one by one, if you prefer.</p>`
                }

                function firstClickFunction(){

                    numberlineButton.off("click");
                    setTimeout(function() {
                        numberlineButton.on("click", secondClickFunction);
                    }, 1);
                    // }, 5000);

                    linePairAndBarWithWinningNum = createLinePair("only", wheelNumbersSplit);

                }

                function secondClickFunction(){

                    numberlineButton.off("click");
                    setTimeout(function() {
                        numberlineButton.on("click", thirdClickFunction);
                    }, 1);
                    // }, 5000);

                    beginningMessage.html(`<p>In previous trials, at this point we would show you a pair of horizontal lines, and you would see whether the winning number is on the top or bottom line. You had no ability to choose which numbers were on which line, and hence, what you would learn about the winning number prior to playing the memory game.</p>`);

                }

                function thirdClickFunction(){
                    numberlineButton.off("click");
                    const oldLinePair = linePairAndBarWithWinningNum[0];
                    oldLinePair.remove();
                    beginningMessage.html(`<p>This time it\'ll work a little differently. Now, you can choose how the ${numOfWheelNumbers} numbers are split between the two lines.</p>`);
                    setTimeout(function() {
                        numberlineButton.on("click", fourthClickFunction);
                    }, 1);
                    // }, 5000);
                }

                function fourthClickFunction(){

                    numberlineButton.off("click");
                    beginningMessage.html(beginningMessage.specificallyNote);
                    setTimeout(function() {
                        console.log("spawn")
                        numberlineButton.on("click", fifthClickFunction);
                    }, 1);
                    // }, 5000);

                }

                function fifthClickFunction(){

                    numberlineButton.off("click");
                    beginningMessage.html(`${beginningMessage.specificallyNote}<br>${rememberNote}`);

                    setTimeout(function() {
                        numberlineButton.on("click", nextStage);
                    }, 1);

                }

                setTimeout(function() {
                    numberlineButton.on("click", firstClickFunction);
                }, 1)
                // }, 7000)
            }

            function openEndedQuestion(){

                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted];
                const linePairAndBarWithWinningNum = createLinePair("only", wheelNumbersSplit, "bw");
                let numsOnBarWithWinningNumber;
                setupDotClicking(linePairAndBarWithWinningNum[0]);
                $('.line-wrapper').css("cursor", "pointer");

                // setTimeout(function() {
                    numberlineButton.off("click");
                    numberlineButton.on("click", firstClickFunction);
                // }, 5000);

                beginningMessage.html(`${beginningMessage.specificallyNote}${rememberNote}${beginningMessage.beginNowInstructions}`)

                function firstClickFunction(){

                    if (document.querySelectorAll('.selected').length == numOfWheelNumbers){
                        numberlineButton.off("click");
                        $('.line-wrapper').off();
                        
                        $('#incomplete-message').html("");
    
    
                        const barWithWinningNumber = linePairAndBarWithWinningNum[1];
                        const barNotWithWinningNumber = ["top", "bottom"].filter(x => ![barWithWinningNumber].includes(x));
                        $(`.dot-${barNotWithWinningNumber}-only`).animate({opacity: 0}, 1000);
                        // $(`.dot-${barNotWithWinningNumber}-only.selected`).animate({opacity: 0}, 1000);
                        // $(`.select`).not(`.dot-${barNotWithWinningNumber}-only`)
                        $(`.dot-${barWithWinningNumber}-only:not([class*="selected"])`).animate({opacity: 0}, 1000);
                        numsOnBarWithWinningNumber = document.querySelectorAll(`.dot-${barWithWinningNumber}-only.selected`).length;
    
                        beginningMessage.html(`<p>The winning number is one of the ${numsOnBarWithWinningNumber} numbers on the ${barWithWinningNumber} line.</p><br><br><br><br><br><br><br><br>`);
                        numberlineButton.html("Continue to the memory game");
                        numberlineButton.on("click", secondClickFunction);
                    } else {
                        $('#incomplete-message').html("Please select one of each number");
                    }
                }

                function secondClickFunction(){
                    jsPsych.finishTrial({
                        winningNum: winningNum,
                        wheelNumbersSplit: wheelNumbersSplit,
                        selections: numsOnBarWithWinningNumber,
                    })
                }
            }

            function multipleChoiceQuestion(){
                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted];
                const linePairAndBarWithWinningNumTop = createLinePair("top", wheelNumbersSplit[0]);
                const linePairAndBarWithWinningNumBottom = createLinePair("bottom", wheelNumbersSplit[1]);
                setupPairClicking(linePairAndBarWithWinningNumTop[0]);
                setupPairClicking(linePairAndBarWithWinningNumBottom[0]);
                $('.line-wrapper').css("cursor", "pointer");

                let topOrBottomSelected;
                
                beginningMessage.html(`${beginningMessage.specificallyNote}${rememberNote}${beginningMessage.beginNowInstructions}`)

                // setTimeout(function() {
                    // if (document.querySelectorAll('.selected').length == 1){
                        // console.log("tokyo")
                        numberlineButton.off("click");
                        numberlineButton.on("click", firstClickFunction);
                    // } else {

                    // }
                // }, 5000);

                function firstClickFunction(){


                    if (document.querySelectorAll('.selected').length == 1){

                        const selectedID = document.querySelectorAll('.selected')[0].id
                        const lastHyphenIndex = selectedID.lastIndexOf('-');
                        topOrBottomSelected = selectedID.substring(lastHyphenIndex + 1);
                        
                        numberlineButton.off("click");
                        $('#incomplete-message').html("");

                        let linePairID = $('.selected').first().attr('id');
                        let linePairAndBarWithWinningNum;
                        let linePairAndBarNotWithWinningNum;
                        let pairPosition;

                        if (linePairID == "line-pair-top"){
                            pairPosition = "top"
                            linePairAndBarWithWinningNum = linePairAndBarWithWinningNumTop;
                            linePairAndBarNotWithWinningNum = linePairAndBarWithWinningNumBottom;
                        } else if (linePairID == "line-pair-bottom"){
                            pairPosition = "bottom"
                            linePairAndBarWithWinningNum = linePairAndBarWithWinningNumBottom;
                            linePairAndBarNotWithWinningNum = linePairAndBarWithWinningNumTop;
                        }

                        $(linePairAndBarNotWithWinningNum[0]).animate({opacity: 0}, 1000);
                        // $(`#${linePairAndBarNotWithWinningNum}`).animate({opacity: 0}, 1000);

                        // console.log(winningNum)

                        setTimeout(function(){

                            // let numsOnBarWithWinningNumber
                            // if ()
                            
                            // console.log("hello")
                            // console.log(linePairAndBarWithWinningNum)
                            // const barWithWinningNumber = linePairAndBarWithWinningNum[1];
                            const barNotWithWinningNumber = ["top", "bottom"].filter(x => ![linePairAndBarWithWinningNum[1]].includes(x));
                            $(`.dot-${barNotWithWinningNumber}-${pairPosition}`).animate({opacity: 0}, 1000);
                            // console.log(linePairAndBarWithWinningNum)
                            // console.log(pairPosition)
                            let numsRemaining = document.querySelectorAll(`.dot-${linePairAndBarWithWinningNum[1]}-${pairPosition}`).length
        
                            beginningMessage.html(`The winning number is one of the ${numsRemaining} numbers on the ${linePairAndBarWithWinningNum[1]} line.<br><br><br><br><br><br><br><br><br>`);
                            numberlineButton.html("Continue to the memory game");
                            numberlineButton.on("click", secondClickFunction);
                            // end trial should go here
                        }, 3000)


                    } else {
                        // numberlineButton.on("click", function(event){
                            // console.log("tomajo")
                            $('#incomplete-message').html("Please make a selection");
                        // });
                    }

                    // $('.myClass')
                    // document.querySelectorAll('.selected')

                    // const linePairAndBarWithWinningNum = createLinePair(2);
                    // const newLinePair = linePairAndBarWithWinningNum[0];
                    // const barWithWinningNumber = linePairAndBarWithWinningNum[1];

                    // if (createLinePair)
                    // detect if one of the lines is selected
                    // when line is detected, figure out whether it's the top or bottom line

                    // document.querySelectorAll('.selected')


                }

                function secondClickFunction(){
                    jsPsych.finishTrial({
                        // selectedNums: selectedNums,
                        winningNum: winningNum,
                        wheelNumbersSplit: wheelNumbersSplit,
                        selection: topOrBottomSelected
                        // topOrBottom: topOrBottom,
                    })
                }
            }

            function createLinePair(position, wheelNumbersSplit, ballColor="color"){

                const linePair = document.createElement("div");
                linePair.setAttribute("id", `line-pair-${position}`);
                linePair.classList.add("line-pair");
                let barWithWinningNumber;

                ["top", "bottom"].forEach(function(topOrBottom, index) {

                    const wrapper = document.createElement("div");
                    wrapper.setAttribute("id", `line-wrapper-${topOrBottom}`);
                    wrapper.classList.add("line-wrapper");
                    const line = document.createElement("div");
                    line.classList.add("line", `line-${topOrBottom}`);
                    wrapper.appendChild(line);
        
                    linePair.appendChild(wrapper);
                    
                    const numbersOnLine = wheelNumbersSplit[index];

                    wheelNumbers.forEach((wheelNumber, i) => {

                        if (numbersOnLine.includes(wheelNumber)){
                            const dot = document.createElement("div");
                            dot.classList.add("dot", `dot-${topOrBottom}`, `dot-${topOrBottom}-${position}`);
                            dot.style.left = `${((i + 1) * 100) / (numOfWheelNumbers + 2)}%`;
    
                            const nmbr = document.createElement("span");
    
                            let dotBackgroundColor;
                            let dotTextColor;
    
                            if (ballColor == "color") {
                                dotTextColor = "white";
                                if (topOrBottom == "top"){
                                    dotBackgroundColor = "royalblue";
                                } else if (topOrBottom == "bottom"){
                                    dotBackgroundColor = "coral";
                                }    
                            }
    
                            nmbr.style.color = dotTextColor;
                            dot.style.backgroundColor = dotBackgroundColor;
    
                            nmbr.textContent = wheelNumber;
                            dot.appendChild(nmbr);
                            
                            dot.dataset.index = wheelNumber;
    
                            if (wheelNumber == winningNum){
                                barWithWinningNumber = topOrBottom;
                            }
                            line.appendChild(dot);
                        }
                    });

                });
    
                linePairContainer.appendChild(linePair);

                if (position == "only"){
                    $(".line-pair").not(".selected").css("border-color", "white")
                } else {
                    $(".line-pair").not(".selected").css("border-color", "#dbdbdb85");
                }


                return [linePair, barWithWinningNumber];
            }

            function setupDotClicking(linePair) {

                let isMouseDown = false;
                let lastChangedDot = null;

                function getClosestDot(line, x, y) {

                    let closestDot = null;
                    let minDistance = Number.MAX_VALUE;

                    line.querySelectorAll(".dot").forEach(dot => {
                        const dotRect = dot.getBoundingClientRect();
                        const centerX = dotRect.x + dotRect.width / 2;
                        const centerY = dotRect.y + dotRect.height / 2;
                        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                        const threshold = 40;

                        if (distance < threshold && distance < minDistance) {
                            minDistance = distance;
                            closestDot = dot;
                        }
                    });

                    return closestDot;
                }

                function handleDotClick(dot, linePair) {
                    if (!dot || dot === lastChangedDot) return;

                    const index = dot.dataset.index;
                    const topDot = linePair.querySelector(`.line-top .dot[data-index="${index}"]`);
                    const bottomDot = linePair.querySelector(`.line-bottom .dot[data-index="${index}"]`);

                    if (dot.parentElement.classList.contains("line-top")) {
                        topDot.classList.add('selected');
                        topDot.classList.remove('opaque');
                        bottomDot.classList.remove('selected');
                        bottomDot.classList.add('opaque');
                        console.log(bottomDot)
                    } else {
                        bottomDot.classList.add('selected');
                        bottomDot.classList.remove('opaque');
                        topDot.classList.remove('selected');
                        topDot.classList.add('opaque');
                        console.log(bottomDot)
                    }

                    lastChangedDot = dot;
                }

                function handleMouseDown(e, linePair) {
                    e.preventDefault();
                    isMouseDown = true;
                    lastChangedDot = null;
                    const line = e.target.closest(".line-wrapper");
                    const closestDot = getClosestDot(line, e.clientX, e.clientY);
                    if (closestDot) {
                        handleDotClick(closestDot, linePair);
                    }
                }

                function handleMouseUp(e) {
                    isMouseDown = false;
                    lastChangedDot = null;
                }

                function handleMouseMove(e) {
                    e.preventDefault();
                    if (!isMouseDown) return;

                    const line = e.target.closest(".line-wrapper");
                    const closestDot = getClosestDot(line, e.clientX, e.clientY);
                    if (closestDot) {
                        handleDotClick(closestDot, linePair);
                    }
                }

                const lineWrappers = document.querySelectorAll('.line-wrapper');

                lineWrappers.forEach(function(lineWrapper) {

                    $(lineWrapper).on('mousedown', (e) => {
                        handleMouseDown(e, linePair);
                    })

                    $(lineWrapper).on("mouseup", handleMouseUp);
                    $(lineWrapper).on("mousemove", handleMouseMove);
                });

                return linePair;
            }

            function setupPairClicking(linePair){
                $(linePair).on("click", function(){

                    // Remove the 'selected' class from all line pairs
                    document.querySelectorAll(".line-pair.selected").forEach((selectedPair) => {
                        selectedPair.classList.remove("selected");
                    });

                    // Add the 'selected' class to the clicked line pair
                    linePair.classList.add("selected");

                });
            }
    
            function updateLinePairs(){

                if (mainTrialsCompleted < trialsWithoutChoice){
                    createInstructionsEarlyTrials();
                } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "open_ended"){
                    createInstructionsForFirstChoice(openEndedQuestion);
                } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "multiple_choice"){
                    createInstructionsForFirstChoice(multipleChoiceQuestion);
                } else if (mainTrialsCompleted > trialsWithoutChoice && choiceType == "multiple_choice"){
                    beginningMessage.html(`Once again, choose which of the sets of pairs of numbers to work with. When you make your choice, we\'ll then tell you whether the winning number is on the top line or bottom line of the set you chose.<br>${rememberNote}`);
                    multipleChoiceQuestion();
                }
            }

            updateLinePairs();
        }
    }
    NumberlinePlugin.info = info;

    return NumberlinePlugin;

})(jsPsychModule);
