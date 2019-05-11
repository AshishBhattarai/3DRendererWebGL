#version 300 es
layout(location=0)in vec3 position;
out vec3 texDir;

layout(std140)uniform GlobalVSData{
	mat4 projectionMat;
};

uniform mat3 transformation;

void main(void){
	texDir=normalize(-position);
	vec4 pos=projectionMat*mat4(transformation)*vec4(position,1.f);
	gl_Position=pos.xyww;
}