LIBRARY({
    name: "EnhancedRecipes",
    version: 3,
    shared: false,
    api: "CoreEngine"
});


var Recipes2 = { 

    addShaped: function(result, mask, source, func){
        const array = [];
        let id = data = 0;
        for(let key in source){
            array.push(key, source[key].id || source[key], source[key].data || (source[key].data === 0 ? 0 : -1));
        }
        Recipes.addShaped(typeof result == "number" ? {id: result} : result, mask.split(":"), array, func);
    },

    addShapeless: function(result, source, func){
        const array = [];
        for(let i = 0; i < source.length; i++){
            if(typeof source[i] == "number"){
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
        Recipes.addShapeless(typeof result == "number" ? {id: result} : result, array, func);
    },

    bucketFunc: function(api){
        let slot;
        for(let i = 9; i--;){
            slot = api.getFieldSlot(i);
            if(slot.id == 325){
                slot.data = 0;
                continue;
            }
            api.decreaseFieldSlot(i);
        }
    }

};


EXPORT("Recipes2", Recipes2);