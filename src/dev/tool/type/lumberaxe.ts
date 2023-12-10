class TconLumberaxe extends TconTool {

    static LOGS: number[] = [
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

        if(!item.extra){
            return true;
        }

        const stack = new TconToolStack(item);

        if(stack.isBroken()){
            return true;
        }

        if(TconLumberaxe.LOGS.includes(block.id)){
            this.chopTree(stack, coords, player);
            return true;
        }
        
        let blockData = ToolAPI.getBlockData(block.id);
        
        if(blockData && this.blockTypes.includes(blockData.material.name) && stack.stats.level >= blockData.level){
            const region = WorldRegion.getForActor(player);
            const center = World.getRelativeCoords(coords.x, coords.y, coords.z, coords.side ^ 1);
            let block2: Tile;
            let consume = 0;
            for(let x = center.x - 1; x <= center.x + 1; x++){
            for(let y = center.y - 1; y <= center.y + 1; y++){
            for(let z = center.z - 1; z <= center.z + 1; z++){
                if(x === coords.x && y === coords.y && z === coords.z) continue;
                block2 = region.getBlock(x, y, z);
                blockData = ToolAPI.getBlockData(block2.id);
                if(blockData && this.blockTypes.includes(blockData.material.name) && stack.stats.level >= blockData.level){
                    region.destroyBlock(x, y, z, true, player);
                    stack.forEachModifiers((mod, level) => {
                        mod.onDestroy(item, {x: x, y: y, z: z, side: coords.side, relative: World.getRelativeCoords(x, y, z, coords.side)}, block2, player, level);
                    });
                    consume++;
                }
            }
            }
            }
            stack.consumeDurability(consume);
            stack.addXp(consume);
            item.data = stack.data;
        }

        return true;
        
    }

    chopTree(toolStack: TconToolStack, coords: Vector, player: number): void {

        if(Threading.getThread("tcon_choptree")?.isAlive()){
            Game.message("processing...");
            return;
        }

        Threading.initThread("tcon_choptree", () => {

            const array: Vector[] = [];
            const visited: Vector[] = [];
            
            let item: ItemInstance;
            let stack: TconToolStack;
            let pos: Vector;
            let pos2: Vector;
            let block: Tile;
            let region: WorldRegion;

            array.push(coords);

            while(array.length > 0){

                item = Entity.getCarriedItem(player);
                if(toolStack.id !== item.id || !item.extra) return;

                stack = new TconToolStack(item);
                if(stack.isBroken() || toolStack.uniqueKey() !== stack.uniqueKey()) return;

                pos = array.shift();
                if(visited.some(p => p.x === pos.x && p.y === pos.y && p.z === pos.z)) continue;
                visited.push(pos);

                region = WorldRegion.getForActor(player);

                block = region.getBlock(pos);
                if(!TconLumberaxe.LOGS.includes(block.id) && (coords.x !== pos.x || coords.y !== pos.y || coords.z !== pos.z)){
                    continue;
                }

                for(let i = 2; i <= 5; i++){
                    pos2 = World.getRelativeCoords(pos.x, pos.y, pos.z, i);
                    if(!visited.some(p => p.x === pos2.x && p.y === pos2.y && p.z === pos2.z)){
                        array.push(pos2);
                    }
                }

                for(let i = -1; i <= 1; i++){
                for(let j = -1; j <= 1; j++){
                    pos2 = {x: pos.x + i, y: pos.y + 1, z: pos.z + j};
                    if(!visited.some(p => p.x === pos2.x && p.y === pos2.y && p.z === pos2.z)){
                        array.push(pos2);
                    }
                }
                }

                region.destroyBlock(pos, true, player);
                stack.forEachModifiers((mod, level) => {
                    mod.onDestroy(item, {x: pos.x, y: pos.y, z: pos.z, side: EBlockSide.DOWN, relative: pos}, block, player, level);
                });
                stack.consumeDurability(1);
                stack.addXp(1);
                stack.applyToHand(player);

                Thread.sleep(25);

            }

        });

    }

}


/*
Callback.addCallback("LocalTick", () => {

    if(World.getThreadTime() % 20 === 0){

        const player = Player.get();
        const pointed = Player.getPointed();
        const region = WorldRegion.getForActor(player);

        region.destroyBlock(pointed.pos, true, player);

    }

});
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
