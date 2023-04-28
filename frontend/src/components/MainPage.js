import React, { useRef, useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import '../App.css';
import { redirect } from 'react-router';



const API = 'http://127.0.0.1:8000'

export const MainPage = () => {

  const crearCarrito = async () => {
    const res = await fetch(`${API}/crear-carrito/`,{
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
