var jsPsychWebgazerAskForCameraPermission = (function (jspsych) {
    'use strict';

    const info = {
        name: "askforPermission",
        parameters: {
        }
    }

    class WebgazerAskForCameraPermissionPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {

            // display_element.innerHTML = `<p id="clickAbove">Please click "Allow" on the popup above.</p><div id="ifDenied" style="display:none"><p id="errorMessage" style="color:red">Camera access denied. Please check your settings and grant permission to use the camera.</p><p>Either follow the instructions in the pictures below, or click on <a href="#" onclick="chrome.tabs.create({url:'chrome://settings/content/camera#:~:text=Not%20allowed%20to%20use%20your%20camera'});">this link</a> and remove this website from the section that says "Not allowed to use your camera". When you\'ve granted permission, click the "Retry" button below.</p><button id="retryButton" style="display:inline;height:50px;width:100px;">Retry</button></div>`;
            display_element.innerHTML = `
                <p id="clickAbove">Please click "Allow" on the popup above.</p>
                <div id="ifDenied" style="display:none">
                    <p id="errorMessage" style="color:red">Camera access denied. Follow the instructions in the picture below, then click the "Retry" button.</p>
                    <button id="retryButton">Retry</button>
                    <img id="camBlockedInstrPic"src="static/images/camblockedInstruct.jpeg" width="800">
                </div>
                <div id="ifNoCameraDetected" style="display:none">
                    <p id="errorMessage" style="color:red">No camera detected. Please check your computer settings and grant permission to use the camera. If you think this message was a mistake, please contact monosovlab.mturk@gmail.com</p>
                </div>
            `;

            // const video = document.getElementById('video');
            const errorMessage = document.getElementById('errorMessage');
            const retryButton = document.getElementById('retryButton');

            function handleSuccess(stream) {
                // video.srcObject = stream;

                display_element.innerHTML = '<div id="jspsych-content"></div>';

                jsPsych.finishTrial();

            }

            function handleError(error) {
                // console.log(error)
                // console.log(error.name)
                // console.log(typeof(error.name))
                // console.log(error.message)
                // console.log(typeof(error.message))
                // console.log(`error.name: ${error.name}    error.message: ${error.message}`)
                // // emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: error})
                emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: `error.name: ${error.name}    error.message: ${error.message}`})
                // emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "permission denied"})
                emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: JSON.stringify(jsPsych.data.get().trials[0])})
                document.getElementById('clickAbove').style.display = 'none';
                // if (true){
                if (error.message == "Requested device not found"){
                    document.getElementById('ifNoCameraDetected').style.display = 'block';
                    emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "no camera detected :-("})
                }
                else {
                    document.getElementById('ifDenied').style.display = 'block';
                }
                // console.log("retryButton")
                // console.error('Error: ', error);
                // errorMessage.innerHTML = 'Camera access denied. Please check your settings and grant permission to use the camera.';
                // errorMessage.style.color = 'red';
                // display_element.appendChild(errorMessage);
            
                // console.log("retryButton")
                // retryButton.style.display = 'inline';
                retryButton.onclick = requestCameraAccess; // Call requestCameraAccess when the button is clicked
                display_element.body.appendChild(retryButton);
            }

            function requestCameraAccess(){
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const constraints = {
                        video: true
                    };
    
                    navigator.mediaDevices.getUserMedia(constraints)
                        .then(handleSuccess)
                        .catch(handleError);
                } else {
                    alert('Sorry, your browser does not support WebRTC.');
                    emailjs.send(serviceID, templateID, {workerid: window.location.href, stage: "Sorry, your browser does not support WebRTC"})
                }
            }
            requestCameraAccess();
        }

    }
    WebgazerAskForCameraPermissionPlugin.info = info;

    return WebgazerAskForCameraPermissionPlugin;


})(jsPsychModule);
