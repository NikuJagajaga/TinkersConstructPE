const TraitCheap = new class extends TconTrait {

    constructor(){
        super("cheap", "Cheap", "#999999");
    }

    getRepairModifier(value: number, level: number): number {
        return value *= 1.05;
    }

}
