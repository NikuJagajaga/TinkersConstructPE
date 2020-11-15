class Sound {

    private media: globalAndroid.media.MediaPlayer;

    constructor(name: string){
        this.media = new android.media.MediaPlayer();
        this.media.setDataSource(__dir__ + "res/sounds/tcon/" + name);
        this.media.prepare();
    }

    play(): void {
        this.media.start();
    }

    pause(): void {
        this.media.pause();
    }

    reset(): void {
        this.media.reset();
    }

    stop(): void {
        this.media.stop();
        this.media.prepare();
    }

}


const soundSaw = new Sound("saw.ogg");
const soundLevelup = new Sound("levelup.ogg");