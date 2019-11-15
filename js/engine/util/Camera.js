class Camera extends Stageable {

    // Attributes
    static idMax = -1;
    id; name; settings; raster;

    constructor(name, settings=new CamSettings(), transform, parentLinked) {
        super(transform, parentLinked);

        if (!(settings instanceof CamSettings))
            throw new Error('What is this? -o-"');

        Camera.idMax++;
        if (!name) name = 'cam'+Camera.idMax;

        this.id = Camera.idMax;
        this.name = name;
        this.settings = settings;
        this.raster = Utilities.create2Array(this.settings.rasterHeight, this.settings.rasterWidth, this.settings.bgColor);
    }

    getFrame() {
        if (this.scene == null)
            throw new Error("I'm not in scene :'c");

        let xunit = this.settings.canvasWidth / this.settings.rasterWidth;
        let zunit = this.settings.canvasHeight / this.settings.rasterHeight;
        let xoffset = this.settings.canvasWidth / 2;
        let zoffset = this.settings.canvasHeight / 2;

        let p = new Vector([0, 0, 0]); // cam position
        let d = new Vector([0, 0, 0]); // Ray direction
        let ray = new Ray(p, d, this); // Ray Template

        // Loop all raster
        for (let j=0; j < this.raster.length; j++)
            for (let i=0; i < this.raster[j].length; i++) {

                // direction per pixel
                d = new Vector([ xunit*i - xoffset, 1, zunit*j - zoffset ]);
                ray.d = d;

                // Ray creation per pixel
                this.raster[j][i] = ray.getColor();
            }

        return this.raster;
    }
}