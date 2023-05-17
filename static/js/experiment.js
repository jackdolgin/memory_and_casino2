condition = 1;
const jsPsych = initJsPsych({
  // extensions: [
  //   {type: jsPsychExtensionWebgazer}
  // ],
  exclusions: {
    min_width: 800,
    min_height: 600
  },
  show_progress_bar: false,
  display_element: 'jspsych-target',
  on_finish: function() {
    console.log('on_finish')
    if (DEBUG) {
      return jsPsych.data.displayData();
    } else {
      return submitHit();
    }
  },
  on_data_update: function(data) {
    console.log('data', data);
    return psiturk.recordTrialData(data);
  }
});


/* ************************************ */
/* Define experimental variables */
/* ************************************ */


let choiceType;
if (condition == 0) {
  choiceType = "multiple_choice";
} else if (condition == 1) {
  choiceType = "open_ended";
}

const wheelNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
let wheelNumbersSplits1 = [
  [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]  
  ],
  [
    [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
  ],
  [
    [1, 2, 4, 5, 6, 7, 8, 9, 10, 18],
    [3, 11, 12, 13, 14, 15, 16, 17, 19, 20]  
  ],
  [
    [1, 2, 3, 4, 5, 16, 17, 18, 19, 20],
    [6, 7, 8, 9, 10, 11, 12, 13, 14, 15] 
  ],
];
const trialsWithoutChoice = wheelNumbersSplits1.length;

wheelNumbersSplits1 = wheelNumbersSplits1.map(jsPsych.randomization.shuffle);
// wheelNumbersSplits1 = wheelNumbersSplits1.flat();
wheelNumbersSplits1 = jsPsych.randomization.shuffle(wheelNumbersSplits1);

let wheelNumbersSplits2;

if (choiceType == "multiple_choice"){

  function getCombinations(arr) {
    let combinations = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        let combination = [arr[i], arr[j]];
        combination = jsPsych.randomization.shuffle(combination);
        combinations.push(combination);
      }
    }
    return combinations;
  }

  wheelNumbersSplits2 = getCombinations(wheelNumbersSplits1);

} else if (choiceType == "open_ended"){
  wheelNumbersSplits2 = [[wheelNumbers, wheelNumbers]];
}

const trialsWithChoice = wheelNumbersSplits2.length;

const wheelNumbersSplits = wheelNumbersSplits1.concat(wheelNumbersSplits2);
const trials = trialsWithoutChoice + trialsWithChoice;

const expectedDuration = 30;
const trialsOfActualSpinning = 10;
const basePayGuarantee = 5
const mostToGain = 4;
const numOfWheelNumbers = wheelNumbers.length;
const demoWin = jsPsych.randomization.sampleWithReplacement(wheelNumbers, 1)[0];
// const demoWin = 10;
const winningNums = jsPsych.randomization.sampleWithReplacement(wheelNumbers, trials);
const randomSpaceArray = Array.from({length: trials}, () => Math.floor(Math.random() * 360 + 1));
const wheelSpinTime = 9;
const unique_memory_objects_per_trial = 18;
let mainTrialsCompleted = 0;
const omission = "ball";

/* ************************************ */
/* Load Awesome Icons */
/* ************************************ */

function findAllContentAttributes(cssFilePath, callback) {
  let matches;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const cssText = this.responseText;
      matches = cssText.match(/content\s*:\s*([^;]+);/g);
      callback(matches);
    }
  };
  xhttp.open("GET", cssFilePath, true);
  xhttp.send();
}

async function getAwesomeIcons() {
  const fontAwesomeSheet = "https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css";
  const matches = await new Promise((resolve) => {
    findAllContentAttributes(fontAwesomeSheet, (matches) => {
      resolve(matches);
    });
  });
 
  const list = [];
    let nextThreeChars = '';
    let wholeString = matches[0];

    let startingIndex;
    let endingIndex;
    for (let i = 0; i < wholeString.length; i++){
      if (wholeString[i-3] == '"' && wholeString[i-2] == "}" && wholeString[i-1] == ".") {
        startingIndex = i;
      } else if (wholeString[i] == ":" && wholeString[i+7] == "{"){
        endingIndex = i
        list.push(wholeString.slice(startingIndex, endingIndex));
      }
    }
    return list;
}

let allAwesomeIcons = getAwesomeIcons();

async function grabJSONData() {
  const response = await fetch("static/images/font-awesome-icons-to-keep.json");
  const jsonData = await response.json();
  return jsonData;
}

let iconsToKeep = grabJSONData();

