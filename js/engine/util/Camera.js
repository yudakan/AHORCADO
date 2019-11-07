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

        // TODO: Camera.lookAt()
    }

    getFrame() {
        // TODO: Camera.getFrame()
    }
}