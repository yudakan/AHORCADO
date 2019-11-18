class Mesh extends Stageable {

    // Attributes
    name; objects = [];

    constructor(name='', transform, parentLinked) {
        super(transform, parentLinked);
        if (typeof name !== 'string')
            throw new Error('Not a string ¬3¬');

        this.name = name ? name : 'mesh'+this.id;
    }

    add(objects) {
        if (!Array.isArray(objects))
            throw new Error('This is not an array! >.<');
        
        for (let i=0; i < objects.length; i++)
            if (!(objects[i] instanceof Triangle))
                throw new Error('Not Triangle element found! ^^"');
            else if (objects[i].parentLinked != null)
                throw new Error('This triangle is already linked to '+objects[i].parentLinked+' >v<');
            else {
                for (let j=0; j < this.objects.length; j++)
                    if (this.objects[j].id == objects[i].id)
                        throw new Error(objects[i]+' is already in this mesh ovo');
                        
                objects[i].linkToOutsideWorld(this);
                this.objects.push(objects[i]);
            }
    }

    remove(id) {
        for (let i=0; i < this.objects.length; i++)
            if (id == this.objects[i].id) {
                this.objects[i].breakLink();
                this.objects = this.objects.splice(i, 1);
                return true
            }
        
        return false;
    }

    clone() { // ONEDAY: likeAnInstance?
        let objects = new Array(this.polys.length);
        for (let i=0; i < objects.length; i++)
            objects[i] = this.polys[i].clone();

        return new Mesh(objects, this.name+'#', super.tr, super.parentLinked);
    }
}