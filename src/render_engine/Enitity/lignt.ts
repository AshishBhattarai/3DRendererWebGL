import {vec3} from 'gl-matrix';
import Enitity from './entity';
class Light  {
    position:vec3;
    rotation:vec3;
    color:vec3;

    constructor(positionValue,rotationValue,colorValue){
        this.position = positionValue;
        this.rotation = rotationValue;
        this.color= colorValue;
    }
   
}