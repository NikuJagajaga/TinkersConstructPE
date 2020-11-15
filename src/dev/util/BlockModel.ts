class BlockModel {

    private static amount = 0;
    private static data: {id: number, func: (model: any, index: number) => any, meta: number}[] = [];

    static register(id: number, func: (model: any, index: number) => any, meta: number = 1): void {
        this.data.push({id: id, func: func, meta: meta});
        this.amount += meta;
    }

    static run(): void {
        try{
            let render;
            let i = 0, j = 0, count = 0;
            for(i = 0; i < this.data.length; i++){
            for(j = 0; j < this.data[i].meta; j++){
                render = new ICRender.Model();
                render.addEntry(this.data[i].func(BlockRenderer.createModel(), j));
                BlockRenderer.setStaticICRender(this.data[i].id, j, render);
                ItemModel.getFor(this.data[i].id, j).setModel(render);
                setLoadingTip(`[TCon]: register render (${count++} / ${this.amount})`);
            }
            }
        }
        catch(e){
            alert(e);
        }
    }

};

Callback.addCallback("PostLoaded", () => {
    Threading.initThread("tcon_define_render", () => {
        BlockModel.run();
    });
});