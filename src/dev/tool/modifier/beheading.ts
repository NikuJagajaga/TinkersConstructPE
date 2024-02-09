class ModBeheading extends TinkersModifier {

    constructor(){
        super("beheading", "Beheading", 1, true);
        this.texIndex = 7;
        this.setRecipe(["ender_pearl", "obsidian"]);
    }

    override onKillEntity(victim: number, player: number, damageType: number, level: number): void {
        const headMeta = EntityHelper.getHeadMeta(victim);
        if(headMeta !== -1 && Math.random() < 0.1 * level){
            const region = WorldRegion.getForActor(player);
            region.dropItem(Entity.getPosition(victim), VanillaBlockID.skull, 1, headMeta);
        }
    }
    
}
