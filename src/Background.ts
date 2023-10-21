import * as THREE from 'three';

export class DiagonalGradientBackground {
    private material: THREE.ShaderMaterial;

    constructor(scene: THREE.Scene) {
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;
            uniform vec3 colorTop;   // DarkerBlue
            uniform vec3 colorBottom; // Dark

            void main() {
                gl_FragColor = vec4(mix(colorBottom, colorTop, vUv.y), 1.0);
            }
        `;

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                colorTop: { value: new THREE.Color('#000050') },
                colorBottom: { value: new THREE.Color('#000020') }
            }
        });


        const backgroundPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2, 1),
            this.material
        );
        backgroundPlane.position.set(0, 0, -1);
        backgroundPlane.scale.set(window.innerWidth, window.innerHeight, 1);

        scene.add(backgroundPlane);
    }
}
