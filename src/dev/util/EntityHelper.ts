class EntityHelper {

    private static undeads: EEntityType[] = [
        EEntityType.SKELETON,
        EEntityType.STRAY,
        EEntityType.WHITHER_SKELETON,
        EEntityType.ZOMBIE,
        EEntityType.DROWNED,
        EEntityType.HUSK,
        EEntityType.PIG_ZOMBIE,
        EEntityType.ZOMBIE_VILLAGER,
        EEntityType.ZOMBIE_VILLAGE_V2,
        EEntityType.PHANTOM,
        EEntityType.WHITHER,
        EEntityType.SKELETON_HORSE,
        EEntityType.ZOMBIE_HORSE
    ];

    private static arthropods: EEntityType[] = [
        EEntityType.SPIDER,
        EEntityType.CAVE_SPIDER,
        EEntityType.SILVERFISH,
        EEntityType.ENDERMITE
    ];

    private static headMeta: {[ent: number]: number} = {
        [EEntityType.SKELETON]: 0,
        [EEntityType.WHITHER_SKELETON]: 1,
        [EEntityType.ZOMBIE]: 2,
        1: 3, //PLAYER
        63: 3, //PLAYER
        [EEntityType.CREEPER]: 4,
        [EEntityType.ENDER_DRAGON]: 5
    };

    static isPlayer(entity: number): boolean {
        const type = Entity.getType(entity);
        return type === EEntityType.PLAYER || type === 63;
    }

    static isUndead(entity: number): boolean {
        const type = Entity.getType(entity);
        return this.undeads.indexOf(type) !== -1;
    }

    static isArthropods(entity: number): boolean {
        const type = Entity.getType(entity);
        return this.arthropods.indexOf(type) !== -1;
    }

    static getHeadMeta(entity: number): number {
        const type = Entity.getType(entity);
        return this.headMeta[type] || -1;
    }

}
