class Light extends Stageable {

    // Attributes
    name; color;

    constructor(color=Color.WHITE, name='', transform, parentLinked) {
        super(transform, parentLinked);

        // Filter
        if (!(color instanceof Color))
            throw new Error('Color needed! >.<');
        if (typeof name !== 'string')
            throw new Error('Not a string ¬3¬');
    


        this.color = color;
        this.name = name ? name : 'light'+this.id;
    }

    getColor() {
        return this.color;
    }
}