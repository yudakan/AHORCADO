class Transform {

    // Attributes
    matrix;

    constructor(mx) {

        // Filter
        if (!mx) {
            mx = new SquareMatrix([
            // R = <o, i, j, k>        World Orthonormal Basis
            // R' = <o', i', j', k'>   Object Orthonormal Basis
            //   x  y  z
                [1, 0, 0, 0], // i'
                [0, 1, 0, 0], // j'
                [0, 0, 1, 0], // k'
                [0, 0, 0, 1]  // o'
            ]);
        }
        if (mx.order != 4)
            throw new Error("Format Exception -.-");
        
        // Attributes
        this.matrix = mx.clone();
    }

    translate(p) {
        if (p.dim != 3)
            throw new Error("Format Exception -.-");

        let arr = new Array(4);
        arr[0] = p.me[0];
        arr[1] = p.me[1];
        arr[2] = p.me[2];
        arr[3] = 1;
        this.matrix.me[3] = arr;
    }

    rotateX(alpha) {
        let rx = new SquareMatrix([
            [1, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha)],
            [0, -Math.sin(alpha), Math.cos(alpha)]
        ]);

        console.log(SquareMatrix.minor(this.matrix, 3, 3));

        let rotated = rx.multiply(SquareMatrix.minor(this.matrix, 3, 3));
        for (let j=0; j < 3; j++)
            for (let i=0; i < 3; i++)
                this.matrix.me[j][i] = rotated.me[j][i];
    }

    rotateY(alpha) {
        let ry = new SquareMatrix([
            [Math.cos(alpha), 0, Math.sin(alpha)],
            [0, 1, 0],
            [-Math.sin(alpha), 0, Math.cos(alpha)]
        ]);

        let rotated = ry.multiply(SquareMatrix.minor(this.matrix, 3, 3));
        for (let j=0; j < 3; j++)
            for (let i=0; i < 3; i++)
                this.matrix.me[j][i] = rotated.me[j][i];
    }

    rotateZ(alpha) {
        let rz = new SquareMatrix([
            [Math.cos(alpha), Math.sin(alpha), 0],
            [-Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 1]
        ]);

        let rotated = rz.multiply(SquareMatrix.minor(this.matrix, 3, 3));
        for (let j=0; j < 3; j++)
            for (let i=0; i < 3; i++)
                this.matrix.me[j][i] = rotated.me[j][i];
    }

    rotate(angles) {
        if (angles.length != 3)
            throw new Error("Format Exception -.-");

        if (angles[0] != 0) this.rotateX(angles[0]);
        if (angles[1] != 0) this.rotateY(angles[1]);
        if (angles[2] != 0) this.rotateZ(angles[2]);
    }

    clone() {
        return new Transform(this.matrix);
    }
}