console.log("iojoifs")
async function initializeExperiment() {
  LOG_DEBUG('initializeExperiment');


  /* ************************************ */
  /* Set up jsPsych blocks */
  /* ************************************ */


  let preload = {
    type: jsPsychPreload,
    auto_preload: true
  }

  let inclusionCheck = {
    type: jsPsychBrowserCheck,
    inclusion_function: (data) => {
      return ['chrome'].includes(data.browser);
    },
    exclusion_message: (data) => {
      return `<p>You must use Chrome to complete this experiment.</p>`
    },
    minimum_height: 600,
    minimum_width: 800
  };

  let enter_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message:
        "<p>This experiment has to be conducted in <strong>full screen mode</strong>. It will end automatically at " +
        "the end of the study.</p><br>"
  }

  let introInstructions = {
    type: jsPsychInstructions,
    pages: [
        '<p>Welcome to the experiment. It is expected to last around ' + expectedDuration+ ' minutes. You will be playing ' + trials + ' memory games, which are the sort of conventional game where you see many tiles and have to find out which images underneath those tiles match each other.</p>',
        '<p>Along the way, you\'ll win or lose points. Those points will be added up at the end of the experiment, such that the more points you earn the more money you receive. You are guaranteed to earn at least $' + basePayGuarantee + ' for participating today. At most, you can earn $' + (basePayGuarantee + mostToGain) + '.</p>',
        '<p>The points are earned by spinning a virtual roulette wheel before each memory game. The ball will land on one of the numbers at random, and that number is how many points you will win (or if it lands on a negative number, lose).</p>',
        '<p>For example, on the following page spin the wheel, and watch it land on ' + demoWin + '.</p>',
    ],
    show_clickable_nav: true
  }

  let wheelSpinDemo = {
    type: jsPsychRoulette,
    wheelSpinTime: wheelSpinTime,
    specialTrial: "demo",
    spinOrReveal: "spin",
  }

  let introToPartialInfoInstructions = {
    type: jsPsychInstructions,
    pages: [
      '<p>In this case, you would have earned ' + demoWin + ' points, since the ball landed on ' + demoWin + '.</p>',
      '<p>The only catch is that, during the spin, you won\'t be able to find out the exact number the ball landed on. The spins will never actually show ' + 'the ball' + '.</p>',
      '<p>However, we\'ll split the wheel\'s numbers into two sets after the spin, and we will tell you which set the winning number is in.</p>',
      '<p>You will then move on to a memory game. After the memory game, we will reveal exactly what number the ball landed on.</p>',
      '<p>If you\'re ready, press the button below to start the begin.</p>'
      // '<p>However, you\'ll be able to select a set of the wheel\'s numbers after the spin, and we will tell you whether the ball landed among that set of numbers.</p>',
      // '<p>The only catch is that you won\'t be able to find out the exact number the ball landed on during the spin. The spins will never actually show [the ball/ where the numbers are], e.g. the image below. + '<br>' + '<img src="con2.png"></img>'</p>',
      // '<p>Instead, you\'ll only be able to ask once about whether the number the ball landed on was among a set of numbers. We\'ll then tell you yes or no.</p>',
      // '<p>Let\'s go through an example.</p>',
    ],
    show_clickable_nav: true
  }

  let wheelSpin = {
    type: jsPsychRoulette,
    wheelSpinTime: wheelSpinTime,
    spinOrReveal: "spin",
  }

  let numberlineDisplay = {
    type: jsPsychNumberline,
  }

  let memoryGame = {
    type: jsPsychMemory,
    numUniqueItems: unique_memory_objects_per_trial
  }

  let wheelReveal = {
    type: jsPsychRoulette,
    wheelSpinTime: 0,
    rotationsTime: 0,
    spinOrReveal: "reveal",
  }

  // let trialsWithoutChoiceNode = {
  //   // timeline: [wheelSpin, memoryGame, wheelReveal],
  //   // timeline: [wheelReveal],
  //   timeline: [numberlineDisplay],
  //   repetitions: trialsWithoutChoice
  // }

  // let instructionsBeforeFirstTrialWithChoice = {
  //   type: jsPsychInstructions,
  //   pages: [
  //     "In previous trials, at this point we would show you two lines, and you would see whether the winning number is on the top or bottom. You had no ability to choose which numbers were on which line, and hence, what you would learn about the winning number prior to playing the memory game.",
  //     `This time it\'ll work a little differently. Now, you can choose how the ${numOfWheelNumbers} numbers are split between the two lines.`
  //   ],
  //   show_clickable_nav: true
  // }

  // let firstTrialWithChoiceNode = {
  //   // timeline: [wheelSpin, memoryGame, wheelReveal],
  //   // timeline: [wheelReveal],
  //   timeline: [numberlineDisplay],
  //   repetitions: 1,
  // }

  let node = {
    // timeline: [wheelSpin, numberlineDisplay, memoryGame, wheelReveal],
    // timeline: [wheelSpin, numberlineDisplay, wheelReveal],
    // timeline: [wheelReveal],
    timeline: [wheelSpin],
    // timeline: [numberlineDisplay],
    // timeline: [numberlineDisplay, wheelReveal],
    repetitions: trials
  }

  let exit_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
    delay_after: 0
  }

  /* create timeline */
  var timeline = [
    preload,
    // inclusionCheck,
    // enter_fullscreen,
    // introInstructions,
    // wheelSpinDemo,
    // introToPartialInfoInstructions,
    node,
    // trialsWithoutChoiceNode,
    // instructionsBeforeFirstTrialWithChoice,
    // firstTrialWithChoiceNode,
    exit_fullscreen,
  ]

  /* start the experiment */
  return jsPsych.run(timeline);

}















// const expectedMaxExpLength = 10;
// const writingTimeLimit = 2;
// const wheelSpinTime = 9;
// const omission = "ball";
// const wheelCondition = "confined_wheel";
// const startingTotalEnglish = "1.5";
// const startingTotal = 1.5;
// const numorder = [-50, -25, 25, 50];
// const startingTotalPlusMinPayment = 3;
// const startingTotalPlusMinPaymentEnglish = "3";

