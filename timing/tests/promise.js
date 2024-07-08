import { animate } from "../Animation.js";

export async function testPromise(){
    let tm = animate(async tm => {
        for (let i = 0; i < 8; i++){
            console.log("Oui", i);
            await tm.sleep(500)
            console.log("Non", i);
            await tm.sleep(500);
        }
    })

    setTimeout(() => {
        tm.stop();
    }, 4100);

    await tm.promise;

    console.log("YEEEEEEHHHHAAAAAAW")
}

