var cameraPosition = [-2, -1.5, -0.5];
module.exports = {
    bgColor: 0xD0D8D9,
    lightColor: 0xE0E0E0,
    fogDensity: 0.075,
    lightIntensity: 1.1,
    // orbitCameraPosition: [-16, -16, -16],
    orbitCameraPosition: cameraPosition,
    // spectatorCameraPosition: [-5.72, -15.27, 3.00],
    spectatorCameraPosition: cameraPosition,
    landscapeMaxHeight: 1.8,
    landscapePlaneSize: 32,
    landscapePlaneDetails: 64,
    landscapeTextureResolution: 20.0,
    landscapeHeightmapTexture: 'resources/heightmap.png',
    landscapeGroundTexture: 'resources/snow-512.jpg',
    snowNumParticles: 25000,
    snowColor: 0xFFFFFF,
    snowRadiusX: 0.1,
    snowRadiusY: 0.1,
    snowSize: 10.0,
    snowScale: 1.0,
    snowOpacity: 0.5
}