import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import { redirect, useParams } from 'react-router';
//import BarcodeScanner from './MyScanner.js'
import BarcodeScanner from './BarcodeScanner'
import Camera from './Camera'
import { Col, Container, Row, Nav, Modal, Button } from 'react-bootstrap';


//const API = 'http://192.168.100.156:8000'
const API = 'http://192.168.1.59:8000'
//const API = process.env.BACKEND_API


export const Carrito = () => {

    const { id, idSuper } = useParams()
    const [nombreSuper, setNombreSuper] = useState('')
    const [ean, setEan] = useState(0)
    const [listaProd, setListaProd] = useState([])
    const [count, setCount] = useState(0)
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
    }, [count])

    useEffect(() => {
        listarProductos()
    }, [total])


    // const calcularTotal = () => {
    //     var aux = 0;
    //     listaProd.forEach((p) => {
    //         console.log(p)
    //         aux += p.cantidad * p.precio
    //     })
    //     setTotal(aux)
    //     console.log(total)
    // }

    // const listarProductos = async () => {
    //     const lista = await fetch(`${API}/detalle-carrito/${id}`, { 'mode': 'cors', 'method': 'GET' });
    //     const data = await lista.json();
    //     setListaProd(data);
    //     console.log(listaProd);
    // }


    const agregarProducto = async () => {
        console.log(ean)
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
    return (
        <div>
            <Nav style={{backgroundColor: 'crimson'}}>
                <Nav.Item style={{}}> Supermercado: {nombreSuper}</Nav.Item>
                <Nav.Item style={{display:'flex', justifyContent:'center', alignItems: 'center'}}> CARRITO Nº {id}</Nav.Item>

            </Nav>


            <div className='main-pg'>
                <Container fluid style={{ color: 'black', outline: 'solid', textAlign: 'center', padding: '10px', backgroundColor: 'lightblue' }}>
                    <Row >
                        <Col>ID DETALLE</Col>
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
                            <Col>{p.id}</Col>
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
                    onClick={() => { agregarProducto(); handleClick(); }}>
                    +
                </Button>
                {/* <Button size='lg' variant='success' onClick={() => handleShow()}>Scan</Button> */}

            </div>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Escanear producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Camera></Camera>

                </Modal.Body>
            </Modal>

        </div>

    );
}

export default Carrito;
