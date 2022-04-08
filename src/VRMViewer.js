import { useVrm } from "./useVrm";
import ExampleAvatar from "./assets/ExampleAvatar_B.vrm";
import { convert, getVmd } from "./vmdUtils";
import { useEffect, useMemo, useRef } from "react";
import { AnimationMixer, Clock } from "three";
import { useFrame } from "@react-three/fiber";
import { bindToVRM, toOffset } from "./vmdBinding";
import VRMIKHandler from "./vrmIK";

const VRMViewer = () => {
  const { vrm } = useVrm(ExampleAvatar);

  const ik = useRef(null);

  const mixer = useMemo(
    () => (vrm ? new AnimationMixer(vrm.scene) : undefined),
    [vrm]
  );

  useEffect(() => {
    const vmd = async () => {
      const vmd = await getVmd();

      const animation = convert(vmd, toOffset(vrm));
      console.log(animation);

      const clip = bindToVRM(animation, vrm);
      mixer.clipAction(clip).play();
      ik.current = VRMIKHandler.get(vrm);
    };

    if (vrm) {
      vmd();
    }
  }, [mixer, vrm]);

  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }

    if (ik.current) {
      ik.current.update();
    }

    if (vrm) {
      vrm.update(delta);
    }
  });

  return vrm && <primitive object={vrm.scene} />;
};

export { VRMViewer };
