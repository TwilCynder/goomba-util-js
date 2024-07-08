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

    /** @type {Promise<void>} */
    promise;

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

        this.promise = p;

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

export class TimedExectionController {
    #resolve;
    #tm;
    /**@type {Promise<void>} */
    promise;

    constructor(func){
        if (!(func instanceof Function)){
            throw "TimedExecutionController : argument is not a function"; 
        }

        let resolve_;
        let tm = new TAnimation;
        this.promise = new Promise((resolve, reject) => {
            resolve_ = resolve;

            (async () => {
                try {
                    tm.run();
                    await func(tm);
                } catch (err){
                    if (!(err instanceof StopException)){
                        reject(err);
                    }
                }
    
                if (tm.isStopped()) return;
                resolve();
            })()

            return (()=>{})(resolve, reject) //WHAT THE FUCK
        })
        this.#resolve = resolve_;
        this.#tm = tm;
    }

    stop(){
        let tm = this.#tm;
        if (tm.isStopped() || !tm.isRunning()) return;
        tm.stop();
        this.#resolve();
    }
}

/**
 * @param {(tm: TimedExectionController) => Promise<any>} func 
 * @returns 
 */
export function animate(func){
    return new TimedExectionController(func);
}