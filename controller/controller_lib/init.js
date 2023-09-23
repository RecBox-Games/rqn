import { handleTouchCancel, handleClick, handleTouchEnd, handleTouchMove, handleTouchStart } from "./utils.js";
let context;
// globals
let drag_start_x = 0;
let drag_start_y = 0;
// websocket and main
export const get_context = () => context;
export const init_context = () => {
    const canvas = document.querySelector("canvas");
    const url_arg_str = window.location.search;
    const url_params = new URLSearchParams(url_arg_str);
    const subid = url_params.get('subid');
    const box_ip = window.location.href.split('/')[2].split(':')[0];
    let ws = new WebSocket("ws://" + box_ip + ":50079");
    context = {
        canvas: canvas,
        ctx: canvas.getContext("2d"),
        dimensions: { x: canvas.width, y: canvas.width },
        ws: ws,
        subid: parseInt(subid),
        box_ip: box_ip,
        wsState: 0,
        wsMessage: null
    };
    // if (ws.readyState == WebSocket.CLOSED) {
    //     ws = new WebSocket("ws://" + box_ip + ":50079");
    // }
    screenChange();
    // window.onload = () => {
    // 	context.dimensions.x = window.innerWidth;
    // 	context.dimensions.y = window.innerHeight;
    //     context.canvas.width = document.body.clientWidth;
    //     context.canvas.height = document.body.clientWidth;
    // }
    context.ws.onclose = (event) => {
        console.log("closed websocket");
        context.wsState = 0;
        context.ws = new WebSocket("ws://" + box_ip + ":50079");
    };
    context.ws.onopen = (event) => {
        console.log("opened websocket!! controll controller_lib/init.ts");
        context.wsState = 1;
        let byte_array = new Uint8Array(1);
        byte_array[0] = context.subid;
        context.ws.send(byte_array);
        context.ws.onmessage = async (event) => {
            console.log("Message is: ", event.data);
            if (event.data instanceof Blob) {
                const blobData = new Uint8Array(await event.data.arrayBuffer()); // Read the Blob as a Uint8Array
                // Check the first byte to trigger a reload if it's equal to 0x01
                if (blobData.length > 0 && blobData[0] === 0x01) {
                    console.log("Hold your hats! It's reload time!");
                    location.reload();
                }
                else {
                    // Handle other binary data
                    console.log("Received binary data:", blobData);
                    // Handle it according to your use case.
                }
            }
            else {
                const msg = event.data;
                console.log("other messages: ", msg);
                context.wsMessage = msg;
                //     handleMessage(msg);
            }
        };
    };
};
// wait for websocket to connect
window.onresize = screenChange;
window.onorientationchange = screenChange;
function screenChange() {
    // context.canvas.width = Math.max(window.innerWidth, window.innerHeight);
    // context.canvas.height = Math.min(window.innerWidth, window.innerHeight);
    // context.dimensions.x = Math.max(window.innerWidth, window.innerHeight);
    // context.dimensions.y = Math.min(window.innerWidth, window.innerHeight);
    // let ratio = window.innerWidth / window.innerHeight;
    // if (!(ratio >= 0.8 && ratio <= 1.25))
    //     return ;
    context.canvas.width = window.innerWidth * window.devicePixelRatio;
    context.canvas.height = window.innerHeight * window.devicePixelRatio;
    context.dimensions.x = window.innerWidth;
    context.dimensions.y = window.innerHeight;
    // size_loading();
    // size_menu();
    // size_tutorial();
    // size_main();
    // size_end();
    // console.log(context.dimensions)
    // onFlip(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", (event) => {
    screenChange();
});
window.addEventListener("touchstart", (event) => {
    const touchesArray = Array.from(event.changedTouches);
    for (let touch of touchesArray) {
        handleTouchStart(touch.identifier, touch.pageX, touch.pageY);
    }
});
window.addEventListener("touchmove", (event) => {
    const touchesArray = Array.from(event.changedTouches);
    for (let touch of touchesArray) {
        handleTouchMove(touch.identifier, touch.pageX, touch.pageY);
    }
});
window.addEventListener("touchend", (event) => {
    const touchesArray = Array.from(event.changedTouches);
    for (let touch of touchesArray) {
        handleTouchEnd(touch.identifier, touch.pageX, touch.pageY);
    }
});
window.addEventListener("touchcancel", (event) => {
    const touchesArray = Array.from(event.changedTouches);
    for (let touch of touchesArray) {
        handleTouchCancel(touch.identifier, touch.pageX, touch.pageY);
    }
});
window.addEventListener('click', (event) => {
    handleClick(event.clientX, event.clientY);
});
