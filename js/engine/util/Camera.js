class Camera extends Stageable {

    // Attributes
    static idMax = -1;
    id; name;

    constructor(name, transform) {
        super(transform);

        Camera.idMax++;
        if (!name) name = 'cam'+Camera.idMax;

        this.id = Camera.idMax;
        this.name = name;
    }

    lookAt(point) {
        if (!(point instanceof Vector))
            throw new Error('Vector needed -.-"');
        if (point.dim != 3)
            throw new Error("3 components neded o.o");

        /* Camera points to -j' */
        // point as lineal combination of R'
        let j = this.tr.toMyWorld(point).scale(-1).normalize();
        // a -> plain with normal vector = j
        // b -> plain a but z = 0
        // b -> plain with normal vector = n
        let n = new Vector([j.me[0], j.me[1], 0]);
        let i = j.me[2] > 0 ? n.cross(j).normalize() : j.cross(n).normalize();
        let k = i.cross(j);

        this.tr.matrix.me[0] = i.me.concat(0);
        this.tr.matrix.me[1] = j.me.concat(0);
        this.tr.matrix.me[2] = k.me.concat(0);
    }

    getFrame() {
        // TODO: Camera.getFrame()
    }
}