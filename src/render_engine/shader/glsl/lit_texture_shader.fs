#version 300 es
precision mediump float;
out vec4 FragColor;

in vec3 normal;
in vec3 toSun;
in vec3 toCamera;
in vec2 texCoords;

struct Material{
	sampler2D diffuse;
	sampler2D specular;
	// sampler2D emission;
	float shininess;
};

uniform Material material;

layout(std140)uniform GlobalFSData{
	vec3 sunColor;
	float sceneAmbient;
};

void main(void){
	vec3 in_normal=normalize(normal);
	vec3 in_toSun=normalize(toSun);
	vec3 in_toCamera=normalize(toCamera);
	vec3 samDiffuse=texture(material.diffuse,texCoords).xyz;
	// vec3 samSpecular=((textureSize(material.specular,0).x<=1)?vec3(0.f):texture(material.specular,texCoords).xyz);
	/* Half Lambert */
	float halfLamb=(dot(in_toSun,in_normal)*.5f)+.5f;
	halfLamb*=halfLamb;
	vec3 diffuse=halfLamb*samDiffuse;
	/* Blinn–Phong */
	// vec3 halfwayDir=normalize(in_toSun+in_toCamera);
	// float sFactor=pow(max(dot(in_normal,halfwayDir),0.f),material.shininess);
	// vec3 specular=sFactor*samSpecular;
	vec3 finalColor=(diffuse)*sunColor.xyz;
	finalColor=max(finalColor,sceneAmbient*samDiffuse);
	FragColor=vec4(finalColor,1.f);
}