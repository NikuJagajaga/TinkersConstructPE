class ModBeheading extends TinkersModifier {

    private static readonly headMeta = {
        [EEntityType.SKELETON]: 0,
        [EEntityType.WHITHER_SKELETON]: 1,
        [EEntityType.ZOMBIE]: 2,
        [EEntityType.PLAYER]: 3,
        [EEntityType.CREEPER]: 4,
        [EEntityType.ENDER_DRAGON]: 5
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