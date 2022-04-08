import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import styles from "./App.module.css";
import { Controls } from "./Controls";
import { VRMViewer } from "./VRMViewer";
import * as THREE from "three";

function App() {
  return (
    <main className={styles.main}>
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 30, near: 0.001, far: 100 }}
      >
        <Suspense fallback={null}>
          <directionalLight />
          <VRMViewer />
          <Controls
            target={new THREE.Vector3(0, 1, 0)}
            maxDistance={10}
            screenSpacePanning
          />
          <gridHelper />
          <axesHelper />
        </Suspense>
      </Canvas>
    </main>
  );
}

export default App;
