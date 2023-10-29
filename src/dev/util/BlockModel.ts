class BlockModel {

    static register(id: number, func: (model: BlockRenderer.Model, index: number) => BlockRenderer.Model, meta: number = 1): void {
        let render: ICRender.Model;
        for(let i = 0; i < meta; i++){
            render = new ICRender.Model();
            render.addEntry(func(BlockRenderer.createModel(), i));
            BlockRenderer.setStaticICRender(id, i, render);
            ItemModel.getFor(id, i).setModel(render);
        }
    }

};
