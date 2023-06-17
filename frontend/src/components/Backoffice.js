import { useEffect, useState } from "react"
import { Row, Nav, Button, Accordion, Col } from "react-bootstrap"
import '../App.css'

const API = process.env.REACT_APP_BACKEND_API


export const Backoffice = () => {

    const [carritos, setCarritos] = useState([])
    const [showCarousel, setShowCarousel] = useState(false);


    const getCarritos = async () => {
        const res = await fetch(`${API}/carrito/`, { 'method': 'GET', 'mode': 'cors' })
        const data = await res.json()
        for (let i = 1; i <= 5;) {
            console.log(i); 
          }
          
        setCarritos(data)
        
    }

    useEffect(() => {
        getCarritos()
    }, [])

    return (
        <div>
            <Nav className="nav-backoffice">
                <Nav.Item style={{ fontWeight: 'bold' }}> BACKOFFICE </Nav.Item>
            </Nav>

            {carritos.map((carro, index) => (
                <Row key={index} className="border row-backoffice">
                    <Col>Carro Nº {carro.id}</Col>
                    <Col> Estado:  {carro.estado !== 'FINALIZADO' ? carro.estado : <span style={{color:'red'}}> {carro.estado} </span>}</Col>
                    <Col></Col>
                </Row>
            ))}

        </div>
    )
}

export default Backoffice;