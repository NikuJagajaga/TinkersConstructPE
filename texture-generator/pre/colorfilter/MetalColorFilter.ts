class MetalColorFilter extends ColorFilter {

    private color: number;

    constructor(color: string, private shinyness: number, private brightness: number, private hueshift: number){
        super();
        this.color = Color.parseColor(color);
    }

    preProcess(data: number[]): void {

    }

    colorPixel(pixel: number, index: number): number {
        const a = ColorFilter.getA(pixel);
        if(a === 0){
            return pixel;
        }
        const l = ColorFilter.getPerceptualBrightness(pixel) / 255;
        const ll = l ** 2;
        const r = ColorFilter.mult(ColorFilter.getR(this.color), ColorFilter.getR(pixel)) & 0xff;
        const g = ColorFilter.mult(ColorFilter.getG(this.color), ColorFilter.getG(pixel)) & 0xff;
        const b = ColorFilter.mult(ColorFilter.getB(this.color), ColorFilter.getB(pixel)) & 0xff;
        const hsb = ColorFilter.colorToHSB(r, g, b);
        hsb[0] -= (0.5 - ll) * this.hueshift;
        while(hsb[0] < 0){
            hsb[0] += 360;
        }
        while(hsb[0] >= 360){
            hsb[0] -= 360;
        }
        if(l > 0.9) {
            hsb[1] = Math.min(Math.max(hsb[1] - ll * this.shinyness, 0), 1);
        }
        if(l > 0.8) {
            hsb[2] = Math.min(Math.max(hsb[2] + ll * this.brightness, 0), 1);
        }
        return Color.HSVToColor(a, hsb);
    }

    postProcess(data: number[]): void {

    }

}