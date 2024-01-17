class CastFilter extends TexColorFilter {

    constructor(){
        super(BaseTex.cast);
    }

    colorPixel(pixel: number, index: number): number {

        if(ColorFilter.getA(pixel) === 0){
            return pixel;
        }

        const x = ColorFilter.getX(index);
        const y = ColorFilter.getY(index);
        const color = this.texData[index];
        let a = ColorFilter.getA(color);
        if(a > 64 && !(x === 0 || x === 15 || y === 0 || y === 15)){
            return 0;
        }

        let count = 0;
        let edge = false;

        a = x > 0 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x - 1, y)]) : 0;
        if(a < 64){
            count++;
            edge = true;
        }

        a = y < 15 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x, y + 1)]) : 0;
        if(a < 64){
            count++;
            edge = true;
        }

        a = x < 15 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x + 1, y)]) : 0;
        if(a < 64){
            count++;
            edge = true;
        }

        a = y > 0 ? ColorFilter.getA(this.texData[ColorFilter.getIndex(x, y - 1)]) : 0;
        if(a < 64){
            count -= 3;
            edge = true;
        }

        if(!edge || count === 0) {
            return pixel;
        }

        const mult = count < 0 ? 0.8 : count > 0 ? 1.1 : 1;
        const r = Math.min(ColorFilter.getR(pixel) * mult, 255);
        const g = Math.min(ColorFilter.getG(pixel) * mult, 255);
        const b = Math.min(ColorFilter.getB(pixel) * mult, 255);

        return Color.rgb(r, g, b);

    }
    
}