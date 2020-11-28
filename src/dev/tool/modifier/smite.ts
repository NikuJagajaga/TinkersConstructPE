createBlock("tcon_graveyard_soil", [{name: "Graveyard Soil"}], "dirt");
createBlock("tcon_consecrated_soil", [{name: "Consecrated Soil"}], "dirt");
Recipes2.addShapelessWith2x2("block:tcon_graveyard_soil", ["dirt", "rotten_flesh", {item: "dye", data: 15}]);
Recipes.addFurnace(BlockID.tcon_graveyard_soil, BlockID.tcon_consecrated_soil);


class ModSmite extends TinkersModifier {

    private static readonly targets = {
        [Native.EntityType.SKELETON]: true,
        [Native.EntityType.STRAY]: true,
        [Native.EntityType.WHITHER_SKELETON]: true,
        [Native.EntityType.ZOMBIE]: true,
        [Native.EntityType.DROWNED]: true,
        [Native.EntityType.HUSK]: true,
        [Native.EntityType.PIG_ZOMBIE]: true,
        [Native.EntityType.ZOMBIE_VILLAGER]: true,
        [Native.EntityType.ZOMBIE_VILLAGE_V2]: true,
        [Native.EntityType.PHANTOM]: true,
        [Native.EntityType.WHITHER]: true,
        [Native.EntityType.SKELETON_HORSE]: true,
        [Native.EntityType.ZOMBIE_HORSE]: true
    };

    constructor(){
        super("smite", "Smite", 8, [BlockID.tcon_consecrated_soil], 24, true);
    }

    onAttack(item: ItemInstance, victim: number, level: number): number {
        return ModSmite.targets[Entity.getType(victim)] ? 7 / this.max * level : 0;
    }
    
}