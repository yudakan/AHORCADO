class Camera extends Stageable {

    // Attributes
    name; settings; raster;
    triangles; lights; trianglesGears; lightsGiars;

    constructor(settings=new CamSettings(), name='', transform, parentLinked) {
        super(transform, parentLinked);

        if (typeof name !== 'string')
            throw new Error('Not a string ¬3¬');
        if (!(settings instanceof CamSettings))
            throw new Error('What is this? -o-"');

        this.settings = settings;
        this.name = name ? name : 'cam'+this.id;
        this.raster = Utilities.create2Array(this.settings.rasterHeight, this.settings.rasterWidth, this.settings.bgColor);
    }

    collect(collectable) { //private
        for (let i=0; i < collectable.objects.length; i++) {
            let obj = collectable.objects[i];

            if (!obj.ghost)
                if (obj instanceof Triangle) this.triangles.push(obj);
                else if (obj instanceof Light) this.lights.push(obj);
                else if (obj instanceof Mesh) this.collect(obj);
                else if (obj instanceof Null) this.collect(obj);
        }
    }

    mountContent() { //private
        let scene = this.parentLinked;
        while (!(scene instanceof Scene)) {
            if (scene == null)
                throw new Error("I'm not in scene :'c");
            scene = scene.parentLinked;
        }

        // Look for all no-ghost triangles & lights on the scene
        this.triangles = [];
        this.lights = [];
        this.collect(scene);
    }

    contentToMyWorld() { //private
        this.trianglesGears = [];
        for (let i=0; i < this.triangles.length; i++) {

            // Go down to max outside, global world
            let trMatrix = this.triangles[i].tr.matrix;
            let step =  this.triangles[i].parentLinked;
            while (!(step instanceof Scene)) {
                trMatrix = step.tr.myWorldToOutside(trMatrix);
                step = step.parentLinked;
            }

            let a = this.triangles[i].points[0].concat([1]).multiply(trMatrix);
            let b = this.triangles[i].points[1].concat([1]).multiply(trMatrix);
            let c = this.triangles[i].points[2].concat([1]).multiply(trMatrix);

            // Go up to cam world (reversed)
            trMatrix = this.tr.matrix;
            step = this.parentLinked;
            while (!(step instanceof Scene)) {
                trMatrix = step.tr.outsideToMyWorld(trMatrix);
                step = step.parentLinked;
            }

            a = a.multiply(trMatrix.inverse()).slice(0,3);
            b = b.multiply(trMatrix.inverse()).slice(0,3);
            c = c.multiply(trMatrix.inverse()).slice(0,3);

            // Push triangle to array
            this.trianglesGears.push( [a, b, c, this.triangles[i]] );
        }

        this.lightsGiars = [];
        for (let i=0; i < this.lightsGiars.length; i++) {

            // Go down to max outside, global world
            let trMatrix1 = this.lightsGiars[i].tr.matrix;
            let step =  this.lightsGiars[i].parentLinked;
            while (!(step instanceof Scene)) {
                trMatrix1 = step.tr.myWorldToOutside(trMatrix1);
                step = step.parentLinked;
            }

            // Go up to cam world (reversed)
            trMatrix2 = this.tr.matrix;
            step = this.parentLinked;
            while (!(step instanceof Scene)) {
                trMatrix2 = step.tr.outsideToMyWorld(trMatrix2);
                step = step.parentLinked;
            }

            // Push triangle to array
            this.lightsGiarsGears.push( [trMatrix2.multiply(trMatrix1.inverse()), this.lightsGiars[i]] );
        }
    }

    getFrame() {
        if (this.ghost)
            throw new Error("I'm a fucking ghost! >3<");

        this.mountContent();
        this.contentToMyWorld();

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