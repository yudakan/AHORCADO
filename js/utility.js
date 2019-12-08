// load obj function
const loadObj = obj => {

	// Read file contents
	const text = obj;
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

	return mesh;
};

// pad function
const pad = (n, width, z) => {
	z = z || "0";
	n = n + "";
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};
