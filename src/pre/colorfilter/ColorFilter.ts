abstract class ColorFilter {

    protected baseTex: android.graphics.Bitmap;

    static getX(index: number): number {
        return index & 15;
    }

    static getY(index: number): number {
        return index >> 4;
    }

    static getIndex(x: number, y: number): number {
        return x + (y << 4);
    }

    applyTo(baseTex: android.graphics.Bitmap): android.graphics.Bitmap {
        this.baseTex = baseTex;
        const data: number[] = new Array(256);
        for(let i = 0; i < data.length; i++){
            data[i] = baseTex.getPixel(ColorFilter.getX(i), ColorFilter.getY(i));
        }
        this.processData(data);
        const bitmap: android.graphics.Bitmap = new Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
        for(let i = 0; i < data.length; i++){
            bitmap.setPixel(ColorFilter.getX(i), ColorFilter.getY(i), data[i]);
        }
        return bitmap;
    }

    processData(data: number[]): void {
        this.preProcess(data);
        for(let i = 0; i < data.length; i++){
            data[i] = this.colorPixel(data[i], i);
        }
        this.postProcess(data);
    }

    abstract preProcess(data: number[]): void;
    abstract colorPixel(pixel: number, index: number): number;
    abstract postProcess(data: number[]): void;

    static mult(c1: number, c2: number): number {
        return c1 * (c2 / 255) | 0;
    }

    static getPerceptualBrightness(color: number): number {
        const r = this.getR(color) / 255;
        const g = this.getG(color) / 255;
        const b = this.getB(color) / 255;
        return Math.sqrt(0.241 * r ** 2 + 0.691 * g ** 2 + 0.068 * b ** 2) * 255 | 0;
    }

    static getA(color: number): number {
        return color >> 24;
    }

    static getR(color: number): number {
        return color >> 16 & 0xff;
    }

    static getG(color: number): number {
        return color >> 8 & 0xff;
    }

    static getB(color: number): number {
        return color & 0xff;
    }

    static colorToHSB(r: number, g: number, b: number): [number, number, number] {
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        let h = 0, s = 0;
        if(min !== max){
            switch(max){
                case r: h = 60 * ((g - b) / (max - min)); break;
                case g: h = 60 * ((b - r) / (max - min)) + 120; break;
                case b: h = 60 * ((r - g) / (max - min)) + 240; break;
            }
            s = (max - min) / max;
        }
        return [h, s, max / 255];
    }
/*
    static HSBToColor(alpha: number, hsb: [number, number, number]): number {
        const c = hsb[1] * hsb[2];
        const hp = hsb[0] / 60;
        const x = c * (1 - Math.abs(hp % 2 - 1));
        let r = 0, g = 0, b = 0;
        label: {
            if(hp < 1){
                [r, g, b]=[c, x, 0];
                break label;
            }
            if(hp < 2){
                [r, g, b]=[x, c, 0];
                break label;
            }
            if(hp < 3){
                [r, g, b]=[0, c, x];
                break label;
            }
            if(hp < 4){
                [r, g, b]=[0, x, c];
                break label;
            }
            if(hp < 5){
                [r, g, b]=[x, 0, c];
                break label;
            }
            if(hp < 6){
                [r, g, b]=[c, 0, x];
                break label;
            }
        }
        const m = hsb[2] - c;
        r += m;
        g += m;
        b += m;
        return Color.argb(alpha, r * 255 | 0, g * 255 | 0, b * 255 | 0);
    }
*/
}