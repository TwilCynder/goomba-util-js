import { animate } from "./Animation.js";

animate(async tm => {
    for (let i = 0; i < 10; i++){
        console.log(i);
        await tm.delay(500);
    }
});