import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import { redirect } from 'react-router';



const API = 'http://192.168.100.156:8000'
//const API = process.env.BACKEND_API;

export const MainPage = () => {

  const crearCarrito = async () => {
    const res = await fetch(`${API}/carrito/`,{
      'mode': 'cors',
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': {}
    })
    const data = await res.json();
    console.log(data)
    window.location.href = `/carrito/${data.id}`;
  }


  return (
      <div className='main-pg'>
        ¡Bienvenido a su asistente de compras!
        <button className='crear-carrito-btn' onClick={() => crearCarrito()}>
          CREAR CARRITO
        </button>
      </div>
  );
}

export default MainPage;
