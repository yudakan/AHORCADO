class Null extends Stageable {

    // Attributes
    static idMax = -1;
    id; name; objects = [];

    constructor(name, transform, parentLinked) {
        super(transform, parentLinked);

        Null.idMax++;
        if (!name) name = 'null'+Null.idMax;

        this.id = Null.idMax;
        this.name = name;
    }

    add(objects, preserveWorld=true) {

        // Filter
        if (!objects) throw new Error("Objects needed :/");
        if (!Array.isArray(objects))
            throw new Error("This is not an Array >.<");

        for (let i=0; i < objects.length; i++)
            if (!(objects[i] instanceof Stageable))
                throw new Error("Not a Stageable object found TToTT");
            else {
                objects[i].linkToOutsideWorld(this);
                if (preserveWorld)
                    objects[i].tr.matrix = this.tr.toMyWorld(objects[i].tr.matrix);
            }
        
        this.objects = this.objects.concat(objects);
    }
}
