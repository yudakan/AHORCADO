class Triangle extends Stageable {

    // Attributes
    points;

    constructor(points, transform) {
        super(transform);

        // Filter
        if (points) {
            if (!Array.isArray(points))
                throw new Error("This is not an Array >.<");
            if (points.length != 3)
                throw new Error("3 points needed u_u");
            for (let i=0; i < 3; i++)
                if (points[i].dim != 3)
                    throw new Error("R^3 vectors needed o.o");

            this.points = [points[0].clone(), points[1].clone(), points[2].clone()];
        }
        else
            this.points = [new Vector([1,0,0]), new Vector([0,1,0]), new Vector([0,0,1])];
    }

    clone() {
        return new Triangle(this.points, super.tr);
    }
}