// const randomIndex = Math.floor(Math.random() * 2);
// const winningNum = numorder[2 + randomIndex];

// let totalWinnings, bonusEnglish;
// if (winningNum == 50){
//   totalWinnings = "3.50"
//   bonusEnglish = ".50" 
// } else if (winningNum == 25){
//   totalWinnings = "3.25"
//   bonusEnglish = ".25"
// }

// psiturk.recordUnstructuredData('bonus', bonusEnglish)
// jsPsych.data.addProperties({
//   bonus: bonusEnglish,
// })

// let possibilities, infoChoice, displayPartialInfo;

// let numred = [];
// let numblack = [];

// numorder.forEach(function (value, i) {
//   if (i % 2 == 0){
//     numred.push(value)
//   } else{
//     numblack.push(value)
//   }
// });


// let numOrderAssignments = [numorder, numorder];

// let choiceList;



// const serviceID = "service_4lz07ym";
// const templateID = "template_qwkcnrf";




// // function getUserInputs() {
// //   const input1 = prompt("Please type 'Full Experiment' or 'Shortened Experiment'");
// //   const input2 = prompt('Please enter the experiment version, which is either 0 or 1');

// //   return ([input1, input2]);
// // }

// // let userInputs = getUserInputs();

// // let expLength = userInputs[0];
// // condition = userInputs[1];

// // condition = '3'

// let bonusPageOne = [
//   {
//     type: 'html',
//       prompt: `Terrific. You\'re nearly done. To validate the eye-tracking data, we are going to do a second round of eye-tracking calibration, which will again consist of clicking dots on the screen for about a minute.`
//   },
// ]

// if (condition == '0'){
//   choiceList = [
//     "Whether you won or lost money (but not how much)",
//     "Whether the amount you won/lost was 50 cents or 25 cents (but not whether you won/lost that amount)"
//   ]
// } else if (condition == '1'){
//   choiceList = [
//     "Now (before recalibration)",
//     "After recalibration"
//   ]
// }

// if (counterbalance == '1'){
//   choiceList.reverse();
// }

// let bonusPages, earlyRevealBoolean, lateRevealBoolean;
// if (condition == '0'){
//   bonusPages = [
//     bonusPageOne,
//     [
//       {
//         type: 'html',
//           prompt: `You will find out after the re-calibration exactly how much money you earned for participating in today\'s experiment. We are giving you $${startingTotalPlusMinPaymentEnglish} to start, but there is also a bonus that will be tacked on. That bonus has an equal chance of being each of these four amounts: -50 cents, -25 cents, +25 cents, or +50 cents.`
//           // `Just now we randomly picked one of these four bonuses. Even though you will find out after the dot clicking exactly how much the bonus is, we can tell you before re-calibration about two of numbers that definitely are not the bonus.`
//           // `By the time you finish the re-calibration, the amount you will earn will be slightly different than $${startingTotalPlusMinPaymentEnglish}. It will either be 50 cents less, 25 cents less, 25 cents more, or 50 cents more than $${startingTotalPlusMinPaymentEnglish}. Each of these four bonuses is equally likely.`
//       },
//     ],
//     [
//           {
//               type: 'multi-choice',
//               name: 'bonusChoice',
//               // prompt: `Great. We just randomly generated the bonus. You are about to do the minute-long re-calibration, and afterwards we will tell you the amount of the bonus. In the meantime, you can learn partial information about the bonus. Select one of the following options (your choice doesn\'t affect the bonus, since the bonus is already generated).`,
//               // prompt: "Just now we randomly picked one of these four bonuses (-50, -25, 25, or 50). Even though you will find out after the dot clicking exactly how much the bonus is, we can tell you before re-calibration about two of numbers that definitely are not the bonus. Choose to be told now (before dot-clicking)",
//               prompt: "Just now we randomly picked one of these four bonuses (-50 cents, -25 cents, 25 cents, or 50 cents). Even though you will find out after the dot clicking exactly how much the bonus is, we can tell you before re-calibration some information about the bonus. Choose to be told now (before dot-clicking)",
//               options: choiceList,
//               required: true,
//           },
//     ],
//   ]
  
  
  
  
//   // choicePartialInstructions ="Even though you will find out after the dot clicking exactly how much the bonus is, we can tell you before re-calibration about two of numbers that definitely are not the bonus. Choose to be told now (before dot-clicking):";
//   // choiceList = [
//   //   // 'Find out whether the ball either landed on one of these two numbers (25, 50), or whether it landed on one of these two numbers (-25, -50)',
//   //   // 'Find out whether the ball either landed on one of these two numbers (25, -25), or whether it landed on one of these two numbers (50, -50)'
//   //   // "Would you rather know whether you won/lost money (but not how much)",
//   //   // "Whether the amount you won/lost was 50 cents (but not whether you won/lost money)"
//   //   "whether you won or lost money (but not how much)",
//   //   "whether the amount you won/lost was 50 cents or 25 cents (but not whether you won/lost that amount)"

//   // ]
// } else if (condition == '1'){
  

