uniform float height;
uniform float elapsedTime;

void main() {
    vec3 pos = position;
    pos.z = mod(pos.z - elapsedTime, height);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
