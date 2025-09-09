import React, { useState, useEffect } from 'react';
import { Button, Container, Stack, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard } from 'react-bootstrap-icons'; // Un ícono para darle contexto visual

const API = process.env.REACT_APP_BACKEND_API;

export const PaginaPago = () => {
    const { id, idSuper } = useParams();
    const navigate = useNavigate();

    const [total, setTotal] = useState(0);
    const [isPaying, setIsPaying] = useState(false); // Estado para mostrar feedback al pagar
    const [error, setError] = useState('');

    // Efecto para obtener el total del carrito al cargar la página
    useEffect(() => {
        const fetchCartTotal = async () => {
            try {
                const res = await fetch(`${API}/detalle-carrito/${id}`);
                if (!res.ok) throw new Error('No se pudo obtener el total del carrito.');
                
                const detallesData = await res.json();
                const nuevoTotal = detallesData.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
                setTotal(nuevoTotal.toFixed(2));
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCartTotal();
    }, [id]); // Se ejecuta cuando el ID del carrito cambia

    const handlePayment = async () => {
        setIsPaying(true); // Activa el estado de carga
        setError('');
        try {
            // Simula un retraso de 3 segundos antes de realizar la solicitud
            await new Promise(resolve => setTimeout(resolve, 2000));

            const res = await fetch(`${API}/carrito/${id}`, {
                method: 'PATCH',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'estado': 'FINALIZADO' }),
            });

            if (!res.ok) throw new Error('El pago no pudo ser procesado.');

            // Navegación SPA sin recarga
            navigate(`/${idSuper}/carrito/${id}/resumen`);
        } catch (err) {
            setError(err.message);
            setIsPaying(false); // Desactiva el estado de carga si hay un error
        }
    };

    const handleReturn = () => {
        // Navegación SPA sin recarga
        navigate(`/${idSuper}/carrito/${id}/`);
    };

    return (
        // Usamos la clase que definimos para centrar el contenido verticalmente
        <Container as="main" className="main-page-container text-center">
            <Stack gap={4} className="align-items-center" style={{ maxWidth: '400px' }}>
                <CreditCard color="var(--primary-color)" size={70} />

                <div className="w-100">
                    <h1 className="h2">Finalizar Compra</h1>
                    <p className="text-muted">
                        Confirma el pago para completar tu compra.
                    </p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}

                <div className="bg-light p-3 rounded w-100">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fs-5">Total a pagar:</span>
                        <span className="fs-3 fw-bold">${total}</span>
                    </div>
                </div>

                {/* Usamos un Stack para los botones, mucho más limpio que dos Rows */}
                <Stack gap={3} className="w-100">
                    <Button 
                        variant="success" 
                        size="lg" 
                        onClick={handlePayment}
                        disabled={isPaying} // El botón se deshabilita mientras se procesa el pago
                    >
                        {isPaying ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span className="ms-2">Procesando...</span>
                            </>
                        ) : (
                            'Pagar'
                        )}
                    </Button>

                    <Button 
                        variant="outline-secondary" 
                        onClick={handleReturn}
                        disabled={isPaying}
                    >
                        Volver al Carrito
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
};

export default PaginaPago;