//   bonusPages = [
//     bonusPageOne,
//     [
//       {
//         type: 'html',
//           prompt: `You can find out either before or after the re-calibration how much money you earned for participating in today\'s experiment. We are giving you $${startingTotalPlusMinPaymentEnglish} to start, but there is also a bonus that will be tacked on. That bonus has an equal chance of being each of these four amounts: -50 cents, -25 cents, +25 cents, or +50 cents.`
//           // `Just now we randomly picked one of these four bonuses. Even though you will find out after the dot clicking exactly how much the bonus is, we can tell you before re-calibration about two of numbers that definitely are not the bonus.`
//           // `By the time you finish the re-calibration, the amount you will earn will be slightly different than $${startingTotalPlusMinPaymentEnglish}. It will either be 50 cents less, 25 cents less, 25 cents more, or 50 cents more than $${startingTotalPlusMinPaymentEnglish}. Each of these four bonuses is equally likely.`
//       },
//     ],
//     [
//           {
//               type: 'multi-choice',
//               name: 'bonusChoice',
//               // prompt: `Great. We just randomly generated the bonus. You are about to do the minute-long re-calibration, and afterwards we will tell you the amount of the bonus. In the meantime, you can learn partial information about the bonus. Select one of the following options (your choice doesn\'t affect the bonus, since the bonus is already generated).`,
//               // prompt: `Just now we randomly picked one of these four bonuses (-50, -25, 25, or 50). ${choicePartialInstructions}`,
//               // prompt: `You can find out either before or after the re-calibration how much money you earned for participating in today\'s experiment. We are giving you $${startingTotalPlusMinPaymentEnglish} as a baseline, but there is also a bonus that will be tacked on. We randomly picked that bonus from these four possibilities: -50 cents, -25 cents, +25 cents, or +50 cents. When would you like to find out about the bonus?`,
//               prompt: `Just now we randomly picked one of these four bonuses (-50 cents, -25 cents, 25 cents, or 50 cents). When would you like to find out about the bonus?`,
//               options: choiceList,
//               required: true,
//           },
//     ],
//   ]
  
//   // choicePartialInstructions ="When would you like to be told about the bonus?"
//   // choiceList = [
//   //   // 'Find out whether the ball either landed on one of these two numbers (25, 50), or whether it landed on one of these two numbers (-25, -50)',
//   //   // 'Not be told anything until after re-calibration'
//   //   // "Would you rather know whether you won/lost money (but not how much)",
//   //   // "Would you rather not be told anything"
//   //   "Now (before recalibration)",
//   //   "After recalibration"
//   // ]
// } else if (condition == '2'){
//   choiceList = [
//     // 'Find out whether the ball either landed on one of these two numbers (25, -25), or whether it landed on one of these two numbers (50, -50)',
//     // 'Not be told anything until after re-calibration'
//     // "Whether the amount you won/lost was 50 cents (but not whether you won/lost money)",
//     // "Would you rather not be told anything"
//     "whether the amount you won/lost was 50 cents (but not whether you won/lost money)",
//     "Not be told anything until after re-calibration"

//   ]
// }

// let postQAboutWheelvars;

// if (condition != '3'){
//    postQAboutWheelvars = [
//     'highlight',
//     'highlight',
//     'As you were making your choice about which roulette numbers to , did you find it confusing what the button you chose would do, or did you understand that it would leave you with a subset of values that we would subsequently reveal after recalibration?'
//   ]
// } else if (condition == '0'){
//   postQAboutWheelvars = [
//     'select',
//     'button you chose',
//   ] 
// } else {
//   postQAboutWheelvars = [
//     'select',
//     'button on the left',
//   ]
// }


// // const lowEnd = -10;
// // const highEnd = 25;
// // const winningNumDenom = 10;
// // const wheelSpinTime = 9;


// // startingTotal = minPayment - (lowEnd / winningNumDenom);

// // let numorder;
// // let numorderSorted = [];
// // let numred = [];
// // let numblack = [];
// // for (var i = lowEnd; i <= highEnd; i+= numFrequency) {
// //   numorderSorted.push(i);
// // }
// // if (omission == "numbers"){
// //   numorder = jsPsych.randomization.shuffle(numorderSorted);
// // } else if (omission == "ball"){
// //   numorder = numorderSorted
// // }

// // numorder.forEach(function (value, i) {
// //   if (i % 2 == 0){
// //     numred.push(value)
// //   } else{
// //     numblack.push(value)
// //   }
// // });

// // let numOrderAssignments = [numorderSorted, numorder];


// // let winningNum;
// // if (guaranteedPositive) {
// //   winningNum = Math.floor(Math.random() * highEnd + 0);                    
// // } else {
// //   winningNum = numorder[Math.floor(Math.random() * numorder.length)];
// // }










// // const numFrequency = 1;
// // const minPayment = 2;
// // const expectedMaxExpLength = 5;
// // const guaranteedPositive = true;
// // let lowEnd, highEnd, startingTotal, winningNumDenom, dimesOrDollars, wheelCondition, omission;
// // let rotationsTime, wheelSpinTime, ballSpinTime;

// // const writingTimeLimit = 2;

// // if (condition == 0){
// //   wheelCondition = "vast_wheel";
// // } else if (condition == 1){
// //   wheelCondition = "confined_wheel";
// // }

// // if (counterbalance == 0){
// //   omission = "ball";
// // } else if (counterbalance == 1){
// //   omission = "numbers";
// // }


