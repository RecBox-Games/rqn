import { drawablesAdd, drawablesRenderAll } from "./controller_lib/draw.js";
import { get_context, init_context } from "./controller_lib/init.js";
import { cp_update } from "./controller_lib/update.js";
import { fetch_drawables, start_default_controller } from "./modes/default.js";
import { get_drawables, start_input } from "./modes/input.js";
const DEFAULT = 0;
const INPUT = 1;
let mode = DEFAULT;
let drawables = [];
const switch_mode = (new_mode) => {
    mode = new_mode;
    if (mode == DEFAULT) {
        start_default_controller();
        drawables = fetch_drawables();
    }
    else if (mode == INPUT) {
        start_input();
        drawables = get_drawables();
        console.log("drawables", drawables);
    }
};
const get_parse_messages = () => {
    const ctx = get_context();
    if (ctx.wsMessage) {
        if (ctx.wsMessage.startsWith("mode:")) {
            if (ctx.wsMessage.includes("default"))
                switch_mode(DEFAULT);
            else if (ctx.wsMessage.includes("input"))
                switch_mode(INPUT);
        }
    }
};
const app = () => {
    const ctx = get_context();
    cp_update();
    get_parse_messages();
    // console.log("Hello");
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
// window.addEventListener("orientationchange", (event) => {
//   console.log(
//     `the orientation of the device is now`, event.target
//   );
// });
window.onload = () => {
    init_context();
    // switch_mode(DEFAULT);
    switch_mode(INPUT);
    // init_controller();
};
window.requestAnimationFrame(app);
//TODO: add layer to+ drawable & sort it before rendering + render functions
