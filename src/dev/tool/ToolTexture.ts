class ToolTexture {

    private path: string;
    private bitmap: android.graphics.Bitmap;
    resolution: number;
    partsCount: number;
    brokenIndex: number;

    constructor(key: string, partsCount: number, brokenIndex: number){
        this.path = "model/tcontool_" + key;
        this.bitmap = UI.TextureSource.get("tcon.toolbmp." + key);
        this.resolution = 256;
        this.partsCount = partsCount;
        this.brokenIndex = brokenIndex;
    }

    getPath(): string {
        return this.path;
    }

    getBitmap(coords: {x: number, y: number}): android.graphics.Bitmap {
        return Bitmap.createBitmap(this.bitmap, coords.x, coords.y, 16, 16);
    }

    //partNum: head, handle..., index: material
    getCoords(partNum: number, index: number, isBroken: boolean): {x: number, y: number} {
        const part = isBroken && partNum === this.brokenIndex ? this.partsCount : partNum;
        return {
            x: (index & 15) << 4, //(index % 16) * 16
            y: (part << 1) + (index >> 4) << 4 // (part * 2 + (index / 16 | 0)) * 16
        };
    }

    getModCoords(index: number) : {x: number, y: number} {
        return {
            x: (index & 15) << 4,
            y: 224 + (index >> 4)
        };
    }

}
