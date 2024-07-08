import { TimeoutAnimation } from "../Animation.js";

class TimeoutAnimTest extends TimeoutAnimation {
    #count = 0;

    constructor(){
        super(400)
    }

    loop(){
        this.#count++;
        if (this.#count > 10){
            return true;
        }
        console.log("Oui");
    }
}

export async function testTimeout(){
    await new TimeoutAnimTest().run();

    console.log("THE END (of my suffering)")
}