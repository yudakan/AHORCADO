class CamSettings {

    // Attributes
    canvasWidth;
    canvasHeight;
    rasterWidth;
    rasterHeight;

    constructor(canvasWidth=2, canvasHeight=1, rasterWidth=200, rasterHeight=100) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.rasterWidth = rasterWidth;
        this.rasterHeight = rasterHeight;
    }

    clone() {
        return new CamSettings(this.canvasWidth, this.canvasHeight, this.rasterWidth, this.rasterHeight);
    }
}