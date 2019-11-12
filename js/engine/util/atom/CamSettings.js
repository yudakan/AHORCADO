class CamSettings {

    // Attributes
    canvasWidth;
    canvasHeight;
    rasterWidth;
    rasterHeight;

    constructor(canvasWidth=16, canvasHeight=9, rasterWidth=1920, rasterHeight=1080) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.rasterWidth = rasterWidth;
        this.rasterHeight = rasterHeight;
    }

    clone() {
        return new CamSettings(this.canvasWidth, this.canvasHeight, this.rasterWidth, this.rasterHeight);
    }
}