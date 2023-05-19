var jsPsychRoulette = (function (jspsych) {
    'use strict';

    const info = {
        name: "roulette",
        parameters: {
            specialTrial: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Special Trial',
                default: "none",
            },
            rotationsTime: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Rotations Time',
                default: 8, 
            },
            wheelSpinTime: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Wheel Spin Time',
                default: 4,
            },
            ballSpinTime: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Ball Spin Time',
                default: 8,
            },
            numbersFacing: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Numbers Facing',
                default: "inwards",
            },
            spinOrReveal: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Spin or Reveal',
                default: "spin",
            },
            freqBars: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Frequency of Bars',
                default: 1
            },
            wheelNumbers: {
                type: jspsych.ParameterType.COMPLEX,
                pretty_name: 'Wheel Numbers',
                default: [],
            },
            cardsAndOrBars: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Cards and/or Bars',
                default: "onlyOne",
            }
        }
    }


    class RoulettePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {

            display_element.innerHTML = `
                <div id="overlay">
                    <div id="overlay-message">
                        <p id="overlay-description"><p/>
                        <button id="overlay-button">OK</button>
                    </div>
                </div>
                </div>
                <div id="content-underneath">
                
                    <div class="spinner" id="spinnerID">
                        <div class="ball"><span></span></div>
                        <div class="platebg"></div>
                        <div class="platetop">
                            <div id="ballLandedNotification">
                                <p>The ball has finished spinning and has landed on a number; the winning number is therefore now determined</p>
                            </div>
                        </div>
                        <div id="toppart" class="topnodebox">
                            <div class="silvernode"></div>
                            <div class="topnode silverbg"></div>
                            <span class="top silverbg"></span>
                            <span class="right silverbg"></span>
                            <span class="down silverbg"></span>
                            <span class="left silverbg"></span>
                        </div>
                        <div id="rcircle" class="pieContainer">
                            <div class="pieBackground"></div>
                        </div>
                    </div>
                    <div id="dotContainer"></div>
                    <div class="control">
                        <div id="btnSpin" class="button">Spin</div>
                        <div id="selection-explained"></div>
                        <div class="other-buttons">
                            <div id="btnselect" class="button">Reveal</div>
                        </div>
                        <div id="btnproceed" class="button">Proceed</div>
                    </div>

                </div>
            `;

            function getCSSProperty(propertyName) {
                return getComputedStyle(document.documentElement).getPropertyValue(`--${propertyName}`);
            }

            const plateBGColor = $(".platebg").css("background-color");
            const redGradient = getCSSProperty('red-gradient');
            const blackGradient = getCSSProperty('black-gradient');
            const whiteColor = getCSSProperty('white-color');
            const blackColor = getCSSProperty('black-color');
            const cardBarOkButtonWhiteColor = getCSSProperty('card-bar-ok-button-white');
            const cardBarOkButtonBlackColor = getCSSProperty('card-bar-ok-button-black');
            const wheelSelectedColor = "yellow";
            const selectedCardBarColor = getCSSProperty('selected-card-color');
            const selectedCardBarColorEnglish = "orange";
            const unselectedCardBarColor = getCSSProperty('unselected-card-color');
            const unselectedCardBarColorEnglish = "blue";
            const chunkBorderSelectedColor = getCSSProperty('chunk-border-selected-color');
            const chunkBorderUnselectedColor = getCSSProperty('chunk-border-unselected-color');
            const chunk0Color = getCSSProperty('chunk-0-color');
            const chunk0ColorEnglish = "green";
            const chunk1Color = getCSSProperty('chunk-1-color');
            const chunk1ColorEnglish = "blue";

            // $(".jspsych-content-wrapper").css("display", "flex");

            if (omission == "ball"){
                $("#overlay-message").css("top", "43%");
                trial.numbersFacing = "inwards";
            } else if (omission == "numbers"){
                $("#overlay-message").css("top", "39%");
                trial.numbersFacing = "upright";
            }

            // temporary line
            // removeOverlay();

            // if (trial.cardsAndOrBars == "onlyOne"){
            //     if (wheelCondition == "confined_wheel"){
            //         trial.cardsAndOrBars = "cards";
            //     } else if (wheelCondition == "vast_wheel"){
            //         trial.cardsAndOrBars = "bars";
            //     }
            // }

            $("body").css("background-color", whiteColor);


            // let wheelNumbersSplitsAndMissings;
            // if (trial.specialTrial == "demo"){
            //     wheelNumbersSplitsAndMissings = wheelNumbersDemo;
            // } else if (trial.specialTrial == "practice1"){
            //     wheelNumbersSplitsAndMissings = wheelNumbersPractice1;
            // } else if (trial.specialTrial == "practice2"){
            //     wheelNumbersSplitsAndMissings = wheelNumbersPractice2;
            // } else {
            //     wheelNumbersSplitsAndMissings = wheelNumbersMain[mainTrialsCompleted];
            // }

            // let numberLine = wheelNumbersSplitsAndMissings[0];
            // let chunk1s = wheelNumbersSplitsAndMissings[1];
            // chunk1s = jsPsych.randomization.shuffle(chunk1s);
            // let topchunk0 = [];
            // let topchunk1 = chunk1s[0];
            // let bottomchunk0 = [];
            // let bottomchunk1 = chunk1s[1];
            // let numbersOnlyOnNumberLine = wheelNumbersSplitsAndMissings[2];
            // let wheelNumbersAscending = []
            
            // numberLine.map(x => {
            //     if (!numbersOnlyOnNumberLine.includes(x)){
            //         wheelNumbersAscending.push(x);
            //         if (!topchunk1.includes(x)) topchunk0.push(x);
            //         if (!bottomchunk1.includes(x)) bottomchunk0.push(x);
            //     }
            // });
            
            const removeOverlay = () =>  overlay.style.display = 'none';

            let overlay = document.querySelector('#overlay');
            let overlayWriting = document.querySelector('#overlay-description');
            let OverlayBtn = document.querySelector('#overlay-button');

            function openingMessage(){
                if (mainTrialsCompleted == trialsOfActualSpinning){
                    let finalPosition;
                    if (omission == "numbers"){
                        finalPosition = "ball";
                    } else if (omission == "ball"){
                        finalPosition = "wheel";
                    }
                    overlayWriting.innerHTML = `At this point, we\'re going to stop literally 'spinning' the wheel and just show you the ${finalPosition}\'s final position, to save time. Everything else will be the same.`
                    OverlayBtn.addEventListener('click', removeOverlay);
                } else {
                    removeOverlay();
                }
                if (trial.spinOrReveal == "reveal"){
                    console.log(document.querySelector('#content-underneath'))
                    document.querySelector('#content-underneath').style.opacity = 0;
                    onSpinPress();

                    // setTimeout(function() {
                        document.querySelector('#content-underneath').style.opacity = 1;
                    // }, 2000);
                    // }, 2000);
                }
            }

            var numbg = $(".pieContainer");
            var ballbg = $(".ball");
            var btnSpin = $("#btnSpin");
            var toppart = $("#toppart");
            var numberLoc = [];
            $.keyframe.debug = true;
            let dest;
            let linePairAttributes = {};

            let winningNum;
            if (trial.specialTrial == "demo"){
                winningNum = demoWin;
            } else {
                winningNum = winningNums[mainTrialsCompleted]
            }

            winningNum = winningNum.toString();

            // if (trial.specialTrial == "demo" || trial.spinOrReveal == "spin"){

            // }
            if (trial.spinOrReveal == "reveal"){
                btnSpin.css("display", "none");
            }
            
            createWheel();

            function createWheel() {
                var temparc = 360 / numOfWheelNumbers;
                for (var i = 0; i < numOfWheelNumbers; i++) {
                    let possiblePayout = wheelNumbers[i];
                    numberLoc[possiblePayout] = [];
                    numberLoc[possiblePayout][0] = i * temparc;
                    numberLoc[possiblePayout][1] = i * temparc + temparc;
                
                    let newSlice = document.createElement("div");
                    $(newSlice).addClass("hold");
                    let newHold = document.createElement("div");
                    $(newHold).addClass("pie");
                    $(newHold).attr('id', 'hold' + possiblePayout);
                    let newNumber = document.createElement("div");
                    $(newNumber).addClass("num");
                    $(newNumber).attr('id', 'num' + possiblePayout);
            
                    newNumber.innerHTML = possiblePayout;
                    $(newSlice).attr("id", "rSlice" + possiblePayout);
                    $(newSlice).css(
                        "transform",
                        "rotate(" + numberLoc[possiblePayout][0] + "deg)"
                    );
                    
                    if (trial.numbersFacing == "upright"){
                        $(newNumber).css(
                            "transform",
                            "rotate("  + - numberLoc[possiblePayout][0] + "deg)"
                        );
                    } else if (numOfWheelNumbers == 6){
                        $(newNumber).css("transform", "rotate(32deg)");
                    } else if (numOfWheelNumbers == 20){
                        $(newNumber).css("transform", "rotate(15deg)");
                    }

                    $(newHold).css("transform", `rotate(${temparc}deg`);
                    $(newHold).css("-webkit-transform", `rotate(${temparc}deg)`);
                    if (numOfWheelNumbers > 25){
                        $(newHold).css("border", "solid .1em #FFF");
                        if (numOfWheelNumbers == 36){
                            $(newNumber).css("top", "0.4em");
                            $(newNumber).css("left", "10.28em");
                        }
                    } else if (numOfWheelNumbers == 20){
                        $(newHold).css("border", "solid .1em #FFF");
                        $(newNumber).css("top", "0.7em");
                        $(newNumber).css("left", "11.0em");
                    } else {
                        $(newHold).css("border", "solid .03em #FFF");
                        if (numOfWheelNumbers == 6){
                            $(newNumber).css("top", "1.9em");
                            $(newNumber).css("left", "14.28em");
                        }
                    }

                    let numred = [];
                    let numblack = [];
                    // Assign numbers to red wheel tile or black wheel tile
                    wheelNumbers.forEach(function (value, i) {
                        if (i % 2 == 0){
                            numred.push(value)
                        } else{
                            numblack.push(value)
                        }
                    });
            
                    if ($.inArray(possiblePayout, numred) > -1) {
                        $(newHold).addClass("redbg");
                    } else if ($.inArray(possiblePayout, numblack) > -1) {
                        $(newHold).addClass("greybg");
                    }
            
                    $(newHold).appendTo(newSlice);
                    $(newSlice).appendTo( $("#rcircle"));
                    $(newNumber).appendTo(newSlice);
                    // if (omission == "numbers") {$(newNumber).css("display", "none");}
                    if (omission == "numbers" && trial.specialTrial != "demo"){
                        ($(newNumber)[0]).style.display = "none";
                    }
                }
            }

            function onSpinPress() {

                spinTo(winningNum);
                btnSpin.off('click',onSpinPress);

                $(".control").animate({
                    opacity: 0,
                }, 2000);
            }

            btnSpin.click(onSpinPress);
            
            function resetAni() {
                let pfx = $.keyframe.getVendorPrefix();
                let animationPlayState = "animation-play-state";
                let playStateRunning = "running";
            
                $(ballbg)
                .css(pfx + animationPlayState, playStateRunning)
                .css(pfx + "animation", "none");
            
                $(numbg)
                .css(pfx + animationPlayState, playStateRunning)
                .css(pfx + "animation", "none");
                $(toppart)
                .css(pfx + animationPlayState, playStateRunning)
                .css(pfx + "animation", "none");
            
                $("#rotate2").html("");
                $("#rotate").html("");
            }
            
            function spinTo(winningNum) {

                //set timer here
                if (trial.spinOrReveal == "spin"){
                    setTimeout(function() {
                        var ballDiv = document.getElementsByClassName("ball")[0];
                        if (omission == "ball"){
                            var opacity = 1;
                            var interval = setInterval(function() {
                                opacity -= 0.05;
                                ballDiv.style.opacity = opacity;
                                if (opacity <= 0) {
                                    clearInterval(interval);
                                }
                            }, 20);
                        }
                    }, 100);
                }
                
                //get location
                var temp = numberLoc[winningNum][0] + 4;
            
                //randomize
                var rndSpace = randomSpaceArray[mainTrialsCompleted];
            
                resetAni();
                let timeoutDuration;
                if (trial.spinOrReveal == "spin"){
                    timeoutDuration = 500;
                } else if (trial.spinOrReveal == "reveal"){
                    timeoutDuration = 0;
                } {

                }
                setTimeout(function() {
                    bgrotateTo(rndSpace);
                    ballrotateTo(rndSpace + temp, rndSpace, winningNum);
                }, timeoutDuration);
            }
            
            function ballrotateTo(deg, rndSpace, winningNum) {

                let timeoutDuration;
                if (trial.spinOrReveal == "spin"){
                    timeoutDuration = 1000;;
                } else if (trial.spinOrReveal == "reveal"){
                    timeoutDuration = 0;
                }

                // let extraBallRotation = (wheelCondition == "confined_wheel") ? 30 : 0;
                let extraBallRotation = 0;
                var temptime = trial.rotationsTime + 's';
                var ballDest = -360 * trial.ballSpinTime - (360 - deg) + extraBallRotation;
                $.keyframe.define({
                    name: "rotate2",
                    from: {
                        transform: "rotate(0deg)"
                    },
                    to: {
                        transform: "rotate(" + ballDest + "deg)"
                    }
                });            
                $(ballbg).playKeyframe({
                    name: "rotate2", // name of the keyframe you want to bind to the selected element
                    duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
                    timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation

                    complete: finishSpin
                    // complete: function() {






                    //     setTimeout(function() {
                    //         finishSpin(rndSpace, winningNum)
                    //     // }, timeoutDuration)
                    // }, 10000000000)
                    // } //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
                });
            }
            
            function bgrotateTo(deg) {

                dest = 360 * trial.wheelSpinTime + deg;
                var temptime = (trial.rotationsTime * 1000 - 1000) / 1000 + 's';
            
                $.keyframe.define({
                    name: "rotate",
                    from: {
                        transform: "rotate(0deg)"
                    },
                    to: {
                        transform: "rotate(" + dest + "deg)"
                    }
                });
            
                $(numbg).playKeyframe({
                    name: "rotate", // name of the keyframe you want to bind to the selected element
                    duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
                    timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
                    complete: function() {} //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
                });
            
                $(toppart).playKeyframe({
                    name: "rotate", // name of the keyframe you want to bind to the selected element
                    duration: temptime, // [optional, default: 0, in ms] how long you want it to last in milliseconds
                    timingFunction: "ease-in-out", // [optional, default: ease] specifies the speed curve of the animation
                    complete: function() {} //[optional]  Function fired after the animation is complete. If repeat is infinite, the function will be fired every time the animation is restarted.
                });
            }

            function createInstructionsEarlyTrials(){

                linePairAttributes.beginningMessage.html(`<p>The balls represent the ${numOfWheelNumbers} numbers from the wheel. We\'re going to tell you now whether the winning number is one of the numbers on the top or bottom line. We\'ll then tell you exactly what the winning number was after the upcoming memory game.</p>`);
                linePairAttributes.numberlineButton.html("Reveal bar with winning number");

                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted];
                const linePairAndBarWithWinningNum = createLinePair("moveDots", "only", wheelNumbersSplit);
                console.log(linePairAndBarWithWinningNum)
                const barWithWinningNumber = linePairAndBarWithWinningNum[1];

                function firstClickFunction(){
                    
                    linePairAttributes.numberlineButton.off("click");

                    // $("#line-wrapper-top").animate({opacity: 0}, 1000);
                    const barNotWithWinningNumber = ["top", "bottom"].filter(x => ![barWithWinningNumber].includes(x));
                    $(`.dot-${barNotWithWinningNumber}-only`).animate({opacity: 0}, 1000);

                    let numsRemaining;

                    if (barWithWinningNumber == "top"){
                        numsRemaining = wheelNumbersSplit[0]
                    } else if (barWithWinningNumber == "bottom"){
                        numsRemaining = wheelNumbersSplit[1]
                    }

                    setTimeout(function() {
                        const numsOnBarWithWinningNumber = document.querySelectorAll(`.dot-${barWithWinningNumber}-only`).length;
                        linePairAttributes.beginningMessage.html(`<p>The winning number is one of the ${numsRemaining.length} numbers on the ${barWithWinningNumber} line.</p><br><br><br>`);
                        // linePairAttributes.beginningMessage.html(`<p>The balls represent the ${numOfWheelNumbers} numbers from the wheel. We\'re going to tell you now whether the winning number is one of the numbers from the top or bottom. We\'ll then tell you exactly what the winning number was after the upcoming memory game.</p>`);
                    }, 1);
                    //   }, 2000);

                    setTimeout(function() {
                        linePairAttributes.numberlineButton.on("click", secondClickFunction);
                        linePairAttributes.numberlineButton.html("Continue to memory game");
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
                    linePairAttributes.numberlineButton.on("click", firstClickFunction);
                }, 1);
                // }, 7000);

            }


            function createInstructionsForFirstChoice(nextStage){         
                
                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted - 1];
                let linePairAndBarWithWinningNum;

                linePairAttributes.beginningMessage.html(`<p>In previous trials, at this point we would show you a pair of horizontal lines, and you would see whether the winning number is on the top or bottom line. <span style='color: white'>You had no ability to choose which numbers were on which line, and hence, what you would learn about the winning number prior to playing the memory game.</span></p>`);
                linePairAttributes.numberlineButton.html("Continue");

                if (choiceType == "multiple_choice"){
                    // setTimeout(function() {
                    //     linePairAttributes.numberlineButton.on("click", secondClickFunction);
                    // }, 5000);
                    linePairAttributes.beginningMessage.specificallyNote = `<p>Specifically, we\'ll present two pairs, instead of one pair, of horizontal lines. You can then choose whether you prefer the top split or the bottom split.</p>`;
                    linePairAttributes.beginningMessage.beginNowInstructions = `<p>Click one of these two pairs now, and click the button below to submit your choice. We\'ll tell you whether the winning number is on the top or bottom of that pair.</p>`
                } else if (choiceType == "open_ended"){
                    linePairAttributes.beginningMessage.specificallyNote = `<p>Specifically, you have to click which numbers you would like on each line. When you are finished, all ${numOfWheelNumbers} numbers should appear on one of the two lines.</p>`;
                    linePairAttributes.beginningMessage.beginNowInstructions = `<p>Now, click the balls to assign them to a line. You can also drag your mouse to select several more quickly than clicking one by one, if you prefer.</p>`
                }

                function firstClickFunction(){

                    linePairAttributes.numberlineButton.off("click");
                    setTimeout(function() {
                        linePairAttributes.numberlineButton.on("click", secondClickFunction);
                    }, 1);
                    // }, 5000);

                    linePairAndBarWithWinningNum = createLinePair("moveDots", "only", wheelNumbersSplit);

                }

                function secondClickFunction(){

                    linePairAttributes.numberlineButton.off("click");
                    setTimeout(function() {
                        linePairAttributes.numberlineButton.on("click", thirdClickFunction);
                    }, 1);
                    // }, 5000);

                    linePairAttributes.beginningMessage.html(`<p>In previous trials, at this point we would show you a pair of horizontal lines, and you would see whether the winning number is on the top or bottom line. You had no ability to choose which numbers were on which line, and hence, what you would learn about the winning number prior to playing the memory game.</p>`);

                }

                function thirdClickFunction(){
                    linePairAttributes.numberlineButton.off("click");
                    const oldLinePair = linePairAndBarWithWinningNum[0];
                    oldLinePair.remove();
                    linePairAttributes.beginningMessage.html(`<p>This time it\'ll work a little differently. Now, you can choose how the ${numOfWheelNumbers} numbers are split between the two lines.</p>`);
                    setTimeout(function() {
                        linePairAttributes.numberlineButton.on("click", fourthClickFunction);
                    }, 1);
                    // }, 5000);
                }

                function fourthClickFunction(){

                    linePairAttributes.numberlineButton.off("click");
                    linePairAttributes.beginningMessage.html(linePairAttributes.beginningMessage.specificallyNote);
                    setTimeout(function() {
                        console.log("spawn")
                        linePairAttributes.numberlineButton.on("click", fifthClickFunction);
                    }, 1);
                    // }, 5000);

                }

                function fifthClickFunction(){

                    linePairAttributes.numberlineButton.off("click");
                    linePairAttributes.beginningMessage.html(`${linePairAttributes.beginningMessage.specificallyNote}<br>${linePairAttributes.rememberNote}`);

                    setTimeout(function() {
                        linePairAttributes.numberlineButton.
                        linePairAttributes.numberlineButton.on("click", nextStage);
                    }, 1);

                }

                setTimeout(function() {
                    linePairAttributes.numberlineButton.on("click", firstClickFunction);
                }, 1)
                // }, 7000)
            }

            function openEndedQuestion(moveDotsOrCreatePair="createPair"){

                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted];
                const linePairAndBarWithWinningNum = createLinePair(moveDotsOrCreatePair, "only", wheelNumbersSplit, "bw");
                let numsOnBarWithWinningNumber;
                setupDotClicking(linePairAndBarWithWinningNum[0]);
                $('.line-wrapper').css("cursor", "pointer");

                // setTimeout(function() {
                    linePairAttributes.numberlineButton.off("click");
                    linePairAttributes.numberlineButton.on("click", firstClickFunction);
                // }, 5000);

                linePairAttributes.beginningMessage.html(`${linePairAttributes.beginningMessage.specificallyNote}${linePairAttributes.rememberNote}${linePairAttributes.beginningMessage.beginNowInstructions}`)

                function firstClickFunction(){

                    if (document.querySelectorAll('.selected').length == numOfWheelNumbers){
                        linePairAttributes.numberlineButton.off("click");
                        $('.line-wrapper').off();
                        
                        $('#incomplete-message').html("");
    
    
                        const barWithWinningNumber = linePairAndBarWithWinningNum[1];
                        const barNotWithWinningNumber = ["top", "bottom"].filter(x => ![barWithWinningNumber].includes(x));
                        $(`.dot-${barNotWithWinningNumber}-only`).animate({opacity: 0}, 1000);
                        // $(`.dot-${barNotWithWinningNumber}-only.selected`).animate({opacity: 0}, 1000);
                        // $(`.select`).not(`.dot-${barNotWithWinningNumber}-only`)
                        $(`.dot-${barWithWinningNumber}-only:not([class*="selected"])`).animate({opacity: 0}, 1000);
                        numsOnBarWithWinningNumber = document.querySelectorAll(`.dot-${barWithWinningNumber}-only.selected`).length;
    
                        linePairAttributes.beginningMessage.html(`<p>The winning number is one of the ${numsOnBarWithWinningNumber} numbers on the ${barWithWinningNumber} line.</p><br><br><br><br><br><br><br><br>`);
                        linePairAttributes.numberlineButton.html("Continue to the memory game");
                        linePairAttributes.numberlineButton.on("click", secondClickFunction);
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

            function multipleChoiceQuestion(moveDotsOrCreatePair="createPair"){
                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted];
                const linePairAndBarWithWinningNumTop = createLinePair(moveDotsOrCreatePair, "top", wheelNumbersSplit[0]);
                const linePairAndBarWithWinningNumBottom = createLinePair(moveDotsOrCreatePair, "bottom", wheelNumbersSplit[1]);
                setupPairClicking(linePairAndBarWithWinningNumTop[0]);
                setupPairClicking(linePairAndBarWithWinningNumBottom[0]);
                $('.line-wrapper').css("cursor", "pointer");

                let topOrBottomSelected;
                
                linePairAttributes.beginningMessage.html(`${linePairAttributes.beginningMessage.specificallyNote}${linePairAttributes.rememberNote}${linePairAttributes.beginningMessage.beginNowInstructions}`)

                // setTimeout(function() {
                    // if (document.querySelectorAll('.selected').length == 1){
                        // console.log("tokyo")
                        linePairAttributes.numberlineButton.off("click");
                        linePairAttributes.numberlineButton.on("click", firstClickFunction);
                    // } else {

                    // }
                // }, 5000);

                function firstClickFunction(){


                    if (document.querySelectorAll('.selected').length == 1){

                        const selectedID = document.querySelectorAll('.selected')[0].id
                        const lastHyphenIndex = selectedID.lastIndexOf('-');
                        topOrBottomSelected = selectedID.substring(lastHyphenIndex + 1);
                        
                        linePairAttributes.numberlineButton.off("click");
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
        
                            linePairAttributes.beginningMessage.html(`The winning number is one of the ${numsRemaining} numbers on the ${linePairAndBarWithWinningNum[1]} line.<br><br><br><br><br><br><br><br><br>`);
                            linePairAttributes.numberlineButton.html("Continue to the memory game");
                            linePairAttributes.numberlineButton.on("click", secondClickFunction);
                            // end trial should go here
                        }, 3000)


                    } else {
                        // linePairAttributes.numberlineButton.on("click", function(event){
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


            // function anotherone(position, wheelNumbersSplit){
            //     ["top", "bottom"].forEach(function(topOrBottom, index) {
            //         const numbersOnLine = wheelNumbersSplit[index];
            //         wheelNumbers.forEach((wheelNumber, i) => {
            //             if (numbersOnLine.includes(wheelNumber)){


    
            //             }
            //         });
            //     })
            // }


            function createLinePair(moveDotsOrCreatePair, position, wheelNumbersSplit, ballColor="color"){

                let linePair;
                let barWithWinningNumber;
                // let wrappersPositions;
                let topOfWrappers;
                let halfSizeOfWrapper;

                if (moveDotsOrCreatePair == "createPair"){
                    linePair = document.createElement("div");
                    linePair.setAttribute("id", `line-pair-${position}`);
                    linePair.classList.add("line-pair");

                    let dotDivsTop = document.querySelectorAll(`.dot-top-${position}`);
                    let dotDivsBottom = document.querySelectorAll(`.dot-bottom-${position}`);
                    let firstDotDivTop = dotDivsTop[0];
                    let firstDotDivBottom = dotDivsBottom[0];
                    let topDotPosition = firstDotDivTop.getBoundingClientRect();
                    let bottomDotPosition = firstDotDivBottom.getBoundingClientRect();
                    console.log(topDotPosition)
                    console.log(bottomDotPosition)
                    let middleOfTop = (topDotPosition.top + topDotPosition.bottom) / 2;
                    console.log(middleOfTop)
                    let middleOfBottom = (bottomDotPosition.top + bottomDotPosition.bottom) / 2;
                    let middleOfLinePair = (middleOfTop + middleOfBottom) / 2;
                    halfSizeOfWrapper = middleOfTop - middleOfLinePair;
                    console.log(halfSizeOfWrapper)
                    topOfWrappers = [middleOfTop + halfSizeOfWrapper, middleOfLinePair];
                    // wrappersPositions = [
                    //     {
                    //         top: middleOfTop + halfSizeOfWrapper,
                    //         // middle: middleOfTop,
                    //         // bottom: middleOfLinePair
                    //     },
                    //     {
                    //         top: middleOfLinePair,
                    //         // middle: middleOfBottom,
                    //         // bottom: middleOfBottom - halfSizeOfWrapper
                    //     }
                    // ];

                    linePair.style.top = topOfWrappers[0] + 'px'; // wrappersPositions[0].top + 'px';
                    linePair.style.height = halfSizeOfWrapper * 4 + 'px'; //(wrappersPositions[0].top - wrappersPositions[1].bottom) + 'px';

                    // topwrapper: topwrapper.style.top = linePair.style.top - wrapperPositions[index].top
                    // bottomwrapper: bottomwrapper.style.bottom = linePair.style.top - middleOfLinePair
                    // wrapper.style.height = halfSizeOfWrapper * 2 + 'px';
                    
                    // line.style.top = wrapper.style.top - halfSizeOfWrapper + 'px';


                }

                ["top", "bottom"].forEach(function(topOrBottom, index){

                    let wrapper;
                    let line;
                    const numbersOnLine = wheelNumbersSplit[index];
                    if (moveDotsOrCreatePair == "createPair"){
                        wrapper = document.createElement("div");
                        wrapper.setAttribute("id", `line-wrapper-${topOrBottom}`);
                        // wrapper.style.top = wrappersPositions[index].top + 'px';
                        // wrapper.style.bottom = wrappersPositions[index].bottom + 'px';
                        console.log(topOfWrappers)
                        console.log(topOfWrappers[index])
                        console.log(linePair.style.top)
                        // console.log(linePair.getBoundingClientRect())
                        console.log(parseInt(linePair.style.top));
                        console.log(linePair.getBoundingClientRect().top)
                        console.log(parseInt(linePair.style.top) - topOfWrappers[index])
                        // wrapper.style.top = (parseInt(linePair.style.top) - topOfWrappers[index]) + 'px';
                        wrapper.style.top = (topOfWrappers[index] - parseInt(linePair.style.top)) + 'px';
                        wrapper.style.height = halfSizeOfWrapper * 2 + 'px';
                        wrapper.classList.add("line-wrapper");
                        line = document.createElement("div");
                        line.classList.add("line", `line-${topOrBottom}`);
                        // line.style.top = wrappersPositions[index].middle + 'px';
                        console.log(wrapper.style.top)
                        console.log(halfSizeOfWrapper)
                        line.style.top = wrapper.style.top - halfSizeOfWrapper + 'px';
                        wrapper.appendChild(line);
            
                        linePair.appendChild(wrapper);
                    }

                    wheelNumbers.forEach((wheelNumber, i) => {
                        console.log(wheelNumber)

                        if (numbersOnLine.includes(wheelNumber)){

                            let numElement = $("#num" + wheelNumber);

                            if (moveDotsOrCreatePair == "createPair"){

                                $('#spinnerID').css("z-index", "1");
                                $('#spinnerID').css("height", "0em");
                                $(numElement).css("background-color", "white");

                                // let dotDivs = document.querySelectorAll(`.dot-${topOrBottom}-${position}`);
                                // let firstDotDiv = dotDivs[0];
                                // let div1Position = firstDotDiv.getBoundingClientRect();
                                // let div2 = document.getElementById('line-pair-top');
                                // div2.style.top = ((div1Position.top + div1Position.bottom) / 2) + 'px';





                                // const dot = document.createElement("div");
                                // dot.classList.add("dot", `dot-${topOrBottom}`, `dot-${topOrBottom}-${position}`);
                                // dot.style.left = `${((i + 1) * 100) / (numOfWheelNumbers + 2)}%`;
        
                                // const nmbr = document.createElement("span");
        
                                // let dotBackgroundColor;
                                // let dotTextColor;
        
                                // if (ballColor == "color") {
                                //     dotTextColor = "white";
                                //     if (topOrBottom == "top"){
                                //         dotBackgroundColor = "royalblue";
                                //     } else if (topOrBottom == "bottom"){
                                //         dotBackgroundColor = "coral";
                                //     }    
                                // }
        
                                // nmbr.style.color = dotTextColor;
                                // dot.style.backgroundColor = dotBackgroundColor;
        
                                // nmbr.textContent = wheelNumber;
                                // dot.appendChild(nmbr);
                                
                                // dot.dataset.index = wheelNumber;

                                
        
                                if (wheelNumber == winningNum){
                                    barWithWinningNumber = topOrBottom;
                                }
                                // line.appendChild(dot);

                            } else if (moveDotsOrCreatePair == "moveDots"){

                                let setTop = {
                                    top: {
                                        top: 4,
                                        bottom: 8,
                                    },
                                    only: {
                                        top: 14,
                                        bottom: 18,
                                    },
                                    bottom: {
                                        top: 24,
                                        bottom: 28,
                                    },
                                }
    
                                // let numElement = $("#num" + wheelNumber);
                                let holdElement = $("#rSlice" + wheelNumber);
                                
                                let newLeft = -10 + (i * 2) + "em"; // reduce the multiplier for closer numbers
                                $(numElement).css("border-width", "0px")
                                $(numElement).css("background-color", "transparent")
                                $(numElement).addClass(`dot dot-${topOrBottom}-${position}`);

                                $({deg: 15}).animate({deg: 0}, {
                                    duration: 2000,
                                    step: function(now) {
                                        numElement.css({
                                            transform: 'rotate(' + now + 'deg)'
                                        });
                                    }
                                });
    
                                $({deg: numberLoc[wheelNumber][0]}).animate({deg: 0 - (dest%360)}, {
                                    duration: 2000,
                                    step: function(now) {
                                        holdElement.css({
                                            transform: 'rotate(' + now + 'deg)'
                                        });
                                    }
                                });
                                
                                numElement.animate({
                                    color: '#000',
                                }, 400)
                                
                                numElement.animate({
                                    // color: '#000',
                                    left: newLeft,
                                    // top: '14.3em',
                                    // top: '6.8em',
                                    top: setTop[position][topOrBottom] + "em",
                                    borderWidth: "2px",
                                    width:  "30px",
                                    height: "30px"
                                    // left: 0
                                }, 2000, function(){
                                    if (i == numOfWheelNumbers - 1){
                                        console.log("ganoush")
                                        createLinePair("createPair", position, wheelNumbersSplit, ballColor)
                                    }
                                });
                            }



                        }
                    });

                });
    
                if (moveDotsOrCreatePair == "createPair"){
                    linePairAttributes.linePairContainer.appendChild(linePair);

                    if (position == "only"){
                        $(".line-pair").not(".selected").css("border-color", "white")
                    } else {
                        $(".line-pair").not(".selected").css("border-color", "#dbdbdb85");
                    }
    
    
                    return [linePair, barWithWinningNumber];
                }
                // } else if (moveDotsOrCreatePair == "moveDots"){
                //     return createLinePair("createPair", position, wheelNumbersSplit, ballColor)
                // }
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

            function ballLandedNotification(){

                let fadeTime = 800;

                $(".topnodebox").animate({
                    opacity: 0,
                }, fadeTime)

                $("#ballLandedNotification").animate({
                    opacity: .99,
                }, fadeTime, function(){
                    setTimeout(function(){
                        disappearWheel();
                        generateLinePairs();
                    }, 4000)
                })
            }


            function disappearWheel(){
                
                // setTimeout(() => {

                    $(".pie").animate({
                        opacity: 0,
                    }, 800)

                    $(".platebg, .platetop, .pieBackground").animate({
                        opacity: 0,
                    }, 2000);
                    // }, 100000);

                    setTimeout(function(){
                        $('.hold').css("clip", 'rect(0, 50em, 20em, -10em)')
                        $(".spinner").css("boxShadow", "none")
                    }, 1000)
                    // }, 100000)


                    // $(".spinner").animate({
                    //     boxShadow: 'none',
                    //     border: 'none'
                    // }, 2000);


                    $(".spinner").css("border-width", "2em").animate({
                        borderWidth: 0
                    }, 2000);
                    // }, 100000);
                
                
                    // $(".pieBackground").animate({
                    //     backgroundColor: 'transparent',
                    //     boxShadow: 'none'
                    // }, 2000);

                    // animate opacity to 0
                    // $(".platebg, .platetop, .topnodebox").animate({
                    // $(".platebg, .platetop, .topnodebox, .pieBackground, .control").animate({
                    //     opacity: 0,
                    // }, 2000);


                // }, 1000); 
                    // }, 1); 
            }

            function moveWheelNumbers(){
                setTimeout(() => {
                    wheelNumbers.map((x, index) => {

                        console.log(dest)
                        let numElement = $("#num" + x);
                        
                        let finalTop = 600;
                        let finalLeft = 50 + ((index - 1) * 30);
                        let initialOffset = numElement.offset();
                        // numElement.animate({
                        //     // top: finalTop + 'px',
                        //     left: finalLeft + 'px',
                        // }, 2000);

                        let holdElement = $("#rSlice" + x);
                        let newLeft = -10 + (index * 2) + "em"; // reduce the multiplier for closer numbers
                        $(numElement).css("border-width", "0px")
                        $(numElement).css("background-color", "transparent")
                        $(numElement).addClass("dot");

                        // setTimeout(function() {
                        //     $(numElement).animate({
                        //         borderWidth: "2px"
                        //     }, 100);
                        // }, 1)

                        // $(numElement).animate({
                        //     borderWidth: "2px"
                        // }, 2000);



                        // console.log(numberLoc[x][0])

                        let rotationSoFar = numberLoc[x][0];
                        console.log(numberLoc[x])
                
                        // animate rotation to 0
                        // (dest % 360)
                        $({deg: numberLoc[x][0]}).animate({deg: 0 - (dest%360)}, {
                            duration: 2000,
                            step: function(now) {
                                holdElement.css({
                                    transform: 'rotate(' + now + 'deg)'
                                });
                            }
                        });


                

                        // animate rotation to 0 for numElement
                        // $({deg: 15}).animate({deg: 0}, {
                        //     duration: 2000,
                        //     step: function(now) {
                        //         numElement.css({
                        //             transform: 'rotate(' + now + 'deg)'
                        //         });
                        //     }
                        // });
                
                        // // animate left property
                        // numElement.animate({
                        //     left: newLeft,
                        // }, 2000);


                        // animate color to black for numElement

                        numElement.animate({
                            color: '#000',
                        }, 400)
                        
                        numElement.animate({
                            // color: '#000',
                            left: newLeft,
                            // top: '14.3em',
                            // top: '6.8em',
                            borderWidth: "2px",
                            width:  "30px",
                            height: "30px"
                            // left: 0
                        }, 2000);

                        // setTimeout(function() {

                        //     let dotDivs = document.querySelectorAll('.dot');
                        //     let firstDotDiv = dotDivs[0];
                        //     let div1Position = firstDotDiv.getBoundingClientRect();
                        //     let div2 = document.getElementById('line-pair-top');
                        //     div2.style.top = ((div1Position.top + div1Position.bottom) / 2) + 'px';


                        // }, 2001)


                    })
                // }, 9000);
                }, 3000);
            }
    

            function generateLinePairs(){

                if (mainTrialsCompleted < trialsWithoutChoice){
                    createInstructionsEarlyTrials();
                } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "open_ended"){
                    createInstructionsForFirstChoice(openEndedQuestion);
                } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "multiple_choice"){
                    createInstructionsForFirstChoice(multipleChoiceQuestion);
                } else if (mainTrialsCompleted > trialsWithoutChoice && choiceType == "multiple_choice"){
                    linePairAttributes.beginningMessage.html(`Once again, choose which of the sets of pairs of numbers to work with. When you make your choice, we\'ll then tell you whether the winning number is on the top line or bottom line of the set you chose.<br>${linePairAttributes.rememberNote}`);
                    multipleChoiceQuestion("moveDots");
                }
            }

            function finishSpin(){

                let dotContainer = document.getElementById('dotContainer');
                dotContainer.innerHTML += `
                <div id="beginning-message" class="message-container"></div>
                <div class="line-pair-container"></div>
                <div class="button-message-container">
                    <div id="incomplete-message" class="message-container"></div>
                    <button id="numberlineButton"></button>    
                </div>
                `

                linePairAttributes.linePairContainer  = document.querySelector(".line-pair-container");
                linePairAttributes.beginningMessage = $('#beginning-message');
                linePairAttributes.numberlineButton = $("#numberlineButton");
                linePairAttributes.numberlineButton.css("opacity", "0");
                linePairAttributes.rememberNote = "<p>Remember, the winning number is already chosen, so your choice only affects what information you learn ahead of the memory game about the outcome; it does not affect the outcome itself.</p>";

                ballLandedNotification();



                // generateLinePairs();




                

            //     <div class="line-pair-container">                    
            //     <div id="line-pair-top" class="line-pair" style="border-color: white;">
            //         <div id="line-wrapper-top" class="line-wrapper">
            //             <div class="line line-top">
            //             </div>
            //         </div>
            //     </div>
            //     <div id="line-pair-bottom" class="line-pair" style="border-color: white;">
            //         <div id="line-wrapper-top" class="line-wrapper">
            //             <div class="line line-top">
            //             </div>
            //         </div>
            //     </div>
            // </div>



                // for (var i = 0; i < numOfWheelNumbers; i++) {
                //     let possiblePayout = wheelNumbers[i];

                //     numberLoc[possiblePayout] = [];
                //     numberLoc[possiblePayout][0] = i * temparc;
                //     numberLoc[possiblePayout][1] = i * temparc + temparc;
                // }


                // if (mainTrialsCompleted < trialsWithoutChoice){
                //     createInstructionsEarlyTrials();
                // } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "open_ended"){
                //     createInstructionsForFirstChoice(openEndedQuestion);
                // } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "multiple_choice"){
                //     createInstructionsForFirstChoice(multipleChoiceQuestion);
                // } else if (mainTrialsCompleted > trialsWithoutChoice && choiceType == "multiple_choice"){
                //     linePairAttributes.beginningMessage.html(`Once again, choose which of the sets of pairs of numbers to work with. When you make your choice, we\'ll then tell you whether the winning number is on the top line or bottom line of the set you chose.<br>${linePairAttributes.rememberNote}`);
                //     multipleChoiceQuestion("moveDots");
                // }
                


            }
            
            // function finishSpin(rndSpace, winningNum){

            //     OverlayBtn.removeEventListener('click', removeOverlay);
            //     document.querySelector('#btnSpin').style.display = 'none';

            //     if (trial.specialTrial == "demo" || trial.spinOrReveal == "spin"){
            //         display_element.innerHTML = '<div id="jspsych-content"></div>';
            //         jsPsych.finishTrial()
            //     } else if (trial.spinOrReveal == "reveal"){
            //         $(".spinner").css("top", "20px");
            //         $(".control").css("top", "20px");
            //         $(".control").css("position", "relative");
    
            //         explainRemainingNumbers();
            //         function explainRemainingNumbers(){

            //             document.getElementById("selection-explained").innerHTML = "The winning number was " + winningNum + ". You will earn " + winningNum + " points for the trial.";
            //             document.querySelector('#selection-explained').style.display = 'block';
            //         }
    
    
            //         document.querySelector('#btnproceed').style.display = "inline-block";
    
            //         document.querySelector('#btnproceed').addEventListener('click', () => {

            //             display_element.innerHTML = '<div id="jspsych-content"></div>';

            //             if (trial.specialTrial == "none") mainTrialsCompleted += 1;
        
            //             jsPsych.finishTrial({
            //                 winningNum: winningNum,
            //             })
            //         })
            //     }
            // }

            function activateHighlighting(winningNum){

                removeOverlay();
                
                document.querySelector('.other-buttons').style.display = "inline-block";

                // set explanation text here

                var down = false;
                $(document).mousedown(function() {
                    down = true;
                }).mouseup(function() {
                    down = false;  
                });
            
                let mouseX; let mouseY;

                let prevPieDiv;

                function mouseMoveListener(event){
                    mouseX = event.clientX;
                    mouseY = event.clientY;

                    changeColor(mouseX, mouseY, "mousemove");
                }

                function mouseDownListener(event){
                    down = true
                    changeColor(mouseX, mouseY, "mousedown");
                }
            
                document.addEventListener('mousemove', mouseMoveListener);
                
                document.addEventListener('mousedown', mouseDownListener);
            
                function changeColor(x, y, z){
            
                    let topDivAtPoint =  document.elementFromPoint(x, y)
                    let allDivsAtPoint =  document.elementsFromPoint(x, y)
            
                    let pieDiv = allDivsAtPoint.filter(el => el.classList.contains('pie'))[0]
            
                    const classNamesToCheck = ['hold', 'pie', 'num']
            
                    if (pieDiv && down && (z == "mousedown" ||  prevPieDiv != pieDiv) && classNamesToCheck.some(el => topDivAtPoint.classList.contains(el))){
            
                        prevPieDiv = pieDiv;
                        
                        assignColors(pieDiv, pieDiv.style.background == wheelSelectedColor);
                    }  
                }
            
                btnselect.addEventListener('click', () => {
                    document.querySelector('.other-buttons').style.display = "none";
                    checkPieSelectedNumbers(winningNum, mouseDownListener, mouseMoveListener);
                })
            }

            function constructCardBarContainer(mouseInstruction, cardsExist, barsExist, numberlineExists){
                $(overlay).append(`
                    <div id="card-bar-container">
                        <div id="mouse-card-instruction"></div>
                    </div>
                `);

                if (omission == "ball"){
                    $("#card-bar-container").css("top", "49%");
                } else if (omission == "numbers"){
                    $("#card-bar-container").css("top", "51%");
                }

                function setMouseInstructions(){
                    if (choiceType == "individual"){
                        if (cardsExist && barsExist){
                            return (mouseInstruction + "Just hold your mouse down and then scroll. Alternatively, you can click on the bars underneath, which correspond to the tiles that are displayed.");
                        } else{
                            return (mouseInstruction);
                        }
                    } else if (choiceType == "chunk"){
                        let increaseSpacingForInstructionConsistency;
                        if (trial.specialTrial == "practice1"){
                            increaseSpacingForInstructionConsistency = ".<br><br><br>";
                        } else if (trial.specialTrial == "practice2"){
                            increaseSpacingForInstructionConsistency = " (note that, in this case, the two choices are identical, because they split the numbers the same way)."
                        } else {
                            increaseSpacingForInstructionConsistency = ".";
                        }
                        return (`Select how you would like to subset the numbers${increaseSpacingForInstructionConsistency}`);
                    }
    
                }

                document.getElementById("mouse-card-instruction").innerHTML = setMouseInstructions();


                function generateCard(indexOfNum, topOrBottom, possiblePayout, displayColor){
                    $(`#card-container-${topOrBottom}`).append(`<li id='${topOrBottom}crd${possiblePayout}' class='card ${topOrBottom}-card' style="background-color:${displayColor}">${possiblePayout}</li>`);
                }

                function generateBar(indexOfNum, topOrBottom, possiblePayout, displayColor){
                    let topOfBar = (indexOfNum % 2 === 0) ? '780' :'580';
                    let bottomOfBar = (indexOfNum % 2 === 0) ? '50' :'240';
                    $(`#bar-container-${topOrBottom}`).append(`
                        <svg viewBox='495 -630 110 840' width='100%' class='aviewbox' id='${topOrBottom}viewbox${possiblePayout}'>
                            <path class='bar ${topOrBottom}-bar' id="${topOrBottom}bar${possiblePayout}" fill="${displayColor}" transform = "rotate(-90 100 100)" d="M${topOfBar}.33,500c27.61,0,50,22.39,50,50,0,25.99-19.83,47.35-45.18,49.77l-4.82,.23H${bottomOfBar}c-27.61,0-50-22.39-50-50,0-25.99,19.83-47.35,45.18-49.77l4.82-.23H383.33Z"/>
                        </svg>
                    `)
                }

                function generateNumberLine(indexOfNum, topOrBottom, possiblePayout, displayColor){
                    if (indexOfNum % trial.freqBars == 0) {
                        let numberWidth = $('#numberline').width() / (numberLine.length / trial.freqBars);
                        $('#numberline').append(`
                            <div id="numberline${possiblePayout}" class="num-on-numline" style="width:${numberWidth}px;" >${possiblePayout}</div>
                        `)
                        $(`#numberline${possiblePayout}`).boxfit();
                    }
                }

                function generateCardsBarsOrNumberline(numberArray, afunc, topOrBottom){
                    for (var indexOfNum = 0; indexOfNum < numberArray.length; indexOfNum++) {

                        let possiblePayout = wheelNumbersAscending[indexOfNum];
                        let displayColor;
                        
                        if (choiceType == "individual"){
                            displayColor = unselectedCardBarColor;
                        } else if (choiceType == "chunk"){
                            if (topOrBottom == "top"){
                                if (topchunk0.includes(possiblePayout)){
                                    displayColor = chunk0Color;
                                } else if (topchunk1.includes(possiblePayout)){
                                    displayColor = chunk1Color;
                                }
                            } else if (topOrBottom == "bottom"){
                                if (bottomchunk0.includes(possiblePayout)){
                                    displayColor = chunk0Color;
                                } else if (bottomchunk1.includes(possiblePayout)){
                                    displayColor = chunk1Color;
                                }
                            }
                        }

                        afunc(indexOfNum, topOrBottom, possiblePayout, displayColor);
                    }
                }

                function increaseNumberlineFontSize(){
                    let allBoxfittedFontSizes = [];
                
                    $(".boxfitted").map(function() {
                        allBoxfittedFontSizes.push(parseInt($(this)[0].style.fontSize.split("px")[0]));
                    });
    
                    let barMarginRight = $(".num-on-numline").css("margin-right").split("px")[0];
    
                    let smallestFont = Math.min.apply(Math, allBoxfittedFontSizes) - barMarginRight;
    
                    $(".boxfitted").map(function() {
                        $(this).css("font-size", smallestFont + "px");
                    })
    
                }

                function addNumberline(){
                        $('#card-bar-container').append("<div id='numberline'></div>");
                        generateCardsBarsOrNumberline(numberLine, generateNumberLine, "NA");
                        increaseNumberlineFontSize();
                }

                if (cardsExist){
                    $('#card-bar-container').append("<ul class='card-container' id='card-container-top'></ul>");
                    generateCardsBarsOrNumberline(wheelNumbersDisplayOrder, generateCard, "top");
                    let cssCardAttributes, cssCardContainerAttributes;
                    console.log("hello?")

                    if (choiceType == "chunk"){

                        if (numberlineExists) addNumberline();

                        $('#card-bar-container').append("<ul class='card-container' id='card-container-bottom'></ul>");
                        generateCardsBarsOrNumberline(wheelNumbersDisplayOrder, generateCard, "bottom");
                        cssCardAttributes = {
                            "width": '90.6px',
                            "height": '130px',
                            'line-height': '130px'
                        }
                        cssCardContainerAttributes = {
                            "display": 'inline-flex',
                            "border-width": '20px',
                            "border-color": chunkBorderUnselectedColor
                        }
                    } else if (choiceType == "individual"){
                        cssCardAttributes = {
                            "width": '107.3px',
                            "height": '200px',
                            'line-height': '180px'
                        }
                        cssCardContainerAttributes = {
                            "display": 'inline-block',
                            "border-width": '2px',
                            "border-color": 'black'
                        }
                    }

                    let arrayOfCSSAttributes = [["", cssCardAttributes], ["-container", cssCardContainerAttributes]];
                    arrayOfCSSAttributes.map(([cardOrContainer, cssAttributes]) => {
                        for (const property in cssAttributes){
                            $(`.card${cardOrContainer}`).css(property, cssAttributes[property]);
                        }
                    })


                    // // ["cardOrContainer", cssCardAttributes]
                    // [["top", "bottom"], ["bottom", "top"]].map(([x, y]) => {
                    //     console.log(x)
                    // })

                    // for (const cssAttributes in [["", cssCardAttributes], ["-container", cssCardContainerAttributes]]){
                    //     for (const property in cssAttributes[1]){
                    //         console.log(`.card${cssAttributes[0]}`)
                    //         $(`.card${cssAttributes[0]}`).css(property, cssAttributes[property]);
                    //     }
                    // }
                }

                if (barsExist){
                    $('#card-bar-container').append("<div class='bar-container' id='bar-container-top'></div>");
                    generateCardsBarsOrNumberline(wheelNumbersDisplayOrder, generateBar, "top");

                    if (numberlineExists) addNumberline();
                    
                    if (choiceType == "chunk"){
                        $('#card-bar-container').append("<div class='bar-container' id='bar-container-bottom'></div>");
                        generateCardsBarsOrNumberline(wheelNumbersDisplayOrder, generateBar, "bottom");
                    }
                }

                $('#card-bar-container').append("<button id='card-bar-ok-button'>OK</button>");

            }

            function colorBorder(cardOrBar, position, color){
                document.querySelector(`#${cardOrBar}-container-${position}`).style.borderColor = color;
            }

            function cardBarListeners(winningNum, cardsExist, barsExist, numberlineExists){

                let hoveredElement;
                let mouseX = 0, mouseY = 0;

                let cardBarOkButton = document.getElementById("card-bar-ok-button");

                function hover(targetElement) {
                    
                    // If the target and stored element are the same, return early
                    // because setting it again is unnecessary.
                    if (hoveredElement === targetElement) {
                      return;
                    }

                    // On first run, `hoveredElement` is undefined.
                    if (hoveredElement) {
                      hoveredElement.classList.remove('hover');
                      if (choiceType == "chunk" && hoveredElement.classList.contains('bar')){ // should I add cards as well?
                          hoveredElement.style.filter = "brightness(1)";
                        }
                    }
            
                    hoveredElement = targetElement;
                    if (choiceType == "chunk" && hoveredElement.classList.contains('bar')){ // should I add cards as well?
                      hoveredElement.style.filter = "brightness(.9)";
                    }
                    hoveredElement.classList.add('hover');

                    return(hoveredElement);
                }

                function mouseMoveListener(event){
                    mouseX = event.clientX;
                    mouseY = event.clientY;
                    return (hover(event.target));
                }

                if (choiceType == "individual"){

                    var down = false;
                    let prevSelectedElementNum;
                    $(document).mousedown(function() {
                        down = true;
                        prevSelectedElementNum = "NA"
                    }).mouseup(function() {
                        down = false;  
                    });

                    function switchColor(hoveredElement){

                        if (prevSelectedElementNum != hoveredElement && (hoveredElement.classList.contains('card') || hoveredElement.classList.contains('bar') ||  hoveredElement.classList.contains('aviewbox'))) {

                            let elementNum, cardElement, barElement, aviewBox;
    
                            if (hoveredElement.classList.contains('card')){
                                cardElement = hoveredElement;
                                elementNum = hoveredElement.id.split('topcrd')[1];
                                barElement = document.getElementById(`topbar${elementNum}`);
                            } else if (hoveredElement.classList.contains('bar')){
                                barElement = hoveredElement;
                                elementNum = hoveredElement.id.split('topbar')[1];
                                cardElement = document.getElementById(`topcrd${elementNum}`);
                                $('#card-container-top').scrollTo(cardElement, {offset:-400});
                            } else if (hoveredElement.classList.contains('aviewbox')){
                                aviewBox = hoveredElement;
                                elementNum = hoveredElement.id.split('topviewbox')[1];
                                barElement = document.getElementById(`topbar${elementNum}`);
                                cardElement = document.getElementById(`topcrd${elementNum}`);
                                $('#card-container-top').scrollTo(cardElement, {offset:-400});
                            }

                            if (elementNum != prevSelectedElementNum){
                                prevSelectedElementNum = elementNum;

                                if (cardElement){
                                    if (cardElement.style.backgroundColor == selectedCardBarColor){
                                        cardElement.style.backgroundColor = unselectedCardBarColor;
                                    } else {
                                        cardElement.style.backgroundColor = selectedCardBarColor;
                                    }
                                }

                                if (barElement){
                                    if (barElement.style.fill == selectedCardBarColor){
                                        barElement.style.fill = unselectedCardBarColor;
                                    } else {
                                        barElement.style.fill = selectedCardBarColor;
                                    }
                                }
                            }
    
                            checkCardBarSelectedNumbers("button", cardBarOkButton, cardsExist, barsExist);
                        }
                    }

                    function checkMoveAndScroll(listener){
                        if (listener && down){
                            switchColor(listener);
                        }
                    }

                    function checkMove(event){
                        checkMoveAndScroll(mouseMoveListener(event));
                    }
                    document.addEventListener('mousemove', checkMove);

                    let mouseDownWhileScrollingListener

                    if (cardsExist){

                        function mouseDownWhileScrollingListener(event){
                            const hoverTarget = document.elementFromPoint(mouseX, mouseY);
                            if (hoverTarget) {
                                checkMoveAndScroll(hover(hoverTarget));
                            }
                        }

                        document.getElementById("card-container-top").addEventListener('scroll', mouseDownWhileScrollingListener);
                    }

                    function mouseDownListener(event){
                        switchColor(hoveredElement);
                    }
                    document.addEventListener('mousedown', mouseDownListener);


                     function moveOnToFading(event){
                        checkCardBarSelectedNumbers("endOfTrial", cardBarOkButton, cardsExist, barsExist, numberlineExists, winningNum, mouseDownListener, checkMove, mouseDownWhileScrollingListener, "top", moveOnToFading, selectedCardBarColor, selectedCardBarColorEnglish, unselectedCardBarColor, unselectedCardBarColorEnglish);
                    }

                    cardBarOkButton.addEventListener('click', moveOnToFading);

                } else if (choiceType == "chunk"){

                    createClickListenersForBothChunks();

                    document.addEventListener('mousemove', mouseMoveListener);

                    // check if I can move this function inside selectChunk, or if removelistener will not work
                    function moveOnToFading(event){
                        // console.log(event.currentTarget.selectedBarsLocation);

                        function removeChunkListeners(){
                            ["top", "bottom"].map(x => {
                                let cardOrBar = (cardsExist) ? "card" : "bar";
                                $(`#${cardOrBar}-container-${x}`).off('click');
                            });
                        }
                        removeChunkListeners();

                        
                        checkCardBarSelectedNumbers("endOfTrial", cardBarOkButton, cardsExist, barsExist, numberlineExists, winningNum, null, mouseMoveListener, null, event.currentTarget.selectedBarsLocation, moveOnToFading, chunk0Color, chunk0ColorEnglish, chunk1Color, chunk1ColorEnglish);
                    }

                    function selectChunk(selectedPosition, notSelectedPosition, cardOrBar){

                        // deactivates border not selected (whether or not it was already deactivated)
                        colorBorder(cardOrBar, notSelectedPosition, chunkBorderUnselectedColor);

                        if (document.querySelector(`#${cardOrBar}-container-${selectedPosition}`).style.borderColor == chunkBorderSelectedColor){

                            // remove border
                            colorBorder(cardOrBar, selectedPosition, chunkBorderUnselectedColor);

                            // button to proceed deactivates
                            buttonColorChange("white", cardBarOkButton);
                            cardBarOkButton.removeEventListener('click', moveOnToFading);

                        } else {
                            
                            // add border
                            colorBorder(cardOrBar, selectedPosition, chunkBorderSelectedColor);

                            // button to proceed activates
                            buttonColorChange("black", cardBarOkButton);
                            cardBarOkButton.addEventListener('click', moveOnToFading);
                            cardBarOkButton.selectedBarsLocation = selectedPosition;
                        }

                    }

                    function createClickListenersForBothChunks(){
                        [["top", "bottom"], ["bottom", "top"]].map(([x, y]) => {
                            let cardOrBar = (cardsExist) ? "card" : "bar";
                            $(`#${cardOrBar}-container-${x}`).on("click", function(){
                                selectChunk(x, y, cardOrBar);
                            });
                        });
                    }
                }
            }

            function buttonColorChange(toColor, cardBarOkButton){
                let cssAttributes;
                if (toColor == "black"){
                    cssAttributes = {
                        "backgroundColor": cardBarOkButtonBlackColor,
                        "color": cardBarOkButtonWhiteColor
                    }
                } else if (toColor == "white"){
                    cssAttributes = {
                        "backgroundColor": cardBarOkButtonWhiteColor,
                        "color": cardBarOkButtonBlackColor
                    }
                }
                for (const property in cssAttributes){
                    cardBarOkButton.style[property] = cssAttributes[property];
                }
            }

            function assignColors(pieDivv, bool, newBackground=wheelSelectedColor, newColor=blackColor){

                let divNum = pieDivv.id.split('hold')[1]
                let NumDiv = document.getElementById("num" + divNum)
        
                if (bool) {
                    NumDiv.style.color = whiteColor;
                    if ( pieDivv.classList.contains('redbg')){
                        pieDivv.style.background = redGradient;
                    } else {
                        pieDivv.style.background = blackGradient;
                    }
                } else {
                    NumDiv.style.display = "block";
                    pieDivv.style.background = newBackground; // plateBGColor;
                    NumDiv.style.color = newColor;
                }
            }

            function checkSelectedNumbers(pieOrCardOrBar, pieOrCardOrBarAbbr, backgroundOrFill, selectedColor){

                let selectedPayouts = [];
                let unSelectedPayouts = [];

                $(pieOrCardOrBar).map(function(i, div) {
                    let possiblePayout = div.id.split(pieOrCardOrBarAbbr)[1];
                    let divColor = ($(div)).css(backgroundOrFill);

                    if (divColor == selectedColor){
                        selectedPayouts.push(possiblePayout);
                    } else {
                        unSelectedPayouts.push(possiblePayout);
                    }
                });

                return [selectedPayouts, unSelectedPayouts]
            }

            function checkPieSelectedNumbers(winningNum, mouseDownListener, mouseMoveListener){

                let payouts = checkSelectedNumbers(".pie", "pie", "background", wheelSelectedColor);
                let selectedPayouts = payouts[0];
                let unSelectedPayouts = payouts[1];

                if (selectedPayouts.length > 0 && selectedPayouts.length < numOfWheelNumbers){
                    displayRemainingNumbersOnWheel("pie", false, winningNum, mouseDownListener, mouseMoveListener, null, plateBGColor, topOrBottom, selectedPayouts, unSelectedPayouts);
                }
            }

            function checkCardBarSelectedNumbers(buttonOrEndOfTrial, cardBarOkButton, cardsExist, barsExist, numberlineExists, winningNum, mouseDownListener, mouseMoveListener, mouseDownWhileScrollingListener, topOrBottom="top", moveOnToFading, selectedColor=selectedCardBarColor, selectedColorEnglish, unselectedColor, unselectedColorEnglish){

                function checkSelectedNumbersByTopOrBottom(topOrBottom){
                    if (cardsExist){
                        return checkSelectedNumbers(`.${topOrBottom}-card`, "crd", "background-color", selectedColor);
                    } else {
                        return checkSelectedNumbers(`.${topOrBottom}-bar`, "bar", "fill", selectedColor);
                    }
                }

                let payouts = checkSelectedNumbersByTopOrBottom(topOrBottom);

                let selectedPayouts = payouts[0];
                let unSelectedPayouts = payouts[1];

                if ((choiceType == "chunk") || (selectedPayouts.length > 0 && selectedPayouts.length < numOfWheelNumbers)){
                    if (buttonOrEndOfTrial == "button"){
                        buttonColorChange("black", cardBarOkButton);
                    } else if (buttonOrEndOfTrial == "endOfTrial"){
                        document.getElementById("card-bar-ok-button").removeEventListener('click', moveOnToFading);
                        document.removeEventListener('mousedown', mouseDownListener);
                        document.removeEventListener('mousemove', mouseMoveListener);
                        if (cardsExist){
                            document.getElementById("card-container-top").removeEventListener('scroll', mouseDownWhileScrollingListener);
                        }
                        fadePartOfCardBarNumberline(cardBarOkButton, cardsExist, barsExist, numberlineExists, winningNum, mouseDownListener, mouseMoveListener, mouseDownWhileScrollingListener, topOrBottom, selectedColor, selectedColorEnglish, unselectedColor, unselectedColorEnglish, selectedPayouts, unSelectedPayouts, checkSelectedNumbersByTopOrBottom);
                    }
                } else if (buttonOrEndOfTrial == "button"){
                    buttonColorChange("white", cardBarOkButton);
                }

            }

            function fadePartOfCardBarNumberline(cardBarOkButton, cardsExist, barsExist, numberlineExists, winningNum, mouseDownListener, mouseMoveListener, mouseDownWhileScrollingListener, topOrBottom, selectedColor, selectedColorEnglish, unselectedColor, unselectedColorEnglish, selectedPayouts, unSelectedPayouts, checkSelectedNumbersByTopOrBottom){

                let payoutsToFadeOut, colorWithWinningNumber, colorWithWinningNumberEnglish, colorNotWithWinningNumber, colorNotWithWinningNumberEnglish, didOrDidNotSelect, hadOrHadNot;

                function setColors(){
                    if (selectedPayouts.includes(winningNum)){
                        payoutsToFadeOut = unSelectedPayouts;
                        colorWithWinningNumber = selectedColor;
                        colorWithWinningNumberEnglish = selectedColorEnglish;
                        colorNotWithWinningNumber = unselectedColor;
                        colorNotWithWinningNumberEnglish = unselectedColorEnglish;
                        didOrDidNotSelect = "selected";
                        hadOrHadNot = "<b>not selected</b>"
    
                    } else {
                        payoutsToFadeOut = selectedPayouts;
                        colorWithWinningNumber = unselectedColor;
                        colorWithWinningNumberEnglish = unselectedColorEnglish;
                        colorNotWithWinningNumber = selectedColor;
                        colorNotWithWinningNumberEnglish = selectedColorEnglish;
                        didOrDidNotSelect = "did not select";
                        hadOrHadNot = "<b>selected</b>"
                    }
                }

                setColors();
                
                function changeOpacityAndInstructions(payoutsToFade, increaseOrDecreaseOpacity, instructions, next, next2=null){
                    if (instructions != ""){
                        document.getElementById("mouse-card-instruction").innerHTML = instructions;
                    }
                    $(cardBarOkButton).off('click');
                    buttonColorChange("white", cardBarOkButton);
    
                    let opacity;
                    let opacityMultiplier;
                    if (increaseOrDecreaseOpacity == "decrease"){
                        opacity = 1;
                        opacityMultiplier = 1;
                    } else if (increaseOrDecreaseOpacity == "increase"){
                        opacity = 0;
                        opacityMultiplier = -1
                    }
                    let opacityGoal = 1 - opacity;

                    let interval = setInterval(function() {
                        if ((increaseOrDecreaseOpacity == "decrease" && opacity < .15) || (increaseOrDecreaseOpacity == "increase" && opacity > 1) || increaseOrDecreaseOpacity == "N/A" ){
                        // if (opacity * opacityMultiplier - .15 < opacityGoal * opacityMultiplier) {
                            clearInterval(interval);
                            buttonColorChange("black", cardBarOkButton);
                            if (next2 != null){
                                $(cardBarOkButton).on('click', next2);
                            }
                            $(cardBarOkButton).on('click', next);
                        } else {
                            opacity -= .05 * opacityMultiplier;

                            function setOpacityTopAndOrBottom(topOrBottom){
                                function setOpacity(topOrBottom, crdOrBarOrNumberline){
                                    payoutsToFade.map(x => {
                                        let div = `#${topOrBottom}${crdOrBarOrNumberline}${x}`;
                                        document.querySelector(div).style.opacity = opacity;
                                    })
                                }
    
                                if (cardsExist){
                                    setOpacity(topOrBottom, "crd");
                                }
                                if (barsExist){
                                    setOpacity(topOrBottom, "bar");
                                }
                                if (numberlineExists){
                                    setOpacity("", "numberline");
                                }
                            }
                            setOpacityTopAndOrBottom("top");
                            if (choiceType == "chunk") setOpacityTopAndOrBottom("bottom");
                        }
                    }, 20);
                }

                // if (trial.SpecialTrial == "demo"){
                if (trial.specialTrial == "practice1"){

                    // function afunc(){
                    //     outerInstructions = `Since the winning number in this case is <span style='color:${colorWithWinningNumber}'><b>${winningNum}</b></span>, which is colored ${colorWithWinningNumberEnglish}, <span style='color:${unselectedColor}'>all of the numbers colored ${colorNotWithWinningNumberEnglish} would fade out.</span>`;
                    // }

                    // function afunc2(){
                    //     letouterInstructions = `You have chosen to reveal the winning number according to the way the ${topOrBottom} group is split. Since the winning number in this case is <span style='color:${colorWithWinningNumber}'><b>${winningNum}</b></span>, which is colored ${colorWithWinningNumberEnglish} on the ${topOrBottom}, <span style='color:${unselectedColor}'>all of the numbers colored ${colorNotWithWinningNumberEnglish} on the ${topOrBottom} would fade out.</span>`;
                    // }


                    // function outerFunction(){

                    //     let outerInstructions;

                    //     if (choiceType == "individual"){
                    //         outerInstructions = `Since the winning number in this case is <span style='color:${colorWithWinningNumber}'><b>${winningNum}</b></span>, which is colored ${colorWithWinningNumberEnglish}, all of the numbers colored ${colorNotWithWinningNumberEnglish} would fade out.`;
                    //     } else if (choiceType == "chunk"){
                    //         outerInstructions = `You have chosen to reveal the winning number according to the way the ${topOrBottom} group is split. Since the winning number in this case is <span style='color:${colorWithWinningNumber}'><b>${winningNum}</b></span>, which is colored ${colorWithWinningNumberEnglish} on the ${topOrBottom}, all of the numbers colored ${colorNotWithWinningNumberEnglish} on the ${topOrBottom} would fade out.`;
                    //     }

                    //     changeOpacityAndInstructions(payoutsToFadeOut, "decrease", outerInstructions, middleFunction);
                    // }

                    // outerFunction();

                    // function flashColor(startColor, endColor){
                    function flashColor(position, endColor){
                        function transitionColor (element, property, endColor) {

                            function lerp(start, end, t) {
                                return start * (1 - t) + end * t;
                            }

                            function parseRGB(rgbString) {
                                console.log(rgbString)
                                return rgbString
                                  .slice(4, -1) // Remove the "rgb(" and ")" parts
                                  .split(',') // Split the string by commas
                                  .map(Number); // Convert the strings to numbers
                            }
                            
                            // console.log(startColor)
                            // startColor = parseRGB(startColor);
                            // let  startColor = parseRGB('rgb(25, 179, 148)'); // rgb(179, 25, 95)
                            let startColor = parseRGB('rgb(179, 25, 95)');
                            const middleColor = parseRGB('rgb(255, 255, 255)'); // White color

                            endColor = parseRGB(endColor);
                            const duration = 4000; // Duration of the transition in milliseconds
                            const startTime = performance.now();
                            
                            function animate(time) {
                                const elapsedTime = time - startTime;
                                const t = Math.min(elapsedTime / duration, 1); // Clamp the value of t between 0 and 1
                            
                                let currentColor;
                                if (t < 0.5) {
                                    const tMiddle = t * 2;
                                    currentColor = startColor.map((channel, index) => {
                                        return Math.round(lerp(channel, middleColor[index], tMiddle));
                                    });
                                } else {
                                    const tEnd = (t - 0.5) * 2;
                                    currentColor = middleColor.map((channel, index) => {
                                        return Math.round(lerp(channel, endColor[index], tEnd));
                                    });
                                }
                            
                                let newColor = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
                                if (property == "fill"){
                                    element.style.fill = newColor;
                                } else if (property == "background-color"){
                                    element.style.backgroundColor = newColor;
                                }
                                // $(`#top${cardOrBar}${winningNum}`).css(property, color);
                            
                                if (t < 1) {
                                    requestAnimationFrame(animate);
                                }
                            }
                            
                            requestAnimationFrame(animate);
                        }

                        if (cardsExist){
                            const element = document.getElementById(`${position}crd${winningNum}`);

                            if (endColor == "stay the same"){
                                endColor = element.style.backgroundColor;
                            }
                            transitionColor(element, 'background-color', endColor);
                        }

                        if (barsExist){
                            const element = document.getElementById(`${position}bar${winningNum}`);

                            if (endColor == "stay the same"){
                                endColor = element.style.fill;
                            }
                            transitionColor(element, 'fill', endColor);
                        }
                    }

                    beforeColorChange();

                    function beforeColorChange(){

                        // beforeColorChangeA();

                        function setInstructions(textOpacity){

                            function beginning(positionInfo){
                                return (`The winning number is one of the numbers colored <span style='color:${colorWithWinningNumber}'>${colorWithWinningNumberEnglish}</span>${positionInfo}.<span style='opacity:${textOpacity}'> (In this particular example, <b>${winningNum}</b> is the winning number.`)
                            }
    
                            if (choiceType == "individual"){
    
                                // return (`Since the winning number in this case is <span style='color:${colorWithWinningNumber}'><b>${winningNum}</b></span>, which is colored ${colorWithWinningNumberEnglish}, <span style='color:${textColor}'>all of the numbers colored ${colorWithWinningNumberEnglish} would remain.</span><br><br>`)
                                // return (`The winning number is one of the numbers colored ${colorWithWinningNumberEnglish}. (In this particular example, <span style='color:${colorWithWinningNumber}'><b>${winningNum}</b></span> is the winning number. It was one of the number you selected, so it is colored blue.</span><br><br>`)
                                return (`${beginning("")} As you\'ll recall, it was one of the numbers you <span style='color:${colorWithWinningNumber}'>${didOrDidNotSelect}</span>, so it is colored <span style='color=${colorWithWinningNumber}'>${colorWithWinningNumberEnglish}</span>).</span><br><br>`)
                            } else if (choiceType == "chunk"){
                                let beginningOutput = beginning(` on the ${topOrBottom}`);
                                // let numColor;
                                // if (textColor == whiteColor){
                                //     numColor = whiteColor;
                                // } else {
                                //     numColor = colorWithWinningNumber;
                                // }
                                // return (`The winning number is one of the numbers colored ${colorWithWinningNumberEnglish}. (You have chosen to reveal the winning number according to the way the ${topOrBottom} group is split. <span style='color:${textColor}'>Since the winning number in this case is </span><span style='color:${numColor}'><b>${winningNum}</b></span><span style='color:${textColor}'>, which is colored ${colorWithWinningNumberEnglish} on the ${topOrBottom}, </span><span style='color:${textColor2}'>all of the numbers colored ${colorWithWinningNumberEnglish} on the ${topOrBottom} would remain.</span>`)
                                // return (`${beginningOutput} Even though it is `)
                                return (`${beginningOutput})</span><br><br>`)
                            }
                        }

                        beforeColorChangeA();
                        function beforeColorChangeA(){
                            changeOpacityAndInstructions(payoutsToFadeOut, "decrease", setInstructions(0), beforeColorChangeB);
                        }

                        function beforeColorChangeB(){
                            changeOpacityAndInstructions(payoutsToFadeOut, "N/A", setInstructions(1), beforeColorChangeC);
                            flashColor("top", "stay the same");
                            flashColor("bottom", "stay the same");
                        }

                        function beforeColorChangeC(){
                            changeOpacityAndInstructions(payoutsToFadeOut, "increase", setInstructions(1), afterColorChanges);
                        }



                        // function beforeColorChangeA(){
                        //     // if (choiceType == "individual"){
                        //         // outerInstructionsPartB();
                        //     // } else if (choiceType == "chunk"){
                        //         changeOpacityAndInstructions(payoutsToFadeOut, "N/A", setInstructions(whiteColor, whiteColor), beforeColorChangeB);
                        //         flashColor(colorWithWinningNumber, colorWithWinningNumber);
                        //     // }
                        //     // }
                        // }
                        // function beforeColorChangeB(){
                        //     changeOpacityAndInstructions(payoutsToFadeOut, "N/A", setInstructions('black', whiteColor), beforeColorChangeC);
                        // }
    
                        // function beforeColorChangeC(){
                        //     changeOpacityAndInstructions(payoutsToFadeOut, "decrease", setInstructions('black', 'black'), beforeColorChangeD);
                        // }
    
                        // function beforeColorChangeD(){
                        //     changeOpacityAndInstructions(payoutsToFadeOut, "increase", "", afterColorChanges);
                        // }
                        
                    }

                    function afterColorChanges(){

                        function afterColorChangesIndividual(){

                            function individualChoicesInstruction(textOpacity1, textOpacity2){
                                // return (`Conversely, if you had <span style='color:${colorNotWithWinningNumber}'>${hadOrHadNot}</span> ${winningNum}, ${winningNum} would have been colored ${colorNotWithWinningNumberEnglish},<span style='color:${textColor}'> and all of the ${colorNotWithWinningNumberEnglish} numbers would have remained.</span><br><br>`)
                                return (`Note that if instead you had <span style='color:${colorNotWithWinningNumber}'>${hadOrHadNot}</span> ${winningNum},<span style='opacity:${textOpacity1}'> ${winningNum} would have been colored <span style='color:${colorNotWithWinningNumber}'>${colorNotWithWinningNumberEnglish}</span>.</span><span style='opacity:${textOpacity2}'> In that case, you would know only that the winning number was one of the numbers colored ${colorNotWithWinningNumberEnglish}.</span><br><br>`)
                            }

                            let arrayToSplice;
                            function swapColor(){
                                let indexUnselected = unSelectedPayouts.indexOf(winningNum);
                                let indexSelected = selectedPayouts.indexOf(winningNum);
                                if (indexUnselected == -1) {
                                    selectedPayouts.splice(indexSelected, 1);
                                    unSelectedPayouts.push(winningNum);
                                    arrayToSplice = selectedPayouts;
                                    // flashColor('rgb(179, 25, 95)', unselectedColor);
                                    console.log("1")
                                } else {
                                    unSelectedPayouts.splice(indexUnselected, 1);
                                    selectedPayouts.push(winningNum);
                                    arrayToSplice = unSelectedPayouts;
                                    // flashColor('rgb(179, 25, 95)', selectedColor);
                                    console.log("2")
                                }
                            }

                            function swapColorBack(){
                                let indexUnselected = unSelectedPayouts.indexOf(winningNum);
                                let indexSelected = selectedPayouts.indexOf(winningNum);
                                if (indexUnselected == -1) {
                                    selectedPayouts.splice(indexSelected, 1);
                                    unSelectedPayouts.push(winningNum);
                                } else {
                                    unSelectedPayouts.splice(indexUnselected, 1);
                                    selectedPayouts.push(winningNum);
                                }
                            }

                            partA();
                            function partA(){
                                swapColor();
                                changeOpacityAndInstructions(unSelectedPayouts, "N/A", individualChoicesInstruction(0, 0), partB);
                            }

                            function partB(){
                                changeOpacityAndInstructions(unSelectedPayouts, "N/A", individualChoicesInstruction(1, 0), partC);
                                if (selectedPayouts.includes(winningNum)){
                                    // flashColor('rgb(179, 25, 95)', selectedColor);
                                    flashColor('top', selectedColor);
                                } else {
                                    flashColor('top', unselectedColor);
                                    // flashColor('rgb(179, 25, 95)', unselectedColor);
                                }
                            }

                            function partC(){
                                changeOpacityAndInstructions(arrayToSplice, "decrease", individualChoicesInstruction(1, 1), moveToWheel, swapColorBack);
                            }

                        }

                        function afterColorChangesChunk(){

                            let oppositeTopOrBottom;
                            if (topOrBottom == "top"){
                                oppositeTopOrBottom = "bottom";
                            } else {
                                oppositeTopOrBottom = "top";
                            }

                            let payoutsOtherTopOrBottom = checkSelectedNumbersByTopOrBottom(oppositeTopOrBottom);
    
                            let payoutsToFadeOutOtherTopOrBottom;

                            if (payoutsOtherTopOrBottom[0].includes(winningNum)){
                                payoutsToFadeOutOtherTopOrBottom = payoutsOtherTopOrBottom[1];
                            } else {
                                payoutsToFadeOutOtherTopOrBottom = payoutsOtherTopOrBottom[0];
                            }

                            function chunkChoicesInstruction(textOpacity1, textOpacity2, textOpacity3){
                                // console.log(textColor);
                                // console.log(colorWithWinningNumberEnglish)
                                return (`Note that the color of ${winningNum} is different on the ${oppositeTopOrBottom}.<span style='opacity:${textOpacity1}'> If instead you had selected the ${oppositeTopOrBottom} group,</span><span style='opacity:${textOpacity2}'> where ${winningNum} is colored <span style='color:${colorNotWithWinningNumber}'>${colorNotWithWinningNumberEnglish}</span>,<span style='opacity:${textOpacity3}'> you would know only that the winning number was one of the numbers colored ${colorNotWithWinningNumberEnglish} on the ${oppositeTopOrBottom}.</span>`)// <span style='color:${textColor}'>all of the ${colorNotWithWinningNumberEnglish} numbers on the ${oppositeTopOrBottom} bar would have remained.</span><br><br>`)
                            }


                            partA();
                            function partA(){
                                changeOpacityAndInstructions(payoutsToFadeOutOtherTopOrBottom, "N/A", chunkChoicesInstruction(0, 0, 0), partB)
                            }

                            function partB(){
                                changeOpacityAndInstructions(payoutsToFadeOutOtherTopOrBottom, "N/A", chunkChoicesInstruction(1, 0, 0), partC)
                                let cardOrBar = (cardsExist) ? "card" : "bar";
                                colorBorder(cardOrBar, oppositeTopOrBottom, chunkBorderSelectedColor);
                                colorBorder(cardOrBar, topOrBottom, chunkBorderUnselectedColor);
                            }

                            function partC(){
                                changeOpacityAndInstructions(payoutsToFadeOutOtherTopOrBottom, "N/A", chunkChoicesInstruction(1, 1, 0), partD)
                                flashColor(oppositeTopOrBottom, "stay the same");
                            }

                            function partD(){
                                changeOpacityAndInstructions(payoutsToFadeOutOtherTopOrBottom, "decrease", chunkChoicesInstruction(1, 1, 1), moveToWheel)
                            }

                        }

                        if (choiceType == "individual"){
                            afterColorChangesIndividual();
                        } else if (choiceType == "chunk"){
                            afterColorChangesChunk();
                        }

                    }
                    


                } else {

                    let topOrBottomInWriting;
                    if (choiceType == "chunk"){
                        topOrBottomInWriting = ` on the ${topOrBottom}`;
                    } else if (choiceType == "individual"){
                        topOrBottomInWriting = ""; 
                    }

                    changeOpacityAndInstructions(payoutsToFadeOut, "decrease", `The ball landed on one of the numbers colored ${colorWithWinningNumberEnglish}${topOrBottomInWriting}.`, moveToWheel);


                    // moveToWheel();
                    // indicateCorrectNumbers(cardsExist, winningNum, mouseDownListener, mouseMoveListener, mouseDownWhileScrollingListener, selectedDivs, selectedNumDivs, unSelectedDivs, unSelectedNumDivs, selectedNums);
                    // changeOpacityAndInstructions(payoutsToFadeOut, "decrease", topOrBottom, "One of these numbers is where the ball landed.", function() {
                    //     removeOverlay();
                    //     displayRemainingNumbersOnWheel("cardBar", cardsExist, winningNum, mouseDownListener, mouseMoveListener, mouseDownWhileScrollingListener, selectedColor, topOrBottom, selectedPayouts, unSelectedPayouts);
                    //     // buttonColorChange("black", cardBarOkButton);
                    // })
                }

                function moveToWheel(){
                    removeOverlay();
                    displayRemainingNumbersOnWheel("cardBar", cardsExist, winningNum, mouseDownListener, mouseMoveListener, mouseDownWhileScrollingListener, whiteColor, topOrBottom, selectedPayouts, unSelectedPayouts);
                }

                function grabDivsThenFadeOut(possiblePayouts){
                    if (cardsExist){
                        fadeOut(possiblePayouts, topOrBottom, "crd");
                    }
                    if (barsExist){
                        fadeOut(possiblePayouts, topOrBottom, "bar");
                    }
                    if (numberlineExists){
                        fadeOut(possiblePayouts, "", "numberline");
                    }
                }

            }

            function displayRemainingNumbersOnWheel(pieOrCardBar, cardsExist, winningNum, mouseDownListener, mouseMoveListener, mouseDownWhileScrollingListener, numberColor, topOrBottom="NA", selectedPayouts, unSelectedPayouts) {
                $(".spinner").css("top", "20px");
                $(".control").css("top", "20px");
                $(".control").css("position", "relative");

                explainRemainingNumbers();
                function explainRemainingNumbers(){
                    let explanationOfRemainings;

                    if (omission == "ball"){
                        explanationOfRemainings =  "To reiterate, the possible points from this trial is one of the numbers in red or black."
                    } else if (omission == "numbers"){
                        explanationOfRemainings = "To reiterate, the possible points from this trial is not one of the numbers in brown."
                    }
    
                    document.getElementById("selection-explained").innerHTML = explanationOfRemainings;
                    document.querySelector('#selection-explained').style.display = 'block';
                }


                document.querySelector('#btnproceed').style.display = "inline-block";

                // document.removeEventListener('mousedown', mouseDownListener);
                // document.removeEventListener('mousemove', mouseMoveListener);
                // if (cardsExist){
                //     document.getElementById("card-container-top").removeEventListener('scroll', mouseDownWhileScrollingListener);
                // }

                function grabDiv(prefix, possiblePayout){
                    return(document.getElementById(prefix + possiblePayout));
                }

                if (selectedPayouts.includes(winningNum)){
                    selectedPayouts.map(possiblePayout => {
                        assignColors(grabDiv("hold", possiblePayout), true);
                    })

                    unSelectedPayouts.map(possiblePayout => {
                        assignColors(grabDiv("hold", possiblePayout), false, plateBGColor, numberColor);
                    })

                    if (pieOrCardBar == "pie"){
                        selectedPayouts.map(possiblePayout => {
                            assignColors((grabDiv("num", possiblePayout)).style.display = "block");
                        })
                    }
                }  else {

                    selectedPayouts.map(possiblePayout => {
                        assignColors(grabDiv("hold", possiblePayout), false, plateBGColor, numberColor);
                    })

                    unSelectedPayouts.map(possiblePayout => {
                        assignColors(grabDiv("hold", possiblePayout), true);
                    })

                    if (pieOrCardBar == "pie"){
                        unSelectedPayouts.map(possiblePayout => {
                            assignColors((grabDiv("num", possiblePayout)).style.display = "block");
                        })
                    }
                }
        
                document.querySelector('#btnproceed').addEventListener('click', () => {
                    endTrial(selectedPayouts, winningNum, topOrBottom);
                })

            }

            function endTrial(selectedNums, winningNum, topOrBottom){
                display_element.innerHTML = '<div id="jspsych-content"></div>';

                if (trial.spinOrReveal == "reveal") mainTrialsCompleted += 1;

                jsPsych.finishTrial({
                    // selectedNums: selectedNums,
                    // winningNum: winningNum,
                    // topOrBottom: topOrBottom,
                })
            }

            openingMessage();
        }
    }
    RoulettePlugin.info = info;

    return RoulettePlugin;

})(jsPsychModule);