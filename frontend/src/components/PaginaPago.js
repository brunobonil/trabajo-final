import { Button, Container, Row } from "react-bootstrap"
import { useParams } from "react-router"

const API = process.env.REACT_APP_BACKEND_API


export const PaginaPago = () => {

    const { id, idSuper } = useParams()

    const resumenPage = async () => {
        const res = await fetch(`${API}/carrito/${id}`,
            {
                'method': 'PATCH',
                'mode': 'cors',
                'headers': { 'Content-Type': 'application/json' },
                'body': JSON.stringify({ 'estado': 'FINALIZADO' }),
            })
        window.location.href = `/${idSuper}/carrito/${id}/resumen`
    }

    const returnPage = () => {
        window.location.href = `/${idSuper}/carrito/${id}/`
    }

    return (
        <Container style={{ paddingTop: '20%' }}>
            <Row style={{ paddingBottom: '30px', paddingLeft: '100px', paddingRight: '100px' }}>
                <Button variant="success" style={{ padding: '30px' }} onClick={resumenPage}>PAGAR</Button>
            </Row>

            <Row style={{ paddingBottom: '30px', paddingLeft: '100px', paddingRight: '100px' }}>
                <Button variant="danger" style={{ padding: '15px' }} onClick={returnPage}>Volver</Button>
            </Row>
        </Container>
    )
}

export default PaginaPago