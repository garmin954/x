import {useState, useEffect,useRef} from 'react'
import { useEventListener  } from "ahooks";

const MoveKey = ['KeyW','KeyA','KeyS','KeyD','ArrowLeft','ArrowRight','ArrowUp', 'ArrowDown']
function useKeyAction(){

    const [moving, setMoveing] = useState(false) 
    const [keyCode, setKeyCode] = useState('')
    
    function handelKeydown(event){
        if (MoveKey.includes(event.code)) {
            setKeyCode(event.code)
            setMoveing(true)
        }
    }
    useEventListener('keydown', handelKeydown)

    function handelKeyup(){
        if (MoveKey.includes(event.code)) {
            setKeyCode('')
            setMoveing(false)
        }
    }

    useEventListener('keyup', handelKeyup)

    return {
        moving,
        keyCode
    }
}

export default useKeyAction