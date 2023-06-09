import { useEffect, useState } from 'react'
import { Nav, Row, Col, Container } from 'react-bootstrap'
import { useParams } from 'react-router'
import QRCode from 'qrcode.react';


const API = process.env.REACT_APP_BACKEND_API

export const ResumenCompra = () => {

    const { id, idSuper } = useParams()
    const [listaProd, setListaProd] = useState([])
    const [total, setTotal] = useState([])
    const [estado, setEstado] = useState([])
    const URL = window.location

    const listarProductos = async () => {
        const lista = await fetch(`${API}/detalle-carrito/${id}`, { 'mode': 'cors', 'method': 'GET' });
        const data = await lista.json();
        setListaProd(data);
        var aux = 0;
        listaProd.forEach((p) => {
            aux += p.cantidad * p.precio
        })
        setTotal(aux.toFixed(2))
    }

    const getCarrito = async () => {
        const res = await fetch(`${API}/carrito/${id}`, { 'method': 'GET', 'mode': 'cors' })
        const data = await res.json()
        setEstado(data.estado)
    }

    useEffect(() =>{
        listarProductos()
        getCarrito()
    }, [total])

        return (
            <div>
                <Nav style={{ backgroundColor: 'rosybrown', justifyContent: 'center', padding: '10px' }}>
                    <h1>
                        RESUMEN DE LA COMPRA
                    </h1>
                </Nav>
                <Nav style={{ justifyContent: 'center', padding: '5px' }}>
                    <h2>
                        CARRITO Nº {id}
                    </h2>
                </Nav>
                <Nav style={{ justifyContent: 'center', padding: '5px' }}>
                    <h3 style={{color:'red'}}>
                        {estado}
                    </h3>
                </Nav>

                <Container fluid style={{ color: 'black', outline: 'solid', textAlign: 'center', padding: '10px', backgroundColor: 'whitesmoke' }}>
                    <Row >
                        <Col>PRODUCTO</Col>
                        <Col>PRECIO</Col>
                        <Col>CANTIDAD</Col>
                        <Col>SUBTOTAL</Col>
                    </Row>
                </Container>
                <Container fluid style={{ color: 'black', outline: 'solid' }}>
                {listaProd.map((p, index) => (
                    <Row key={index} style={{ outline: 'solid', padding: '20px', textAlign: 'center', }}>
                        <Col>{p.nombre}</Col>
                        <Col>$ {p.precio}</Col>
                        <Col>{p.cantidad}</Col>
                        <Col>$ {(p.cantidad * p.precio).toFixed(2)}</Col>
                    </Row>
                ))}
            </Container>
                <Container fluid style={{ color: 'black', outline: 'solid', textAlign: 'center', padding: '10px', backgroundColor: 'whitesmoke' }}>
                    <Row>
                        <Col style={{ fontWeight: 'bold' }}>TOTAL ${total}</Col>
                    </Row>
                </Container>
                <Container style={{textAlign: 'center', paddingTop: '20px'}}>
                    <QRCode value={URL}  />
                </Container>
            </div>

        )
}

    export default ResumenCompra