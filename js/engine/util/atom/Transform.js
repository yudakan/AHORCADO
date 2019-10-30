class Transform {

    constructor(mx) {

        // Filter
        if (!mx) {
            mx = new SquareMatrix([
            //   x  y  z
                [1, 0, 0, 0], // x
                [0, 1, 0, 0], // y
                [0, 0, 1, 0], // z
                [0, 0, 0, 1]  // p
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
            [0, Math.cos(alpha), -Math.sin(alpha)],
            [0, Math.sin(alpha), Math.cos(alpha)]
        ]).transpose();

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
        ]).transpose();

        let rotated = ry.multiply(SquareMatrix.minor(this.matrix, 3, 3));
        for (let j=0; j < 3; j++)
            for (let i=0; i < 3; i++)
                this.matrix.me[j][i] = rotated.me[j][i];
    }

    rotateZ(alpha) {
        let rz = new SquareMatrix([
            [Math.cos(alpha), -Math.sin(alpha), 0],
            [Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 1]
        ]).transpose();

        let rotated = rz.multiply(SquareMatrix.minor(this.matrix, 3, 3));
        for (let j=0; j < 3; j++)
            for (let i=0; i < 3; i++)
                this.matrix.me[j][i] = rotated.me[j][i];
    }

    rotate(angles) {
        if (angles.length != 3)
            throw new Error("Format Exception -.-");

        // x
        this.matrix.me[1][1] = Math.cos(angles[0] + Math.acos(this.matrix.me[1][1]));
        this.matrix.me[1][2] = Math.sin(angles[0] + Math.asin(this.matrix.me[1][2]));
        this.matrix.me[2][1] = Math.cos(angles[0] + Math.acos(this.matrix.me[2][1]));
        this.matrix.me[2][2] = Math.sin(angles[0] + Math.asin(this.matrix.me[2][2]));

        // y
        this.matrix.me[0][0] = Math.cos(angles[1] + Math.acos(this.matrix.me[0][0]));
        this.matrix.me[0][2] = Math.sin(angles[1] + Math.asin(this.matrix.me[0][2]));
        this.matrix.me[2][0] = Math.cos(angles[1] + Math.acos(this.matrix.me[2][0]));
        this.matrix.me[2][2] = Math.sin(angles[1] + Math.asin(this.matrix.me[2][2]));

        // this.rotateX(angles[0]);
        // this.rotateY(angles[1]);
        // this.rotateZ(angles[2]);
    }

    clone() {
        return new Transform(this.matrix);
    }
}