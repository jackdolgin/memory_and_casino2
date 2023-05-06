/**
 * jspsych-writing
 * Ian Eisenberg
 *
 * plugin for writing text
 *
 * documentation: docs.jspsych.org
 *
 **/

var jsPsychWriting = (function (jspsych) {
    'use strict';

    const info = {
        name: "writing",
        parameters: {
            choices: {
                type: jspsych.ParameterType.COMPLEX,
                pretty_name: 'Choices',
                default: [],
            },
            initial_text: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Initial Text',
                default: "",
            },
            timing_response: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Timing Response',
                default: -1,
            },
            is_html: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: 'Is HTML',
                default: false,
            },
            prompt: {
                type: jspsych.ParameterType.STRING,
                pretty_name: 'Prompt',
                default: "",
            }
        }
    }

    class WritingPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
            // this array holds handlers from setTimeout calls
            // that need to be cleared if the trial ends early
            var setTimeoutHandlers = [];

            // display text area the first time this plugin is called in a series
            var myElem = document.getElementById('jspsych-writing-box');
            console.log(myElem)
            console.log(display_element)
            console.log(display_element)
            if (myElem === null) {
                display_element.innerHTML = `
                    <div class="display_stage">
                        <textarea id='jspsych-writing-box' class='writing_class'></textarea>
                    </div>
                    `;
                $("#jspsych-writing-box").focus()
            };
            // }

            // //show prompt if there is one
            if (trial.initial_text !== "") {
                $("#jspsych-writing-box").attr('placeholder', trial.initial_text);
            }

            // store writing
            var key_strokes = []

            // store response
            var response = {
                rt: -1,
                key: -1
            };
            var last_response_time = 0

            // function to end trial when it is time
            var end_trial = function() {

                // kill any remaining setTimeout handlers
                for (var i = 0; i < setTimeoutHandlers.length; i++) {
                    clearTimeout(setTimeoutHandlers[i]);
                }

                // kill keyboard listeners
                if (typeof keyboardListener !== 'undefined') {
                    jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                }
                
                
                //get text
                let final_text = $('#jspsych-writing-box').val()
                // clear the display
                display_element.innerHTML = '<div id="jspsych-content"></div>';
                //jsPsych.data.write(trial_data);
                $("#jspsych-writing-box").unbind()
                // move on to the next trial
                jsPsych.finishTrial({'key_strokes': key_strokes, 'final_text': final_text});
            };

            var after_response = function(info) {
                // after a valid response, the stimulus will have the CSS class 'responded'
                // which can be used to provide visual feedback that a response was recorded
                // only record the first response
                response = info
                
                // gather the data to store for the trial
                var trial_data = {
                    "rt": response.rt - last_response_time,
                    "key_press": response.key
                };
                last_response_time = response.rt
                key_strokes.push(trial_data)
            };


            // start the response listener
            if (JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
                console.log("blue")
                var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: after_response,
                    valid_responses: trial.choices,
                    // // rt_method: 'performance',
                    // persist: true,
                    allow_held_key: false
                });
            }

            // $("#jspsych-writing-box").on('focusout', function() {
            //     alert('Please write for the full time! Disable this alert if you really need to leave this page.')
            //     setTimeout(function() {$("#jspsych-writing-box").focus()}, 1);
            // });

            // end trial if time limit is set
            if (trial.timing_response > 0) {
                var t1 = setTimeout(function() {
                    end_trial();
                }, trial.timing_response);
                setTimeoutHandlers.push(t1);
            }
        }

    }
    WritingPlugin.info = info;

    return WritingPlugin;


})(jsPsychModule);
