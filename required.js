///////////////////////////// DO NOT EDIT THIS FILE ////////////////////////////
/* This file will be replaced by GameNite code once you submit your game so 
   relying on edits you make to this file may break your game.
*/

import { send_controlpad_message } from './controlpad.js';
// Update the paths to your image files

const menuButtonImagePath = 'resources/menu.png';

// ---------------------- helpers ----------------------------------

/*function isAdmin() {
    return localStorage.getItem('isAdmin') === 'true';
}*/

// ------------------------------ Menu Elements -------------------------

function createMenuButton() {
    const menuButton = document.createElement('button');
    menuButton.id = 'universal-menu-button';
    menuButton.setAttribute('data-message', 'menu');
    menuButton.addEventListener('click', togglePopup); // Listener attached here

    menuButton.style.position = 'fixed';
    menuButton.style.top = '10px';
    menuButton.style.right = '10px'
    menuButton.style.zIndex = '1002';
    menuButton.style.backgroundColor = 'transparent';
    menuButton.style.border = 'none';
    //
    const img = document.createElement('img');
    img.src = menuButtonImagePath;
    img.alt = 'Menu';
    menuButton.appendChild(img);
    //
    return menuButton;
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'universal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'none';
    return overlay;
}

function createPopup() {
    const popup = document.createElement('div');
    popup.id = 'universal-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = '1001';
    popup.style.display = 'none'; // Hidden by default
    popup.style.backgroundColor = '#fff';
    popup.style.border = '1px solid black';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    popup.style.width = '50%';
    popup.style.height = '20%';
    popup.style.textAlign = 'center';
    //
    document.body.appendChild(popup);
}

function togglePopup() {
    const popup = document.getElementById('universal-popup');
    const overlay = document.getElementById('universal-overlay');
    const isHidden = popup.style.display === 'none';
    popup.style.display = isHidden ? 'block' : 'none';
    overlay.style.display = isHidden ? 'block' : 'none';
    if(isHidden) showMainMenu();
}

// ------------------------- Orientation Check ---------------------------
var viewWidth = 0;
var viewHeight = 0;
var isPortrait = true;

function dimsCheck() {
    if (viewWidth != window.innerWidth || viewHeight != window.innerHeight) {
        dispatchViewportEvent();
    }
}

function dispatchViewportEvent() {
    viewWidth = window.innerWidth;
    viewHeight = window.innerHeight;
    isPortrait = viewHeight > viewWidth;
    var viewport_event = new CustomEvent("viewport-change", {
        detail: {
            isPortrait: isPortrait,
            viewHeight: viewHeight,
            viewWidth: viewWidth,
        }
    });
    console.log("dispatching");
    document.dispatchEvent(viewport_event);
}

// ------------------------- Menu Sub Elements -----------------------------

function showMainMenu() {
    const popup = document.getElementById('universal-popup');
    popup.innerHTML = ''; // Clear current content
    if (window.innerWidth > window.innerHeight) popup.style.height = '30%';
    else popup.style.height = '20%';

    const closeButton = document.createElement('button');    
    closeButton.id = 'close-button';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.textContent = 'Close X';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '2px';
    closeButton.style.top = '2px';
    closeButton.addEventListener('click', togglePopup);
    closeButton.style.backgroundColor = 'black';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '20px';
    closeButton.style.padding = '3px';
    closeButton.style.width = '20vw';
    
    // Invite Others Button
    const inviteButton = document.createElement('button');
    inviteButton.textContent = 'Invite Others';
    inviteButton.style.fontSize = '20px';
    inviteButton.addEventListener('click', inviteOthers);
    inviteButton.style.margin = '10px';
    inviteButton.style.width = '50vw';
    inviteButton.style.backgroundColor = '#4CAF50';
    inviteButton.style.color = 'white';
    inviteButton.style.border = 'none';
    inviteButton.style.borderRadius = '5px';
    inviteButton.style.position = 'relative';
    inviteButton.style.top = '20%';
    inviteButton.style.right = '4%';

    if (!isPortrait) {
	closeButton.style.height = '8vh';
	inviteButton.style.height = '7vh';
    }
    else {
	closeButton.style.height = '5vh';
	inviteButton.style.height = '5vh';
    }
    showQuitButton();
//        showPlayerMenuButton();
    
    //
    popup.appendChild(closeButton);
    popup.appendChild(inviteButton);
}

