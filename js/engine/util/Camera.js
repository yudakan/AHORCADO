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

    getFrame() {
        // TODO: Camera.getFrame()

        // Loop all objects in scene?
    }
}