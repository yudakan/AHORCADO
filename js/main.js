// Scene
const dim = 50;
const cam = new Camera(new CamSettings( 1, 1, dim, dim, ));

const tribg = new Triangle([ new Vector([-50, 2, 100]), new Vector([-50, 2, -100]), new Vector([50, 2, 0]) ]);

const suport = new Null();
const head = new Null();
const nene = new Null();
const allObjs = new Null();

const suport0 = loadObj(SUPORT0);
const suport1 = loadObj(SUPORT1);
const suport2 = loadObj(SUPORT2);
const suport3 = loadObj(SUPORT3);

const nene0 = loadObj(NENE0);
const face = loadObj(FACE);
const nene1 = loadObj(NENE1);
const nene2 = loadObj(NENE2);
const nene3 = loadObj(NENE3);
const nene4 = loadObj(NENE4);
const nene5 = loadObj(NENE5);

suport.add([ suport0, suport1, suport2, suport3 ]);
head.add([ nene0, face ]);
nene.add([ head, nene1, nene2, nene3, nene4, nene5 ]);
allObjs.add([ suport, nene, tribg ]);

allObjs.tr.translateFromOrigin(new Vector([ 1, 25, 1 ]));
suport.tr.rotateX(Math.PI/2);
suport.tr.translateFromOrigin(new Vector([ -6.5, 0.01, 0 ]));
nene.tr.rotateX(Math.PI/2);
nene.tr.translateFromOrigin(new Vector([ 3.5, 0, 5 ]));
face.tr.translateFromOrigin(new Vector([ 0, 0, 0.001 ]));

// suport.objects.forEach(e => e.setGhost(true));
// nene.objects.forEach(e => e.setGhost(true));
suport.objects.forEach(e => e.setColor(new Color(85 << 16 | 89 << 8 | 144)));
nene.objects.filter(e => e instanceof Mesh).forEach(e => e.setColor(new Color(255 << 16 | 176 << 8 | 149)));

tribg.setColor(new Color(219 << 16 | 123 << 8 | 81));
nene0.setColor(Color.WHITE);
face.setColor(Color.PURPLE);
face.objects[2].setColor(new Color(85 << 16 | 89 << 8 | 144));
face.objects[3].setColor(new Color(85 << 16 | 89 << 8 | 144));

const light = new Light();

const scene = new Scene();
scene.add([ cam, light, allObjs ]);

// Run
let running = true;
let lighting = false;
let rot = 0;
let rotSign = 1;
const ROT_MAX = 10;
let frames = 0;

const render = mode => {
    const raster = cam.getFrame('raw', mode, lighting);

    for (let j=0; j < dim; j++)
        for (let i=0; i < dim; i++)
            document.getElementById('pix'+(j*dim+i)).style.backgroundColor =
                `#${pad(new Number( raster[j][i] ).toString(16), 6)}`;
};

const update = () => {
	// light move
	light.tr.translateFromOrigin(new Vector([ Math.cos(frames/10)*10, 21.5, Math.sin(frames/10)*10 ]));

	// nene rotate
	if (Math.abs(rot) > ROT_MAX)
		rotSign *= -1;

	nene.tr.rotateZ(Math.PI/128 * rotSign);
	rot += rotSign;

	frames++;
};

const guessIntent = async () => {

	cam.mountContent();

	// Run
    do {
		update();
		render('noIni');
		console.log('rendered');
		await new Promise(resolve => setTimeout(resolve, 1000/60));
	}
	while (running);
};

const play = () => {
	running = true;
	guessIntent();
};
const stop = () => running = false;
const lightOn = () => lighting = true;
const lightOff = () => lighting = false;

// html interaction
const cbAnimation = function() { this.checked ? play() : stop() };
const cbLight = function() { this.checked ? lightOn() : lightOff() };
const secretButton = () => {
    document.getElementById('ini').classList.add('moveToForeignTop');
	document.getElementById('game').classList.add('moveToCenterY');
	//...
	
}

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('secretButton').addEventListener('click', secretButton);
	document.getElementById('guessButton').addEventListener('click', guessIntent);
	document.getElementById('cbAnimation').addEventListener('change', cbAnimation);
	document.getElementById('cbLight').addEventListener('change', cbLight);
});

document.getElementById('cbAnimation').checked = running;
document.getElementById('cbLight').checked = lighting;