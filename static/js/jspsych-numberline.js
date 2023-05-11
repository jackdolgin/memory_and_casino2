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
            let barWithWinningNumber;

            // function hideDots(){
            //     ["top", "bottom"].forEach(function(topOrBottom, index) {

            //         let numbersOnLine = wheelNumbersSplit[index];
            //         let numbersToRemove = wheelNumbers.filter(x => !numbersOnLine.includes(x));

            //         wheelNumbers.map(function(wheelNumber){

            //             if (wheelNumber == winningNum){
            //                 barWithWinningNumber = topOrBottom;
            //             }

            //             let dotDiv = document.querySelector(`.line-${topOrBottom} .dot[data-index="${wheelNumber}"]`);
            //             dotDiv.style.opacity = 1;
            //             if (numbersToRemove.includes(wheelNumber)){
            //                 dotDiv.style.opacity = 0;
            //             }
            //         });
            //     });
            // }

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

            // function createInstructionsForFirstChoice(oldLinePair, createLinePair, numLinePairs, callback){
                beginningMessage.html(`<p>In previous trials, at this point we would show you a pair of horizontal lines, and you would see whether the winning number is on the top or bottom line. <span style='color: white'>You had no ability to choose which numbers were on which line, and hence, what you would learn about the winning number prior to playing the memory game.</span></p>`);
                numberlineButton.html("Continue");
                let specificallyNote;
                let beginNowInstructions;

                if (choiceType == "multiple_choice"){
                    // setTimeout(function() {
                    //     numberlineButton.on("click", secondClickFunction);
                    // }, 5000);
                    beginningMessage.specificallyNote = `<p>Specifically, we\'ll present two pairs, instead of one pair, of horizontal lines. You can then choose whether you prefer the top split or the bottom split.</p>`;
                    beginningMessage.beginNowInstructions = `<p>Click one of these two pairs now, and then click the button below to submit your choice. We\'ll tell you whether the winning number is on the top or bottom of that pair.</p>`
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

                    // beginningMessage.html(`<p>In previous trials, at this point we would show you a pair of horizontal lines, and you would see whether the winning number is on the top or bottom line. You had no ability to choose which numbers were on which line, and hence, what you would learn about the winning number prior to playing the memory game.</p>`);

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
                    console.log("john")

                    numberlineButton.off("click");
                    beginningMessage.html(`${beginningMessage.specificallyNote}<br>${rememberNote}`);

                    setTimeout(function() {
                        numberlineButton.on("click", nextStage);
                        // create the numberline
                        // change display of button
                        // add listeners
                    }, 1);

                    // numberlineButton.off("click");

                    // const linePairAndBarWithWinningNum = createLinePair("only");
                    // const newLinePair = linePairAndBarWithWinningNum[0];
                    // const barWithWinningNumber = linePairAndBarWithWinningNum[1];
                    // // createInstructionsForFirstChoice(newLinePair, createLinePair, 1, setupDotClicking);

                    // callback(newLinePair);

                    // setTimeout(function() {
                    //     numberlineButton.on("click", fifthClickFunction);
                    //     // create the numberline
                    //     // change display of button
                    //     // add listeners
                    // }, 1);
                    // // }, 5000);

                }

                // function fifthClickFunction(){
                //     // $("#line-wrapper-top").animate({opacity: 0}, 1000);
                //     const barNotWithWinningNumber = ["top", "bottom"].filter(x => ![barWithWinningNumber].includes(x));
                //     $(`.dot-${barNotWithWinningNumber}-only`).animate({opacity: 0}, 1000);
                // }

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

                // setTimeout(function() {
                    numberlineButton.off("click");
                    numberlineButton.on("click", firstClickFunction);
                // }, 5000);

                beginningMessage.html(`${beginningMessage.specificallyNote}${rememberNote}${beginningMessage.beginNowInstructions}`)

                function firstClickFunction(){

                    console.log("joe")

                    if (document.querySelectorAll('.selected').length == numOfWheelNumbers){
                        // console.log("toe")
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
                        // selectedNums: selectedNums,
                        winningNum: winningNum,
                        wheelNumbersSplit: wheelNumbersSplit,
                        selections: numsOnBarWithWinningNumber,
                        // topOrBottom: topOrBottom,
                    })
                }
            }

            function multipleChoiceQuestion(){
                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted];
                const linePairAndBarWithWinningNumTop = createLinePair("top", wheelNumbersSplit[0]);
                const linePairAndBarWithWinningNumBottom = createLinePair("bottom", wheelNumbersSplit[1]);
                setupPairClicking(linePairAndBarWithWinningNumTop[0]);
                setupPairClicking(linePairAndBarWithWinningNumBottom[0]);

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


                        // .line-pair {
                        //     border-color: #dbdbdb85;
                        // }
                        
                        // .line-pair:not(.selected) {
                        //     border-color: #ffffff;
                        // }
                        $(".jspsych-content-wrapper").css("display", "block");
                        
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
        
                            beginningMessage.html(`The winning number is one of the ${numsRemaining} numbers on the ${linePairAndBarWithWinningNum[1]} line.<br><br><br><br><br><br>`);
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

            // if (true){
            // // // if (mainTrialsCompleted < trialsWithoutChoice){

            // //     // let topNumbers = wheelNumbersSplit[0];
            // //     // topNumbersToRemove = wheelNumbers.filter(x => !topNumbers.includes(x));
            // //     // let bottomNumbers = wheelNumbersSplit[1];
            // //     // bottomNumbersToRemove = wheelNumbers.filter(x => !bottomNumbers.includes(x));

            // //     // document.querySelector(`.line-top .dot[data-index="4"]`);
            // //     // document.querySelector(`.line-top .dot[data-index="4"]`);
                
            // //     beginningMessage.html(`<p>The balls represent the ${numOfWheelNumbers} numbers from the wheel. We\'re going to tell you now whether the winning number is one of the numbers from the top or bottom. We\'ll then tell you exactly what the winning number was after the upcoming memory game.</p>`);
            // //     numberlineButton.html("Reveal bar with winning number");

            // //     function firstClickFunction(){
                    
            // //         numberlineButton.off("click");

            // //         // $("#line-wrapper-top").animate({opacity: 0}, 1000);
            // //         $(".dot-top").animate({opacity: 0}, 1000);

            // //         setTimeout(function() {
            // //             beginningMessage.html("<p>The winning number is one of the ___ numbers on the bottom.</p>");
            // //             // beginningMessage.html(`<p>The balls represent the ${numOfWheelNumbers} numbers from the wheel. We\'re going to tell you now whether the winning number is one of the numbers from the top or bottom. We\'ll then tell you exactly what the winning number was after the upcoming memory game.</p>`);
            // //           }, 2000);

            // //         setTimeout(function() {
            // //             numberlineButton.on("click", secondClickFunction);
            // //             numberlineButton.html("Continue to memory game");
            // //         }, 5000)
            // //     }

            // //     function secondClickFunction(){

            // //     }

            // //     setTimeout(function() {
            // //         numberlineButton.on("click", firstClickFunction);
            // //     }, 7000)

            // } else if (true){
            // // } else if (mainTrialsCompleted == trialsWithoutChoice){
            //     beginningMessage.html(`<p>In previous trials, at this point we would show you two lines, and you would see whether the winning number is on the top or bottom. You had no ability to choose which numbers were on which line, and hence, what you would learn about the winning number prior to playing the memory game.</p>`);
            //     numberlineButton.html("Continue");

            //     function firstClickFunction(){
            //         numberlineButton.off("click");
            //         beginningMessage.html(`<p>This time it\'ll work a little differently. Now, you can choose how the ${numOfWheelNumbers} numbers are split between the two lines.</p>`);
            //         setTimeout(function() {
            //             numberlineButton.on("click", secondClickFunction);
            //         }, 5000);
            //     }

            //     function secondClickFunction(){
            //         numberlineButton.off("click");
            //         beginningMessage.html("<p>Specifically, we\'ll present two sets of horizontal lines. You can then choose whether you prefer the top split or the bottom split.</p>");
            //         setTimeout(function() {
            //             numberlineButton.on("click", thirdClickFunction);
            //         }, 5000);
            //     }

            //     function thirdClickFunction(){
            //         numberlineButton.off("click");
            //         beginningMessage.html(`<p>Specifically, we\'ll present two sets of horizontal lines. You can then choose whether you prefer the top split or the bottom split.<br><br>Remember, the winning number is already chosen, so your choice only affects what information you learn ahead of the memory game about the outcome; it does not affect the outcome itself.</p>`);
            //         setTimeout(function() {
            //             numberlineButton.on("click", fourthClickFunction);
            //         }, 5000);
            //     }

            //     function fourthClickFunction(){
            //         numberlineButton.off("click");
            //         beginningMessage.html(`<p>Specifically, we\'ll present two sets of horizontal lines. You can then choose whether you prefer the top split or the bottom split.<br><br>Remember, the winning number is already chosen, so your choice only affects what information you learn ahead of the memory game about the outcome; it does not affect the outcome itself.</p>`);
            //     }

            //     setTimeout(function() {
            //         numberlineButton.on("click", firstClickFunction);
            //     }, 7000)

            // } else {

            // }

            // function generateMessage(){
    
            //     // const numberlineButton = document.getElementById("numberlineButton");
    
    
    
            //     function firstClickFunction(){
            //         let numSelections = document.querySelectorAll('.selected').length;
            //         console.log(numSelections)
            //         if (numPairs == 1){
            //             if (numSelections == numOfWheelNumbers) {
            //                 console.log("Continue");
            //             } else {
            //                 const incompleteMessage = document.querySelector("#incomplete-message");
            //                 incompleteMessage.innerText = "Please select one of each number";
            //             }
            //         } else {
            //             if (numSelections == 1){
            //                 console.log("Continue")
            //             } else {
            //                 const incompleteMessage = document.querySelector("#incomplete-message");
            //                 incompleteMessage.innerText = "Please make a selection";
            //             }
            //         }
            //     }
        
            // }


    



            
            // function createBeginningMessage(){
                
            // }

            function createLinePair(position, wheelNumbersSplit, ballColor="color"){

                // console.log(wheelNumbersSplits)
                // console.log(wheelNumbersSplits[mainTrialsCompleted]);

                // console.log("baba")
                // console.log(position)
                const linePair = document.createElement("div");
                // console.log(linePair)
                linePair.setAttribute("id", `line-pair-${position}`);
                linePair.classList.add("line-pair");
                let barWithWinningNumber;


                // .line-pair {
                //     border-color: #dbdbdb85;
                // }
                
                // .line-pair:not(.selected) {
                //     border-color: #ffffff;
                // }

                ["top", "bottom"].forEach(function(topOrBottom, index) {

                    const wrapper = document.createElement("div");
                    wrapper.setAttribute("id", `line-wrapper-${topOrBottom}`);
                    wrapper.classList.add("line-wrapper");
                    const line = document.createElement("div");
                    line.classList.add("line", `line-${topOrBottom}`);
                    wrapper.appendChild(line);
        
                    linePair.appendChild(wrapper);
                    
                    const numbersOnLine = wheelNumbersSplit[index];
                    // let numbersToRemove = wheelNumbers.filter(x => !numbersOnLine.includes(x));

                    console.log(wheelNumbersSplit)
                    console.log(numbersOnLine)

                    wheelNumbers.forEach((wheelNumber, i) => {

                        console.log(wheelNumber)
                        console.log(numbersOnLine)

                        if (numbersOnLine.includes(wheelNumber)){
                            const dot = document.createElement("div");
                            dot.classList.add("dot", `dot-${topOrBottom}`, `dot-${topOrBottom}-${position}`);
                            dot.style.left = `${((i + 1) * 100) / (numOfWheelNumbers + 2)}%`;
                            // dot.style.left = `${(i * (100 - 10)) / (numOfWheelNumbers - 1) + 5}`; // Adjust dot position to start 5% from the left edge
                            const dotPosition = (i * (100 - 10)) / (numOfWheelNumbers - 1) + 5; // Adjust dot position to start 5% from the left edge
                            // dot.style.left = `${(i * (100 - 10)) / (numOfWheelNumbers - 1) + 5}%`;
    
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
            
                            console.log(line)
                            line.appendChild(dot);
                        }
                    });

                });

                console.log(linePair)


                    
                //     wheelNumbers.map(function(wheelNumber){

                //         if (wheelNumber == winningNum){
                //             barWithWinningNumber = topOrBottom;
                //         }

                //         let dotDiv = document.querySelector(`.line-${topOrBottom} .dot[data-index="${wheelNumber}"]`);
                //         dotDiv.style.opacity = 1;
                //         if (numbersToRemove.includes(wheelNumber)){
                //             dotDiv.style.opacity = 0;
                //         }
                //     });
                // });









    
                // const topWrapper = document.createElement("div");
                // topWrapper.setAttribute("id", "line-wrapper-top");
                // topWrapper.classList.add("line-wrapper");
                // const topLine = document.createElement("div");
                // topLine.classList.add("line", "line-top");
                // topWrapper.appendChild(topLine);
    
                // const bottomWrapper = document.createElement("div");
                // bottomWrapper.setAttribute("id", "line-wrapper-bottom");
                // bottomWrapper.classList.add("line-wrapper");
                // const bottomLine = document.createElement("div");
                // bottomLine.classList.add("line", "line-bottom");
                // bottomWrapper.appendChild(bottomLine);
    
                // linePair.appendChild(topWrapper);
                // linePair.appendChild(bottomWrapper);
    
                // const threshold = 40;
    
                // wheelNumbers.forEach((wheelNumber, i) => {
                //     const topDot = document.createElement("div");
                //     const bottomDot = document.createElement("div");
                //     const topNumber = document.createElement("span");
                //     const bottomNumber = document.createElement("span");
    
                //     topDot.classList.add("dot");
                //     topDot.classList.add("dot-top");
                //     bottomDot.classList.add("dot");
                //     bottomDot.classList.add("dot-bottom");
    
    
                //     topDot.style.left = `${(i * 100) / (numOfWheelNumbers - 1)}%`;
                //     topDot.style.backgroundColor = "royalblue";
                //     bottomDot.style.left = `${(i * 100) / (numOfWheelNumbers - 1)}%`;
                //     bottomDot.style.backgroundColor = "coral";
    
                //     // const dotPosition = (i * (100 - 10)) / (numOfWheelNumbers - 1) + 5; // Adjust dot position to start 5% from the left edge
                //     // topDot.style.left = `${dotPosition}%`;
                //     // bottomDot.style.left = `${dotPosition}%`;
    
                //     topNumber.textContent = wheelNumber;
                //     bottomNumber.textContent = wheelNumber;
    
                //     topDot.appendChild(topNumber);
                //     bottomDot.appendChild(bottomNumber);
    
                //     topDot.dataset.index = wheelNumber;
                //     bottomDot.dataset.index = wheelNumber;
    
                //     topLine.appendChild(topDot);
                //     bottomLine.appendChild(bottomDot);
                // });
    
                // console.log(document.querySelectorAll(".line-pair").length)
                // if (totalPairs == 1) {
                // if (numPairs == 1){
                //     let isMouseDown = false;
                //     let lastChangedDot = null;
    
                //     function getClosestDot(line, x, y) {
                //         // console.log(y)
                //         const lineRect = line.getBoundingClientRect();
                //         let closestDot = null;
                //         let minDistance = Number.MAX_VALUE;
    
                //         line.querySelectorAll(".dot").forEach(dot => {
                //             const dotRect = dot.getBoundingClientRect();
                //             const centerX = dotRect.x + dotRect.width / 2;
                //             const centerY = dotRect.y + dotRect.height / 2;
                //             const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    
                //             if (distance < threshold && distance < minDistance) {
                //                 minDistance = distance;
                //                 closestDot = dot;
                //             }
                //         });
    
                //         return closestDot;
                //     }
    
                //     function handleDotClick(dot, linePair) {
                //         if (!dot || dot === lastChangedDot) return;
    
                //         const index = dot.dataset.index;
                //         // console.log(index)
                //         // console.log(`.line-top .dot[data-index="${index}"]`)
                //         // console.log(linePair)
                //         const topDot = linePair.querySelector(`.line-top .dot[data-index="${index}"]`);
                //         const bottomDot = linePair.querySelector(`.line-bottom .dot[data-index="${index}"]`);
    
                //         if (dot.parentElement.classList.contains("line-top")) {
                //             topDot.classList.add('selected');
                //             topDot.classList.remove('opaque');
                //             bottomDot.classList.remove('selected');
                //             bottomDot.classList.add('opaque');
                //         } else {
                //             bottomDot.classList.add('selected');
                //             bottomDot.classList.remove('opaque');
                //             topDot.classList.remove('selected');
                //             topDot.classList.add('opaque');
                //         }
    
                //         lastChangedDot = dot;
                //     }
    
                //     function handleMouseDown(e, linePair) {
                //         e.preventDefault();
                //         isMouseDown = true;
                //         lastChangedDot = null;
                //         // console.log(e)
                //         // console.log(e.target)
                //         const line = e.target.closest(".line-wrapper");
                //         // console.log(line)
                //         const closestDot = getClosestDot(line, e.clientX, e.clientY);
                //         if (closestDot) {
                //             handleDotClick(closestDot, linePair);
                //         }
                //     }
    
                //     function handleMouseUp(e) {
                //         isMouseDown = false;
                //         lastChangedDot = null;
                //     }
    
                //     function handleMouseMove(e) {
                //         e.preventDefault();
                //         if (!isMouseDown) return;
    
                //         const line = e.target.closest(".line-wrapper");
                //         // console.log(line)
                //         const closestDot = getClosestDot(line, e.clientX, e.clientY);
                //         if (closestDot) {
                //             handleDotClick(closestDot, linePair);
                //         }
                //     }
    
    
                //     topWrapper.addEventListener("mousedown", (e) => {
                //         handleMouseDown(e, linePair);
                //     });
                //     topWrapper.addEventListener("mouseup", handleMouseUp);
                //     topWrapper.addEventListener("mousemove", handleMouseMove);
    
                //     bottomWrapper.addEventListener("mousedown", (e) => {
                //         handleMouseDown(e, linePair);
                //     });
                //     bottomWrapper.addEventListener("mouseup", handleMouseUp);
                //     bottomWrapper.addEventListener("mousemove", handleMouseMove);
                // }
    
                // linePair.addEventListener("click", () => {
                //     if (numPairs > 1) {
                //         // Remove the 'selected' class from all line pairs
                //         document.querySelectorAll(".line-pair.selected").forEach((selectedPair) => {
                //             selectedPair.classList.remove("selected");
                //         });
    
                //         // Add the 'selected' class to the clicked line pair
                //         linePair.classList.add("selected");
                //     }
                // });
    
    
                // window.addEventListener('mouseup', handleMouseUp);
    
                linePairContainer.appendChild(linePair);

                console.log("aaaaaaaa")
                if (position == "only"){
                    console.log("big")
                    $(".line-pair").not(".selected").css("border-color", "white")
                } else {
                    console.log("tig")
                    $(".line-pair").not(".selected").css("border-color", "#dbdbdb85");
                }


                return [linePair, barWithWinningNumber];
            }

            function setupDotClicking(linePair) {

                console.log("toshiba")
                let isMouseDown = false;
                let lastChangedDot = null;

                function getClosestDot(line, x, y) {
                    // console.log(y)
                    const lineRect = line.getBoundingClientRect();
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
                    console.log(index)
                    console.log(`.line-top .dot[data-index="${index}"]`)
                    console.log(linePair)
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
                    console.log(linePair)
                    e.preventDefault();
                    isMouseDown = true;
                    lastChangedDot = null;
                    // console.log(e)
                    // console.log(e.target)
                    const line = e.target.closest(".line-wrapper");
                    // console.log(line)
                    const closestDot = getClosestDot(line, e.clientX, e.clientY);
                    if (closestDot) {
                        handleDotClick(closestDot, linePair);
                    }
                }

                function handleMouseUp(e) {
                    isMouseDown = false;
                    lastChangedDot = null;
                    // console.log("jip")
                }

                function handleMouseMove(e) {
                    e.preventDefault();
                    if (!isMouseDown) return;

                    const line = e.target.closest(".line-wrapper");
                    console.log(line)
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
                console.log(linePair)
                $(linePair).on("click", function(){

                    // $(linePair).off("click")

                    // Remove the 'selected' class from all line pairs
                    document.querySelectorAll(".line-pair.selected").forEach((selectedPair) => {
                        selectedPair.classList.remove("selected");
                    });

                    // Add the 'selected' class to the clicked line pair
                    linePair.classList.add("selected");

                });
            }
    
            // function updateLinePairs(numPairs) {
            function updateLinePairs(){
    
                // for (let i = 0; i < numPairs; i++) {

                    if (mainTrialsCompleted < trialsWithoutChoice){
                        createInstructionsEarlyTrials();
                    } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "open_ended"){
                        createInstructionsForFirstChoice(openEndedQuestion);
                    } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "multiple_choice"){
                        createInstructionsForFirstChoice(multipleChoiceQuestion);
                    } else if (mainTrialsCompleted > trialsWithoutChoice && choiceType == "multiple_choice"){
                        beginningMessage.html(`Once again, choose which of the sets of pairs of numbers to work with. When you make your choice, we\'ll then tell you whether the winning number is on the top line or bottom line of the set you chose.<br>${rememberNote}`);
                        multipleChoiceQuestion();
                    // }

                    
                    


                    
                    // const linePairAndBarWithWinningNum = createLinePair(numPairs);
                    // const linePair = linePairAndBarWithWinningNum[0];
                    // const barWithWinningNumber = linePairAndBarWithWinningNum[1];

                    // if (mainTrialsCompleted < trialsWithoutChoice){
                    //     createInstructionsEarlyTrials(barWithWinningNumber);
                    //     // linePair = linePair;
                    // } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "open_ended"){
                    //     linePair = setupDotClicking(linePair);
                    //     createInstructionsForFirstChoice("open_ended");
                    // } else {
                    //     createInstructionsForFirstChoice("multiple_choice");
                    //     linePair = setupPairClicking(linePair);
                    // }

                }
            }

            updateLinePairs();
    
            // if (mainTrialsCompleted >= trialsWithoutChoice && choiceType == "multiple_choice"){
            //     updateLinePairs(2);
            // } else {
            //     updateLinePairs(1);
            // }
            // generateMessage();
            // hideDots();

        }
    }
    NumberlinePlugin.info = info;

    return NumberlinePlugin;

})(jsPsychModule);