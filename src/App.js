import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { AnimationMixer, Clock, LoopOnce } from "three";
import styles from "./App.module.css";
import { Controls } from "./Controls";
import { VRMViewer } from "./VRMViewer";
import { useVrm } from "./useVrm";
import { bindToVRM } from "./vmdBinding";
import { toOffset, IKHandler, convert } from "vrm-helper";
import ExampleAvatar from "./assets/ExampleAvatar_B.vrm";
import danceFile from "./assets/wavefile_v2.vmd";
import music from "./assets/music_wavefile_short.mp3";
import { Parser } from "mmd-parser";

const getVmd = async (url) => {
  const data = await fetch(url)
    .then((res) => res.blob())
    .then((blob) => blob.arrayBuffer());
  const vmdData = new Parser().parseVmd(data);
  return vmdData;
};

function App() {
  const { vrm } = useVrm(ExampleAvatar);
  const [audio] = useState(new Audio(music));
  const [show, setShow] = useState(true);

  const ikRef = useRef();
  const clockRef = useRef();
  const mixerRef = useRef();

  const start = async () => {
    setShow(false);
    const vmd = await getVmd(danceFile);
    clockRef.current = new Clock();

    const animation = convert(vmd, toOffset(vrm));

    const clip = bindToVRM(animation, vrm);
    mixerRef.current = new AnimationMixer(vrm.scene);

    const animate = mixerRef.current.clipAction(clip);
    animate.setLoop(LoopOnce);
    animate.clampWhenFinished = true;
    animate.play();
    ikRef.current = IKHandler.get(vrm);

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
    </main>
  );
}

export default App;
