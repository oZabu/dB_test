const AudioContext = window.AudioContext || window.webkitAudioContext;
const meter = document.getElementById('volume');

function render(percent) {
    // console.log('Percent:', percent);
    meter.style.background = "hsl(" + percent * 3 + ",50%,50%)";
    meter.style.height = Math.min(Math.max(0, percent), 100) + '%';


    //TEXT

    var omg = Math.trunc(percent);

    document.getElementById("text_dB").innerHTML = omg + "dB";

    var masterDIV = document.getElementById("masterDIV");
    if (90 < omg) {
        masterDIV.style.backgroundColor = "gold";
    } else {
        masterDIV.style.backgroundColor = "white";
    };
}

function onProcess(event) {
    const data = event.inputBuffer.getChannelData(0);
    const peak = data.reduce((max, sample) => {
        const cur = Math.abs(sample);
        return max > cur ? max : cur;
    });
    render(100 / 32 * 10 * Math.log10(peak) + 100);
}

async function start() {
    const media = await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .catch(console.error);
    const ctx = new AudioContext();
    console.log('Sampling Rate:', ctx.sampleRate);

    const processor = ctx.createScriptProcessor(1024, 1, 1);
    processor.onaudioprocess = onProcess;
    processor.connect(ctx.destination);

    const source = ctx.createMediaStreamSource(media);
    source.connect(processor);
}
