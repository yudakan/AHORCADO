class Scene {

    // Attributes
    geometry = [];
    lights = [];
    cameras = [];

    // TODO: How to organize Nulls?

    constructor() {
        
    }

    addCamera(cam) {
        if (!(cam instanceof Camera))
            throw new Error('Not a Camera -_-"');

        cam.scene = this;
        this.cameras.push(cam);
    }
}