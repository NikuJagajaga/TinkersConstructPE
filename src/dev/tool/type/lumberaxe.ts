class TconLumberaxe extends TconTool {

    static LOGS: number[] = [
        VanillaTileID.log,
        VanillaTileID.log2,
        VanillaTileID.warped_stem,
        VanillaTileID.crimson_stem
    ];

    private static readonly DURABILITY_MODIFIER = 2;

    constructor(miningLevel: number){

        super("tcontool_lumberaxe_lv" + miningLevel, "Lumber Axe", "tcontool_lumberaxe");

        this.tconToolType = "lumberaxe";
        this.is3x3 = true;
        this.blockTypes = ["wood"];
        this.texture = new ToolTexture(this.tconToolType, 3, 1);
        this.miningSpeedModifier = 0.35;
        this.damagePotential = 1.2;
        this.repairParts = [1, 2];

        this.setToolParams(miningLevel);

    }

    override buildStats(stats: ToolStats, materials: TinkersMaterial[]): void {
        stats.head(materials[1], materials[2])
             .extra(materials[3])
             .handle(materials[0]);
        stats.damage += 2;
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

        if(TconLumberaxe.LOGS.indexOf(block.id) !== -1){
            this.treechop(coords, stack.uniqueKey(), player);
            return true;
        }
        
        let blockData = ToolAPI.getBlockData(block.id);
        
        if(blockData && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level){
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
                if(blockData && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level){
                    region.destroyBlock(x, y, z, true, player);
                    stack.forEachModifiers((mod, level) => {
                        mod.onDestroy(item, {x: x, y: y, z: z, side: coords.side, relative: World.getRelativeCoords(x, y, z, coords.side)}, block2, player, level);
                    });
                    consume++;
                }
            }
            }
            }
            stack.consumeDurability(consume, player);
            stack.addXp(consume, player);
            item.data = stack.data;
        }

        return true;
        
    }

    treechop(coords: Vector, uniqueKey: string, player: number): void {

        const updatableName = "tcon_treechop_" + player;

        const updatables = Updatable.getAll();
        const it = updatables.iterator();
        let updatable: ChopTreeUpdatable;
        while(it.hasNext()){
            updatable = it.next();
            if(updatable.name === updatableName){
                BlockEngine.sendMessage(Network.getClientForPlayer(player), "Tree chopping in progress...");
                return;
            }
        }

        Updatable.addUpdatable(new ChopTreeUpdatable(updatableName, coords, uniqueKey, player));

    }

}


class ChopTreeUpdatable implements Updatable {

    name: string;
    player: number;
    uniqueKey: string;
    target: Vector[];
    visited: Vector[];
    remove: boolean;
    update: () => void;

    constructor(updatableName: string, coords: Vector, uniqueKey: string, player: number){

        this.name = updatableName;
        this.player = player;
        this.uniqueKey = uniqueKey;
        this.target = [];
        this.visited = [];
        this.remove = false;
        this.update = () => {
            this.remove = this.onTick();
        };

        this.addNearest(coords);

    }

    alreadyVisited(coords: Vector): boolean {
        return this.visited.some(p => p.x === coords.x && p.y === coords.y && p.z === coords.z);
    }

    addTarget(coords: Vector): void {
        if(!this.alreadyVisited(coords)){
            this.target.push(coords);
        }
    }

    addNearest(coords: Vector){
        for(let i = 2; i <= 5; i++)
            this.addTarget(World.getRelativeCoords(coords.x, coords.y, coords.z, i));
        for(let i = -1; i <= 1; i++)
            for(let j = -1; j <= 1; j++)
                this.addTarget({x: coords.x + i, y: coords.y + 1, z: coords.z + j});
    }

    onTick(): boolean {

        const carried = Entity.getCarriedItem(this.player);
    
        if(TconToolFactory.getType(carried.id) !== "lumberaxe" || !carried.extra) return true;

        const stack = new TconToolStack(carried);

        if(stack.isBroken() || stack.uniqueKey() !== this.uniqueKey) return true;

        const region = WorldRegion.getForActor(this.player);
        let coords: Vector;
        let block: Tile;

        while(this.target.length > 0){
            coords = this.target.shift();
            if(!this.alreadyVisited(coords)){
                block = region.getBlock(coords);
                if(TconLumberaxe.LOGS.indexOf(block.id) !== -1){
                    break;
                }
                coords = null;
            }
        }

        if(!coords) return true;

        region.destroyBlock(coords, true, this.player);
        stack.forEachModifiers((mod, level) => {
            mod.onDestroy(carried, {x: coords.x, y: coords.y, z: coords.z, side: EBlockSide.DOWN, relative: coords}, block, this.player, level);
        });
        stack.consumeDurability(1, this.player);
        stack.addXp(1, this.player);
        stack.applyToHand(this.player);

        this.visited.push(coords);
        this.addNearest(coords);

        return false;

    }

}


ToolForgeHandler.addRecipe("lumberaxe", ["rod2", "broadaxe", "largeplate", "binding2"]);
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
