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
    up.src = 'resources/up.svg';
    down.src = 'resources/down.svg';
    left.src = 'resources/left.svg';
    right.src = 'resources/right.svg';
    enter.src = 'resources/enter.svg';
    exit.src = 'resources/exit.svg';
    empty.src = 'resources/empty.svg';
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
const size_arrows = (pad) => {
    if (controller.up.dst) {
        controller.up.dst.w = controller.empty.dst.w;
        controller.up.dst.h = controller.empty.dst.h;
        controller.up.dst.x = controller.empty.dst.x + 5;
        controller.up.dst.y = controller.empty.dst.y - controller.empty.dst.h * 0.8 - pad;
    }
    if (controller.down.dst) {
        controller.down.dst.w = controller.empty.dst.w;
        controller.down.dst.h = controller.empty.dst.h;
        controller.down.dst.x = controller.empty.dst.x - 5;
        controller.down.dst.y = controller.empty.dst.y + controller.empty.dst.h * 0.8 + pad;
    }
    if (controller.left.dst) {
        controller.left.dst.w = controller.empty.dst.w;
        controller.left.dst.h = controller.empty.dst.h;
        controller.left.dst.x = controller.empty.dst.x - controller.empty.dst.w * 0.8 - pad;
        controller.left.dst.y = controller.empty.dst.y;
    }
    if (controller.right.dst) {
        controller.right.dst.w = controller.empty.dst.w;
        controller.right.dst.h = controller.empty.dst.h;
        controller.right.dst.x = controller.empty.dst.x + controller.empty.dst.w * 0.8 + pad;
        controller.right.dst.y = controller.empty.dst.y;
    }
};
const size_enter_exit = (empty_origin, exit_origin) => {
    const dims = { x: window.innerWidth, y: window.innerHeight };
    if (controller.empty.dst) {
        controller.empty.dst.x = empty_origin.x;
        controller.empty.dst.y = empty_origin.y;
    }
    if (controller.exit.dst) {
        controller.exit.dst.x = exit_origin.x;
        controller.exit.dst.y = exit_origin.y;
    }
    if (controller.enter.dst) {
        controller.enter.dst.x = exit_origin.x - dims.x * 0.20;
        controller.enter.dst.y = exit_origin.y + dims.y * 0.20;
    }
};
const size_landscape = () => {
    const dims = { x: window.innerWidth, y: window.innerHeight };
    const pad = 15;
    const empty_origin = { x: dims.x * 0.15, y: dims.y * 0.5 - dims.y * 0.125 };
    const exit_origin = { x: dims.x - dims.x * 0.25, y: dims.y * 0.5 - dims.y * 0.25 };
    size_enter_exit(empty_origin, exit_origin);
    if (controller.exit.dst) {
        controller.exit.dst.w = dims.y * 0.35;
        controller.exit.dst.h = dims.y * 0.35;
    }
    if (controller.enter.dst) {
        controller.enter.dst.w = dims.y * 0.29;
        controller.enter.dst.h = dims.y * 0.29;
    }
    if (controller.empty.dst) {
        controller.empty.dst.w = dims.y * 0.29;
        controller.empty.dst.h = dims.y * 0.29;
    }
    size_arrows(pad);
};
const size_portrait = () => {
    const dims = { x: window.innerWidth, y: window.innerHeight };
    const pad = 25;
    const empty_origin = { y: dims.y * 0.20, x: dims.x * 0.5 - dims.x * 0.125 };
    const exit_origin = { y: dims.y - dims.y * 0.40, x: dims.x * 0.5 - dims.x * 0.15 };
    if (controller.exit.dst) {
        controller.exit.dst.w = dims.x * 0.35;
        controller.exit.dst.h = dims.x * 0.35;
    }
    if (controller.enter.dst) {
        controller.enter.dst.w = dims.x * 0.29;
        controller.enter.dst.h = dims.x * 0.29;
    }
    if (controller.empty.dst) {
        controller.empty.dst.w = dims.x * 0.29;
        controller.empty.dst.h = dims.x * 0.29;
    }
    size_enter_exit(empty_origin, exit_origin);
    size_arrows(pad);
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
