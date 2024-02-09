class TconHatchet extends TconTool {

    private static readonly STRIPPED_LOGS: {id: number, data: number, stripped: number, isStem: boolean}[] = [
        {id: VanillaTileID.log, data: 0, stripped: VanillaTileID.stripped_oak_log, isStem: false},
        {id: VanillaTileID.log, data: 1, stripped: VanillaTileID.stripped_spruce_log, isStem: false},
        {id: VanillaTileID.log, data: 2, stripped: VanillaTileID.stripped_birch_log, isStem: false},
        {id: VanillaTileID.log, data: 3, stripped: VanillaTileID.stripped_jungle_log, isStem: false},
        {id: VanillaTileID.log2, data: 0, stripped: VanillaTileID.stripped_acacia_log, isStem: false},
        {id: VanillaTileID.log2, data: 1, stripped: VanillaTileID.stripped_dark_oak_log, isStem: false},
        {id: VanillaTileID.warped_stem, data: -1, stripped: VanillaTileID.stripped_warped_stem, isStem: true},
        {id: VanillaTileID.crimson_stem, data: -1, stripped: VanillaTileID.stripped_crimson_stem, isStem: true}
    ];

    constructor(miningLevel: number){

        super("tcontool_hatchet_lv" + miningLevel, "Hatchet", "tcontool_hatchet");

        this.tconToolType = "hatchet";
        this.blockTypes = ["wood", "plant"];
        this.texture = new ToolTexture(this.tconToolType, 3, 1);
        this.damagePotential = 1.1;

        this.setToolParams(miningLevel);

    }

    override buildStats(stats: ToolStats, materials: TinkersMaterial[]): void {
        stats.head(materials[1])
             .extra(materials[2])
             .handle(materials[0]);
        stats.damage += 0.5;
    }

    //Destroying plants does not reduce durability.
    onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number): true {
        if(!item.extra){
            return true;
        }
        const stack = new TconToolStack(item);
        const blockData = ToolAPI.getBlockData(block.id);
        if(blockData && this.blockTypes.indexOf(blockData.material.name) !== -1 && stack.stats.level >= blockData.level && !stack.isBroken()){
            stack.forEachModifiers((mod, level) => {
                mod.onDestroy(item, coords, block, player, level);
            });
            if(blockData.material.name !== "plant"){
                if(this.isWeapon){
                    stack.consumeDurability(2, player);
                }
                else{
                    stack.consumeDurability(1, player);
                    stack.addXp(1, player);
                }
                item.data = stack.data;
            }
        }
        return true;
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        if(item.extra){
            const log = TconHatchet.STRIPPED_LOGS.find(stripped => stripped.id === block.id && (stripped.data === -1 || stripped.data === block.data));
            const stack = new TconToolStack(item);
            if(log && !stack.isBroken()){
                const region = WorldRegion.getForActor(player);
                if(BlockEngine.getMainGameVersion() >= 16){
                    const blockState = region.getBlock(coords);
                    const states = {pillar_axis: blockState.getState(EBlockStates.PILLAR_AXIS)};
                    if(log.isStem){
                        states["deprecated"] = 0;
                    }
                    region.setBlock(coords, new BlockState(log.stripped, states));
                }
                else{
                    region.setBlock(coords, log.stripped, 0);
                }
                region.playSound(coords.x, coords.y, coords.z, log.isStem ? "step.stem" : "step.wood");
                stack.consumeDurability(1, player);
                stack.addXp(1, player);
                stack.applyToHand(player);
            }
        }
    }

}


ToolForgeHandler.addRecipe("hatchet", ["rod", "axe", "binding"]);
ToolForgeHandler.addLayout({
    title: "Hatchet",
    background: "tcon.icon.hatchet",
    intro: "The Hatchet chops up wood and makes short work of leaves. It also makes for a passable weapon. Chop chop!",
    slots: [
        {x: -11, y: 11, bitmap: "tcon.slot.rod"},
        {x: -2, y: -20, bitmap: "tcon.slot.axe"},
        {x: 18, y: -8, bitmap: "tcon.slot.binding"}
    ]
});
