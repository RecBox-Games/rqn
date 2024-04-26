import { CONTROLPAD_MESSAGE, send_controlpad_message } from "./controlpad.js";

var isPortrait = false;
var defaultController = true;
let previous_orientation;

var windowWidth;
var windowHeight;

// set to true to enable logs from controlpad.js
export const DEBUG = false;

///////////////////////////// HANDLE CONTROLPAD MESSAGES ///////////////////////////

document.addEventListener(CONTROLPAD_MESSAGE, function(event) {
    let message = event.detail;
    if (message === "mode:input") {
        defaultController = false;
        displayInputController();
    }
    else if (message === "mode:default") {
        defaultController = true;        
        endInput();        
    }
});

///////////////////////////// HANDLE ORIENTATION ///////////////////////////////////


function dimsCheck() {
    if (windowWidth != window.innerWidth || windowHeight != window.innerHeight) {
	console.log("windowWidth === window.innerWidth" + windowWidth === window.innerWidth);
	setDimensions();
    }
}

function setDimensions() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    if(windowWidth > windowHeight) {
	isPortrait = false;
    }
    else {
	isPortrait = true;
    }
    layoutElements(isPortrait);    
}

function layoutElements(isPortrait) {
    if (isPortrait) {
        if (defaultController) {
            hideInputController();
            document.getElementById("dpad-container-portrait").style.display = "flex";
            document.getElementById("dpad-container-landscape").style.display = "none";
        }
        else {
            hideDefaultController();
            document.getElementById("clarity-text-portrait").style.display = "flex";
            document.getElementById("input-row").style.display = "flex";
            document.getElementById("input-text-portrait").style.display = "flex";
	    document.getElementById("send-button").style.display = "flex";
	    //
	    //	    document.getElementById("input-row-landscape").style.display = "none";
	    //      document.getElementById("input-text-landscape").style.display = "none";
	    //      document.getElementById("send-button-landscape").style.display = "none";
	    document.getElementById("clarity-text-landscape").style.display = "none";
        }
    }
    else {
        if (defaultController) {
            hideInputController();
            document.getElementById("dpad-container-portrait").style.display = "none";
            document.getElementById("dpad-container-landscape").style.display = "flex";
        }
        else {
            hideDefaultController();
            document.getElementById("clarity-text-landscape").style.display = "flex";
	    //            document.getElementById("input-row-landscape").style.display = "flex";
	    //            document.getElementById("input-text-landscape").style.display = "flex"
	    document.getElementById("send-button-landscape").style.display = "none";
	    //
            document.getElementById("clarity-text-portrait").style.display = "none";
	    //      document.getElementById("input-row").style.display = "none";
	    //      document.getElementById("input-text-portrait").style.display = "none";
	    //	    document.getElementById("send-button").style.display = "none";
	    document.getElementById("input-row").style.display = "flex";
            document.getElementById("input-text-portrait").style.display = "flex";
	    document.getElementById("send-button").style.display = "flex";

        }
    }
}

setInterval(function() {
    dimsCheck();
}, 100);



/////////////////////////////////////////////////////////////////////////////////////

document.getElementById("input-text-portrait").addEventListener('blur', () => {
    window.scrollTo(0, 0);
});

document.getElementById("input-text-landscape").addEventListener("blur", () => {
    window.scrollTo(0,0);
});

//////////////////////////////// INPUT HELPERS //////////////////////////////////////

function hideDefaultController() {
    document.getElementById("dpad-container-portrait").style.display = "none";
    document.getElementById("dpad-container-landscape").style.display = "none";
}

function hideInputController() {
    document.getElementById("input-row").style.display = "none";
    document.getElementById("input-row-landscape").style.display = "none";
    document.getElementById("clarity-text-landscape").style.display = "none";
    document.getElementById("clarity-text-portrait").style.display = "none";  
}


function displayInputController() {
    hideDefaultController();
    layoutElements(isPortrait);
}

// clear input and relayout elements
function endInput() {
    document.getElementById("input-text-landscape").value = "";
    document.getElementById("input-text-portrait").value = "";
    layoutElements(isPortrait);
}


///////////////////////////////// HANDLE INPUT ///////////////////////////////////

function handleInput() {
    let text_input = document.getElementById("input-text-portrait");
    let eye_icon = document.getElementById("eye-portrait");
    let prev_value = "";

    text_input.setAttribute('autocomplete', 'off');
    text_input.setAttribute('autocorrect', 'off');
    text_input.setAttribute('autocapitalize', 'off');
    text_input.setAttribute('spellcheck', false);
    
    text_input.oninput = function (e) {
        const currentValue = e.target.value;
        if (currentValue.length < prev_value.length) {
            const deletedCount = prev_value.length - currentValue.length;
            for (let i = 0; i < deletedCount; i++) {
                send_controlpad_message("back");
            }
        } else {
            send_controlpad_message("]" + currentValue.slice(prev_value.length));
        }
        prev_value = currentValue;
    }
    
    eye_icon.onclick = function (e) {
        if (text_input.type === "password") {
            text_input.type = "text";
        } else {
            text_input.type = "password";
        }
    }      
}

////////////////////////// SETUP BUTTON LISTENERS ////////////////////////////////

function setupButtonListeners() {
    const buttons = document.querySelectorAll('button');    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            if (message != null) send_controlpad_message(message);
        });
    });    
}

///////////////////////////// DOCUMENT READY ///////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    dimsCheck();
    window.scrollTo(0,0);
    handleInput();
    setupButtonListeners();
});