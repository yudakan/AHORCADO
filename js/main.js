let scene = new Scene();

let cam = new Camera("cam");
let traingle = new Triangle([
    new Vector([2,0,0]),
    new Vector([0,2,0]),
    new Vector([0,0,2])
]);

traingle.tr.translate(new Vector([6,-0.5,1]));
traingle.tr.rotateZ(Math.PI/2);

let mesh = new Mesh([traingle]);
mesh.tr.translate(new Vector([-2,3,0]));
mesh.tr.rotateZ(Math.PI/2);

scene.geometry.push(mesh);
scene.addCamera(cam);

cam.lookAt(mesh.tr.toYourWorld(traingle.tr.toYourWorld(traingle.points[2])));

let frame = cam.getFrame();

document.write('<div class="contRender">');
for (let j=0; j < frame.length; j++)
    for (let i=0; i < frame[0].length; i++)
        document.write('<div class="pixel" style="background-color:#'+frame[j][i].me.toString(16)+'"></div>');
document.write('</div>');