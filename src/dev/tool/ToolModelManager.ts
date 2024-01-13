class ToolModelManager {

    private static models: {[key: string]: {normal: ItemModel, broken: ItemModel}} = {};

    static getModel(item: ItemInstance): ItemModel {

        if(!item.extra){
            return null;
        }

        const stack = new TconToolStack(item);
        const suffix = stack.isBroken() ? "broken" : "normal";
        const texture = stack.instance.texture;
        const uniqueKey = stack.uniqueKey();

        if(this.models[uniqueKey]){
            return this.models[uniqueKey][suffix];
        }

        if(Threading.getThread("tcon_toolmodel")?.isAlive()){
            return null;
        }

        const modelNormal = ItemModel.newStandalone();
        const modelBroken = ItemModel.newStandalone();
        const path = texture.getPath();
        const mesh = [ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool()];
        const coordsNormal: {x: number, y: number}[] = [];
        const coordsBroken: {x: number, y: number}[] = [];
        let index = 0;

        for(let i = 0; i < texture.partsCount; i++){
            index = stack.materials[i].getTexIndex();
            coordsNormal.push(texture.getCoords(i, index));
            coordsBroken.push(texture.getCoords(i === texture.brokenIndex ? texture.partsCount : i, index));
        }

        for(let key in stack.modifiers){
            index = Modifier[key].getTexIndex();
            coordsNormal.push(texture.getModCoords(index));
            coordsBroken.push(texture.getModCoords(index));
        }

        Threading.initThread("tcon_toolmodel", () => {

            const size = 1 / 16;
            let coords: {x: number, y: number}[];
            let x = 0;
            let y = 0;
            let z = 0;

            for(let i = 0; i < 4; i++){
                coords = i >> 1 ? coordsBroken : coordsNormal;
                for(let j = 0; j < coords.length; j++){
                    x = coords[j].x;
                    y = coords[j].y;
                    z = (i & 1 ? j : (coords.length - j)) * 0.001;
                    mesh[i].setColor(1, 1, 1);
                    mesh[i].setNormal(1, 1, 0);
                    mesh[i].addVertex(0, 1, z, x, y);
                    mesh[i].addVertex(1, 1, z, x + size, y);
                    mesh[i].addVertex(0, 0, z, x, y + size);
                    mesh[i].addVertex(1, 1, z, x + size, y);
                    mesh[i].addVertex(0, 0, z, x, y + size);
                    mesh[i].addVertex(1, 0, z, x + size, y + size);
                }
                if((i & 1) === 0){ //hand
                    mesh[i].translate(0.4, -0.1, 0.2);
                    mesh[i].rotate(0.5, 0.5, 0.5, 0, -2.1, 0.4);
                    mesh[i].scale(2, 2, 2);
                }
            }

            modelNormal.setModel(mesh[0], path)
                       .setUiModel(mesh[1], path)
                       .setSpriteUiRender(true)
                       .setModUiSpriteName(stack.instance.icon.name, stack.instance.icon.meta);
            modelBroken.setModel(mesh[2], path)
                       .setUiModel(mesh[3], path)
                       .setSpriteUiRender(true)
                       .setModUiSpriteName(stack.instance.icon.name, stack.instance.icon.meta);

        });
        
        this.models[uniqueKey] = {normal: modelNormal, broken: modelBroken};

        return this.models[uniqueKey][suffix];

    }

}