/*function showAdminButton() {
    const popup = document.getElementById('universal-popup');

    const adminButton = document.createElement('button');
    adminButton.id = 'admin-button';
    adminButton.textContent = 'Admin Menu';
    adminButton.style.fontSize = '20px';
    adminButton.addEventListener('click', showPasswordPrompt);
    adminButton.style.margin = '10px';
    adminButton.style.width = '50vw';
    
    adminButton.style.backgroundColor = '#2196F3';
    adminButton.style.color = 'white';
    adminButton.style.border = 'none';
    adminButton.style.borderRadius = '5px';
    adminButton.style.position = 'relative';
    adminButton.style.top = '20%';
    adminButton.style.right = '4%';

    if (!isPortrait) {
	popup.style.height = '30%';
	adminButton.style.height = '7vh';
    }
    else {
	popup.style.height = '20%';
	adminButton.style.height = '5vh';
    }

   
    popup.appendChild(adminButton);
}*/

function showQuitButton() {
    const popup = document.getElementById('universal-popup');   

    const quitButton = document.createElement('button');    
    quitButton.textContent = 'Quit Game';
    quitButton.style.fontSize = '20px';
    quitButton.addEventListener('click', confirmQuitGame);
    quitButton.style.margin = '10px';
    quitButton.style.width = '50vw';
    quitButton.style.height = '5vh';
    quitButton.style.backgroundColor = '#f44336';
    quitButton.style.color = 'white';
    quitButton.style.border = 'none';
    quitButton.style.borderRadius = '5px';
    quitButton.style.position = 'relative';
    quitButton.style.top = '20%';
    quitButton.style.right = '4%';

    if (!isPortrait) {
	popup.style.height = '45%';
	quitButton.style.height = '7vh';
    }
    else {
	popup.style.height = '30%';
	quitButton.style.height = '5vh';	
    }


    popup.appendChild(quitButton);

}

/*function showPlayerMenuButton() {
    const popup = document.getElementById('universal-popup');

    const showPlayerMenuButton = document.createElement('button');
    showPlayerMenuButton.textContent = 'Player Controls';
    showPlayerMenuButton.style.fontSize = '20px';
    showPlayerMenuButton.addEventListener('click', switchToPlayerControls);
    showPlayerMenuButton.style.margin = '10px';
    showPlayerMenuButton.style.width = '50vw';
    showPlayerMenuButton.style.height = '5vh';
    showPlayerMenuButton.style.backgroundColor = '#2196F3';
    showPlayerMenuButton.style.color = 'white';
    showPlayerMenuButton.style.border = 'none';
    showPlayerMenuButton.style.borderRadius = '5px';
    showPlayerMenuButton.style.position = 'relative';
    showPlayerMenuButton.style.top = '20%';
    showPlayerMenuButton.style.right = '4%';

    if (!isPortrait) {
	showPlayerMenuButton.style.height = '7vh';
    }
    else {
	popup.style.height = '30%';
	showPlayerMenuButton.style.height = '5vh';	
    }



    popup.appendChild(showPlayerMenuButton);
}*/

// ---------------------- Password Prompt ----------------------------------

/*function showPasswordPrompt() {
    const popup = document.getElementById('universal-popup');
    popup.innerHTML = ''; 
    popup.style.width = '50%';
    popup.style.height = '5%';    

    const input = document.createElement('input');
    input.type = 'password';
    input.id = 'password-input';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.style.fontSize = '20px';
    submitButton.addEventListener('click', checkPassword);

    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.style.fontSize = '20px';
    backButton.addEventListener('click', showMainMenu);

    popup.appendChild(input);
    popup.appendChild(submitButton);
    popup.appendChild(backButton);
}

function checkPassword() {
    const input = document.getElementById('password-input');
    if (input.value === '7') {
        console.log("Password correct. Action performed.");
        togglePopup();
        switchToAdminMenu();
    } else {
        console.log("Incorrect password");
    }
}*/

// ------------------------- Handle Admin Menu ------------------------------

/*function switchToPlayerControls() {
    localStorage.setItem('isAdmin', 'false');
    send_controlpad_message("state-request");
    togglePopup();
}


  function switchToAdminMenu() {
    localStorage.setItem('isAdmin', 'true');
  }
*/

function confirmQuitGame() {
    const popup = document.getElementById('universal-popup');
    popup.innerHTML = ''; 
    popup.style.height = '20%';

    // yes or no button and no button just goes back and yes calls exitGame
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.style.fontSize = '20px';
    yesButton.addEventListener('click', exitGame);
    yesButton.style.margin = '10px';
    yesButton.style.width = '50vw';
    yesButton.style.height = '5vh';
    yesButton.style.backgroundColor = '#f44336';
    yesButton.style.color = 'white';
    yesButton.style.border = 'none';
    yesButton.style.borderRadius = '5px';
    yesButton.style.position = 'relative';
    yesButton.style.top = '20%';
    yesButton.style.right = '4%';

    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.style.fontSize = '20px';
    noButton.addEventListener('click', showMainMenu);
    noButton.style.margin = '10px';
    noButton.style.width = '50vw';
    noButton.style.height = '5vh';
    noButton.style.backgroundColor = '#4CAF50';
    noButton.style.color = 'white';
    noButton.style.border = 'none';
    noButton.style.borderRadius = '5px';
    noButton.style.position = 'relative';
    noButton.style.top = '20%';
    noButton.style.right = '4%';

    popup.appendChild(yesButton);
    popup.appendChild(noButton);    

}

