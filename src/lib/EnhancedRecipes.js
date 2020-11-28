LIBRARY({
    name: "EnhancedRecipes",
    version: 5,
    shared: false,
    api: "CoreEngine"
});


var existVR = FileTools.isExists(__dir__ + "lib/VanillaRecipe.js");
if(existVR){
    IMPORT("VanillaRecipe");
    VanillaRecipe.setResourcePath(__dir__ + "res/");
    FileTools.mkdir(__dir__ + "res/definitions/recipe/");
}


var Recipes2 = {

    addShaped: function(result, mask, source, func){
        const array = [];
        for(let key in source){
            array.push(key, source[key].id || source[key], source[key].data || (source[key].data === 0 ? 0 : -1));
        }
        Recipes.addShaped(typeof result === "number" ? {id: result} : result, mask.split(":"), array, func);
    },

    addShapeless: function(result, source, func){
        const array = [];
        for(let i = 0; i < source.length; i++){
            if(typeof source[i] === "number"){
                array.push({id: source[i], data: -1});
                continue;
            }
            if(!("data" in source[i])){
                source[i].data = 0;
            }
            if(!source[i].count){
                array.push({id: source[i].id, data: source[i].data});
                continue;
            }
            for(; source[i].count--;){
                array.push({id: source[i].id, data: source[i].data});
            }
        }
        Recipes.addShapeless(typeof result === "number" ? {id: result} : result, array, func);
    },

    addShapedWith2x2: function(result, mask, source, name){
        if(!existVR){
            return;
        }
        if(!name){
            name = result.item || result;
        }
        let result2;
        if(typeof result === "string"){
            result2 = VanillaRecipe.getNumericID(result);
            result = {item: result};
        }
        else{
            result2 = {id: VanillaRecipe.getNumericID(result.item), count: result.count, data: result.data};
        }
        const source2 = {};
        for(let key in source){
            if(typeof source[key] === "string"){
                source2[key] = VanillaRecipe.getNumericID(source[key]);
                source[key] = {item: source[key]};
            }
            else{
                source2[key] = {id: VanillaRecipe.getNumericID(source[key].item), data: source[key].data};
            }
        }
        this.addShaped(result2, mask, source2);
        VanillaRecipe.addCraftingRecipe(name, {
            type: "shaped",
            pattern: mask.split(":"),
            key: source,
            result: result
        });
    },

    addShapelessWith2x2: function(result, source, name){
        if(!existVR){
            return;
        }
        if(!name){
            name = result.item || result;
        }
        let result2;
        if(typeof result === "string"){
            result2 = VanillaRecipe.getNumericID(result);
            result = {item: result};
        }
        else{
            result2 = {id: VanillaRecipe.getNumericID(result.item), count: result.count, data: result.data};
        }
        this.addShapeless(result2, source.map(function(item){
            return typeof item === "string" ? VanillaRecipe.getNumericID(item) : {id: VanillaRecipe.getNumericID(item.item), count: item.count, data: item.data};
        }));
        VanillaRecipe.addCraftingRecipe(name, {
            type: "shapeless",
            ingredients: source.map(function(item){
                return typeof item === "string" ? {item: item} : item;
            }),
            result: result
        });
    },

    bucketFunc: function(api){
        let slot;
        for(let i = 9; i--;){
            slot = api.getFieldSlot(i);
            if(slot.id == VanillaItemID.bucket){
                slot.data = 0;
                continue;
            }
            api.decreaseFieldSlot(i);
        }
    }

};


EXPORT("Recipes2", Recipes2);