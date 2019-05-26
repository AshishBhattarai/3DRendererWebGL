#version 300 es
#define MAX_BONES 50

layout(location=0)in vec4 aPosition;
layout(location=1)in vec3 aNormal;
layout(location=4)in ivec4 aBoneID;
layout(location=5)in vec4 aWeight;

out vec3 normal;
out vec3 toSun;
out vec3 toCamera;
out float fogFactor;

uniform mat4 tranformationMat;
uniform mat4 boneTransforms[MAX_BONES];

layout(std140)uniform GlobalVSData{
	mat4 projectionMat;
	mat4 viewMat;
	vec3 cameraPosition;
	vec3 sunPosition;
	vec2 fogDensityGradient;
};

void main(void){
	vec4 newPosition;
	vec3 newNormal;
	newPosition=(boneTransforms[aBoneID.x]*aPosition)*aWeight.x;
	newNormal=(mat3(boneTransforms[aBoneID.x])*aNormal)*aWeight.x;
	newPosition+=(boneTransforms[aBoneID.y]*aPosition)*aWeight.y;
	newNormal+=(mat3(boneTransforms[aBoneID.y])*aNormal)*aWeight.y;
	newPosition+=(boneTransforms[aBoneID.z]*aPosition)*aWeight.z;
	newNormal+=(mat3(boneTransforms[aBoneID.z])*aNormal)*aWeight.z;
	newPosition+=(boneTransforms[aBoneID.w]*aPosition)*aWeight.w;
	newNormal+=(mat3(boneTransforms[aBoneID.w])*aNormal)*aWeight.w;
	newPosition=tranformationMat*vec4(newPosition.xyz,1.f);
	gl_Position=projectionMat*viewMat*newPosition;
	normal=mat3(tranformationMat)*newNormal;
	toSun=sunPosition-newPosition.xyz;
	toCamera=cameraPosition-newPosition.xyz;
	float distance=length(toCamera);
	fogFactor=exp(-pow((distance*fogDensityGradient.x),fogDensityGradient.y));
}