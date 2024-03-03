const TraitReinforced = new class extends TconTrait {

    constructor(){
        super("reinforced", "Reinforced", "#502e83");
    }

    override getLocalizedName(level: number): string {
        if(level >= 5){
            return translate("Unbreakable");
        }
        return super.getLocalizedName(level);
    }

    override onConsume(stack: TconToolStack, level: number): boolean {
        return level >= 5 ? true : Math.random() < level * 0.2;
    }
    
}