// // if (wheelCondition == "vast_wheel"){
// //   lowEnd = -10;
// //   highEnd = 25;
// //   winningNumDenom = 10;
// //   wheelSpinTime = 4;
// // } else if (wheelCondition == "confined_wheel"){
// //   lowEnd = -1;
// //   highEnd = 4;
// //   winningNumDenom = 1;
// //   wheelSpinTime = 9;
// // }

// // if (winningNumDenom == 10){
// //   dimesOrDollars =  "dimes";
// // } else if (winningNumDenom == 1){
// //   dimesOrDollars = "dollars";
// // }

// // startingTotal = minPayment - (lowEnd / winningNumDenom);

// // let numorder;
// // let numorderSorted = [];
// // let numred = [];
// // let numblack = [];
// // for (var i = lowEnd; i <= highEnd; i+= numFrequency) {
// //   numorderSorted.push(i);
// // }
// // if (omission == "numbers"){
// //   numorder = jsPsych.randomization.shuffle(numorderSorted);
// // } else if (omission == "ball"){
// //   numorder = numorderSorted
// // }

// // numorder.forEach(function (value, i) {
// //   if (i % 2 == 0){
// //     numred.push(value)
// //   } else{
// //     numblack.push(value)
// //   }
// // });

// // let numOrderAssignments = [numorderSorted, numorder];


// // let winningNum;
// // if (guaranteedPositive) {
// //   winningNum = Math.floor(Math.random() * highEnd + 0);                    
// // } else {
// //   winningNum = numorder[Math.floor(Math.random() * numorder.length)];
// // }


// async function initializeExperiment() {
//   LOG_DEBUG('initializeExperiment');


//   /* ************************************ */
//   /* Set up jsPsych blocks */
//   /* ************************************ */

//   let inclusionCheck = {
//     type: jsPsychBrowserCheck,
//     inclusion_function: (data) => {
//       return ['chrome'].includes(data.browser);
//     },
//     exclusion_message: (data) => {
//       return `<p>You must use Chrome to complete this experiment.</p>`
//     },
//     minimum_height: 600,
//     minimum_width: 800
//   };

//   let introInstructions = {
//     type: jsPsychInstructions,
//     pages: [
//     `<p>Hello, and welcome! Our study is interested in introspection and the associated eye correlates. It is expected to last ${expectedMaxExpLength} minutes.<br><br>Please make sure you are using Google Chrome.</p>`,
//     // `<p>This study involves eye tracking. On the next screen, you should see a popup asking for access to your web camera. You will need to click "Allow" in order to participate.</p>`,
//     ],
//     show_clickable_nav: true,
//     on_start: () => {
//       emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "welcome to the exp"})

//     }
//   }

//   let gaveCameraPermission;

//   let askForCameraPermissionInAbstract = {
//     type: jsPsychSurveyMultiChoice,
//     questions: [
//       {
//         prompt: "This study involves eye tracking. Are you willing to give us access to your web camera during the experiment? If not, you cannot participate.", 
//         name: 'askForCameraPermissionInAbstract', 
//         options: ['Yes', 'No'], 
//         required: true
//       },
//       {
//         prompt: "Does your computer have a web camera or is it connected to one?", 
//         name: 'askAboutHavingACamera', 
//         options: ['Yes', 'No'], 
//         required: true
//       },
//     ],
//     on_start: () => {
//       emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "ask for permission in abstract"})

//     },
//     on_finish: function(data){
//       console.log(data.response.askForCameraPermissionInAbstract)
//       if (data.response.askForCameraPermissionInAbstract == "Yes" && data.response.askAboutHavingACamera == "Yes"){
//         gaveCameraPermission = true;
//       } else {
//         gaveCameraPermission = false;
//       }
//     }
//   };

//   let earlyExpEnd = {
//     type: jsPsychInstructions,
//     pages: [
//       `<p>Unfortunately, you cannot participate in this study without giving us access to a web camera. Please return the HIT.</p>`
//     ],
//     show_clickable_nav: false,
//     allow_keys: false,
//     on_start: () => {
//       emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: `unfortunately you dont want to participate;   data.response.askForCameraPermissionInAbstract: ${data.response.askForCameraPermissionInAbstract}       data.response.askAboutHavingACamera ${data.response.askAboutHavingACamera} `})
//     }
//   }

//   let if_camera_permission_not_given = {
//     timeline: [earlyExpEnd],
//     conditional_function: function(){
//         if (!gaveCameraPermission) {
//             return true
//         } else {
//             return false
//         }
//     }
//   }

//   let cameraPermissionInstructions = {
//     type: jsPsychInstructions,
//     pages: [
//       `<p>Great. On the next screen, you should see a popup asking for access to your web camera. You will need to click "Allow" in order to participate.</p>`
//     ],
//     show_clickable_nav: true,
//     on_start: () => {
//       emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "thanks for clicking yes"})

//     }
//   }

//   let askForCameraPermission = {
//     type: jsPsychWebgazerAskForCameraPermission,
//     on_start: () => {
//       emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "ask for permission"})

//     }
//   }

//   // let if_camera_permission_given = {
//   //   timeline: [cameraPermissionInstructions],
//   //   conditional_function: function(){
//   //       if (gaveCameraPermission) {
//   //           return true
//   //       } else {
//   //           return false
//   //       }
//   //   }
//   // }

