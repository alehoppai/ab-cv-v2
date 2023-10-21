import * as THREE from 'three';

export function dimColor(hexColor: number, dimFactor: number) {
    const color = new THREE.Color(hexColor);
    
    color.r *= dimFactor;
    color.g *= dimFactor;
    color.b *= dimFactor;

    return color.getHex();
}