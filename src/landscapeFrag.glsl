uniform sampler2D snowyTexture;
uniform vec3 fogColor;
uniform float fogDensity;

varying vec2 vUV;

varying float vAmount;

// varying vec4 vertexColor;

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

  vec4 vertexColor = (smoothstep(0.0, 0.65, vAmount)) * texture2D( snowyTexture, vUV * 10.0 );

  // vec3 fogColor = vec3(0.66, 0.66, 0.66);

  gl_FragColor = mix(vertexColor, vec4(fogColor, 1.0), fogAmount);
  // gl_FragColor = vec4(fogColor, 1.0);
}
