import React, { useRef, useState ,useEffect, useImperativeHandle} from 'react'
import { Canvas, useFrame , useLoader } from '@react-three/fiber'
import { OrbitControls} from '@react-three/drei'
import { A11y } from '@react-three/a11y'
import * as THREE from 'three'
import {useKeyPress} from 'ahooks'
import Adventurer, { ModelRef } from './model/Adventurer'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
function Box(props: JSX.IntrinsicElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null)
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


 
function ThreeCli(){
    const adventurerRef = useRef<ModelRef>(null)

    const handelMovement = (id:number=0) =>{
      if(adventurerRef.current){
        adventurerRef.current.play(id)
      }
    }

    return (<div style={{
          width:'100vw',
          height:'100vh',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
       }}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {/* <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} /> */}
        <A11y role="button" actionCall={()=>handelMovement()} description="A" showAltText={false} >
          <Adventurer forwardRef={adventurerRef}/>
        </A11y>
        <OrbitControls/>
        <axesHelper/>
      </Canvas>
      </div>
    )
}

export default  ThreeCli