const TraitSpider = new class extends TconTrait {

    constructor(){
        super("spider", "Bane of Arthropods", "#61ba49");
    }

    override onAttack(stack: TconToolStack, victim: number, player: number, baseDamage: number, damage: number, level: number): number {
        let newDamage = damage;
        if(EntityHelper.isArthropods(victim)){
            newDamage += 7 / this.parent.maxLevel * level;
        }
        return newDamage;
    }
    
}
