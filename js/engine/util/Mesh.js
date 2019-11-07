class Mesh extends Stageable {

    // Attributes
    static idMax = -1;
    id; name; polys;

    constructor(triangles, name, transform) {
        super(transform);

        // Filter
        if (!triangles) throw new Error("Triangles needed :/");
        if (!Array.isArray(triangles))
            throw new Error("This is not an Array >.<");
        for (let i=0; i < triangles.length; i++)
            if (!(triangles[i] instanceof Triangle))
                throw new Error('Not a triangle ^^"');

        Mesh.idMax++;
        if (!name) name = 'mesh'+Mesh.idMax;

        this.id = Mesh.idMax;
        this.name = name;
        this.polys = triangles;
    }

    clone(likeAnInstance=true) {
        let triangles = this.polys;
        if (!likeAnInstance) {
            triangles = new Array(this.polys.length);
            for (let i=0; i < triangles.length; i++)
                triangles[i] = this.polys[i].clone();
        }

        return new Mesh(triangles, this.name+'#', super.tr);
    }
}