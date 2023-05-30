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

            if (omission == "ball"){
                $("#overlay-message").css("top", "43%");
                trial.numbersFacing = "inwards";
            } else if (omission == "numbers"){
                $("#overlay-message").css("top", "39%");
                trial.numbersFacing = "upright";
            }


            $("body").css("background-color", 'white');

            const groupsOfThree = [
                ["top", "color", "current"],
                ["bottom", "color", "current"],
                ["only", "color", "current"],
                ["only", "bw", "current"],
                ["only", "color", "prev"]
            ]
            
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

                    $(newSlice).attr("id", "rSlice" + possiblePayout);
                    $(newSlice).css(
                        "transform",
                        "rotate(" + numberLoc[possiblePayout][0] + "deg)"
                    );
                    

                    $(newHold).css("transform", `rotate(${temparc}deg`);
                    $(newHold).css("-webkit-transform", `rotate(${temparc}deg)`);

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
                

                    ["top", "bottom"].forEach(topOrBottom => {
                        ["top", "only", "bottom"].forEach(position => {
                            ["color", "bw"].forEach(ballColor => {
                                ["prev", "current"].forEach(trialPresent => {
                                    let dotDiv = document.createElement("div");
                                    $(dotDiv).attr('id', `dot${possiblePayout}-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);
                                    $(dotDiv).attr('data-index', possiblePayout);
                                    $(dotDiv).attr('data-row', topOrBottom);
                                    $(dotDiv).addClass("numOuter");
                                    
                                    // $(dotDiv).addClass(`dot-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);
            
                                    let newNumber = document.createElement("div");
                                    $(newNumber).addClass("num");
                                    $(newNumber).attr('id', `num${possiblePayout}-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);
                                    // $(newNumber).addClass(`num-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);
            
                                    newNumber.innerHTML = possiblePayout;                        
            
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
            
                                    if (numOfWheelNumbers > 25){
                                        $(newHold).css("border", "solid .1em #FFF");
                                        if (numOfWheelNumbers == 36){
                                            $(dotDiv).css("top", "0.4em");
                                            $(dotDiv).css("left", "10.28em");
                                            // $(newNumber).css("top", "0.4em");
                                            // $(newNumber).css("left", "10.28em");
                                        }
                                    } else if (numOfWheelNumbers == 20){
                                        $(newHold).css("border", "solid .1em #FFF");
                                        $(dotDiv).css("top", "0.7em");
                                        $(dotDiv).css("left", "11.0em");
                                        // $(newNumber).css("top", "0.7em");
                                        // $(newNumber).css("left", "11.0em");
                                    } else {
                                        $(newHold).css("border", "solid .03em #FFF");
                                        if (numOfWheelNumbers == 6){
                                            $(dotDiv).css("top", "1.9em");
                                            $(dotDiv).css("left", "14.28em");
                                            // $(newNumber).css("top", "1.9em");
                                            // $(newNumber).css("left", "14.28em");
                                        }
                                    }
            
                                    if (position != "only" || ballColor == "bw"){
                                        $(dotDiv).css("opacity", "0");
                                        $(newNumber).css("opacity", "0");
                                    }
            
                                    $(dotDiv).appendTo(newSlice);
                                    $(newNumber).appendTo(dotDiv);
                                    // if (omission == "numbers") {$(newNumber).css("display", "none");}
                                    if (omission == "numbers" && trial.specialTrial != "demo"){
                                        ($(newNumber)[0]).style.display = "none";
                                    }
        
                                })
                            })
                        })
                    })
            

            
                    $(newHold).appendTo(newSlice);
                    $(newSlice).appendTo( $("#rcircle"));
                }
            }

            function onSpinPress() {

                btnSpin.off('click',onSpinPress);
                spinTo(winningNum);
                btnSpin.css("cursor", "default");

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

            async function createInstructionsEarlyTrials(){

                // "only", "color", "present" should be made visible
                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted][0];
                console.log(wheelNumbersSplit)
                await moveDots([2]);
                const linePairAndBarWithWinningNum = createLinePair(2);

                linePairAttributes.beginningMessage.html(`<p>The balls represent the ${numOfWheelNumbers} numbers from the wheel. We\'re going to tell you now whether the winning number is one of the numbers on the top or bottom line. We\'ll then tell you exactly what the winning number was after the upcoming memory game.</p>`);
                linePairAttributes.numberlineButton.html("Reveal bar with winning number");
                linePairAttributes.numberlineButton.css("opacity", "1");
                console.log(linePairAndBarWithWinningNum)
                const barWithWinningNumber = linePairAndBarWithWinningNum[1];

                function firstClickFunction(){
                    
                    linePairAttributes.numberlineButton.off("click");
                    const barNotWithWinningNumber = ["top", "bottom"].filter(x => ![barWithWinningNumber].includes(x));
                    $(`.dot-${barNotWithWinningNumber}-only-color-current`).animate({opacity: 0}, 1000);

                    let numsRemaining;

                    if (barWithWinningNumber == "top"){
                        numsRemaining = wheelNumbersSplit[0]
                    } else if (barWithWinningNumber == "bottom"){
                        numsRemaining = wheelNumbersSplit[1]
                    }

                    // setTimeout(function() {
                        linePairAttributes.beginningMessage.html(`<p>The winning number is one of the ${numsRemaining.length} numbers on the ${barWithWinningNumber} line.</p><br><br><br>`);
                        // linePairAttributes.beginningMessage.html(`<p>The balls represent the ${numOfWheelNumbers} numbers from the wheel. We\'re going to tell you now whether the winning number is one of the numbers from the top or bottom. We\'ll then tell you exactly what the winning number was after the upcoming memory game.</p>`);
                    // }, 1);
                    //   }, 2000);

                    setTimeout(function() {
                        linePairAttributes.numberlineButton.on("click", secondClickFunction);
                        linePairAttributes.numberlineButton.html("Continue to memory game");
                    // }, 1)
                    }, 5000)
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
                // }, 1);
                }, 7000);

            }


            function createInstructionsForFirstChoice(nextStage, numberlineButtonLastHeight){

                linePairAttributes.beginningMessage.html(`<p>In previous trials, at this point we would show you a pair of horizontal lines, and you would see whether the winning number is on the top or bottom line. <span style='color: white'>You had no ability to choose which numbers were on which line, and hence, what you would learn about the winning number prior to playing the memory game.</span></p>`);
                linePairAttributes.numberlineButton.css("opacity", "1");
                linePairAttributes.numberlineButton.css("top", '200px');
                linePairAttributes.numberlineButton.html("Continue");

                async function firstClickFunction(){

                    linePairAttributes.numberlineButton.css("top", '566');
                    linePairAttributes.numberlineButton.off("click");
                    setTimeout(function() {
                        linePairAttributes.numberlineButton.on("click", secondClickFunction);
                    }, 5000);

                    await moveDots([4]);
                    createLinePair(4);

                }

                function secondClickFunction(){

                    linePairAttributes.numberlineButton.off("click");

                    setTimeout(function() {
                        linePairAttributes.numberlineButton.on("click", thirdClickFunction);
                    }, 5000);

                    linePairAttributes.beginningMessage.html(`<p>In previous trials, at this point we would show you a pair of horizontal lines, and you would see whether the winning number is on the top or bottom line. You had no ability to choose which numbers were on which line, and hence, what you would learn about the winning number prior to playing the memory game.</p>`);

                }

                function thirdClickFunction(){

                    linePairAttributes.numberlineButton.off("click");
                    $("#line-pair-only-color-prev").remove();

                    ["top", "bottom"].forEach(function(topOrBottom){
                        
                        let position = groupsOfThree[4][0];
                        let ballColor = groupsOfThree[4][1];
                        let trialPresent = groupsOfThree[4][2];
    
                        wheelNumbers.forEach((wheelNumber) => {
                                   
                            let numElement = $(`#num${wheelNumber}-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);
                            let dotElement = $(`#dot${wheelNumber}-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);

                            $(numElement).css("opacity", "0")
                            $(dotElement).css("opacity", "0")


                        })
                    })

                    linePairAttributes.numberlineButton.css("top", '176px');
                    linePairAttributes.beginningMessage.html(`<p>This time it\'ll work a little differently. Now, you can choose how the ${numOfWheelNumbers} numbers are split between the two lines.</p>`);
                    setTimeout(function() {
                        linePairAttributes.numberlineButton.on("click", fourthClickFunction);
                    }, 5000);
                }

                function fourthClickFunction(){

                    linePairAttributes.numberlineButton.off("click");
                    linePairAttributes.beginningMessage.html(linePairAttributes.beginningMessage.specificallyNote);
                    setTimeout(function(){
                        linePairAttributes.numberlineButton.on("click", fifthClickFunction);
                    }, 5000);
                }

                function fifthClickFunction(){

                    linePairAttributes.numberlineButton.off("click");
                    linePairAttributes.numberlineButton.css("top", '233px');
                    linePairAttributes.beginningMessage.html(`${linePairAttributes.beginningMessage.specificallyNote}<br>${linePairAttributes.rememberNote}`);

                    setTimeout(function() {
                         linePairAttributes.numberlineButton.on("click", function(){
                            linePairAttributes.numberlineButton.css("top", numberlineButtonLastHeight);
                            linePairAttributes.beginningMessage.html(`${linePairAttributes.beginningMessage.specificallyNote}${linePairAttributes.rememberNote}${linePairAttributes.beginningMessage.beginNowInstructions}`);
                            nextStage()
                        })
                    }, 1);

                }

                setTimeout(function() {
                    linePairAttributes.numberlineButton.on("click", firstClickFunction);
                }, 1)
                // }, 7000)
            }

            function openEndedQuestion(){
                linePairAttributes.numberlineButton.css("opacity", "1");
                let falseClicks = 0;

                const linePairAndBarWithWinningNum = createLinePair(3);
                let numsOnBarWithWinningNumber;
                let container = $("#line-pair-only-bw-current");
                setupOpenEndedDotClicking(container);
                $('.line-wrapper').css("cursor", "pointer");

                setTimeout(function() {
                    linePairAttributes.numberlineButton.off("click");
                    linePairAttributes.numberlineButton.on("click", firstClickFunction);
                }, 5000);

                function firstClickFunction(){

                    if (document.querySelectorAll('.selected').length == numOfWheelNumbers){
                        linePairAttributes.numberlineButton.off("click");
                        container.off();
                        
                        $('#incomplete-message').html("");
    
                        const barWithWinningNumber = linePairAndBarWithWinningNum[1];
                        const barNotWithWinningNumber = ["top", "bottom"].filter(x => ![barWithWinningNumber].includes(x));
                        $(`.dot-${barNotWithWinningNumber}-only-bw-current`).animate({opacity: 0}, 1000);

                        $(`.dot-${barWithWinningNumber}-only-bw-current:not([class*="selected"])`).animate({opacity: 0}, 1000);
                        numsOnBarWithWinningNumber = document.querySelectorAll(`.dot-${barWithWinningNumber}-only-bw-current.selected`).length;
    
                        linePairAttributes.beginningMessage.html(`<p>The winning number is one of the ${numsOnBarWithWinningNumber} numbers on the ${barWithWinningNumber} line.</p><br><br><br><br><br><br><br><br>`);
                        linePairAttributes.numberlineButton.html("Continue to the memory game");
                        linePairAttributes.numberlineButton.on("click", secondClickFunction);
                    } else {

                        falseClicks+=1;

                        if (falseClicks==1){
                            let topOfButton = document.getElementById('numberlineButton').getBoundingClientRect().top
                            $('#incomplete-message').html("Please select one of each number");
                            $('#incomplete-message').css('top', (topOfButton - 35) + 'px');
                            linePairAttributes.numberlineButton.css('top', (topOfButton + 30) + 'px')
                        }
                    }
                }

                function secondClickFunction(){
                    jsPsych.finishTrial({
                        winningNum: winningNum,
                        wheelNumbersSplit: wheelNumbersSplits[mainTrialsCompleted][4],
                        selections: numsOnBarWithWinningNumber,
                    })
                }
            }

            function multipleChoiceQuestion(){
                linePairAttributes.numberlineButton.css("opacity", "1");
                linePairAttributes.numberlineButton.html("Reveal bar with winning number");
                linePairAttributes.numberlineButton.css('top', '787px')
                let falseClicks = 0;
                const wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted];
                const linePairAndBarWithWinningNumTop = createLinePair(0);
                const linePairAndBarWithWinningNumBottom = createLinePair(1);
                setupPairClicking(linePairAndBarWithWinningNumTop[0]);
                setupPairClicking(linePairAndBarWithWinningNumBottom[0]);
                $('.line-wrapper').css("cursor", "pointer");


                let topOrBottomSelected;
                
                setTimeout(function() {
                    linePairAttributes.numberlineButton.off("click");
                    linePairAttributes.numberlineButton.on("click", firstClickFunction);
                }, 4000);

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
                        let notPairPosition;

                        if (linePairID.includes('top')){
                            pairPosition = "top"
                            notPairPosition = "bottom"
                            linePairAndBarWithWinningNum = linePairAndBarWithWinningNumTop;
                            linePairAndBarNotWithWinningNum = linePairAndBarWithWinningNumBottom;
                        } else if (linePairID.includes('bottom')){
                            pairPosition = "bottom"
                            notPairPosition = "top"
                            linePairAndBarWithWinningNum = linePairAndBarWithWinningNumBottom;
                            linePairAndBarNotWithWinningNum = linePairAndBarWithWinningNumTop;
                        }

                        $(linePairAndBarNotWithWinningNum[0]).animate({opacity: 0}, 1000);

                        $(`.dot-${notPairPosition}-color-current`).animate({opacity: 0}, 1000);

                        setTimeout(function(){

                            const barNotWithWinningNumber = ["top", "bottom"].filter(x => ![linePairAndBarWithWinningNum[1]].includes(x));
                            $(`.dot-${barNotWithWinningNumber}-${pairPosition}-color-current`).animate({opacity: 0}, 1000);
                            let numsRemaining = document.querySelectorAll(`.dot-${linePairAndBarWithWinningNum[1]}-${pairPosition}-color-current`).length
        
                            linePairAttributes.beginningMessage.html(`The winning number is one of the ${numsRemaining} numbers on the ${linePairAndBarWithWinningNum[1]} line.<br><br><br><br><br><br><br><br><br>`);
                            linePairAttributes.numberlineButton.html("Continue to the memory game");
                            setTimeout(function(){
                                linePairAttributes.numberlineButton.on("click", secondClickFunction);
                            }, 4000)
                        }, 3000)


                    } else {
                            falseClicks+=1;

                            if (falseClicks==1){
                                let topOfButton = document.getElementById('numberlineButton').getBoundingClientRect().top
                                $('#incomplete-message').html("Please make a selection");
                                $('#incomplete-message').css('top', (topOfButton - 35) + 'px');
                                linePairAttributes.numberlineButton.css('top', (topOfButton + 30) + 'px')
                            }
                    }
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
        
            function moveDots(indexesToShowNow){
                return new Promise((resolve) => {

                    let resolveOnThisIterationCounter = 0;
                    groupsOfThree.forEach(function(groupOfThree, indexOuter){
                        let wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted][indexOuter];
                        let position = groupOfThree[0];
                        let ballColor = groupOfThree[1];
                        let trialPresent = groupOfThree[2];


                        ["top", "bottom"].forEach(function(topOrBottom, index){

                            const numbersOnLine = wheelNumbersSplit[index];

                            wheelNumbers.forEach((wheelNumber, i) => {
        
                                let numElement = $(`#num${wheelNumber}-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);
                                let dotElement = $(`#dot${wheelNumber}-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);

                                if (numbersOnLine.includes(wheelNumber)){
                                    if (indexesToShowNow.includes(indexOuter)){
                                        $(numElement).css("opacity", "1")
                                        $(dotElement).css("opacity", "1")
                                    } else {
                                        $(numElement).css("opacity", "0")
                                        $(dotElement).css("opacity", "0")
                                    }

                                    let holdElement = $("#rSlice" + wheelNumber);
                                    
                                    let newLeft = -10 + (i * 2) + "em"; // reduce the multiplier for closer numbers
                                    
                                    $(dotElement).addClass(`dot dot-${topOrBottom}-${position}-${ballColor}-${trialPresent} dot-${position}-${ballColor}-${trialPresent}`);
                                    $(dotElement).css("border-width", "0px")

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
                                        right: wheelNumber >= 10 ? linePairAttributes.dotRight1: linePairAttributes.dotRight2,
                                        top: linePairAttributes.dotTop,
                                        fontSize: linePairAttributes.dotFontSize,
                                    }, 2000)

                                    let setTop = {
                                        top: {
                                            top: 318,
                                            bottom: 418
                                        },
                                        only: {
                                            top: 318,
                                            bottom: 418
                                        },
                                        bottom: {
                                            top: 551,
                                            bottom: 651
                                        },
                                    }

                                    let resolveOnThisIteration;
                                    if (indexesToShowNow[0] == indexOuter && (i == (numOfWheelNumbers - 1))){
                                        resolveOnThisIterationCounter += 1;
                                        resolveOnThisIteration = true;
                                    } else {
                                        resolveOnThisIteration = false;
                                    }
                                    
                                    dotElement.animate({
                                        left: newLeft,
                                        top: setTop[position][topOrBottom] + "px",
                                        borderWidth: "2px",
                                        backgroundColor: "white",
                                        width:  linePairAttributes.dotHeightAndWidth,
                                        height: linePairAttributes.dotHeightAndWidth
                                    }, 2000, function(){
                                        if (resolveOnThisIterationCounter == 1 && resolveOnThisIteration){
                                            resolve()
                                        }
                                    });
        
                                } else {
                                    $(numElement).css("opacity", "0")
                                    $(dotElement).css("opacity", "0")
                                }
                            });
                        })
                    })
                })
            }

            function createLinePair(indexToShowNow){

                let wheelNumbersSplit = wheelNumbersSplits[mainTrialsCompleted][indexToShowNow];
                let position = groupsOfThree[indexToShowNow][0];
                let ballColor = groupsOfThree[indexToShowNow][1];
                let trialPresent = groupsOfThree[indexToShowNow][2];

                let barWithWinningNumber;

                let linePair = document.createElement("div");
                linePair.setAttribute("id", `line-pair-${position}-${ballColor}-${trialPresent}`);
                linePair.classList.add("line-pair");

                let dotDivsTop = document.querySelectorAll(`.dot-top-${position}-${ballColor}-${trialPresent}`);
                let dotDivsBottom = document.querySelectorAll(`.dot-bottom-${position}-${ballColor}-${trialPresent}`);
                let firstDotDivTop = dotDivsTop[0];
                let firstDotDivBottom = dotDivsBottom[0];
                let topDotPosition = firstDotDivTop.getBoundingClientRect();
                let bottomDotPosition = firstDotDivBottom.getBoundingClientRect();
                
                let middleOfTop = (topDotPosition.top + topDotPosition.bottom) / 2;
                
                let middleOfBottom = (bottomDotPosition.top + bottomDotPosition.bottom) / 2;
                let middleOfLinePair = (middleOfTop + middleOfBottom) / 2;
                let halfSizeOfWrapper = middleOfTop - middleOfLinePair;
                
                let topOfWrappers = [middleOfTop + halfSizeOfWrapper, middleOfLinePair];

                linePair.style.top = topOfWrappers[0] + 'px';
                linePair.style.height = halfSizeOfWrapper * -4 + 'px';


                ["top", "bottom"].forEach(function(topOrBottom, index){
                    const numbersOnLine = wheelNumbersSplit[index];

                    let wrapperWithLine = document.createElement("div");
                    let wrapperClickable = document.createElement("div");
                    
                    wrapperWithLine.setAttribute("id", `line-wrapper-includes-line-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);
                    wrapperClickable.setAttribute("id", `line-wrapper-clickable-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);
                    
                    [wrapperWithLine, wrapperClickable].forEach(wrapper => {
                        wrapper.style.top = (topOfWrappers[index] - parseFloat(linePair.style.top)) + 'px';
                        wrapper.style.height = halfSizeOfWrapper * 2 + 'px';
                        wrapper.classList.add("line-wrapper");
                    });

                    let line = document.createElement("div");
                    line.classList.add("line", `line-${topOrBottom}`);
                    
                    line.style.top = wrapperWithLine.style.top - halfSizeOfWrapper + 'px';
                    wrapperWithLine.appendChild(line);

                    $(wrapperClickable).css("z-index", "400");
        
                    linePair.appendChild(wrapperWithLine);
                    linePair.appendChild(wrapperClickable);

                    wheelNumbers.forEach((wheelNumber) => {
                        if (numbersOnLine.includes(wheelNumber)){

                            let numElement = $(`#num${wheelNumber}-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);
                            let dotElement = $(`#dot${wheelNumber}-${topOrBottom}-${position}-${ballColor}-${trialPresent}`);

                            $(numElement).css("opacity", "1");
                            $(dotElement).css("opacity", "1");

                                    
                            $('#spinnerID').css("z-index", "1");
                            $('#spinnerID').css("height", "0em");


                            if (ballColor == "color") {
                                numElement.animate({color: 'white'}, 1000);
                                if (topOrBottom == "top"){
                                    dotElement.animate({backgroundColor: linePairAttributes.topColor}, 1000);
                                } else if (topOrBottom == "bottom"){
                                    dotElement.animate({backgroundColor: linePairAttributes.bottomColor}, 1000);
                                }
                            }
    
                            if (wheelNumber == winningNum){
                                barWithWinningNumber = topOrBottom;
                            }
                        }
                    })
                })

                linePairAttributes.linePairContainer.appendChild(linePair);

                if (position == "only"){
                    $(".line-pair").not(".selected").css("border-color", "white")
                } else {
                    $(".line-pair").not(".selected").css("border-color", "#dbdbdb85");
                }

                return([linePair, barWithWinningNumber]);

            }

            function setupOpenEndedDotClicking(container){
                let mouseDown = false;

                // Function to calculate the distance between two points
                function distance(x1, y1, x2, y2) {
                    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
                }

                function colorDot(event) {
                    let minDistance = Infinity;
                    let closestDot = null;
                    const containerOffset = container.offset();

                    $(".dot-only-bw-current").each(function() {
                        const dot = $(this);
                        const dotOffset = dot.offset();
                        const dotX = dotOffset.left - containerOffset.left + dot.width() / 2;
                        const dotY = dotOffset.top - containerOffset.top + dot.height() / 2;

                        const dist = distance(dotX, dotY, event.pageX - containerOffset.left, event.pageY - containerOffset.top);
                        if (dist < minDistance) {
                            minDistance = dist;
                            closestDot = dot;
                        }
                    });

                    // Change the color of the closest dot and its corresponding dot
                    if (closestDot) {
                        const index = closestDot.data('index');
                        const row = closestDot.data('row');
                        const correspondingRow = (row === "top") ? "bottom" : "top";
                        const correspondingDot = $(`.dot[data-index=${index}][data-row=${correspondingRow}]`);
                        
                        const closestDotNumber = closestDot.find('*');
                        const correspondingDotNumber = correspondingDot.find('*')

                        closestDot.addClass("selected");
                        closestDotNumber.css('color', 'white')
                        if (closestDot.attr('id').includes('top')){
                            closestDot.css("background-color", linePairAttributes.topColor);
                        } else {
                            closestDot.css("background-color", linePairAttributes.bottomColor);
                        }
                        
                        correspondingDot.removeClass("selected");
                        correspondingDotNumber.css('color', 'black');
                        correspondingDot.css("background-color", "white");

                    }
                }

                // Add the click and mousemove event to the container
                container.on({
                    'mousedown': function(event) {
                        mouseDown = true;
                        colorDot(event);
                    },
                    'mousemove': function(event) {
                        if (mouseDown) colorDot(event);
                    },
                    'mouseleave': function() {
                        mouseDown = false;
                    }
                });

                $(document).on('mouseup', function() {
                    mouseDown = false;
                });

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

                let timeoutTime = mainTrialsCompleted < 2 ? 9000 : 4000

                $("#ballLandedNotification").animate({
                    opacity: .99,
                }, fadeTime, function(){
                    setTimeout(function(){
                        disappearWheel();
                        generateLinePairs();
                    }, timeoutTime)
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
                        $('.hold').css("clip", 'rect(0, 50em, 200em, -10em)')
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

            async function generateLinePairs(){

                if (mainTrialsCompleted < trialsWithoutChoice){
                    createInstructionsEarlyTrials();
                } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "open_ended"){
                    linePairAttributes.beginningMessage.specificallyNote = `<p>Specifically, we\'ll present two pairs, instead of one pair, of horizontal lines. You can then choose whether you prefer the top split or the bottom split.</p>`;
                    linePairAttributes.beginningMessage.beginNowInstructions = `<p>Click one of these two pairs now, and click the button below to submit your choice. We\'ll tell you whether the winning number is on the top line or bottom line of that pair.</p>`;
                    createInstructionsForFirstChoice(openEndedQuestion, '555px');
                } else if (mainTrialsCompleted == trialsWithoutChoice && choiceType == "multiple_choice"){
                    linePairAttributes.beginningMessage.specificallyNote = `<p>Specifically, you have to click which numbers you would like on each line. When you are finished, all ${numOfWheelNumbers} numbers should appear on one of the two lines.</p>`;
                    linePairAttributes.beginningMessage.beginNowInstructions = `<p>Now, click the balls to assign them to a line. You can also drag your mouse to select several more quickly than clicking one by one, if you prefer.</p>`
                    createInstructionsForFirstChoice(multipleChoiceQuestion, '787px');
                } else if (mainTrialsCompleted > trialsWithoutChoice && choiceType == "multiple_choice"){
                    linePairAttributes.beginningMessage.html(`<p>Once again, choose which of the sets of pairs of numbers to work with. When you make your choice, we\'ll then tell you whether the winning number is on the top line or bottom line of the set you chose.</p>${linePairAttributes.rememberNote}`);
                    await moveDots([0, 1]);
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
                linePairAttributes.topColor = '#4169e1' // royalblue
                linePairAttributes.bottomColor = '#ff7f50' // coral

                let dotSize = 'big'

                if (dotSize == "big"){
                    linePairAttributes.dotHeightAndWidth = '36px';
                    linePairAttributes.dotFontSize = '21px';
                    linePairAttributes.dotRight1 = '6px';
                    linePairAttributes.dotRight2 = '12px';
                    linePairAttributes.dotTop = '4px';
                } else if (dotSize == "small"){
                    linePairAttributes.dotHeightAndWidth = '20px';
                    linePairAttributes.dotFontSize = '12px';
                    linePairAttributes.dotRight1 = '4px';
                    linePairAttributes.dotRight2 = '6.5px';
                    linePairAttributes.dotTop = '-3.5px';
                }

                ballLandedNotification();
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