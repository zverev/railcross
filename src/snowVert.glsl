uniform float radiusX;
uniform float radiusY;
uniform float size;
uniform float scale;
uniform float height;
uniform float elapsedTime;

void main() {
    vec3 pos = position;
    pos.x += cos((elapsedTime + position.y) * 0.25) * radiusX;
    pos.y += sin((elapsedTime + position.x) * 0.25) * radiusY;
    pos.z = mod(pos.z - elapsedTime, height);

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

    gl_PointSize = size * ( scale / length( mvPosition.xyz ) );
    gl_Position = projectionMatrix * mvPosition;
}
