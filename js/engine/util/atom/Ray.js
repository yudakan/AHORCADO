class Ray {

    // Attributes
    static MAX_DEPTH = 1000;
    p; d;

    constructor(point, direction, trLink) {

        // Filter
        if (!(point instanceof Vector) || !(direction instanceof Vector))
            throw new Error('Vectors needed >:c');

        this.p = point.clone();
        this.d = direction.clone();
    }

    intersect(triangle, trsOthersWorlds, trsToRayWorld) {
        if (!(triangle instanceof Triangle))
            throw new Error("Triangle needed -3-");
        if (!Array.isArray(trsOthersWorlds))
            throw new Error("Array needed n3n");

        let a = triangle.tr.toYourWorld(triangle.points[0]);
        let b = triangle.tr.toYourWorld(triangle.points[1]);
        let c = triangle.tr.toYourWorld(triangle.points[2]);

        // All transformations to general world
        for (let i=0; i < trsOthersWorlds.length; i++) {
            a = trsOthersWorlds[i].toYourWorld(a);
            b = trsOthersWorlds[i].toYourWorld(b);
            c = trsOthersWorlds[i].toYourWorld(c);
        }

        // All transformations to ray world
        for (let i=0; i < trsToRayWorld.length; i++) {
            a = trsToRayWorld[i].toMyWorld(a);
            b = trsToRayWorld[i].toMyWorld(b);
            c = trsToRayWorld[i].toMyWorld(c);
        }

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

    getColor(scene, trs) {
        if (!(scene instanceof Scene))
            throw new Error("I'm not in scene >o<");

        let yDepth = Ray.MAX_DEPTH;
        let firstTriangle;

        // Loop all geometry
        for (let i=0; i < scene.geometry.length; i++)
            for (let j=0; j < scene.geometry[i].polys.length; j++) {
                
                let point = this.intersect( scene.geometry[i].polys[j], [scene.geometry[i].tr], trs );

                if (point && point.me[1] < yDepth) {
                    yDepth = point.me[1];
                    firstTriangle = scene.geometry[i].polys[j];
                }
            }

        return firstTriangle ? firstTriangle.getColor() : Color.GRAY;
    }
}