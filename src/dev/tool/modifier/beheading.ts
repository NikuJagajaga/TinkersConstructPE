class ModBeheading extends TinkersModifier {

    private static headMeta = {
        [Native.EntityType.SKELETON]: 0,
        [Native.EntityType.WHITHER_SKELETON]: 1,
        [Native.EntityType.ZOMBIE]: 2,
        [Native.EntityType.PLAYER]: 3,
        [Native.EntityType.CREEPER]: 4,
        [Native.EntityType.ENDER_DRAGON]: 5
    };

    constructor(){
        super("beheading", "Beheading", 7, [VanillaItemID.ender_pearl, VanillaBlockID.obsidian], 1, true);
    }

    onKillEntity(entity: number, damageType: number, level: number): void {
        const headMeta = ModBeheading.headMeta[Entity.getType(entity)];
        if(headMeta && Math.random() * 10 < level){
            const pos = Entity.getPosition(entity);
            World.drop(pos.x, pos.y, pos.z, VanillaBlockID.skull, 1, headMeta);
        }
    }
    
}