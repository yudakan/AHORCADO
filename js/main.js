/*========================================================
========== SCENE SETUP                          ==========
========================================================*/
// camera
const dim = 50;
const cam = new Camera(new CamSettings( 1, 1, dim, dim, ));

// set polygonal objects
const tribg = new Triangle([ new Vector([-50, 2, 100]), new Vector([-50, 2, -100]), new Vector([50, 2, 0]) ]);

const suport = new Null();
const head = new Null();
const nene = new Null();
const allObjs = new Null();

const suport0 = loadObj(SUPORT0);
const suport1 = loadObj(SUPORT1);
const suport2 = loadObj(SUPORT2);
const suport3 = loadObj(SUPORT3);
const face = loadObj(FACE);
const nene0 = loadObj(NENE0);
const nene1 = loadObj(NENE1);
const nene2 = loadObj(NENE2);
const nene3 = loadObj(NENE3);
const nene4 = loadObj(NENE4);
const nene5 = loadObj(NENE5);

suport.add([ suport0, suport1, suport2, suport3 ]);
head.add([ nene0, face ]);
nene.add([ head, nene1, nene2, nene3, nene4, nene5 ]);
allObjs.add([ suport, nene, tribg ]);

// transform objects
allObjs.tr.translateFromOrigin(new Vector([ 1, 25, 1 ]));
suport.tr.rotateX(Math.PI/2);
suport.tr.translateFromOrigin(new Vector([ -6.5, 0.01, 0 ]));
nene.tr.rotateX(Math.PI/2);
nene.tr.translateFromOrigin(new Vector([ 3.5, 0, 5 ]));
face.tr.translateFromOrigin(new Vector([ 0, 0, 0.001 ]));

// colorize objects
const c_orange = new Color(219 << 16 | 123 << 8 | 81);
const c_blue = new Color(85 << 16 | 89 << 8 | 144);
const c_skin = new Color(255 << 16 | 176 << 8 | 149);

tribg.setColor(c_orange);
suport.objects.forEach(e => e.setColor(c_blue));
nene.objects.filter(e => e instanceof Mesh).forEach(e => e.setColor(c_skin));
nene0.setColor(Color.WHITE);
face.setColor(Color.PURPLE);
face.objects[2].setColor(c_blue); // eye L
face.objects[3].setColor(c_blue); // eye R

// set objects to ghost
suport.objects.forEach(e => e.setGhost(true));
nene.objects.forEach(e => e.setGhost(true));

// light & scene
const light = new Light();
const scene = new Scene();
scene.add([ cam, light, allObjs ]);
cam.mountContent();


/*========================================================
========== RUN MECHANICS                        ==========
========================================================*/
// settings
let running = true;
let lighting = false;

// logic
let secret = null;
let wrongs = 0;
let guessIntentWorking = false;

// update
let frames = 0;
let rot = 0;
let rotSign = 1;
const ROT_MAX = 10;

const render = () => {
    const raster = cam.getFrame('raw', 'noIni', lighting);

    for (let j=0; j < dim; j++)
        for (let i=0; i < dim; i++)
            document.getElementById('pix'+(j*dim+i)).style.backgroundColor =
                `#${pad(new Number( raster[j][i] ).toString(16), 6)}`;
};

const update = () => {
	// light move
	light.tr.translateFromOrigin(new Vector([ Math.cos(frames/10)*10, 21.5, Math.sin(frames/10)*10 ]));

	// nene rotate
	if (Math.abs(rot) > ROT_MAX) rotSign *= -1;
	nene.tr.rotateZ(Math.PI/128 * rotSign);
	rot += rotSign;

	frames++;
};

const run = async () => {
	do {
		update();
		render();
		await new Promise(resolve => setTimeout(resolve, 1000/60));
	}
	while (running);
};

const logic = () => {
	// get first letter & clean input value
	const key = document.getElementById('guessInput').value.slice(0,1).toLowerCase();
	document.getElementById('guessInput').value = '';
	document.getElementById('guessInput').focus();

	// check input
	if (typeof key !== 'string' || key === '') {
		document.getElementById('guessInput').placeholder = 'YOU BASTARD, I SAID TELL ME!!! >O<';
		return false;
	}
	document.getElementById('guessInput').placeholder = 'So... tell me 7v7';

	// get coincidences if any
	let discovered = false;
	for (let i=0; i < secret[0].length; i++)
		if (key === secret[0][i] && !secret[1][i]) {
			secret[1][i] = true;
			discovered = true;
		}

	// display & check if win
	if (discovered) {
		let viewer = '';
		for (let i=0; i < secret[0].length; i++)
			viewer += secret[1][i] ? secret[0][i] : '_';

		document.getElementById('viewer').style.display = 'block';
		document.getElementById('viewer').innerHTML = viewer;

		if (secret[1].every(e => e)) {
			stop();	
			win();
			return false;
		}
	}
	else { // update scene
		wrongs++;
		if (wrongs > 10) {
			stop();
			lose();
			return false;
		}

		allObjs.objects
				.filter(o => o instanceof Null)
				.flatMap(n => n.objects)
				.slice(0, wrongs)
				.forEach(o => o.setGhost(false));

		cam.mountContent();
	}
	
	return true;
};

const guessIntent = async () => {
	if (!guessIntentWorking)
		guessIntentWorking = true;

	if ( !logic() ) return;
	run()
	guessIntentWorking = false;
};

// controls
const play = () => {
	running = true;
	run();
};
const stop = () => running = false;
const lightOn = () => lighting = true;
const lightOff = () => lighting = false;


/*========================================================
========== HTML interaction                     ==========
========================================================*/
// settings
const cbAnimation = function() { this.checked ? play() : stop() };
const cbLight = function() { this.checked ? lightOn() : lightOff() };

// play button
const secretButton = () => {
	let secretText = document.getElementById('secretInput').value;
	if (typeof secretText !== 'string' || secretText === '') {
		alert('We need some text there :/')
		return;
	}
	if (secretText.length > 40) {
		alert('40 characters max limit ^^"')
		return;
	}
	let arrSecret = secretText.toLowerCase().split('');
	let arrDiscovered = Utilities.createArray(secretText.length, false);
	secret = [arrSecret, arrDiscovered];

    document.getElementById('ini').classList.add('moveToForeignTop');
	document.getElementById('game').classList.add('moveToCenterY');
}

// click when enter
const entersBecauseButtons = (event) => {
	if (event.keyCode === 13)
		if (Array.isArray(secret))
			guessIntent()
		else
			secretButton();
};

// win & lose final screens
const win = () => {
	document.getElementById('game').classList.remove('moveToCenterY');
    document.getElementById('game').classList.add('moveToForeignTop');
	document.getElementById('win').classList.add('moveToCenterY');
};
const lose = () => {
	document.getElementById('game').classList.remove('moveToCenterY');
    document.getElementById('game').classList.add('moveToForeignTop');
	document.getElementById('lose').classList.add('moveToCenterY');
};

// listeners
document.addEventListener('DOMContentLoaded', () => {
	document.addEventListener("keydown", entersBecauseButtons)
	document.getElementById('secretButton').addEventListener('click', secretButton);
	document.getElementById('guessButton').addEventListener('click', guessIntent);
	document.getElementById('cbAnimation').addEventListener('change', cbAnimation);
	document.getElementById('cbLight').addEventListener('change', cbLight);
});

// set parameters
document.getElementById('cbAnimation').checked = running;
document.getElementById('cbLight').checked = lighting;
document.getElementById('secretInput').focus();