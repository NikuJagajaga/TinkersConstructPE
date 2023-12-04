class ModBeheading extends TinkersModifier {

    constructor(){
        super("beheading", "Beheading", 7, ["ender_pearl", "obsidian"], 1, true);
    }

    override onKillEntity(victim: number, player: number, damageType: number, level: number): void {
        const headMeta = EntityHelper.getHeadMeta(victim);
        if(headMeta !== -1 && Math.random() * 10 < level){
            const region = WorldRegion.getForActor(player);
            const pos = Entity.getPosition(victim);
            region.dropItem(pos, VanillaBlockID.skull, 1, headMeta);
        }
    }
    
}