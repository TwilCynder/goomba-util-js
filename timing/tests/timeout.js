import { TimeoutAnimation } from "../Animation.js";

class TimeoutAnimTest extends TimeoutAnimation {
    #count = 0;

    constructor(){
        super(400)
    }

    async loop(){
        this.#count++;
        if (this.#count > 10){
            return true;
        }
        console.log("Oui");
        await this.sleep(1000);
    }
}

export async function testTimeout(){
    let anim = new TimeoutAnimTest();

    setTimeout(() => {
        anim.stop();
    }, 1900);

    await anim.run();

    console.log("THE END (of my suffering)")
}