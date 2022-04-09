import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM, VRMUtils } from "@pixiv/three-vrm";

const useVrm = (url) => {
  const { current: loader } = useRef(new GLTFLoader());
  const [vrm, setVrm] = useState();

  useEffect(() => {
    const loadVrm = (url) => {
      loader.load(url, async (gltf) => {
        VRMUtils.removeUnnecessaryJoints(gltf.scene);
        VRMUtils.removeUnnecessaryVertices(gltf.scene);

        const vrm = await VRM.from(gltf);
        vrm.scene.rotation.y = Math.PI;
        setVrm(vrm);
      });
    };

    if (url) {
      loadVrm(url);
    }
  }, [loader, url]);

  return { vrm };
};

export { useVrm };
