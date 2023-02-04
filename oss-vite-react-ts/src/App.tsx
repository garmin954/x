import React, { lazy, useState } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import AsyncReoute from '@/router'

import Login from '@/pages/login/Index'
import Container from '@/pages/public/Container'
import { HashRouter } from "@/utils/history";

function App() {
  const [count, setCount] = useState(0)


  return (
    <div className="">
      <HashRouter>
        <AsyncReoute />
      </HashRouter>
    </div>
  )
}

export default App
