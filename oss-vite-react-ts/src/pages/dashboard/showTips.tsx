import React from 'react'
import {connect, useSelector} from 'react-redux'
import store from '@/store'
const sd = typeof store.getState()

const ShowTips:React.FC = (props) => {
    const smg = useSelector((state:State)=>state.value)
  return (
    <div>{smg}</div>
  )
}

const mapStateToProps = (state:State) =>{
    console.log('state :', state);
    return state
}
export default ShowTips
