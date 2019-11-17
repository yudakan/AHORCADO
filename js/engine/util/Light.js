class Light extends Stageable {

    // Attributes
    name; color; intensity;

    constructor(color, intensity, name, transform, parentLinked) {
        super(transform, parentLinked);

        // Filter
        if (!(color instanceof Color))
            throw new Error('Color needed! >.<');
        if (typeof intensity !== 'number')
            throw new Error('Intensity needed! >_<');
        if (intensity < 0)
            throw new Error('I do not understand negative intensity o3o');

        if (!name) name = 'light'+this.id;

        this.name = name;
        this.color = color;
        this.intensity = intensity > 1 ? 1 : intensity;
    }
}