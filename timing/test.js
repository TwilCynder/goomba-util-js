import { animate } from "./Animation.js";

animate(async tm => {
    while (true){
        console.log("red")
        await tm.delay(1000);
        console.log("black");
        await tm.delay(1000);
    }
})
