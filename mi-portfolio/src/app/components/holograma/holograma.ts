import { Component, ElementRef, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-holograma',
  standalone: true,
  templateUrl: './holograma.html',
  styleUrls: ['./holograma.css']
})
export class Holograma implements OnInit, OnDestroy {

  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private mesh!: THREE.Mesh;
  private material!: THREE.ShaderMaterial;

  // Eliminado: mouseX / mouseY y listeners

  // Solo listener de resize
  private onResize = this.onWindowResize.bind(this);

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThree();
    this.animate();

    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);

    if (this.mesh) this.mesh.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.renderer) this.renderer.dispose();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050505, 0.008);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 150);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    const geometry = new THREE.PlaneGeometry(300, 300, 64, 64);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },

        // 🎨 Nuevos colores gris + azul suave
        color1: { value: new THREE.Color(0x222831) }, // gris oscuro
        color2: { value: new THREE.Color(0x76ABAE) }, // azul suave
        color3: { value: new THREE.Color(0xEEEEEE) }  // gris claro
      },
      vertexShader: `
        uniform float time;
        varying float vElevation;
        varying vec2 vUv;

        void main() {
          vUv = uv;

          vec3 newPosition = position;

          float wave1 = sin(newPosition.x * 0.02 + time * 0.4) * 2.0;
          float wave2 = cos(newPosition.y * 0.03 + time * 0.6) * 1.8;
          float wave3 = sin((newPosition.x + newPosition.y) * 0.02 + time * 0.3) * 1.4;

          newPosition.z += wave1 + wave2 + wave3;
          vElevation = newPosition.z;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;

        varying float vElevation;
        varying vec2 vUv;

        void main() {
          float mix1 = (vElevation + 3.0) / 6.0;
          mix1 = clamp(mix1, 0.0, 1.0);

          // Mezcla progresiva: gris oscuro → azul → gris claro
          vec3 midColor = mix(color1, color2, mix1);
          vec3 finalColor = mix(midColor, color3, mix1 * 0.4);

          gl_FragColor = vec4(finalColor, 0.85);
        }
      `,
      wireframe: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.rotation.x = Math.PI * -0.5;

    this.scene.add(this.mesh);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        requestAnimationFrame(loop);

        this.material.uniforms['time'].value += 0.004;

        // ❌ Eliminado el movimiento dependiente del ratón

        this.renderer.render(this.scene, this.camera);
      };
      loop();
    });
  }
}
