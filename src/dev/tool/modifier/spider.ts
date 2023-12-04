class ModSpider extends TinkersModifier {

    constructor(){
        super("spider", "Bane of Arthropods", 9, ["fermented_spider_eye"], 24, true);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        return EntityHelper.isArthropods(victim) ? 7 / this.max * level : 0;
    }
    
}