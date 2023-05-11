var jsPsychMemory = (function (jspsych) {
    'use strict';

    const info = {
        name: "memory",
        parameters: {
            numUniqueItems: {
                type: jspsych.ParameterType.INT,
                pretty_name: 'Number of Unique Memory Items',
                default: 18,
            },
        }
    }

    class MemoryPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {

            display_element.innerHTML = '<div class="deck"></div>';

            let opened = [],
            match = 0,
            moves = 0,
            $deck = $('.deck'),
            delay = 800,
            allSelections = [];

            $("body").css("background-color", "#FF9090");


            async function initializeTrial() {
                let resolvedIcons = await Promise.resolve(allAwesomeIcons);
                let resolvedIconsToKeep = await Promise.resolve(iconsToKeep);

                resolvedIcons = resolvedIcons.filter(item => !item.includes(':') && resolvedIconsToKeep.includes(item));

                let tiles = jsPsych.randomization.sampleWithoutReplacement(resolvedIcons, trial.numUniqueItems);
                tiles = jsPsych.randomization.repeat(tiles, 2);
                
                $deck.empty();
                match = 0;
                moves = 0;
                for (var i = 0; i < tiles.length; i++) {
                    $deck.append($('<li class="tile" id="tile' + i + '"><i class="fa ' + tiles[i] + '""></i></li>'));
                }
    
                // tile flip
                $deck.on('click', '.tile:not(".match, .open")', function () {
                    if ($('.show').length > 1) {return true;}
                
                    var $this = $(this),
                    tile = $this.context.innerHTML;
                    $this.addClass('open show');
                    opened.push(tile);
                    allSelections.push(tile);
                
                    // Compare with opened tile
                    if (opened.length > 1) {
                        if (tile === opened[0]) {
                            $deck.find('.open').addClass('match animated infinite rubberBand');
                            setTimeout(function () {
                            $deck.find('.match').removeClass('open show animated infinite rubberBand');
                            }, delay);
                            match++;
                        } else {
                            // $deck.find('.open').addClass('notmatch animated infinite wobble');
                            setTimeout(function () {
                            $deck.find('.open').removeClass('animated infinite wobble');
                            }, delay / 1.5);
                            setTimeout(function () {
                            $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
                            }, delay);
                        }
                        opened = [];
                        moves++;
                        if (match == trial.numUniqueItems){
                            endTrial(tiles, moves, allSelections)
                        }
                    }
                
                });

            }
        
            initializeTrial()
            

            function endTrial(tiles, moves, allSelections){
                display_element.innerHTML = '<div id="jspsych-content"></div>';
                console.log("done with trial")

                jsPsych.finishTrial({
                    tiles: tiles,
                    numMoves: moves,
                    selections: allSelections
                })
            }
        }
    }
    MemoryPlugin.info = info;

    return MemoryPlugin;

})(jsPsychModule);