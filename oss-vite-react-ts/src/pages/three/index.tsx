import React, { useRef, useState ,useEffect} from 'react'
import { Canvas, useFrame , useLoader } from '@react-three/fiber'
import { OrbitControls} from '@react-three/drei'
import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
function Box(props) {
  const meshRef = useRef(null)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (meshRef.current!.rotation.x += 0.01))
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}


function Model() {
  const modelRef = useRef();
  const { scene,nodes, animations } = useLoader(GLTFLoader, '/src/assets/glb/Adventurer.glb')
  const mixerRef = useRef();

  useEffect(() => {
    mixerRef.current = new THREE.AnimationMixer(modelRef.current!);
    const animationAction = mixerRef.current!.clipAction(animations[15]); // 选择第一个动画
    animationAction.play(); // 播放动画

    return () => {
      mixerRef.current?.stopAllAction(); // 在组件卸载时停止所有动画
    };
  }, [animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });


  // You don't need to check for the presence of the result, when we're here
  // the result is guaranteed to be present since useLoader suspends the component
  return <primitive object={scene}  ref={modelRef} />
}

function ThreeCli(){

    return (<div style={{width:'50vw', height:'50vh'}}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {/* <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} /> */}
        <Model/>
        <OrbitControls/>
      </Canvas>
      </div>
    )
}

export default  ThreeCli