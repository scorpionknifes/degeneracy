import { useRef } from "react";
import { useThree, useFrame, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

// Controls is a react component wrapper for OrbitControls
const Controls = (props) => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const controls = useRef();

  useFrame(() => {
    controls.current.update();
  });

  return (
    <orbitControls {...props} ref={controls} args={[camera, domElement]} />
  );
};

export { Controls };
