import { useEffect, useState } from "react"
import { useParams } from 'react-router'
import { Row, Nav, Button, Accordion, Col } from "react-bootstrap"
import '../App.css'
import AccordionBody from "react-bootstrap/esm/AccordionBody"

const API = process.env.REACT_APP_BACKEND_API


export const Backoffice = () => {

    const { idSuper } = useParams()
    const [carritos, setCarritos] = useState([])
    const [nombreSuper, setNombreSuper] = useState('')
    const [total, setTotal] = useState(0)
    const [listaProd, setListaProd] = useState([])


    const getCarritos = async () => {
        const res = await fetch(`${API}/carrito/`, { 'method': 'GET', 'mode': 'cors' })
        const data = await res.json()
        const newData = data.filter(i => i.supermercado == idSuper)
        setCarritos(newData)
    }

    const nombreSupermercado = async () => {
        const res = await fetch(`${API}/supermercado/${idSuper}`, { 'method': 'GET', 'mode': 'cors' })
        const data = await res.json()
        setNombreSuper(data.nombre)
    }

    const listarProductos = async (id) => {
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
        getCarritos()
        nombreSupermercado()
    }, [])

    return (
        <div>
            <Nav className="nav-backoffice">
                <Nav.Item style={{ fontWeight: 'bold' }}> Backoffice de {nombreSuper} </Nav.Item>
            </Nav>

            <Accordion>
                {carritos.map((carro, index) => (
                    <Accordion.Item eventKey={index} key={index} className="border" onClick={() => listarProductos(carro.id)}>
                        <Accordion.Header className="accordion-backoffice">Carro Nº {carro.id} | Estado: {carro.estado !== 'FINALIZADO' ? carro.estado : <div style={{ color: 'red' }}>{carro.estado}</div>} | Fecha {carro.fecha}</Accordion.Header>
                        <Accordion.Body>
                            {listaProd.map((p, i) => (
                                <Row className="row-backoffice" key={i}>
                                    <Col>{p.nombre}</Col>
                                    <Col>Precio: {p.precio}</Col>
                                    <Col>Cantidad: {p.cantidad}</Col>
                                    <Col>Subtotal: {(p.cantidad * p.precio).toFixed(2)}</Col>
                                </Row>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>

        </div>
    )
}

export default Backoffice;