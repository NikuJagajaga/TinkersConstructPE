LIBRARY({
    name: "ConnectedTexture",
    version: 6,
    shared: false,
    api: "CoreEngine"
});
//by NikuJagajaga (https://vk.com/pockettech)


var BLOCK = function(coords, group, mode){
    return ICRender.BLOCK(coords.x || 0, coords.y || 0, coords.z || 0, group, mode || false);
};

var addSurface = function(mesh, coords, dir, u, v){
    mesh.addVertex(coords.x, coords.y, coords.z, u, v);
    mesh.addVertex(coords.x + (dir[0] === "x" ? 0.5 : 0), coords.y + (dir[0] === "y" ? 0.5 : 0), coords.z + (dir[0] === "z" ? 0.5 : 0), u + 0.5, v);
    mesh.addVertex(coords.x + (dir[1] === "x" ? 0.5 : 0), coords.y + (dir[1] === "y" ? 0.5 : 0), coords.z + (dir[1] === "z" ? 0.5 : 0), u, v + 0.5);
    mesh.addVertex(coords.x + (dir[0] === "x" ? 0.5 : 0), coords.y + (dir[0] === "y" ? 0.5 : 0), coords.z + (dir[0] === "z" ? 0.5 : 0), u + 0.5, v);
    mesh.addVertex(coords.x + (dir[1] === "x" ? 0.5 : 0), coords.y + (dir[1] === "y" ? 0.5 : 0), coords.z + (dir[1] === "z" ? 0.5 : 0), u, v + 0.5);
    mesh.addVertex(coords.x + (dir[0] === "x" || dir[1] === "x" ? 0.5 : 0), coords.y + (dir[0] === "y" || dir[1] === "y" ? 0.5 : 0), coords.z + (dir[0] === "z" || dir[1] === "z" ? 0.5 : 0), u + 0.5, v + 0.5);
};


