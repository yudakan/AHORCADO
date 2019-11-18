class Ray {

    // Attributes
    static MAX_DEPTH = 1000;
    p; d; linkedCam;

    constructor(point, direction, linkedCam) {

        // Filter
        if (!(point instanceof Vector) || !(direction instanceof Vector))
            throw new Error('Vectors needed >:c');
        if (!(linkedCam instanceof Camera))
            throw new Error('Cam reference needed ò3ó');

        this.p = point.clone();
        this.d = direction.clone();
        this.linkedCam = linkedCam;
    }

    intersect(triangleGear) {
        if (!(triangleGear[3] instanceof Triangle))
            throw new Error("What the fuck? @_@");

        let a = triangleGear[0];
        let b = triangleGear[1];
        let c = triangleGear[2];

        // Back camera?
        if (a.me[1] < 1 || b.me[1] < 1 || c.me[1] < 1)
            return false;

        // Ray and plane ab+ac intersection
        // r: p + t*d
        // π: a + x*ab + y*ac
        let ab = b.sub(a);
        let ac = c.sub(a);
        let system_intersection_ABAC_ray = [
            [ab.me[0], ac.me[0], -this.d.me[0], -a.me[0]+this.p.me[0]],
            [ab.me[1], ac.me[1], -this.d.me[1], -a.me[1]+this.p.me[1]],
            [ab.me[2], ac.me[2], -this.d.me[2], -a.me[2]+this.p.me[2]],
        ];
        let sol1 = Gauss.resolve(system_intersection_ABAC_ray);
        
        if (!sol1) return false;
        
        let x1 = sol1[0];
        let y1 = sol1[1];
        let t = sol1[2];

        if (x1 < 0 || y1 < 0) return false; // in plane but not in triangle

        // Ray and plane ba+bc intersection
        // r: p + t*d
        // π: b + x*ba + y*bc
        let ba = a.sub(b);
        let bc = c.sub(b);
        let system_intersection_BABC_ray = [
            [ba.me[0], bc.me[0], -this.d.me[0], -b.me[0]+this.p.me[0]],
            [ba.me[1], bc.me[1], -this.d.me[1], -b.me[1]+this.p.me[1]],
            [ba.me[2], bc.me[2], -this.d.me[2], -b.me[2]+this.p.me[2]],
        ];
        let sol2 = Gauss.resolve(system_intersection_BABC_ray);

        if (!sol2) throw new Error('FATAL ERROR: Triangle lives in two different planes? x_x');

        let x2 = sol2[0];
        let y2 = sol2[1];
        t = sol2[2]; // it should be the same value

        if (x2 < 0 || y2 < 0) return false; // in plane but not in triangle   

        return this.p.add( this.d.scale(t) );
    }

    getColor() {
        let yDepth = Ray.MAX_DEPTH;
        let firstTriangle;

        // Loop all triangles
        for (let i=0; i < this.linkedCam.trianglesGears.length; i++) {
                
            let intersection = this.intersect( this.linkedCam.trianglesGears[i] );

            if (intersection && intersection.me[1] < yDepth) {
                yDepth = intersection.me[1];
                firstTriangle = this.linkedCam.trianglesGears[i][3];
            }
        }

        // Return color
        return firstTriangle ? firstTriangle.getColor() : this.linkedCam.settings.bgColor;
    }
}