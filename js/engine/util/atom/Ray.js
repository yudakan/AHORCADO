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

        let a = triangle.points[0];
        let b = triangle.points[1];
        let c = triangle.points[2];

        // All transformations to general world
        for (let i=0; i < trsOthersWorlds.length; i++) {
            a = trsOthersWorlds.toYourWorld(a);
            b = trsOthersWorlds.toYourWorld(b);
            c = trsOthersWorlds.toYourWorld(c);
        }

        // All transformations to ray world
        for (let i=0; i < trsToRayWorld.length; i++) {
            a = trsToRayWorld.toMyWorld(a);
            b = trsToRayWorld.toMyWorld(b);
            c = trsToRayWorld.toMyWorld(c);
        }

        // Ray and plane ab+ac intersection
        let ab = b.sub(a);
        let ac = c.sub(a);
        let systemAB = [
            [ab.me[0], ac.me[0], -this.d.me[0], a.me[0]-this.p.me[0]],
            [ab.me[1], ac.me[1], -this.d.me[1], a.me[1]-this.p.me[1]],
            [ab.me[2], ac.me[2], -this.d.me[2], a.me[2]-this.p.me[2]],
        ];

    }

    getColor(scene, trs) {
        if (!(scene instanceof Scene))
            throw new Error("I'm not in scene >o<");

        let yDepth = Ray.MAX_DEPTH;
        let firstTriangle;

        for (let i=0; i < scene.geometry.length; i++)
            for (let j=0; j < scene.geometry[i].polys.length; j++) {
                
                let point = this.intersect( scene.geometry[i].polys[j], [scene.geometry[i].tr], trs );

                if (point && point.me[1] < yDepth) {
                    yDepth = point.me[1];
                    firstTriangle = scene.geometry[i].polys[j];
                }
            }

        return firstTriangle.getColor();
    }
}