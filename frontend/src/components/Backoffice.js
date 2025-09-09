import React, { useEffect, useState, useCallback } from "react";
import { useParams } from 'react-router-dom';
import { Nav, Accordion, Col, Container, Spinner, Alert, ListGroup, Badge, Card } from "react-bootstrap";
import '../App.css';

const API = process.env.REACT_APP_BACKEND_API;

export const Backoffice = () => {
    const { idSuper } = useParams();
    const [carritos, setCarritos] = useState([]);
    const [nombreSuper, setNombreSuper] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // --- 1. NUEVO ESTADO PARA LOS DETALLES ---
    const [detallesCarritos, setDetallesCarritos] = useState({});

    // --- LÓGICA DE DATOS ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [carritosRes, superRes] = await Promise.all([
                    fetch(`${API}/carrito/`),
                    fetch(`${API}/supermercado/${idSuper}`)
                ]);
                const carritosData = await carritosRes.json();
                const superData = await superRes.json();
                
                // Filtramos los carritos por supermercado en el frontend
                const filteredCarritos = carritosData.filter(c => c.supermercado == idSuper);
                setCarritos(filteredCarritos);
                setNombreSuper(superData.nombre);
            } catch (err) {
                setError("No se pudieron cargar los datos del backoffice.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [idSuper]);

    // --- 2. NUEVA FUNCIÓN PARA CARGAR DETALLES ON-DEMAND ---
    const handleAccordionToggle = useCallback(async (cartId) => {
        // Si ya tenemos los detalles de este carrito (o ya los estamos pidiendo), no hacemos nada.
        if (detallesCarritos[cartId]) {
            return;
        }

        try {
            // Marcamos este carrito como "cargando"
            setDetallesCarritos(prev => ({ ...prev, [cartId]: { loading: true, products: [], total: 0 } }));
            
            const res = await fetch(`${API}/detalle-carrito/${cartId}`);
            const data = await res.json();
            const total = data.reduce((sum, p) => sum + p.cantidad * p.precio, 0);

            // Guardamos los productos y el total en el estado, y marcamos la carga como finalizada
            setDetallesCarritos(prev => ({ 
                ...prev, 
                [cartId]: { loading: false, products: data, total: total } 
            }));
        } catch (err) {
            console.error(`Error al cargar detalles para el carrito ${cartId}`, err);
            setDetallesCarritos(prev => ({ 
                ...prev, 
                [cartId]: { loading: false, products: [], error: 'No se pudieron cargar los productos.' } 
            }));
        }
    }, [detallesCarritos]); // Dependemos de detallesCarritos para no rehacer la función innecesariamente


    // --- RENDERIZADO ---
    if (isLoading) {
        return <Container className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="danger" /></Container>;
    }

    if (error) {
        return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        <div className="bg-light min-vh-100">
            {/* Usamos clases de Bootstrap para un header consistente */}
            <header className="bg-secondary text-white text-center p-3 shadow-sm">
                <h1 className="h4 mb-0 text-uppercase">Backoffice: {nombreSuper}</h1>
            </header>

            <Container className="py-4">
                {/* --- 3. HABILITAMOS MÚLTIPLES ACORDEONES ABIERTOS --- */}
                <Accordion alwaysOpen>
                    {carritos.map((carro) => {
                        const detalles = detallesCarritos[carro.id];
                        const totalCarrito = detalles?.total?.toFixed(2) || '0.00';
                        return (
                            <Accordion.Item eventKey={carro.id} key={carro.id} className="mb-2 shadow-sm">
                                {/* Usamos onSelect en el Header para cargar los datos */}
                                <Accordion.Header onClick={() => handleAccordionToggle(carro.id)}>
                                    <div className="d-flex justify-content-between w-100 me-2">
                                        <span><strong>Carro Nº {carro.id}</strong></span>
                                        <Badge bg={carro.estado === 'FINALIZADO' ? 'success' : 'secondary'}>
                                            {carro.estado}
                                        </Badge>
                                        <span className="text-muted d-none d-md-block">{new Date(carro.fecha).toLocaleDateString()}</span>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    {/* --- 4. RENDERIZADO CONDICIONAL DEL CONTENIDO --- */}
                                    {detalles?.loading && <div className="text-center"><Spinner size="sm" /></div>}
                                    {detalles?.error && <Alert variant="warning">{detalles.error}</Alert>}
                                    {detalles && !detalles.loading && (
                                        <Card>
                                            <ListGroup variant="flush">
                                                {detalles.products.length > 0 ? detalles.products.map((p) => (
                                                    <ListGroup.Item key={p.id} className="d-flex justify-content-between">
                                                        <div>
                                                            <div className="fw-bold">{p.nombre}</div>
                                                            <small className="text-muted">{p.cantidad} x ${p.precio.toFixed(2)}</small>
                                                        </div>
                                                        <span className="fw-bold">${(p.cantidad * p.precio).toFixed(2)}</span>
                                                    </ListGroup.Item>
                                                )) : <ListGroup.Item>Este carrito está vacío.</ListGroup.Item>}
                                                <ListGroup.Item variant="light" className="d-flex justify-content-end fw-bold">
                                                    Total: ${totalCarrito}
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Card>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>
            </Container>
        </div>
    );
};

export default Backoffice;