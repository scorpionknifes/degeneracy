import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import styles from "./App.module.css";
import { Controls } from "./Controls";
import { VRMViewer } from "./VRMViewer";
import * as THREE from "three";
import { useVrm } from "./useVrm";
import ExampleAvatar from "./assets/ExampleAvatar_B.vrm";
import { convert, getVmd } from "./vmdUtils";
import { AnimationMixer, Clock } from "three";
import { bindToVRM, toOffset } from "./vmdBinding";
import VRMIKHandler from "./vrmIKHandler";
import danceFile from "./assets/wavefile_v2.vmd";
import music from "./assets/music_wavefile_short.mp3";

function App() {
  const { vrm } = useVrm(ExampleAvatar);
  const [audio] = useState(new Audio(music));
  const [show, setShow] = useState(true);
  const ikRef = useRef(null);
  const clockRef = useRef(null);
  const mixerRef = useRef(null);

  const start = async () => {
    setShow(false);
    const vmd = await getVmd(danceFile);
    clockRef.current = new Clock();

    const animation = convert(vmd, toOffset(vrm));

    const clip = bindToVRM(animation, vrm);
    mixerRef.current = new AnimationMixer(vrm.scene);
    mixerRef.current.clipAction(clip).play();
    ikRef.current = VRMIKHandler.get(vrm);

    await new Promise((resolve) => setTimeout(resolve, (160 / 30) * 1000));
    audio.play();
    audio.volume = 0.01;
  };

  return (
    <main className={styles.main}>
      {show && (
        <div className={styles.overlay}>
          <button onClick={start}>Start</button>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 30, near: 0.001, far: 100 }}
      >
        <Suspense fallback={null}>
          <directionalLight />
          <VRMViewer
            vrm={vrm}
            ikRef={ikRef}
            mixerRef={mixerRef}
            clockRef={clockRef}
          />
          <Controls
            target={new THREE.Vector3(0, 1, 0)}
            maxDistance={10}
            screenSpacePanning
          />
          <gridHelper />
        </Suspense>
      </Canvas>
      )
    </main>
  );
}

export default App;
