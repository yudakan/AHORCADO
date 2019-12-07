// html interaction
const secretButton = () => {
    document.getElementById('ini').classList.add('moveToForeignTop');
    document.getElementById('game').classList.add('moveToCenterY');
}

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('secretButton').addEventListener('click', secretButton);
	document.getElementById('guessButton').addEventListener('click', guessIntent);
});

// construct square
const tri0 = new Triangle([new Vector([0,0,1]), new Vector([0,0,0]), new Vector([1,0,0])], Color.AQUA );
const tri1 = new Triangle([new Vector([0,0,1]), new Vector([1,0,1]), new Vector([1,0,0])], Color.AQUA );

const square = new Mesh();
square.add([tri0, tri1]);
square.tr.translateFromOrigin(new Vector([ 0, 3, 0 ]));

// camera
const cam = new Camera(new CamSettings( 1, 1, 15, 15 ));

// scene
const scene = new Scene();
scene.add([ cam ]);

// render
const pad = (n, width, z) => {
	z = z || "0";
	n = n + "";
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const render = () => {
    const raster = cam.getFrame('raw', 'ini', false);

    for (let j=0; j < 15; j++)
        for (let i=0; i < 15; i++)
            document.getElementById('pix'+(j*15+i)).style.backgroundColor =
                `#${pad(new Number( raster[j][i] ).toString(16), 6)}`;
};

const guessIntent = async () => {
    // while (true) {
        render();
        // square.tr.translate(new Vector([ -0.01, 0, -0.01 ]));
        // await new Promise(resolve => setTimeout(resolve, 1000/27));
    // }
};

/*====================================================
 * LOAD OBJ FUNCTION
 *====================================================*/
const loadObjFile = async event => {

	// Read file contents
	const text = OBJ;
	const lines = text.split(/[\r\n]+/g);

	// Create mesh
	let mesh = new Mesh();

	// Create data storage
	const vectors = [];
	const triangles = [];

	// Process file
	lines.forEach(line => {
		if (line === "") return;

		// Process each line
		const data = line.split(" ");
		const type = data[0];
		const values = data.slice(1).map(i => parseFloat(i));

		if (type === "v") {
			vectors.push(new Vector(values));
			return;
		}

		if (type === "f") {
			triangles.push(new Triangle([vectors[values[0] - 1].clone(), vectors[values[1] - 1].clone(), vectors[values[2] - 1].clone()]));
			return;
		}
	});

	mesh.add(triangles);

	// Add mest to scene and render
	scene.add([mesh]);
};

const OBJ =
"o Plane\n"+
"v -1.000000 -9.750000 -1.750000\n"+
"v 1.000000 -9.750000 -1.750000\n"+
"v -1.000000 8.250000 -1.750000\n"+
"v 1.000000 8.250000 -1.750000\n"+
"s off\n"+
"f 2 3 1\n"+
"f 2 4 3\n"+
"o Plane.001\n"+
"v -5.000000 -11.750000 -1.750000\n"+
"v 5.000000 -11.750000 -1.750000\n"+
"v -5.000000 -9.750000 -1.750000\n"+
"v 5.000000 -9.750000 -1.750000\n"+
"s off\n"+
"f 6 7 5\n"+
"f 6 8 7\n"+
"o Plane.002\n"+
"v 1.000000 6.250000 -1.750000\n"+
"v 11.000000 6.250000 -1.750000\n"+
"v 1.000000 8.250000 -1.750000\n"+
"v 11.000000 8.250000 -1.750000\n"+
"s off\n"+
"f 10 11 9\n"+
"f 10 12 11\n"+
"o Plane.003\n"+
"v 9.500000 2.250000 -1.750000\n"+
"v 10.500000 2.250000 -1.750000\n"+
"v 9.500000 6.250000 -1.750000\n"+
"v 10.500000 6.250000 -1.750000\n"+
"s off\n"+
"f 14 15 13\n"+
"f 14 16 15";