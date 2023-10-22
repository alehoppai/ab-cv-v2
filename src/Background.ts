import * as THREE from "three";

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
            uniform vec3 colors[5];
            
            void main() {
                float gradientFactor = vUv.y;
                
                vec3 color;
                if (gradientFactor < 0.25) {
                    color = mix(colors[4], colors[3], gradientFactor * 4.0);
                } else if (gradientFactor < 0.5) {
                    color = mix(colors[3], colors[2], (gradientFactor - 0.25) * 4.0);
                } else if (gradientFactor < 0.75) {
                    color = mix(colors[2], colors[1], (gradientFactor - 0.5) * 4.0);
                } else {
                    color = mix(colors[1], colors[0], (gradientFactor - 0.75) * 4.0);
                }

                gl_FragColor = vec4(color, 1.0);
            }
        `;

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        colors: {
          value: [
            new THREE.Color("#1a3659"),
            new THREE.Color("#152e50"),
            new THREE.Color("#0f2748"),
            new THREE.Color("#0a203f"),
            new THREE.Color("#051937"),
          ],
        },
      },
    });

    const backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1), this.material);
    backgroundPlane.position.set(0, 0, -1);
    backgroundPlane.scale.set(window.innerWidth, window.innerHeight, 1);

    scene.add(backgroundPlane);
  }
}
