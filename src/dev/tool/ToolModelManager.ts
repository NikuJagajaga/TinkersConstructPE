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
            const path = texture.getPath();
            const uniqueKey = stack.uniqueKey();

            if(this.models[uniqueKey]){
                return this.models[uniqueKey][suffix];
            }

            const mesh = [new RenderMesh(), new RenderMesh(), new RenderMesh(), new RenderMesh()];
            const coordsNormal: {x: number, y: number}[] = [];
            const coordsBroken: {x: number, y: number}[] = [];
            let index: number;

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
                let z: number;
                for(let j = 0; j < coords.length; j++){
                    z = i & 1 ? -0.001 * (coords.length - j) : 0.001 * (coords.length - j);
                    m.setColor(1, 1, 1);
                    m.setNormal(1, 1, 0);
                    m.addVertex(0, 1, z, coords[j].x, coords[j].y);
                    m.addVertex(1, 1, z, coords[j].x + 0.0625, coords[j].y);
                    m.addVertex(0, 0, z, coords[j].x, coords[j].y + 0.0625);
                    m.addVertex(1, 1, z, coords[j].x + 0.0625, coords[j].y);
                    m.addVertex(0, 0, z, coords[j].x, coords[j].y + 0.0625);
                    m.addVertex(1, 0, z, coords[j].x + 0.0625, coords[j].y + 0.0625);
                }
                if((i & 1) === 0){ //hand
                    m.translate(0.4, -0.1, 0.2);
                    m.rotate(0.5, 0.5, 0.5, 0, -2.1, 0.4);
                    m.scale(2, 2, 2);
                }
            });

            const data = {
                normal: {hand: mesh[0], ui: mesh[1]},
                broken: {hand: mesh[2], ui: mesh[3]}
            };

            const modelNormal = ItemModel.newStandalone();
            const modelBroken = ItemModel.newStandalone();

            modelNormal.setModel(data.normal.hand, path);
            modelNormal.setUiModel(data.normal.ui, path);
            modelNormal.setSpriteUiRender(true);
            modelBroken.setModel(data.broken.hand, path);
            modelBroken.setUiModel(data.broken.ui, path);
            modelBroken.setSpriteUiRender(true);
            
            this.models[uniqueKey] = {normal: modelNormal, broken: modelBroken};
            //Game.message(uniqueKey);
            return this.models[uniqueKey][suffix];

        }
        catch(e){
            alert("toolModel: " + e);
            return null;
        }

    }


}