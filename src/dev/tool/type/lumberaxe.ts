class TconLumberaxe extends TconTool {

    static logs: number[] = [
        VanillaTileID.log,
        VanillaTileID.log2,
        VanillaTileID.warped_stem,
        VanillaTileID.crimson_stem
    ];

    private static readonly DURABILITY_MODIFIER = 2;

    constructor(){

        super("tcontool_lumberaxe", "Lumber Axe");

        this.is3x3 = true;
        this.blockTypes = ["wood"];
        this.texture = new ToolTexture("model/tcontool_lumberaxe", 3, 1);
        this.miningSpeedModifier = 0.35;
        this.damagePotential = 1.2;
        this.repairParts = [1, 2];

        this.setToolParams();

    }

    override buildStats(stats: ToolStats, materials: string[]): void {
        stats.head(materials[1], materials[2])
             .extra(materials[3])
             .handle(materials[0]);
        stats.attack += 2;
        stats.durability *= TconLumberaxe.DURABILITY_MODIFIER;
    }

    override getRepairModifierForPart(index: number): number {
        return index === 1 ? TconLumberaxe.DURABILITY_MODIFIER : TconLumberaxe.DURABILITY_MODIFIER * 0.625;
    }

    override onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number): true {

        const client = Network.getClientForPlayer(player);

        client.send("tcon.choptree", {x: coords.x, y: coords.y, z: coords.z});

        return true;
        
    }

}


Network.addClientPacket("tcon.choptree", (data: {x: number, y: number, z: number}) => {

    if(Threading.getThread("tcon_choptree")){
        return;
    }

    Threading.initThread("tcon_choptree", () => {

        while(true){

        }

        Thread.sleep(25);

    });

});


/*
    override onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile): true {

        if(!item.extra){
            return true;
        }

        const toolData = new ToolData(item);

        if(TinkersLumberaxe.logs[block.id]){
            const thread = Threading.getThread("tcon_choptree");
            if(thread && thread.isAlive()){
                Game.tipMessage("");
                return;
            }
            Threading.initThread("tcon_choptree", () => {

                const array: Vector[] = [];
                const visited: Vector[] = [];

                let pos: Vector;
                let pos2: Vector;
                let blo: Tile;
                let i: number;
                let j: number;

                array.push({x: coords.x, y: coords.y, z: coords.z});

                while(array.length > 0 && Player.getCarriedItem().id === item.id && !toolData.isBroken()){

                    pos = array.shift();
                    if(visited.some(p => p.x === pos.x && p.y === pos.y && p.z === pos.z)){
                        continue;
                    }
                    visited.push(pos);

                    blo = World.getBlock(pos.x, pos.y, pos.z);
                    if(!TinkersLumberaxe.logs[blo.id] && (coords.x !== pos.x || coords.y !== pos.y || coords.z !== pos.z)){
                        continue;
                    }

                    for(i = 2; i < 6; i++){
                        pos2 = World.getRelativeCoords(pos.x, pos.y, pos.z, i);
                        if(!visited.some(p => p.x === pos2.x && p.y === pos2.y && p.z === pos2.z)){
                            array.push(pos2);
                        }
                    }

                    for(i = -1; i <= 1; i++){
                    for(j = -1; j <= 1; j++){
                        pos2 = {x: pos.x + i, y: pos.y + 1, z: pos.z + j};
                        if(!visited.some(p => p.x === pos2.x && p.y === pos2.y && p.z === pos2.z)){
                            array.push(pos2);
                        }
                    }
                    }

                    World.destroyBlock(pos.x, pos.y, pos.z, true);
                    toolData.forEachModifiers((mod, level) => {
                        mod.onDestroy(item, {...pos, side: 0, relative: pos}, blo, 0, level);
                    });
                    toolData.consumeDurability(1);
                    toolData.addXp(1);
                    toolData.applyHand();

                    Thread.sleep(25);

                }

            });
            return true;
        }

        if(this.blockMaterials[ToolAPI.getBlockMaterialName(block.id)]){
            const center = World.getRelativeCoords(coords.x, coords.y, coords.z, coords.side ^ 1);
            let x: number;
            let y: number;
            let z: number;
            let block2: Tile;
            let damage = 0;
            for(x = center.x - 1; x <= center.x + 1; x++){
            for(y = center.y - 1; y <= center.y + 1; y++){
            for(z = center.z - 1; z <= center.z + 1; z++){
                if(x === coords.x && y === coords.y && z === coords.z){
                    continue;
                }
                block2 = World.getBlock(x, y, z);
                if(this.blockMaterials[ToolAPI.getBlockMaterialName(block2.id)]){
                    World.destroyBlock(x, y, z, true);
                    toolData.forEachModifiers((mod, level) => {
                        mod.onDestroy(item, {x: x, y: y, z: z, side: coords.side, relative: World.getRelativeCoords(x, y, z, coords.side)}, block2, 0, level);
                    });
                    damage++;
                }
            }
            }
            }
            toolData.consumeDurability(damage);
            toolData.addXp(damage);
        }

        return true;
    }

*/


ItemRegistry.registerItem(new TconLumberaxe());
ToolForgeHandler.addRecipe(ItemID.tcontool_lumberaxe, ["rod2", "broadaxe", "largeplate", "binding2"]);
ToolForgeHandler.addLayout({
    title: "Lumber Axe",
    background: "tcon.icon.lumberaxe",
    intro: "The Lumber Axe is a broad chopping tool. It can fell entire trees in one swoop or gather wood in a wide range. Timber!",
    slots: [
        {x: -1, y: 4, bitmap: "tcon.slot.rod2"},
        {x: 0, y: -20, bitmap: "tcon.slot.broadaxe"},
        {x: 20, y: -4, bitmap: "tcon.slot.plate"},
        {x: -20, y: 20, bitmap: "tcon.slot.binding2"}
    ],
    forgeOnly: true
});
