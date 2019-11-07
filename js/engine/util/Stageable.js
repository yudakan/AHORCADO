class Stageable {

    // Attributes
    tr;

    constructor(transform) {

        if (!transform) transform = new Transform();
        this.tr = transform.clone();
    }
}