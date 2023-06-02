import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import { redirect, useParams } from 'react-router';
import { Col, Container, Row, Nav, Modal, Button } from 'react-bootstrap';
import { Html5QrcodeScanner } from 'html5-qrcode';
//import BarcodeScanner from './MyScanner'
//import BarcodeScanner from './BarcodeScanner'
//import Escaner from './Scanner';


const API = 'https://192.168.100.156:8000'
//const API = 'http://192.168.1.59:8000'
//const API = process.env.BACKEND_API


export const Carrito = () => {

    const { id, idSuper } = useParams()
    const [nombreSuper, setNombreSuper] = useState('')
    const [ean, setEan] = useState(0)
    const [listaProd, setListaProd] = useState([])
    const [count, setCount] = useState(0)
    const [scanCount, setScanCount] = useState(0)
    const [total, setTotal] = useState(0)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // const [data, setData] = React.useState("Not Found");
    // const [torchOn, setTorchOn] = React.useState(false);

    const listarProductos = async () => {
        const lista = await fetch(`${API}/detalle-carrito/${id}`, { 'mode': 'cors', 'method': 'GET' });
        const data = await lista.json();
        setListaProd(data);
        var aux = 0;
        listaProd.forEach((p) => {
            console.log(p)
            aux += p.cantidad * p.precio
        })
        setTotal(aux.toFixed(2))
    }

    useEffect(() => {
        listarProductos()
        nombreSupermercado()
        listarProductos()
    }, [count])

    useEffect(() => {
        listarProductos()
    }, [total])



    const agregarProducto = async (ean) => {
        const res = await fetch(`${API}/detalle-carrito/`, {
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
        //alert("El producto fue agregado con éxito")
        console.log(data);
    }

    const handleClick = () => {
        setCount(count + 1); // Update the state value
    };

    const borrarProducto = async (idDetalle) => {
        const res = await fetch(`${API}/detalle-carrito/${idDetalle}`, {
            'mode': 'cors',
            'method': 'DELETE'
        })
    }

    const nombreSupermercado = async () => {
        const res = await fetch(`${API}/supermercado/${idSuper}`, { 'method': 'GET', 'mode': 'cors' })
        const data = await res.json()
        setNombreSuper(data.nombre)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const llamarScaner = () => {
        setScanCount(scanCount + 1)
    }

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 10,
        })

        const success = (result) => {
            scanner.clear()
            setEan(result)
            setTotal()
            agregarProducto(result)
            setCount(count + 1); // Update the state value
            console.log(result)
        }

        const error = (err) => {
            console.warn(err)
        }
        scanner.render(success, error);
    }, [scanCount])


    return (
        <div>
            <Nav className="navbar">
                <Nav.Item style={{}}> CARRITO Nº {id}</Nav.Item>
                <Nav.Item style={{}}> Supermercado: {nombreSuper}</Nav.Item>
            </Nav>


            <div className='main-pg'>
                <Container fluid style={{ color: 'black', outline: 'solid', textAlign: 'center', padding: '10px', backgroundColor: 'lightblue' }}>
                    <Row >
                        <Col>ID PRODUCTO</Col>
                        <Col>NOMBRE</Col>
                        <Col>PRECIO UNITARIO</Col>
                        <Col>CANTIDAD</Col>
                        <Col>SUBTOTAL</Col>
                        <Col></Col>
                    </Row>
                </Container>
                <Container fluid style={{ color: 'black', outline: 'solid' }}>
                    {listaProd.map((p, index) => (
                        <Row key={index} style={{ outline: 'solid', padding: '20px', textAlign: 'center', }}>
                            <Col>{p.id_producto}</Col>
                            <Col>{p.nombre}</Col>
                            <Col>$ {p.precio}</Col>
                            <Col>{p.cantidad}</Col>
                            <Col>$ {(p.cantidad * p.precio).toFixed(2)}</Col>
                            <Col> <Button variant='danger' onClick={() => { borrarProducto(p.id); listarProductos(); handleClick() }}>Borrar</Button> </Col>
                        </Row>
                    ))}
                </Container>
                <Container fluid style={{ color: 'black', outline: 'solid', textAlign: 'center', padding: '10px', backgroundColor: 'lightblue' }}>
                    <Row>
                        <Col style={{ fontWeight: 'bold' }}>TOTAL ${total}</Col>
                    </Row>
                </Container>


                <input className='ean-input'
                    placeholder='Ingrese el código EAN del producto'
                    type='number'
                    onChange={(e) => setEan(e.target.value)}>
                </input>
                {/* <p style={{ color: 'black' }}>Count: {count}</p>
                <button onClick={handleClick}>Increment</button> */}
                <Button variant='success'
                    size='lg'
                    className='add-btn'
                    onClick={() => { agregarProducto(ean); handleClick(); }}>
                    +
                </Button>
                <Button size='lg' variant='success' onClick={() => llamarScaner()}>Scan</Button>
                <div id="reader"></div>

            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Escanear producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>
            </Modal>

        </div>

    );
}

export default Carrito;
