#version 300 es
precision mediump float;
out vec4 FragColor;

in vec3 normal;
in vec3 toSun;
in vec3 toCamera;
in vec2 texCoords;
in float fogFactor;

struct Material{
	sampler2D diffuse;
	sampler2D specular;
	// sampler2D emission;
	float shininess;
};

uniform Material material;

layout(std140)uniform GlobalFSData{
	vec3 fogColor;
	vec3 sunColor;
	float sceneAmbient;
};

void main(void){
	vec3 in_normal=normalize(normal);
	vec3 in_toSun=normalize(toSun);
	vec3 in_toCamera=normalize(toCamera);
	vec3 samDiffuse=texture(material.diffuse,texCoords).xyz;
	/* Half Lambert */
	float halfLamb=(dot(in_toSun,in_normal)*.5f)+.5f;
	halfLamb*=halfLamb;
	vec3 diffuse=halfLamb*samDiffuse;
	/* Blinn–Phong */
	vec3 halfwayDir=normalize(in_toSun+in_toCamera);
	vec3 specular=vec3(0.f);
	if(textureSize(material.specular,0).x!=1){
		float sFactor=pow(max(dot(in_normal,halfwayDir),0.f),material.shininess);
		vec3 specular=sFactor*texture(material.specular,texCoords).xyz;
	}
	vec3 finalColor=(diffuse+specular)*sunColor;
	finalColor=max(finalColor,sceneAmbient*samDiffuse);
	FragColor=vec4(mix(fogColor,finalColor,fogFactor),1.f);
}