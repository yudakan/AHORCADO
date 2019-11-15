class Stageable {

    // Attributes
    tr; parentLinked;

    constructor(transform=new Transform(), parentLinked=null) {
        if (!(transform instanceof Transform))
            throw new Error('Transform reference needed ò_ó');

        this.tr = transform.clone();
        this.parentLinked = parentLinked;
    }

    linkToOutsideWorld(parentLinked) {
        if (!(parentLinked instanceof Stageable))
            throw new Error('Stageable reference needed ò3ó');
        
        this.parentLinked = parentLinked;
    }

    // toWorld(object) {
    //     if (!(object instanceof Stageable))
    //         throw new Error('Stageable needed -_-');

    //     // object to global world (down)
    //     if (object instanceof Scene) {}
    //     else if (object.parentLinked == null) {}
    //     else {}

    //     return this.toWorld();

    //     // object to this world (up)
    // }

    // toDownWorld() {
    //     return this.toDownWorld(this);
    // }

    // toUpWorld(object) {
        
    // }

    lookAt(point, back=false) {
        if (!(point instanceof Vector))
            throw new Error('Vector needed -.-"');
        if (point.dim != 3)
            throw new Error("3 components neded o.o");

        /* Object points to j' */
        /* i' always parallel to plane xi+yj=0 */
        /* the following notation will not have ' but still refers to it */
        // vector from p to point
        let p = new Vector([
            this.tr.matrix.me[3][0],
            this.tr.matrix.me[3][1],
            this.tr.matrix.me[3][2]
        ]);
        let j = back ? p.sub(point).normalize() : point.sub(p).normalize();

        // a -> plane with normal vector = j
        // b -> plane a but z = 0
        // b -> plane with normal vector = n
        let n = new Vector([j.me[0], j.me[1], 0]);
        let i = j.me[2] > 0 ? n.cross(j).normalize() : j.cross(n).normalize();
        let k = i.cross(j);

        // apply changes
        this.tr.matrix.me[0] = i.me.concat(0);
        this.tr.matrix.me[1] = j.me.concat(0);
        this.tr.matrix.me[2] = k.me.concat(0);
    }
}