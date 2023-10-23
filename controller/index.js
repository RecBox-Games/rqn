import { drawablesAdd, drawablesRenderAll } from "./controller_lib/draw.js";
import { get_context, init_context } from "./controller_lib/init.js";
import { cp_update } from "./controller_lib/update.js";
import { fetch_drawables, start_default_controller, stop_default_controller } from "./modes/default.js";
import { get_drawables, start_input } from "./modes/input.js";
const DEFAULT = 0;
const INPUT = 1;
let reinitialize = false;
let mode = DEFAULT;
let drawables = [];
const switch_mode = (new_mode) => {
    mode = new_mode;
    if (mode == DEFAULT) {
        reinitialize = true;
        let inputBox = document.getElementById("textinput");
        if (inputBox) {
            inputBox.style.display = 'none';
            inputBox.value = "";
        }
        start_default_controller();
        drawables = fetch_drawables();
    }
    else if (mode == INPUT) {
        start_input(reinitialize);
        stop_default_controller();
        drawables = get_drawables();
    }
};
const get_parse_messages = () => {
    const ctx = get_context();
    if (ctx.wsMessage) {
        if (ctx.wsMessage.startsWith("mode:")) {
            if (ctx.wsMessage.includes("default")) {
                switch_mode(DEFAULT);
            }
            else if (ctx.wsMessage.includes("input")) {
                switch_mode(INPUT);
            }
        }
    }
};
const app = () => {
    const ctx = get_context();
    cp_update();
    get_parse_messages();
    if (ctx) {
        ctx.ctx.fillStyle = '#3c3c3d';
        ctx.ctx.fillRect(0, 0, ctx.dimensions.x, ctx.dimensions.y);
    }
    for (let img of drawables) {
        drawablesAdd(img);
    }
    drawablesRenderAll();
    window.requestAnimationFrame(app);
};
window.onload = () => {
    init_context();
    switch_mode(DEFAULT);
};
window.requestAnimationFrame(app);
//TODO: add layer to+ drawable & sort it before rendering + render functions