//   let initEyeTracking = {
//     type: jsPsychWebgazerInitCamera,
//     on_start: () => {
//       emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "ini eye tracking"})

//     }
//   }

//   let instruct_eyeTracking_light = {
//     type: jsPsychHtmlButtonResponse,
//     stimulus:
//         '<div style="width: 45%; text-align: left; margin: auto;">' +
//         "<p><strong>For a preliminary adjustment, please consider the following instructions: </strong></p>" +
//         "<ol>" +
//         "<li>Sit at a table and make sure that you could later rest your elbows on it. </li>" +
//         "<li>Sit towards a window or lamp so that there are no shadows on your face. " +
//         "You might additionally turn on a desk lamp for that. <u>Avoid</u> having a window behind you. </li>" +
//         "</ol>" +
//         "</div>" +
//         '<img src="static/images/lightInstruct.png" alt="[Eye-Tracking-Instructions]" style="width: 70%;">',
//     choices: ['Click to continue'],
//     on_start: () => {
//         webgazer.resume();
//     },
//     on_finish: () => {
//         webgazer.pause();
//         webgazer.clearData();
//     }
//   }

//   let enter_fullscreen = {
//     type: jsPsychFullscreen,
//     fullscreen_mode: true,
//     message:
//         "<p>This experiment has to be conducted in <strong>full screen mode</strong>. It will end automatically at " +
//         "the end of the study.</p><br>",
//     on_start: () => {
//       emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "entering fullscreen"})

//     }
//   }

//   let calibration_instructions = {
//     type: jsPsychHtmlButtonResponse,
//     stimulus: `
//     <p>Now you'll calibrate the eye tracking, so that the software can use the image of your eyes to predict where you are looking.</p>
//     <p>You\'ll see a series of dots appear on the screen. Look at each dot and click on it. It takes a couple minutes to complete, but that time is factored into the 10 minutes that the experiment lasts.</p>
//     `,
//     choices: ['Got it'],
//     on_start: () => {
//       emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "calibration instructions"})

//     }
//   }

//   let calibration = {
//     type: jsPsychWebgazerCalibrate,
//     calibration_points: [
//         [20, 20],
//         [20, 50],
//         [20, 80],
//         [35, 35],
//         [35, 65],
//         [50, 20],
//         [50, 50],
//         [50, 80],
//         [65, 35],
//         [65, 65],
//         [80, 20],
//         [80, 50],
//         [80, 80],
//     ],
//     repetitions_per_point: 4,
//     randomize_calibration_order: true,
//     on_start: () => {
//       emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "calibrating"})

//     }
//   }

//   let writingInstructions = {
//     type: jsPsychInstructions,
//     pages: [
//     `<p>Great. We would like you to write for ${writingTimeLimit} minutes about the past month. It can be personal things or current events. Just try to write as much as you can. Click the button below to begin. The writing page will appear and then automatically time out after 2 minutes.</p>`
//     ],
//     show_clickable_nav: true
//   } 

//   let writingTask = {
//     type: jsPsychWriting,
//     is_html: true,
//     initial_text: 'Write here for ' + writingTimeLimit + ' minutes about what happened in the last month',
//     timing_response: writingTimeLimit * 60000,
//   }

//   let bonusSection = {
//     type: jsPsychSurvey,
//     pages: bonusPages,
//     button_label_finish: 'Make Choice',
//     on_finish: (data) => {
//       // $("#jspsych-content").css("width", "100%");
//       infoChoice = jsPsych.data.get().last(1).trials[0].response.bonusChoice;
//       if (infoChoice.includes("After recalibration") || infoChoice.includes("Now (before recalibration)")){
//         displayPartialInfo = false;
//         if (infoChoice.includes("Now (before recalibration)")){
//           earlyRevealBoolean = true;
//           lateRevealBoolean = false;
//         } else if (infoChoice.includes("After recalibration")){
//           earlyRevealBoolean = false;
//           lateRevealBoolean = true;
//         }
//       } else {
//         earlyRevealBoolean = false;
//         lateRevealBoolean = true;
//         if (infoChoice.includes("not how much")){
//           displayPartialInfo = true;
//           possibilities = "+25 or +50";
//         } else if (infoChoice.includes("not whether you won/lost")){
//           displayPartialInfo = true;
//           if (winningNum == 25){
//             possibilities = "-25 or +25"
//           } else if (winningNum == 50){
//             possibilities = "-50 or +50"
//           }
//         }
//       }
//     },
//     on_start: (data) => {
//       $("#jspsych-content").css("width", "60%");
//     },
//     // on_finish: (data) => {
//     //   $("#jspsych-content").css("width", "100%");
//     // },
//     // type: jsPsychSurveyMultiChoice,
//     // questions: [
//     //   {
//     //     prompt: "Which of the following do you like the most?", 
//     //     name: 'VegetablesLike', 
//     //     // options: ['Tomato', 'Cucumber', 'Eggplant', 'Corn', 'Peas'], 
//     //     required: true
//     //   }, 
//     //   {
//     //     prompt: "Which of the following do you like the least?", 
//     //     name: 'FruitDislike', 
//     //     // options: ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry'], 
//     //     required: false
//     //   }
//     // ],
//   }

//   let bonusQVar;

//   if (condition == "0"){
//     bonusQVar = "revealing"
//   } else {
//     bonusQVar = "when to reveal"
//   }
  

