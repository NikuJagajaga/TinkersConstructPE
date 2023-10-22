class ModBeheading extends TinkersModifier {

    private static readonly headMeta = {
        [Native.EntityType.SKELETON]: 0,
        [Native.EntityType.WHITHER_SKELETON]: 1,
        [Native.EntityType.ZOMBIE]: 2,
        1: 3,//Native.EntityType.PLAYER
        [Native.EntityType.CREEPER]: 4,
        [Native.EntityType.ENDER_DRAGON]: 5
    };

    constructor(){
        super("beheading", "Beheading", 7, ["ender_pearl", "obsidian"], 1, true);
    }

    onKillEntity(entity: number, damageType: number, level: number): void {
        const headMeta = ModBeheading.headMeta[Entity.getType(entity)];
        if(headMeta && Math.random() * 10 < level){
            const pos = Entity.getPosition(entity);
            World.drop(pos.x, pos.y, pos.z, VanillaBlockID.skull, 1, headMeta);
        }
    }
    
}