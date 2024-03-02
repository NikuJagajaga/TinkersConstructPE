const TraitReinforced = new class extends TconTrait {

    constructor(){
        super("reinforced", "Reinforced", "#502e83");
    }

    override onConsume(stack: TconToolStack, level: number): boolean {
        return level >= 5 ? true : Math.random() < level * 0.2;
    }
    
}
