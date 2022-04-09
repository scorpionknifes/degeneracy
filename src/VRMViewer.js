import { useFrame, useThree } from "@react-three/fiber";

const VRMViewer = ({ vrm, ikRef, mixerRef, clockRef }) => {
  const { camera } = useThree();

  // useFrame runs on every frame in Three.JS.
  useFrame(() => {
    if (!clockRef.current) return; // not started yet.

    const delta = clockRef.current.getDelta();

    // update mixer for animations
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // update ik handler for IK bones (e.g. legs, feet).
    if (ikRef.current) {
      ikRef.current.update();
    }

    // update vrm itself (e.g. hair physics, animations).
    if (vrm) {
      vrm.update(delta);
    }

    // make vrm pupils always look at camera.
    if (vrm && vrm.lookAt) {
      vrm.lookAt.target = camera;
    }
  });

  return vrm && <primitive object={vrm.scene} />;
};

export { VRMViewer };
