class ToolModelManager {

    private static models: {[key: string]: {normal: ItemModel, broken: ItemModel}} = {};

    static getModel(item: ItemInstance): ItemModel {

        if(!item.extra){
            return null;
        }

        try{

            const stack = new TconToolStack(item);
            const suffix = stack.isBroken() ? "broken" : "normal";
            const texture = stack.instance.texture;
            const uniqueKey = stack.uniqueKey();

            if(this.models[uniqueKey]){
                return this.models[uniqueKey][suffix];
            }

            const modelNormal = ItemModel.newStandalone();
            const modelBroken = ItemModel.newStandalone();
            const path = texture.getPath();
            const mesh = [ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool(), ItemModel.getEmptyMeshFromPool()];
            const coordsNormal: {x: number, y: number}[] = [];
            const coordsBroken: {x: number, y: number}[] = [];
            let index = 0;

            for(let i = 0; i < texture.partsCount; i++){
                index = Material[stack.materials[i]].getTexIndex();
                coordsNormal.push(texture.getCoords(i, index));
                coordsBroken.push(texture.getCoords(i === texture.brokenIndex ? texture.partsCount : i, index));
            }

            for(let key in stack.modifiers){
                index = Modifier[key].getTexIndex();
                coordsNormal.push(texture.getModCoords(index));
                coordsBroken.push(texture.getModCoords(index));
            }

            mesh.forEach((m, i) => {
                const coords = i >> 1 ? coordsBroken : coordsNormal;
                const size = 1 / 16;
                let x = 0;
                let y = 0;
                let z = 0;
                for(let j = 0; j < coords.length; j++){
                    x = coords[j].x;
                    y = coords[j].y;
                    z = (i & 1 ? j : (coords.length - j)) * 0.001;
                    m.setColor(1, 1, 1);
                    m.setNormal(1, 1, 0);
                    m.addVertex(0, 1, z, x, y);
                    m.addVertex(1, 1, z, x + size, y);
                    m.addVertex(0, 0, z, x, y + size);
                    m.addVertex(1, 1, z, x + size, y);
                    m.addVertex(0, 0, z, x, y + size);
                    m.addVertex(1, 0, z, x + size, y + size);
                }
                if((i & 1) === 0){ //hand
                    m.translate(0.4, -0.1, 0.2);
                    m.rotate(0.5, 0.5, 0.5, 0, -2.1, 0.4);
                    m.scale(2, 2, 2);
                }
            });

            modelNormal.setModel(mesh[0], path)
                       .setUiModel(mesh[1], path)
                       .setSpriteUiRender(true)
                       .setModUiSpriteName(stack.instance.icon.name, stack.instance.icon.meta);
            modelBroken.setModel(mesh[2], path)
                       .setUiModel(mesh[3], path)
                       .setSpriteUiRender(true)
                       .setModUiSpriteName(stack.instance.icon.name, stack.instance.icon.meta);
            
            this.models[uniqueKey] = {normal: modelNormal, broken: modelBroken};

            return this.models[uniqueKey][suffix];

        }
        catch(e){
            alert("toolModel: " + e);
            return null;
        }

    }


}
