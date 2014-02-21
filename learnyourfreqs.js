(function () { "use strict";

var context, // the audio context
    gainNode,
    initButtons,
    setFreq,
    currentFreq,
    min = 20,
    max = 20000,
    writeMin,
    writeMax,
    revealed = false;

setFreq = function () {
    // get a random number between log2(min) and log2(max)
    // so that we can do Math.pow(2, that random number)
    var newMin = Math.log(min)/Math.log(2); //log base 2 of min
    var newMax = Math.log(max)/Math.log(2); //log base 2 of max
    var newRange = newMax - newMin;
    var customRandom = Math.random() * (newRange) + newMin;
    currentFreq = Math.floor(Math.pow(2, customRandom));
};

initButtons = function () {  
    $("#playButton").click(function () {
        var osc = context.createOscillator();
        osc.frequency.value = currentFreq;
        osc.connect(gainNode);
        osc.start(context.currentTime);
        osc.stop(context.currentTime + 0.5);
    });

    $("#nextButton").click(function () {
        min = $("#freqSlider").val()[0];
        max = $("#freqSlider").val()[1];
        setFreq();
        $("#revealButton").text("Reveal");
        revealed = false;
    });

    $("#revealButton").click(function () {
        if (!revealed) {
            $("#revealButton").text(currentFreq);
            revealed = true;
        } else {
            $("#revealButton").text("Reveal");
            revealed = false;
        }
    });
}

writeMin = function (freq) {
    min = freq;
    $("#min").text(freq);
    setFreq();
    revealButton.innerHTML = "Reveal";
    revealed = false;
}

writeMax = function (freq) {
    max = freq;
    $("#max").text(freq);
    setFreq();
    revealButton.innerHTML = "Reveal";
    revealed = false;
}  

$("document").ready(function() {
    try {
        context = new AudioContext();
        gainNode = context.createGain();
        gainNode.gain.value = 0.1;
        gainNode.connect(context.destination);
    } catch (e) {
        alert('No web audio support in this browser :(');
        return;
    }

    initButtons();

    // Run noUiSlider
    $("#freqSlider").noUiSlider({
        range: [20,20000],
        start: [20,20000],
        connect: true,
        serialization: {
            resolution: 1,
            to: [
                    [ $('#min'), writeMin ],
                    [ $('#max'), writeMax ]
            ]
        }
    });

    // Running noUiSlider calls writeMin and writeMax immediately.
    // Both writeMin and writeMax call setFreq
    // I'd like to start with 440Hz
    currentFreq = 440;

});

}());