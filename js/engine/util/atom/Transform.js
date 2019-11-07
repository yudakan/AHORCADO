class Transform {

    // Attributes
    matrix;

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

    // rotate(angles) {
    //     if (angles.length != 3)
    //         throw new Error("Format Exception -.-");

    //     // x
        
    //     // y

    //     // z

    // }

    clone() {
        return new Transform(this.matrix);
    }
}