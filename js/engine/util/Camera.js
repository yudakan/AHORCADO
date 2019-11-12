class Camera extends Stageable {

    // Attributes
    static idMax = -1;
    id; name; scene; settings;

    constructor(name, settings=new CamSettings(), transform) {
        super(transform);

        if (!(settings instanceof CamSettings))
            throw new Error('What is this? -o-"');

        Camera.idMax++;
        if (!name) name = 'cam'+Camera.idMax;

        this.id = Camera.idMax;
        this.name = name;
        this.settings = settings;
    }

    getFrame() {
        if (this.scene == null)
            throw new Error("I'm not in scene :'c");

        raster = Utilities.create2Array(this.settings.rasterHeight, this.settings.rasterWidth, Color.BLACK);
        let xunit = this.settings.canvasWidth / this.settings.rasterWidth;
        let zunit = this.settings.canvasHeight / this.settings.rasterHeight;
        let xoffset = this.settings.canvasWidth / 2;
        let zoffset = this.settings.canvasHeight / 2;
        let p = new Vector([0, 0, 0]);

        for (let j=0; j < raster.length; j++)
            for (let i=0; i < raster[j].length; i++) {
                let d = new Vector([ xunit * i - xoffset, 1, zunit * j - zoffset ]);
                raster[j][i] = new Ray(p, d).getColor(this.scene, [this.tr]);
            }

        return raster;
    }
}