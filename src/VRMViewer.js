import { useFrame, useThree } from "@react-three/fiber";

const VRMViewer = ({ vrm, ikRef, mixerRef, clockRef }) => {
  const { camera } = useThree();

  // Look at camera
  useFrame(() => {
    if (!clockRef.current) {
      return;
    }

    const delta = clockRef.current.getDelta();
    console.log(delta);

    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (ikRef.current) {
      ikRef.current.update();
    }

    if (vrm) {
      console.log(vrm);
      vrm.update(delta);
    }

    if (vrm && vrm.lookAt) {
      vrm.lookAt.target = camera;
    }
  });

  return vrm && <primitive object={vrm.scene} />;
};

export { VRMViewer };
