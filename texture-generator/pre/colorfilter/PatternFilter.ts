class PatternFilter extends TexColorFilter {

    constructor(){
        super(BaseTex.pattern);
    }

    colorPixel(pixel: number, index: number): number {
        
        if(ColorFilter.getA(pixel) === 0){
            return pixel;
        }

        const x = ColorFilter.getX(index);
        const y = ColorFilter.getY(index);
        const color = this.texData[index];
        let a = ColorFilter.getA(color);
        if(a < 64){
            return pixel;
        }

        let edge = false;

        a = x > 0 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x - 1, y)]) : 0;
        if(a < 64){
            edge = true;
        }

        a = y < 15 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x, y + 1)]) : 0;
        if(a < 64){
            edge = true;
        }

        a = x < 15 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x + 1, y)]) : 0;
        if(a < 64){
            edge = true;
        }

        a = y > 0 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x, y - 1)]) : 0;
        if(a < 64){
            edge = true;
        }

        const mult = edge ? 0.6 : 0.5;
        const r = Math.min(ColorFilter.getR(pixel) * mult, 255);
        const g = Math.min(ColorFilter.getG(pixel) * mult, 255);
        const b = Math.min(ColorFilter.getB(pixel) * mult, 255);

        return Color.rgb(r, g, b);

    }
    
}