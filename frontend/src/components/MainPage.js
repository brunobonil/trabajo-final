import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import { redirect, useParams } from 'react-router-dom';



//const API = 'http://192.168.100.156:8000'
const API = 'http://192.168.1.59:8000'
//const API = process.env.BACKEND_API



export const MainPage = () => {

  const { idSuper } = useParams()
  const [ nombreSuper, setNombreSuper ] = useState('')

  useEffect(() => {
    nombreSupermercado()
  }, [])

  const crearCarrito = async () => {
    const res = await fetch(`${API}/carrito/`,{
      'mode': 'cors',
      'method': 'POST',
      'headers': {'Content-Type': 'application/json'},
      'body': JSON.stringify({ 'supermercado': idSuper })
    })
    const data = await res.json();
    console.log(data)
    window.location.href = `${idSuper}/carrito/${data.id}`;
  }

  const nombreSupermercado = async () => {
    const res = await fetch(`${API}/supermercado/${idSuper}`, {'method': 'GET', 'mode': 'cors'})
    const data = await res.json()
    console.log(data.nombre)
    setNombreSuper(data.nombre)
  }

  return (
      <div className='main-pg'>
        <h1 style={{color: 'black'}}>
          ¡Bienvenido a su asistente de compras!
        </h1>
        <h2 style={{color: 'black'}}> Usted se encuentra en {nombreSuper} </h2>
        <button className='crear-carrito-btn' onClick={() => crearCarrito()}>
          CREAR CARRITO
        </button>
      </div>
  );
}

export default MainPage;
