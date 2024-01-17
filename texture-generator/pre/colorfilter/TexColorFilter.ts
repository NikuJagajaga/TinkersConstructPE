class TexColorFilter extends ColorFilter {

    protected texData: number[];

    constructor(bitmap: android.graphics.Bitmap){
        super();
        this.texData = new Array(256);
        for(let i = 0; i < this.texData.length; i++){
            this.texData[i] = bitmap.getPixel(ColorFilter.getX(i), ColorFilter.getY(i));
        }
    }

    preProcess(data: number[]): void {

    }

    colorPixel(pixel: number, index: number): number {
        const a = ColorFilter.getA(pixel);
        if(a === 0){
            return pixel;
        }
        const color = this.texData[index];
        const r = ColorFilter.mult(ColorFilter.getR(color), ColorFilter.getR(pixel)) & 0xff;
        const g = ColorFilter.mult(ColorFilter.getG(color), ColorFilter.getG(pixel)) & 0xff;
        const b = ColorFilter.mult(ColorFilter.getB(color), ColorFilter.getB(pixel)) & 0xff;
        return Color.argb(a, r, g, b);
    }

    postProcess(data: number[]): void {

    }

}