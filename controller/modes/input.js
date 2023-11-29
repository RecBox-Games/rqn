import { buttons_add } from "../controller_lib/button.js";
import { get_context } from "../controller_lib/init.js";
import { new_drawable_img } from "../controller_lib/types/drawables.js";
import { new_rect } from "../controller_lib/types/shapes.js";
import { Button } from "../controller_lib/types/triggerable.js";
let text_input;
export const get_drawables = () => {
    return text_input.drawables;
};
const size_input = () => {
    const dimensions = get_context().dimensions;
    if (text_input.sendBtn.dst) {
        if (dimensions.y > dimensions.x) {
            text_input.sendBtn.dst.x = dimensions.x * 0.25;
            text_input.elem.style.right = '15%';
        }
        else {
            text_input.sendBtn.dst.x = dimensions.x * 0.24;
            text_input.elem.style.right = '20%';
        }
        text_input.sendBtn.dst.y = dimensions.y * 0.55;
        text_input.sendBtn.dst.w = dimensions.x * 0.5;
        text_input.sendBtn.dst.h = dimensions.y * 0.25;
    }
};
export const start_input = (reinitialize) => {
    if (!text_input) {
        const btn_img = new Image();
        btn_img.src = 'resources/send.png';
        text_input = {
            elem: document.getElementById("textinput"),
            drawables: [],
            sendBtn: { ...new_drawable_img(), dst: new_rect(), image: btn_img },
            buttons: []
        };
        let prevValue = ""; // Keep track of previous value
        text_input.elem.oninput = function (e) {
            const targetElement = e.target;
            const currentValue = targetElement.value;
            if (currentValue.length < prevValue.length) {
                get_context().ws.send("back"); // Sending a backspace command
            }
            else {
                const lastChar = currentValue.slice(-1); // Get the last entered character
                get_context().ws.send("]" + lastChar); // Send the bracket followed by the new character
            }
            prevValue = currentValue; // Update previous value
            console.log("Changed", currentValue);
        };
        // Restore scroll position on blur
        text_input.elem.addEventListener('blur', () => {
            window.scrollTo(0, 0);
        });
        let button = new Button(text_input.sendBtn.dst, undefined, undefined, () => {
            console.log("Sending ", text_input.elem.value);
            get_context().ws.send("select");
            stop_input();
        });
        text_input.buttons.push(button);
        text_input.drawables = [text_input.sendBtn];
        buttons_add(button);
    }
    if (reinitialize) {
        activate_input_buttons();
    }
    size_input();
    text_input.elem.style.display = "flex";
    window.addEventListener('resize', () => {
        size_input();
    });
};
export const stop_input = () => {
    for (let b of text_input.buttons)
        b.active = false;
};
export const activate_input_buttons = () => {
    for (let b of text_input.buttons)
        b.active = true;
};
