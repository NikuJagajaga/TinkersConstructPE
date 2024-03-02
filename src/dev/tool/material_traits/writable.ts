const TraitWritable = new class extends TconTrait {

    constructor(){
        super("writable", "Writable", "#ffffff");
    }

    getBonusSlots(level: number): number {
        return level;
    }

}
