export class TAnimation {
    #stopped = false;

    stop(){
        this.#stopped = true;
    }

    isStopped(){
        return this.#stopped;
    }

    delay(ms){
        let self = this; //this 
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                self.isStopped() ?
                    reject(new StopException) :
                    resolve();
            }, ms)
        })
    }
}

export class TimeoutAnimation extends TAnimation {
    #timeout;
    #delay;
    
    constructor(delay){
        super();
        this.setDelay(delay);
    }

    setDelay(delay){
        this.#delay = delay;
    }

    loop(){
        console.log(this)
        //Overload this !
    }

    #runLoop(){
        if (this.isStopped()) return;

        this.loop();
        this.#timeout = setTimeout(this.#runLoop.bind(this), this.#delay);
    }

    run(){
        this.#runLoop();
    }

    stop(){
        super.stop();
        if (this.#timeout){
            clearTimeout(this.#timeout);
        }
    }
}

/**
 * @param {(tm: TAnimation) => Promise<any>} func 
 * @returns 
 */
export function animate(func){
    let tm = new TimingManager;
    
    (async () => {
        try {
            await func(tm)
        } catch (err){
            if (!(err instanceof StopException)){
                throw err;
            }
            //Animation stopped using tm.stop();
            console.log("Stopped");
        }
        console.log("Fini")
    })();

    return tm;
}