//   let bonusReasoning = {
//     type: jsPsychSurvey,
//     pages: [
//       [
//         {
//           type: 'text',
//           prompt: `How did you make your choice about ${bonusQVar} the two possible bonuses that were still in play? (Your answer won\'t affect your payment or HIT rating. It\'s for us to better understand the data.)`,
//           // prompt: `We are also interested in your choice about ${bonusQVar} the two possible bonuses that were still in play. What ? (Your answer won\'t affect your payment or HIT rating. It\'s for us to better understand the data.)`,
//           required: true,
//           textbox_rows: 2,
//           textbow_columns: 25,
//         },
//       ]
//     ],
//     button_label_finish: 'Continue'
//   }

//   let crossreferenceChoiceWithWinningNum = {
//     type: jsPsychHtmlButtonResponse,
//     stimulus: function(){
//       console.log(possibilities)
//       console.log("blue")
//       return (`<p>The bonus amount you will receive is either ${possibilities} cents.</p>`)
//     },
//     choices: ['Got it'],
//   }

// let  ifPartialInfo = {
//   timeline: [crossreferenceChoiceWithWinningNum],
//   conditional_function: function(){
//     if (displayPartialInfo){
//       // console.log(crossreferenceChoiceWithWinningNum)
//       // console.log("yao")
//       return true
//     } else {
//       // console.log("nao")
//       return false
//     }
//   }
// }

// let revealWinnings = {
//   type: jsPsychInstructions,
//   pages: [
//   `<p>Great. Your bonus was ${winningNum} cents, resulting in a grand total earnings of $${totalWinnings}. Please continue to finish the experiment and be paid.</p>`,
//    ],
//   show_clickable_nav: true,
// }

// let earlyReveal = {
//   timeline: [revealWinnings],
//   conditional_function: function(){
//     if (earlyRevealBoolean){
//       // console.log(crossreferenceChoiceWithWinningNum)
//       // console.log("yao")
//       return true
//     } else {
//       // console.log("nao")
//       return false
//     }
//   }
// }


//   // let preWheelInstructions = {
//   //   type: jsPsychInstructions,
//   //   pages: [
//   //   '<p>Great. Right now you are projected to earn $' + startingTotalEnglish + '. We also need to re-calibrate you once more to validate the data.</p>'
//   //   ],
//   //   show_clickable_nav: true
//   // }

//   // let learnNow = false;
//   // let choiceAboutInfo = {
//   //   type: jsPsychHtmlButtonResponse,
//   //   stimulus: '<p>The $' + startingTotalEnglish + ' amount you will earn will be slightly different by the time you finish the calibration. It could be as much as 50 cents less or 50 cents more. Do you want to learn about how much the bonus will be now, or do you want to advance directly to the re-calibration screen?</p>',
//   //   choices: ['Learn about how much the bonus will be now', 'Advance directly to the re-calibration screen'],
//   //   on_finish: function(data){
//   //       if (data.response == 0){
//   //           learnNow = true;
//   //       }
//   //   }
//   // }

  
//   let wheelSpin = {
//     type: jsPsychRoulette,
//     // numbersFacing: "upright",
//     wheelSpinTime: wheelSpinTime,
//   }

//   // let if_node = {
//   //   timeline: [wheelSpin],
//   //   conditional_function: function(){
//   //       // if (learnNow) {
//   //           return true
//   //       // } else {
//   //           // return false
//   //       // }
//   //   }
//   // }


  

//   let recalibration_instructions = {
//     type: jsPsychHtmlButtonResponse,
//     stimulus: `
//     <p>Now we\'ll re-calibrate you. Once again, you\'ll see a series of dots appear on the screen. Look at each dot and click on it.</p>
//     `,
//     choices: ['Got it'],
//   }

//   let recalibration = {
//     type: jsPsychWebgazerCalibrate,
//     calibration_points: [
//         [20, 20],
//         [20, 50],
//         [20, 80],
//         [35, 35],
//         [35, 65],
//         [50, 20],
//         [50, 50],
//         [50, 80],
//         [65, 35],
//         [65, 65],
//         [80, 20],
//         [80, 50],
//         [80, 80],
//     ],
//     repetitions_per_point: 2,
//     randomize_calibration_order: true,
//     on_start: (data) => {
//       $("#jspsych-content").css("width", "100%");
//     },
//     on_finish: (data) => {
//       $("#jspsych-content").css("width", "60%");
//     },
//   }

//   let lateReveal = {
//     timeline: [revealWinnings],
//     conditional_function: function(){
//       if (lateRevealBoolean){
//         // console.log(crossreferenceChoiceWithWinningNum)
//         // console.log("yao")
//         return true
//       } else {
//         // console.log("nao")
//         return false
//       }
//     }
//   }

