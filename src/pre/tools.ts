const SampleFilter = [
    new SingleColorFilter("#684e1e"),
    new SingleColorFilter("#c1c1c1"),
    new SingleColorFilter("#2376dd"),
    new SingleColorFilter("#7146b0")
];

TOOLS.forEach(tool => {
    const outputPath1 = __dir__ + "res/items-opaque/tcontool_" + tool.name + ".png";
    const outputPath2 = __dir__ + "gui/tcon/icon/" + tool.name + ".png";
    if(FileUtil.isExist(outputPath1) && FileUtil.isExist(outputPath2)){
        return;
    }
    const dir = __dir__ + "texture-source/tool/" + tool.name + "/";
    const bitmap1 = new Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
    const canvas1 = new Canvas(bitmap1);
    let texture: android.graphics.Bitmap;
    for(let i = 0; i < tool.parts; i++){
        texture = FileUtil.readImage(dir + "part" + i + ".png");
        canvas1.drawBitmap(SampleFilter[i].applyTo(texture), 0, 0, null);
    }
    const bitmap2 = new Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
    const canvas2 = new Canvas(bitmap2);
    const paint2 = new Paint();
    paint2.setAlpha(127);
    canvas2.drawBitmap(bitmap1, 0, 0, paint2);
    FileUtil.writeImage(outputPath1, bitmap1);
    FileUtil.writeImage(outputPath2, bitmap2);
});