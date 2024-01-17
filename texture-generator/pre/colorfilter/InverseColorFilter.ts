class InverseColorFilter extends MultiColorFilter {

    constructor(colorLow: string, colorMid: string, colorHigh: string){
        super(colorLow, colorMid, colorHigh);
    }

    colorPixel(pixel: number, index: number): number {
        const a = ColorFilter.getA(pixel);
        if(a === 0){
            return pixel;
        }
        const color = this.brightnessData[index] < this.minBrightness ? this.colorLow : this.brightnessData[index] > this.maxBrightness ? this.colorHigh : this.colorMid;
        const r = ~ColorFilter.mult(ColorFilter.getR(color), this.brightnessData[index]) & 0xff;
        const g = ~ColorFilter.mult(ColorFilter.getG(color), this.brightnessData[index]) & 0xff;
        const b = ~ColorFilter.mult(ColorFilter.getB(color), this.brightnessData[index]) & 0xff;
        return Color.argb(a, r, g, b);
    }

}