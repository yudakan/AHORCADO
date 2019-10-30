let engine = new Scene();

let arr1 = [
    [8, 2, 3],
    [0, 9, 4],
    [6, 1, 9]
];
let arr2 = [
    [0, 1, 4, 0],
    [1, 2, 3, 0],
    [5, 9, 8, 0],
    [0, 2, 1, 1]
];
let arr3 = [5, 7, 10];

let mx1 = new SquareMatrix(arr1);
let mx2 = new SquareMatrix(arr2);
let vec = new Vector(arr3);

let tr = new Transform();
tr.translate(vec);

tr.rotate([Math.PI/4, Math.PI/4, 0]);
console.log(tr.matrix.me);