//   let postTaskStarterQs = {
//     type: jsPsychSurvey,
//     pages: [
//       [
//         {
//           type: 'html',
//             // prompt: `Great. Your bonus was ${winningNum} cents, resulting in a grand total earnings of $${startingTotalPlusMinPayment + (winningNum / 100)}. To get paid, please answer the questions on this page.`
//             prompt: 'Please answer the questions on this page.'
//         },
//         {
//           type: 'text',
//           name: 'age',
//           prompt: 'What is your age?',
//           input_type: 'number',
//           required: true,
//         },
//         {
//           type: 'text',
//           prompt: 'What is your gender?',
//           name: 'gender',
//           required: true,
//         },
//         // {
//         //   type: 'text',
//         //   prompt: `How did you make your choice about ${bonusQVar} the two possible bonuses that were still in play? Did you think at all about it, or did you choose hastily without any thought? (Your answer won\'t affect your payment or HIT rating. It\'s for us to better understand the data.)`,
//         //   required: true,
//         //   textbox_rows: 2,
//         //   textbow_columns: 25,
//         // },
//         {
//           type: 'multi-choice',
//           prompt: 'Would you be interested in being contacted for a follow-up study?',
//           options: ["Yes", "No"],
//           required: true
//         },
//       ],
//     ],
//     button_label_finish: 'Continue',
//     // on_start: function(trial) {
//     //   $("#jspsych-content").css("width", "60%");
//     // }
//   }

//   postQAboutWheel = {
//     type: jsPsychSurvey,
//     pages: [
//         [
//             {
//                 type: 'html',
//                   prompt: "We\'d like to verify that we properly conveyed the instructions about the roulette wheel.",
//               },      

//             {
//                 type: 'text',
//                 prompt: `As you were making your choice about which roulette numbers to ${postQAboutWheelvars[0]}, did you find it confusing what the ${postQAboutWheelvars[1]} would do, or did you understand that it would leave you with a subset of values that we would subsequently reveal after recalibration?`,
//                 required: true,
//                 textbox_rows: 2,
//                 textbow_columns: 25,
//             }
//         ],
//         [
//             {
//                 type: 'text',
//                 prompt: `How did you make your choice about the roulette numbers you ${postQAboutWheelvars[0]}? Did you think at all about it, or did you choose hastily without any thought? (Your answer won\'t affect your payment or HIT rating. It\'s for us to better understand the data.)`,
//                 required: true,
//                 textbox_rows: 2,
//                 textbow_columns: 25,
//             }
//         ]
//     ],
//   }
  

//   // function checkIfSpun(){
//   //   jsPsych.data.get().filterCustom(function(trial){
//   //       if (trial.stimulus){
//   //           return trial.stimulus.startsWith(`<p>The ${startingTotal} amount`)
//   //       }
//   //   }).select('response').values[0] == 1;
//   // }

//   // function crossreferenceChoiceWithWinningNum(){
//   //   // console.log("rpga")
//   //   // let infoChoice = jsPsych.data.get().trials[0]['response']['bonusChoice'];
//   //   console.log("boga")
//   //   if (infoChoice.includes("Not be told anything")){
//   //     return false;
//   //   } else if (infoChoice.includes("not how much")){
//   //     // console.log("yoga")
//   //     // possibilities = "25 or 50"
//   //     return true;
//   //   } else if (infoChoice.includes("not whether you won/lost money")){
//   //     // if (winningNum == 25){
//   //       // console.log("toga")
//   //       possibilities = "-25 or 25"
//   //     // } else if (winningNum == 50){
//   //       // console.log("roga")
//   //       // possibilities = "-50 or 50"
//   //     // }
//   //     return true;
//   //   }
//   // }



//   // let if_spun_wheel = {
//   //   timeline: [postQAboutWheel],
//   //   conditional_function: function(){
//   //       if (checkIfSpun) {
//   //           return true
//   //       } else {
//   //           return false
//   //       }
//   //   }
//   // }

//   let exit_fullscreen = {
//     type: jsPsychFullscreen,
//     fullscreen_mode: false,
//     delay_after: 0
//   }

//   let timeline;

//   if (true){
//   // if (expLength == 'Full Experiment'){
//     timeline = [
//     inclusionCheck,
//     introInstructions,
//     askForCameraPermissionInAbstract,
//     if_camera_permission_not_given,
//     cameraPermissionInstructions,
//     askForCameraPermission,
//     initEyeTracking,
//     instruct_eyeTracking_light,
//     enter_fullscreen,
//     calibration_instructions,
//     calibration,
//     writingInstructions,
//     writingTask,
//     // wheelSpin,
//     bonusSection,
//     bonusReasoning,
//     ifPartialInfo,
//     earlyReveal,
//     recalibration_instructions,
//     recalibration,
//     lateReveal,
//     postTaskStarterQs,
//     exit_fullscreen
//     ]
//   } else {
//     timeline = [
//       // wheelSpin,
//       bonusSection,
//       ifPartialInfo,
//       earlyReveal,
//       recalibration_instructions,
//       recalibration,
//       lateReveal,
//       postTaskStarterQs,
//       exit_fullscreen

//     ]
//   }

//   // /* create timeline */
//   // timeline = [
//   //   // inclusionCheck,
//   //   // introInstructions,
//   //   // initEyeTracking,
//   //   // instruct_eyeTracking_light,
//   //   // enter_fullscreen,
//   //   // calibration_instructions,
//   //   // calibration,
//   //   // writingInstructions,
//   //   // writingTask,
//   //   // preWheelInstructions,
//   //   // choiceAboutInfo,
//   //   if_node,
//   //   recalibration_instructions,
//   //   recalibration,
//   //   postTaskStarterQs,
//   //   if_spun_wheel,
//   //   exit_fullscreen
//   // ]

//   /* start the experiment */
//   return jsPsych.run(timeline);



// };
