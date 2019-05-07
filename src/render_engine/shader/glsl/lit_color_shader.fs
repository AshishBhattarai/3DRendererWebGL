#version 300 es
precision mediump float;
out vec4 FragColor;

in vec3 normal;
in vec3 toSun;
in vec3 toCamera;

struct Material{
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
	float ka;
	float kd;
	float ks;
};

uniform vec3 sunColor;
uniform Material material;

void main(void){
	vec3 ambient=material.ka*material.ambient;
	vec3 in_normal=normalize(normal);
	vec3 in_toSun=normalize(toSun);
	vec3 in_toCamera=normalize(toCamera);
	/* Half Lambert */
	float halfLamb=(dot(in_toSun,in_normal)*.5f)+.5f;
	halfLamb*=halfLamb;
	vec3 diffuse=material.kd*halfLamb*material.diffuse;
	vec3 specular=vec3(0.f);
	if(halfLamb>0.f){
		/* Blinn–Phong */
		vec3 halfwayDir=normalize(in_toSun+in_toCamera);
		float sFactor=pow(max(dot(in_normal,halfwayDir),0.f),material.shininess);
		specular=material.ks*sFactor*material.specular;
	}
	vec3 finalColor=(ambient+diffuse+specular)*sunColor;
	FragColor=vec4(finalColor,1.f);
}