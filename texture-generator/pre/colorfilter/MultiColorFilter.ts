class MultiColorFilter extends ColorFilter {

    protected colorLow: number;
    protected colorMid: number;
    protected colorHigh: number;
    protected brightnessData: number[];
    protected minBrightness: number;
    protected maxBrightness: number;

    constructor(colorLow: string, colorMid: string, colorHigh: string){
        super();
        this.colorLow = Color.parseColor(colorLow);
        this.colorMid = Color.parseColor(colorMid);
        this.colorHigh = Color.parseColor(colorHigh);
    }

    preProcess(data: number[]): void {
        this.brightnessData = data.map(color => ColorFilter.getPerceptualBrightness(color));
        const min = Math.min(...this.brightnessData);
        const max = Math.max(...this.brightnessData);
        const diff = (max - min) / 2;
        this.minBrightness = Math.max(min + 1, min + diff * 0.4) | 0;
        this.maxBrightness = Math.min(max - 1, max - diff * 0.3) | 0;
    }

    colorPixel(pixel: number, index: number): number {
        const a = ColorFilter.getA(pixel);
        if(a === 0){
            return pixel;
        }
        const color = this.brightnessData[index] < this.minBrightness ? this.colorLow : this.brightnessData[index] > this.maxBrightness ? this.colorHigh : this.colorMid;
        let r = ColorFilter.mult(ColorFilter.getR(color), ColorFilter.getR(pixel)) & 0xff;
        let g = ColorFilter.mult(ColorFilter.getG(color), ColorFilter.getG(pixel)) & 0xff;
        let b = ColorFilter.mult(ColorFilter.getB(color), ColorFilter.getB(pixel)) & 0xff;
        return Color.argb(a, r, g, b);
    }

    postProcess(data: number[]): void {
        this.brightnessData = null;
    }

}