uniform vec3 color;
uniform float opacity;
uniform vec3 fogColor;
uniform float fogDensity;

float fogFactorExp2(
  float dist,
  float density
) {
  const float LOG2 = -1.442695;
  float d = density * dist;
  return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}

void main() {
    float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
    float fogAmount = fogFactorExp2(fogDistance, fogDensity);

    gl_FragColor = vec4( color, 1.0 );
    // gl_FragColor = mix(vec4(color, 1.0), vec4(fogColor, 1.0), fogAmount);
}
