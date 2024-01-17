const genOreTex = (overlay: android.graphics.Bitmap, file: string) => {
    const outputPath = __dir__ + "res/terrain-atlas/" + file;
    if(FileUtil.isExist(outputPath)){
        return;
    }
    const bitmap = BaseTex.netherrack.copy(Bitmap.Config.ARGB_8888, true);
    const canvas = new Canvas(bitmap);
    canvas.drawBitmap(overlay, 0, 0, null);
    FileUtil.writeImage(outputPath, bitmap);
};

//genOreTex(BaseTex.cobalt, "tcon_ore_cobalt.png");
//genOreTex(BaseTex.ardite, "tcon_ore_ardite.png");