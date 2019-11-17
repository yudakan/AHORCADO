class Mesh extends Stageable {

    // Attributes
    name; polys;

    constructor(triangles, name, transform, parentLinked) {
        super(transform, parentLinked);

        // Filter
        if (!triangles) throw new Error("Triangles needed :/");
        if (!Array.isArray(triangles))
            throw new Error("This is not an Array >.<");

        for (let i=0; i < triangles.length; i++)
            if (!(triangles[i] instanceof Triangle))
                throw new Error('Not a triangle ^_^"');
            else
                triangles[i].linkToOutsideWorld(this);

        if (!name) name = 'mesh'+this.id;
    
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

        return new Mesh(triangles, this.name+'#', super.parentLinked);
    }
}