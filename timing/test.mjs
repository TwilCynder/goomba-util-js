import { TimeoutAnimation } from "./Animation.mjs";

let a = new TimeoutAnimation(1000);

a.run();

setTimeout(() => {
    a.stop();
}, 6200);