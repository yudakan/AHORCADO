class Light extends Stageable {

    // Attributes
    static idMax = -1;
    id; name; color; intensity;

    constructor(color, intensity, name, transform) {
        super(transform);

        // Filter
        if (!(color instanceof Color))
            throw new Error('Color needed! >.<');
        if (typeof intensity !== 'number')
            throw new Error('Intensity needed! >_<');

        Light.idMax++;
        if (!name) name = 'light'+Light.idMax;

        this.id = Light.idMax;
        this.name = name;
        this.color = color;
        this.intensity = intensity;
    }
}