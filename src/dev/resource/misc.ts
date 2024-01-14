/*
ItemRegistry.registerItem(new class extends ItemThrowable {

    constructor(){
        super("tcon_efln", "EFLN", "tcon_efln", true);
        Recipes2.addShapeless(this.id, ["flint", "gunpowder"]);
    }

    onProjectileHit(projectile: number, item: ItemInstance, target: Callback.ProjectileHitTarget): void {
        const x = target.coords?.relative.x ?? Math.round(target.x);
        const y = target.coords?.relative.y ?? Math.round(target.y);
        const z = target.coords?.relative.z ?? Math.round(target.z);

    }

});
*/