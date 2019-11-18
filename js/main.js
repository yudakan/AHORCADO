let scene = new Scene();

let cam = new Camera(new CamSettings(
    2, 1, 600, 300
));
let triangle1 = new Triangle([
    new Vector([2,0,0]),
    new Vector([0,2,0]),
    new Vector([0,0,2])
]);
let triangle2 = triangle1.clone();
triangle2.tr.translate(new Vector([0, 5, 0]));
let nul = new Null();
nul.tr.translate(new Vector([1, 0, 0.5]));
nul.add([triangle2]);

triangle1.tr.translate(new Vector([6,-0.5,1]));
triangle1.tr.rotateZ(Math.PI/2);

let mesh = new Mesh();
mesh.add([triangle1]);
mesh.tr.translate(new Vector([-2,3,0]));
mesh.tr.rotateZ(Math.PI/2);

scene.add([cam, mesh, nul]);

let t0 = performance.now();
let frame = cam.getFrame();
let t1 = performance.now();

let t00 = performance.now();
document.write('<div class="contRender">');
for (let j=0; j < frame.length; j++)
    for (let i=0; i < frame[0].length; i++)
        document.write('<div class="pixel" style="background-color:#'+frame[j][i].me.toString(16)+'"></div>');
document.write('</div>');
let t11 = performance.now();

console.log("Render took " + (t1 - t0) + " milliseconds.");
console.log("Draw on canvas took " + (t11 - t00) + " milliseconds.");

// Render took 238.31499999505468 milliseconds.
// Draw on canvas took 6795.750000004773 milliseconds.