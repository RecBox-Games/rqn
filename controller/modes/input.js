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
    const dims = get_context().dimensions;
    if (text_input.text.dst) {
        text_input.text.dst.x = dims.x * 0.25;
        text_input.text.dst.y = dims.y * 0.15;
        text_input.text.dst.w = dims.x * 0.5;
        text_input.text.dst.h = dims.y * 0.25;
    }
    if (text_input.sendBtn.dst) {
        text_input.sendBtn.dst.x = dims.x * 0.25;
        text_input.sendBtn.dst.y = dims.y * 0.65;
        text_input.sendBtn.dst.w = dims.x * 0.5;
        text_input.sendBtn.dst.h = dims.y * 0.25;
    }
};
export const start_input = () => {
    if (!text_input) {
        const txt_img = new Image();
        const btn_img = new Image();
        txt_img.addEventListener('load', () => { console.log('Loaded txt img'); });
        btn_img.addEventListener('load', () => { console.log('Loaded txt img'); });
        txt_img.src = 'resources/pwtxt.svg';
        btn_img.src = 'resources/send.svg';
        text_input = {
            elem: document.getElementById("textinput"),
            drawables: [],
            text: { ...new_drawable_img(), dst: new_rect(), image: txt_img },
            sendBtn: { ...new_drawable_img(), dst: new_rect(), image: btn_img },
            buttons: []
        };
        text_input.elem.onchange = function (e) { console.log("changed", e?.target?.value); };
        let button = new Button(text_input.sendBtn.dst, undefined, undefined, () => { console.log("Sending ", text_input.elem.value); get_context().ws.send(text_input.elem.value); });
        text_input.buttons.push(button);
        text_input.drawables = [text_input.sendBtn, text_input.text];
        buttons_add(button);
    }
    size_input();
    text_input.elem.style.display = "flex";
    window.addEventListener('resize', (e) => {
        size_input();
    });
};
export const stop_input = () => {
    text_input.elem.style.display = "none";
    for (let b of text_input.buttons)
        b.active = false;
};
