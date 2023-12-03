class ModSpider extends TinkersModifier {

    private static readonly targets = {
        [EEntityType.SPIDER]: true,
        [EEntityType.CAVE_SPIDER]: true,
        [EEntityType.SILVERFISH]: true,
        [EEntityType.ENDERMITE]: true
    };

    constructor(){
        super("spider", "Bane of Arthropods", 9, ["fermented_spider_eye"], 24, true);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        return ModSpider.targets[Entity.getType(victim)] ? 7 / this.max * level : 0;
    }
    
}