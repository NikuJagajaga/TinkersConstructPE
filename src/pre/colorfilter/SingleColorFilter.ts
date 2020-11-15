class SingleColorFilter extends ColorFilter {

    private color: number;

    constructor(color: string){
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
        const r = ColorFilter.mult(ColorFilter.getR(this.color), ColorFilter.getR(pixel)) & 0xff;
        const g = ColorFilter.mult(ColorFilter.getG(this.color), ColorFilter.getG(pixel)) & 0xff;
        const b = ColorFilter.mult(ColorFilter.getB(this.color), ColorFilter.getB(pixel)) & 0xff;
        return Color.argb(a, r, g, b);
    }

    postProcess(data: number[]): void {

    }

}