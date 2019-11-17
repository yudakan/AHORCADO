class Scene {

    // Attributes
    objects = [];

    constructor(objects) {
        this.add(objects);
    }

    add(objects) {
        if (!Array.isArray(objects))
            throw new Error('This is not an array! >_<');
        
        for (let i=0; i < objects.length; i++)
            if (!(objects[i] instanceof Stageable))
                throw new Error('Not Stageable element found! è.é');
            else
                for (let j=0; j < this.objects.length; j++)
                    if (this.objects[j].id == objects[i].id)
                        throw new Error(objects[i]+' is already in scene ovo');
                    else {
                        objects[i].linkToOutsideWorld(this);
                        this.objects.push(objects[i]);
                    }
    }
}