import React, { useRef, useEffect, useImperativeHandle,useCallback,useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import useKeyAction from '../useKeyAction.ts'

interface ModelProps {
  forwardRef: React.Ref<ModelRef>;
}

export interface ModelRef {
  play: (action:number) => void;
}

function Adventurer({ forwardRef }: ModelProps) {
  const modelRef = useRef<THREE.Group>();
  const { scene, nodes, animations } = useLoader(GLTFLoader, '/src/assets/glb/Adventurer.glb');
  const mixerRef = useRef<THREE.AnimationMixer>();

  const {moving, keyCode} = useKeyAction()

  console.log('Adventurer=>');
  
  const actionId = useRef(1)
  const play = (action:number = 0)=> {
    // if(moving)return
    
    mixerRef.current?.stopAllAction();
    const animationAction = mixerRef.current!.clipAction(animations[action || actionId.current]); // 选择第一个动画
    // animationAction.setLoop(THREE.LoopRepeat,1);
    animationAction.clampWhenFinished = true;

    if(!action){
      actionId.current+=1
    }
    // animationAction.setLoop(THREE.LoopPingPong, 1); 
    animationAction.play(); // 播放动画
  }

 
  useEffect(()=>{
    if(!moving && mixerRef.current){
      mixerRef.current?.stopAllAction(); 
      play(8)
    }
    if(keyCode === 'ArrowUp'){
      play(16)
    }else if(keyCode === 'ArrowDown'){
      play(17)
    }else if(keyCode === 'ArrowLeft'){
      play(19)
    }else if(keyCode === 'ArrowRight'){
      play(18)
    }
    
  }, [moving, keyCode])

  useEffect(() => {
    mixerRef.current = new THREE.AnimationMixer(modelRef.current!);

    return () => {
      mixerRef.current?.stopAllAction(); // 在组件卸载时停止所有动画
    };
  }, [animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
      if(keyCode === 'ArrowUp'){
        scene.position.z += 0.5 * delta;
      }else if(keyCode === 'ArrowDown'){
        scene.position.z -= 0.5 * delta;
      }else if(keyCode === 'ArrowLeft'){
        scene.position.x -= 0.5 * delta;
      }else if(keyCode === 'ArrowRight'){
        scene.position.x += 0.5 * delta;
      }
    }
  });

  useImperativeHandle(forwardRef, () => ({
    play:play
  }));

  return <primitive object={scene} ref={modelRef} />;
}



export default Adventurer;
