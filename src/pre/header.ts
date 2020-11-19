const Color = android.graphics.Color;
const Bitmap = android.graphics.Bitmap;
const Canvas = android.graphics.Canvas;
const Paint = android.graphics.Paint;


class FileUtil {

    static isExist(path: string): boolean {
        const file = new java.io.File(path);
        return file.exists();
    }

    static readImage(path: string): android.graphics.Bitmap {
        const file = new java.io.File(path);
        file.exists() || file.getParentFile().mkdirs();
        const options = new android.graphics.BitmapFactory.Options();
        options.inScaled = false;
        return android.graphics.BitmapFactory.decodeFile(file.getAbsolutePath(), options);
    }

    static writeImage(path: string, bitmap: android.graphics.Bitmap): void {
        const file = new java.io.File(path);
        file.exists() || file.getParentFile().mkdirs();
        const output = new java.io.FileOutputStream(file);
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output);
        output.close();
    }

}


class BaseTex {
    static readonly sponge = FileUtil.readImage(__packdir__ + "assets/resource_packs/vanilla/textures/blocks/sponge.png");
    static readonly prismarine = FileUtil.readImage(__packdir__ + "assets/resource_packs/vanilla/textures/blocks/prismarine_bricks.png");
    static readonly netherrack = FileUtil.readImage(__packdir__ + "assets/resource_packs/vanilla/textures/blocks/netherrack.png");
    static readonly pattern = FileUtil.readImage(__dir__ + "texture-source/base/pattern.png");
    static readonly cast = FileUtil.readImage(__dir__ + "texture-source/base/cast.png");
    static readonly cobalt = FileUtil.readImage(__dir__ + "texture-source/base/cobalt.png");
    static readonly ardite = FileUtil.readImage(__dir__ + "texture-source/base/ardite.png");
    static readonly firewood = FileUtil.readImage(__dir__ + "texture-source/base/firewood.png");
    static readonly ardite_rust = FileUtil.readImage(__dir__ + "texture-source/base/ardite_rust.png");
}


declare function print(m: string): void;
declare namespace Resources {
    function getBytes(name: string): native.Array<jbyte>;
}