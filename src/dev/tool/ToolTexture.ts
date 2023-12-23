class ToolTexture {

    //private bitmap: android.graphics.Bitmap;

    constructor(private path: string, public partsCount: number, public brokenIndex: number){
        //this.bitmap = FileTools.ReadImage(__dir__ + "res/" + path);
    }

    getPath(): string {
        return this.path;
    }
/*
    getBitmap(partNum: number, index: number): android.graphics.Bitmap {
        return Bitmap.createBitmap(this.bitmap, (index & 15) << 4, (index >> 4) + (partNum << 1) << 4, 16, 16);//null, true
    }
*/
    getCoords(partNum: number, index: number): {x: number, y: number} { // x, y: 0.0 - 1.0
        return {
            x: ((index & 15) << 4) / 256,
            y: ((index >> 4) + (partNum << 1) << 4) / 256
        };
    }

    getModCoords(index: number) : {x: number, y: number} {
        return {x: (index << 4) / 256, y: 240 / 256};
    }

}