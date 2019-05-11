#version 300 es
precision mediump float;
out vec4 FragColor;
in vec3 texDir;

uniform samplerCube skyboxCubemap;
uniform bool enableFog;

layout(std140)uniform GlobalFSData{
	vec3 fogColor;
};

void main(void){
	float fogUpper=.1f;
	float fogLower=0.f;
	vec4 color=texture(skyboxCubemap,texDir);
	if(enableFog){
		float factor=smoothstep(fogLower,fogUpper,-texDir.y);
		color=mix(vec4(fogColor,1.f),color,factor);
	}
	FragColor=color;
}