class MetalTexFilter extends MetalColorFilter {

    private texFilter: TexColorFilter;

    constructor(color: string, shinyness: number, brightness: number, hueshift: number, bitmap: android.graphics.Bitmap){
        super(color, shinyness, brightness, hueshift);
        this.texFilter = new TexColorFilter(bitmap);
    }

    preProcess(data: number[]): void {
        const bitmap = this.texFilter.applyTo(this.baseTex);
        for(let i = 0; i < data.length; i++){
            data[i] = bitmap.getPixel(ColorFilter.getX(i), ColorFilter.getY(i));
        }
    }

}