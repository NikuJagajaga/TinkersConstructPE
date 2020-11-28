abstract class TableBase extends TileBase {

    constructor(private animCount: number, private animSize: number){
        super();
    }

    anims: any[];

    defaultValues = {
        meta: 0
    };

    created(): void {
        this.data.meta = TileRenderer.getBlockRotation(player);
    }

    init(): void {
        if(Cfg.showItemOnTable){
            this.anims = new Array(this.animCount);
            for(let i = 0; i < this.animCount; i++){
                this.anims[i] = createAnimItem(this.x + 0.5, this.y + 33/32, this.z + 0.5);
            }
            this.setAnimItem();
        }
        delete this.liquidStorage;
    }

    destroy(): void {
        this.anims && this.anims.forEach(anim => {
            anim && anim.destroy();
        });
    }

    displayItem(coords: {x: number, z: number}[]): void {
        if(!Cfg.showItemOnTable){
            return;
        }
        //180, 0, 90, 270 degree
        const cos = [-1, 1, 0, 0][this.data.meta];
        const sin = [0, 0, 1, -1][this.data.meta];
        const rot = [Math.PI, 0, Math.PI/2, -Math.PI/2][this.data.meta];
        this.anims.forEach((anim, i) => {
            if(Math.abs(coords[i].x) > 1 || Math.abs(coords[i].z) > 1){
                return;
            }
            const slot = this.container.getSlot("slot" + i);
            let size = this.animSize;
            if(isBlockID(slot.id)){
                size /= 2;
            }
            const x = coords[i].x + size / 16;
            const z = coords[i].z - size / 16;
            const xx = x * cos - z * sin;
            const zz = x * sin + z * cos;
            anim.setPos(this.x + 0.5 + xx, this.y + 33/32, this.z + 0.5 + zz);
            anim.describeItem(slot.id === 0 ? {id: 0, count: 0, data: 0} : {
                id: slot.id, count: 1, data: slot.data,
                size: size,
                rotation: [-Math.PI/2, rot, 0]
            });
        });
    }

    abstract getGuiScreen(): UI.Window | UI.StandardWindow;
    abstract setAnimItem(): void;

}