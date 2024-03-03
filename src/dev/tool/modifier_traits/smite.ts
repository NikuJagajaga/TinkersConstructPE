const TraitSmite = new class extends TconTrait {

    constructor(){
        super("smite", "Smite", "#e8d500");
    }

    override onAttack(stack: TconToolStack, victim: number, player: number, baseDamage: number, damage: number, level: number): number {
        let newDamage = damage;
        if(EntityHelper.isUndead(victim)){
            newDamage += 7 / this.parent.maxLevel * level;
        }
        return newDamage;
    }

}