function exitGame() {
    let byteArray = new Uint8Array([0x99, 0x99]);
    send_controlpad_message(byteArray);
    console.log("Exiting game");
}

// ------------------------- handle qr codes ------------------------------------

function inviteOthers() {
    let byteArray = new Uint8Array([0x98, 0x98]);
    send_controlpad_message(byteArray);

    var qrCodePath = 'resources/qr.png'; 
    var qrCode = new Image();
    qrCode.src = qrCodePath;

    let attempts = 0;
    const maxAttempts = 10;
    
    function attemptLoadQrCode() {
        qrCode.src = qrCodePath; 
        attempts++;        
    }

    qrCode.onload = function() {
        console.log("QR code loaded successfully");
        displayQrCodeImage();
    };

    qrCode.onerror = function() {
        console.log("Attempt " + attempts + " to load QR code failed");
        if (attempts < maxAttempts) {
            setTimeout(attemptLoadQrCode, 1000);
            displayLoadingQrCodeMessage();
        }
        else displayQrCodeNotFoundError();
    };
}

function displayQrCodeImage() {
    const popup = document.getElementById('universal-popup');
    popup.innerHTML = '';
    if (!isPortrait) popup.style.height = '50%';
    else popup.style.height = '25%';
    const qrCode = document.createElement('img');
    qrCode.src = 'resources/qr.png';
    qrCode.style.position = 'relative';
    qrCode.style.top = '20%';
    popup.appendChild(qrCode);
    close_and_back_buttons();
}

function displayLoadingQrCodeMessage() {
    const popup = document.getElementById('universal-popup');
    popup.innerHTML = '';
    popup.style.height = '25%';    
    const loadingQrCode = document.createElement('p');
    loadingQrCode.textContent = 'Loading QR code...';
    loadingQrCode.style.position = 'relative';
    popup.appendChild(loadingQrCode);
    close_and_back_buttons();
}

function displayQrCodeNotFoundError() {
    const popup = document.getElementById('universal-popup');
    popup.innerHTML = '';
    const qrCodeNotFound = document.createElement('p');
    qrCodeNotFound.textContent = 'QR code not found';
    qrCodeNotFound.style.position = 'relative';
    qrCodeNotFound.style.top = '20%';
    popup.appendChild(qrCodeNotFound);
    close_and_back_buttons();
}

function close_and_back_buttons() {
    const popup = document.getElementById('universal-popup');
    //
    const backButton = document.createElement('button');
    backButton.id = 'back-button-popup';
    backButton.textContent = 'Back'
    backButton.style.fontSize = '20px';
    backButton.addEventListener('click', showMainMenu);
    backButton.style.margin = '10px';
    backButton.style.width = '20vw';
    backButton.style.height = '40px';
    backButton.style.backgroundColor = '#4CAF50';
    backButton.style.color = 'white';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '5px';
    backButton.style.position = 'relative';
    backButton.style.top = "20%";

    popup.appendChild(backButton);
    //
    const closeButton = document.createElement('button');
    closeButton.id = 'close-button';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.textContent = 'Close X';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '2px';
    closeButton.style.top = '2px';
    closeButton.addEventListener('click', togglePopup);
    closeButton.style.backgroundColor = 'black';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '20px';
    closeButton.style.padding = '3px';
    closeButton.style.width = '20vw';
    closeButton.style.height = '5vh';
    popup.appendChild(closeButton);

    if (window.innerWidth > window.innerHeight) {
	closeButton.style.height = '8vh';
	backButton.style.top = '35%';
    }
    else {
	closeButton.style.height = '5vh';
    }

}

// ------------------------When Dom is loaded-----------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const bodyElement = document.body;
    const menuButton = createMenuButton();
    const overlay = createOverlay();
    //
    dispatchViewportEvent();
    setInterval(dimsCheck, 100);
    //
    bodyElement.appendChild(overlay);
    bodyElement.appendChild(menuButton);
    createPopup(); // Initialize the popup structure
    //    if (isAdmin()) {
    showQuitButton();
    /*
      showPlayerMenuButton();
      } else showAdminButton();
      */

});