var ConnectedTexture = {

    coords: {
        y: ["x", "z"],
        z: ["x", "y"],
        x: ["z", "y"],
    },

    _setItemModel: function(id, data, texture){
        const render = new ICRender.Model();
        render.addEntry(BlockRenderer.createTexturedBlock([[texture, 0]]));
        ItemModel.getFor(id, data).setModel(render);
    },

    setModel: function(id, data, texture, groupName){

        const render = new ICRender.Model();
        const group = ICRender.getGroup(groupName || ("CTLib_" + id + ":" + data));
        group.add(id, data);

        let coords1, coords2, coords3, H, V, D, mesh, model;
        let i = j = u = v = 0;
        
        for(let axis in this.coords){
            for(i = 0; i < 4; i++){
                coords1 = {};
                coords2 = {};
                coords3 = {};
                coords1[this.coords[axis][0]] = i & 1 ? 1 : -1;
                coords2[this.coords[axis][1]] = i >> 1 ? 1 : -1;
                H = BLOCK(coords1, group);
                V = BLOCK(coords2, group);
                D = BLOCK({x: coords1.x || coords2.x, y: coords1.y || coords2.y, z: coords1.z || coords2.z}, group);
                u = i & 1 ? 0.5 : 0;
                v = i >> 1 ? 0.5 : 0;
                coords3[this.coords[axis][0]] = u;
                coords3[this.coords[axis][1]] = v;
                for(j = 0; j < 5; j++){
                    mesh = new RenderMesh();
                    mesh.setBlockTexture(texture, j);
                    coords3[axis] = 0;
                    addSurface(mesh, coords3, this.coords[axis], u, v);
                    coords3[axis] = 1;
                    addSurface(mesh, coords3, this.coords[axis], u, v);
                    model = new BlockRenderer.Model(mesh);
                    switch(j){
                        case 0: render.addEntry(model).setCondition(ICRender.AND(ICRender.NOT(H), ICRender.NOT(V))); break;
                        case 1: render.addEntry(model).setCondition(ICRender.AND(H, ICRender.NOT(V))); break;
                        case 2: render.addEntry(model).setCondition(ICRender.AND(ICRender.NOT(H), V)); break;
                        case 3: render.addEntry(model).setCondition(ICRender.AND(H, V, ICRender.NOT(D))); break;
                        case 4: render.addEntry(model).setCondition(ICRender.AND(H, V, D)); break;
                    }
                }
            }
        }
        
        BlockRenderer.setStaticICRender(id, data, render);
        this._setItemModel(id, data, texture);

    },

    setModelForGlass: function(id, data, texture, groupName){

        const render = new ICRender.Model();
        const group = ICRender.getGroup(groupName || ("CTLib_" + id + ":" + data));
        group.add(id, data);

        //Horizontal, Vertical, Diagonal, Touch
        let coords1, coords2, coords3, H, V, D, T, mesh, model;
        let i = j = u = v = 0;
        
        for(let axis in this.coords){
            for(i = 0; i < 4; i++){
                coords1 = {};
                coords2 = {};
                coords3 = {};
                coords1[this.coords[axis][0]] = i & 1 ? 1 : -1;
                coords2[this.coords[axis][1]] = i >> 1 ? 1 : -1;
                H = BLOCK(coords1, group);
                V = BLOCK(coords2, group);
                D = BLOCK({x: coords1.x || coords2.x, y: coords1.y || coords2.y, z: coords1.z || coords2.z}, group);
                u = i & 1 ? 0.5 : 0;
                v = i >> 1 ? 0.5 : 0;
                coords3[this.coords[axis][0]] = u;
                coords3[this.coords[axis][1]] = v;
                for(j = 0; j < 5; j++){
                    mesh = new RenderMesh();
                    mesh.setBlockTexture(texture, j);
                    coords3[axis] = 0;
                    addSurface(mesh, coords3, this.coords[axis], u, v);
                    model = new BlockRenderer.Model(mesh);
                    T = ICRender.NOT(BLOCK({x: axis === "x" ? -1 : 0, y: axis === "y" ? -1 : 0, z: axis === "z" ? -1 : 0}, group));
                    switch(j){
                        case 0: render.addEntry(model).setCondition(ICRender.AND(T, ICRender.NOT(H), ICRender.NOT(V))); break;
                        case 1: render.addEntry(model).setCondition(ICRender.AND(T, H, ICRender.NOT(V))); break;
                        case 2: render.addEntry(model).setCondition(ICRender.AND(T, ICRender.NOT(H), V)); break;
                        case 3: render.addEntry(model).setCondition(ICRender.AND(T, H, V, ICRender.NOT(D))); break;
                        case 4: render.addEntry(model).setCondition(ICRender.AND(T, H, V, D)); break;
                    }
                    mesh = new RenderMesh();
                    mesh.setBlockTexture(texture, j);
                    coords3[axis] = 1;
                    addSurface(mesh, coords3, this.coords[axis], u, v);
                    model = new BlockRenderer.Model(mesh);
                    T = ICRender.NOT(BLOCK({x: axis === "x" ? 1 : 0, y: axis === "y" ? 1 : 0, z: axis === "z" ? 1 : 0}, group));
                    switch(j){
                        case 0: render.addEntry(model).setCondition(ICRender.AND(T, ICRender.NOT(H), ICRender.NOT(V))); break;
                        case 1: render.addEntry(model).setCondition(ICRender.AND(T, H, ICRender.NOT(V))); break;
                        case 2: render.addEntry(model).setCondition(ICRender.AND(T, ICRender.NOT(H), V)); break;
                        case 3: render.addEntry(model).setCondition(ICRender.AND(T, H, V, ICRender.NOT(D))); break;
                        case 4: render.addEntry(model).setCondition(ICRender.AND(T, H, V, D)); break;
                    }
                }
            }
        }
        
        BlockRenderer.setStaticICRender(id, data, render);
        this._setItemModel(id, data, texture);

    }

};


EXPORT("ConnectedTexture", ConnectedTexture);
