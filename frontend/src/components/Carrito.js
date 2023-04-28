import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import { redirect } from 'react-router';


const API = 'http://127.0.0.1:8000'

export const Carrito = () => {



  return (
    <div>
        <nav className='navbar'>
            CARRITO Nº 
        </nav>
        <div className='main-pg'>
          ¡El carrito se encuentra vacío!
        </div>  
        <button className='add-btn plus'>
        +
        </button>
      
    </div>
        
  );
}

export default Carrito;
