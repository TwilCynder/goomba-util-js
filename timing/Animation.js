class StopException {

}

class TAnimation {
    #running = false;
    #stopped = false;

    run(){
        this.#running = true;
    }

    stop(){
        this.#running = false;
        this.#stopped = true;
    }

    isStopped(){
        return this.#stopped;
    }

    isRunning(){
        return this.#running;
    }

    sleep(ms){
        let self = this; //this 
        return new Promise((resolve, reject) => {
            if (self.isStopped()){
                console.log("reject 1")
                reject(new StopException);
            }

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
    
    #resolveFunction;
    #rejectFunction;

    constructor(delay){
        super();
        this.setDelay(delay);
    }

    setDelay(delay){
        this.#delay = delay;
    }

    async loop(){
        console.log(this)
        //Overload this !
    }

    async #runLoop(){
        if (this.isStopped()) return;

        this.#timeout = undefined;

        try {
            let res = await this.loop();

            if (res){
                this.#stop_();
            }

            if (res || this.isStopped()){ //note que le "res ||" est là que pour la perf, si il était vrai on a mis stopped à true de toute façon
                this.#resolveFunction();
            } else {
                this.#timeout = setTimeout(this.#runLoop.bind(this), this.#delay);
            }
        } catch (err){
            if (err instanceof StopException){
                this.#resolveFunction() 
            } else {
                this.#rejectFunction(err);
            }

        }
    }

    run(){
        super.run();

        let p = new Promise((resolve, reject) => {
            this.#resolveFunction = resolve;
            this.#rejectFunction = reject;
        })

        this.#runLoop();

        return p;
    }

    #stop_(){
        super.stop();
    }

    stop(){
        if (this.isStopped() || !this.isRunning()) return;

        if (this.#timeout){
            clearTimeout(this.#timeout);
            this.#resolveFunction();
        }

        this.#stop_();
    }
}

/**
 * @param {(tm: TAnimation) => Promise<any>} func 
 * @returns 
 */
export function animate(func){
    let tm = new TAnimation;
    
    (async () => {
        try {
            await func(tm)
        } catch (err){
            if (!(err instanceof StopException)){
                throw err;
            }
            //Animation stopped using tm.stop();
        }
    })();

    return tm;
}