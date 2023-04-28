import React, { useRef, useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import '../App.css';



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
  }


  return (
      <div className='App-header'>
        ¡Bienvenido a su asistente de compras!
        <button className='crear-carrito-btn' onClick={() => crearCarrito()}>
          CREAR CARRITO
        </button>
      </div>

      
        
  );
}

export default MainPage;
