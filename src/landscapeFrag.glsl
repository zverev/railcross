uniform sampler2D snowyTexture;
uniform vec4 fogColor;
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

  //vec4 fogColor = vec4(fogColor3.x, fogColor3.y, fogColor3.z, 1);

  gl_FragColor = mix(vertexColor, fogColor, fogAmount);
  //gl_FragColor = fogColor;
}
