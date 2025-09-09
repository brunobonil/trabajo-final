import React, { useEffect, useState, useMemo } from 'react';
import { Nav, Container, ListGroup, Spinner, Alert, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';

const API = process.env.REACT_APP_BACKEND_API;

export const ResumenCompra = () => {
    const { id } = useParams();

    // --- ESTADO DEL COMPONENTE ---
    const [listaProd, setListaProd] = useState([]);
    const [carrito, setCarrito] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // --- LÓGICA DE DATOS ---
    useEffect(() => {
        const fetchResumenData = async () => {
            setIsLoading(true);
            try {
                // Usamos Promise.all para hacer las llamadas en paralelo
                const [detallesRes, carritoRes] = await Promise.all([
                    fetch(`${API}/detalle-carrito/${id}`),
                    fetch(`${API}/carrito/${id}`)
                ]);

                if (!detallesRes.ok || !carritoRes.ok) {
                    throw new Error('No se pudo cargar el resumen de la compra.');
                }

                const detallesData = await detallesRes.json();
                const carritoData = await carritoRes.json();

                setListaProd(detallesData);
                setCarrito(carritoData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResumenData();
    }, [id]); // El efecto se ejecuta solo cuando el 'id' del carrito cambia

    // Usamos useMemo para calcular el total.
    // Esta función solo se re-ejecutará si `listaProd` cambia, no en cada render. Es más eficiente.
    const total = useMemo(() => {
        return listaProd.reduce((sum, p) => sum + p.cantidad * p.precio, 0).toFixed(2);
    }, [listaProd]);
    
    // El valor para el QR code debe ser un string
    const qrCodeUrl = window.location.href;

    // --- RENDERIZADO ---
    if (isLoading) {
        return <Container className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="danger" /></Container>;
    }

    if (error) {
        return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        // Usamos un fondo consistente con el resto de la app
        <div className="bg-light min-vh-100"> 
            {/* Un header limpio usando nuestra clase de CSS y clases de Bootstrap */}
            <header className="app-navbar text-white text-center p-3 shadow-sm">
                <h1 className="h4 mb-0 text-uppercase">Resumen de Compra</h1>
            </header>

            <Container as="main" className="py-4">
                <Card className="shadow-sm mb-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Carrito Nº {id}</span>
                        {/* El estado se muestra como un "Badge" para más impacto visual */}
                        <span className={`badge bg-${carrito?.estado === 'FINALIZADO' ? 'success' : 'warning'} text-uppercase`}>
                            {carrito?.estado}
                        </span>
                    </Card.Header>
                    {/* Usamos ListGroup para una lista mobile-first */}
                    <ListGroup variant="flush">
                        {listaProd.map((p) => (
                            <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-start">
                                <div className="me-auto">
                                    <div className="fw-bold">{p.nombre}</div>
                                    <small className="text-muted">{p.cantidad} x ${p.precio.toFixed(2)}</small>
                                </div>
                                <span className="fw-bold">${(p.cantidad * p.precio).toFixed(2)}</span>
                            </ListGroup.Item>
                        ))}
                        {/* Fila para el Total */}
                        <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
                            <span className="h5 mb-0">TOTAL</span>
                            <span className="h5 mb-0 fw-bold">${total}</span>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>

                {/* Sección para el QR Code */}
                <Card className="shadow-sm text-center">
                    <Card.Body>
                        <Card.Title className="h6 text-muted">Código para el cajero</Card.Title>
                        <div className="d-flex justify-content-center p-2">
                           <QRCode value={qrCodeUrl} size={180} />
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default ResumenCompra;