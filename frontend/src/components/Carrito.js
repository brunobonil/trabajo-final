import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import { redirect, useParams } from 'react-router';
import { Col, Container, Row } from 'react-bootstrap';


const API = 'http://192.168.100.156:8000'

export const Carrito = () => {

    const { id } = useParams()
    const [ean, setEan] = useState(0)
    const [listaProd, setListaProd] = useState([])

    // useEffect(() => {
    //     const listarProductos = async () => {
    //         const lista = await fetch(`${API}/listar-detalles/${id}`, {'mode': 'cors'});
    //         const data = await lista.json();
    //         setListaProd(data);
    //     }
    //     listarProductos()
    // }, [])


    useEffect(() => {
        listarProductos()
    }, [])

    const listarProductos = async () => {
        const lista = await fetch(`${API}/listar-detalles/${id}`, { 'mode': 'cors' })
        const data = await lista.json()
        setListaProd(data)
        console.log(listaProd);
    }



    const agregarProducto = async () => {
        console.log(ean)
        const res = await fetch(`${API}/crear-detalle/`, {
            'mode': 'cors',
            'method': 'POST',
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON.stringify({
                "id_carrito": id,
                "codigo_ean": ean,
                "cantidad": 1
            })
        });
        const data = await res.json();
        alert("El producto fue agregado con éxito")
        console.log(data)
    }


    return (
        <div>
            <nav className='navbar'>
                CARRITO Nº {id}
            </nav>


            <div className='main-pg'>

                <Container >
                    <Row>
                        <Col>primera col</Col>
                        <Col>segunda col</Col>
                    </Row>
                </Container>

                <input className='ean-input'
                    placeholder='Ingrese el código EAN del producto'
                    type='number'
                    onChange={(e) => setEan(e.target.value)}>
                </input>
            </div>
            <button className='add-btn plus' onClick={() => { agregarProducto(); listarProductos() }}>
                +
            </button>

        </div>

    );
}

export default Carrito;
