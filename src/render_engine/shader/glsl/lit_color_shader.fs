#version 300 es
precision mediump float;
out vec4 FragColor;

in vec3 normal;
in vec3 toSun;
in vec3 toCamera;

struct Material{
	vec3 diffuse;
	vec3 specular;
	float shininess;
};

uniform vec3 sunColor;
uniform Material material;
uniform float sceneAmbient;

void main(void){
	vec3 in_normal=normalize(normal);
	vec3 in_toSun=normalize(toSun);
	vec3 in_toCamera=normalize(toCamera);
	/* Half Lambert */
	float halfLamb=(dot(in_toSun,in_normal)*.5f)+.5f;
	halfLamb*=halfLamb;
	vec3 diffuse=halfLamb*material.diffuse;
	/* Blinn–Phong */
	vec3 halfwayDir=normalize(in_toSun+in_toCamera);
	float sFactor=pow(max(dot(in_normal,halfwayDir),0.f),material.shininess);
	vec3 specular=sFactor*material.specular;
	vec3 finalColor=(diffuse+specular)*sunColor;
	finalColor=max(finalColor,sceneAmbient*diffuse);
	FragColor=vec4(finalColor,1.f);
}