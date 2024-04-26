import { buttons_add } from "../controller_lib/button.js";
import { get_context } from "../controller_lib/init.js";
import { new_drawable_img } from "../controller_lib/types/drawables.js";
import { new_rect } from "../controller_lib/types/shapes.js";
import { Button } from "../controller_lib/types/triggerable.js";
let controller;
export const stop_default_controller = () => {
    if (controller) {
        for (let b of controller.buttons)
            b.active = false;
        return;
    }
};
export const start_default_controller = () => {
    if (controller) {
        for (let b of controller.buttons)
            b.active = true;
        return;
    }
    const up = new Image();
    const down = new Image();
    const left = new Image();
    const right = new Image();
    const enter = new Image();
    const exit = new Image();
    const empty = new Image();
    up.addEventListener('load', () => { console.log('Loaded Arrow'); });
    down.addEventListener('load', () => { console.log('Loaded Arrow'); });
    left.addEventListener('load', () => { console.log('Loaded Arrow'); });
    right.addEventListener('load', () => { console.log('Loaded Arrow'); });
    enter.addEventListener('load', () => { console.log('Loaded enter'); });
    exit.addEventListener('load', () => { console.log('Loaded exit'); });
    empty.addEventListener('load', () => { console.log('Loaded empty'); });
    up.src = 'resources/up.png';
    down.src = 'resources/down.png';
    left.src = 'resources/left.png';
    right.src = 'resources/right.png';
    enter.src = 'resources/enter.png';
    exit.src = 'resources/exit.png';
    empty.src = 'resources/empty.png';
    controller = {
        up: { ...new_drawable_img(), dst: new_rect(), image: up, },
        down: { ...new_drawable_img(), dst: new_rect(), image: down, },
        left: { ...new_drawable_img(), dst: new_rect(), image: left, },
        right: { ...new_drawable_img(), dst: new_rect(), image: right, },
        enter: { ...new_drawable_img(), dst: new_rect(), image: enter, },
        exit: { ...new_drawable_img(), dst: new_rect(), image: exit, },
        empty: { ...new_drawable_img(), dst: new_rect(), image: empty, },
        drawables: [],
        buttons: []
    };
    controller.drawables = [controller.exit, controller.empty, controller.enter, controller.left, controller.right, controller.up, controller.down];
    size_controller();
    let upB = new Button(controller.up.dst, undefined, undefined, () => { console.log("up"); get_context().ws.send('up'); });
    let downB = new Button(controller.down.dst, undefined, undefined, () => { console.log("down"); get_context().ws.send('down'); });
    let leftB = new Button(controller.left.dst, undefined, undefined, () => { console.log("left"); get_context().ws.send('left'); });
    let rightB = new Button(controller.right.dst, undefined, undefined, () => { console.log("right"); get_context().ws.send('right'); });
    let enterB = new Button(controller.enter.dst, undefined, undefined, () => { console.log("enter"); get_context().ws.send('select'); });
    let exitB = new Button(controller.exit.dst, undefined, undefined, () => { console.log("exit"); get_context().ws.send('back'); });
    buttons_add(upB);
    buttons_add(downB);
    buttons_add(leftB);
    buttons_add(rightB);
    buttons_add(enterB);
    buttons_add(exitB);
    controller.buttons = [
        upB,
        downB,
        leftB,
        rightB,
        enterB,
        exitB,
    ];
    window.addEventListener('resize', (e) => {
        size_controller();
    });
};
const size_arrows = (center_x, center_y, smaller_screen_dimension) => {
    var scd = smaller_screen_dimension;
    var btn_w = .28;
    var pad = scd * .02;
    if (controller.up.dst && controller.down.dst && controller.left.dst && controller.right.dst) {
        // up
        controller.up.dst.w = scd * btn_w;
        controller.up.dst.h = scd * btn_w;
        controller.up.dst.x = center_x - controller.up.dst.w * .5;
        controller.up.dst.y = center_y - controller.up.dst.h * 1.5 - pad;
        // down
        controller.down.dst.w = scd * btn_w;
        controller.down.dst.h = scd * btn_w;
        controller.down.dst.x = center_x - controller.down.dst.w * .5;
        controller.down.dst.y = center_y + controller.down.dst.h * .5 + pad;
        // left
        controller.left.dst.w = scd * btn_w;
        controller.left.dst.h = scd * btn_w;
        controller.left.dst.x = center_x - controller.left.dst.w * 1.5 - pad;
        controller.left.dst.y = center_y - controller.left.dst.h * .5;
        // right
        controller.right.dst.w = scd * btn_w;
        controller.right.dst.h = scd * btn_w;
        controller.right.dst.x = center_x + controller.right.dst.w * .5 + pad;
        controller.right.dst.y = center_y - controller.right.dst.h * .5;
    }
};
const size_landscape = () => {
    const dims = { x: window.innerWidth, y: window.innerHeight };
    const center_y = dims.y * .5;
    const center_x = center_y;
    const enter_w = (dims.y + dims.x * 2) / 3 * .2;
    const exit_w = (dims.y + dims.x * 2) / 3 * .15;
    const empty_w = dims.y * .32;
    if (controller.empty.dst && controller.exit.dst && controller.enter.dst) {
        // enter
        controller.enter.dst.w = enter_w;
        controller.enter.dst.h = enter_w;
        controller.enter.dst.x = dims.x - enter_w * 1.3;
        controller.enter.dst.y = center_y - enter_w * .7;
        // exit
        controller.exit.dst.w = exit_w;
        controller.exit.dst.h = exit_w;
        controller.exit.dst.x = dims.x - enter_w * 1.6 - exit_w;
        controller.exit.dst.y = center_y - exit_w * .1;
        // empty
        controller.empty.dst.w = empty_w;
        controller.empty.dst.h = empty_w;
        controller.empty.dst.x = center_x - empty_w * .5;
        controller.empty.dst.y = center_y - empty_w * .5;
    }
    size_arrows(center_x, center_y, dims.y);
};
const size_portrait = () => {
    const dims = { x: window.innerWidth, y: window.innerHeight };
    const center_x = dims.x * .5;
    const center_y = dims.y * .5;
    const enter_w = dims.x * .3;
    const exit_w = dims.x * .25;
    if (controller.empty.dst && controller.exit.dst && controller.enter.dst) {
        // enter
        controller.enter.dst.w = enter_w;
        controller.enter.dst.h = enter_w;
        controller.enter.dst.x = center_x - enter_w * .5;
        controller.enter.dst.y = center_y - enter_w * .5;
        // exit
        controller.exit.dst.x = dims.x * .05;
        controller.exit.dst.y = dims.x * .05;
        controller.exit.dst.w = exit_w;
        controller.exit.dst.h = exit_w;
        // empty
        controller.empty.dst.w = enter_w;
        controller.empty.dst.h = enter_w;
        controller.empty.dst.x = center_x - enter_w * .5;
        controller.empty.dst.y = center_y - enter_w * .5;
    }
    size_arrows(center_x, center_y, dims.x);
};
export const size_controller = () => {
    const ctx = get_context();
    if (!controller)
        return;
    if (ctx.dimensions.x > ctx.dimensions.y)
        size_landscape();
    else
        size_portrait();
};
export const fetch_drawables = () => {
    return controller.drawables;
};
