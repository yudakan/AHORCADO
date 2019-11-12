class Null extends Stageable {

    // Attributes
    static idMax = -1;
    id; name; objects = [];

    constructor(name, transform) {
        super(transform);

        Null.idMax++;
        if (!name) name = 'null'+Null.idMax;

        this.id = Null.idMax;
        this.name = name;
    }

    add(objects, preserveWorld=true) {
        for (let i=0; i < objects.length; i++)
            if (!(objects[i] instanceof Stageable))
                throw new Error("Not a Stageable object found TToTT");

        // TODO: Null.add();

        // if (preserveWorld) {
        //     for (let i=0; i < objects.length; i++) {
        //         if (objects[i] instanceof Null)
        //             this.add(objects[i])
        //         else {

        //         }
        //     }
        // }
        // else this.objects = this.objects.concat(objects);
    }
}
