// En tu archivo Carrito.js (VERSIÓN CORREGIDA)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Modal, Button, ListGroup, Spinner, Alert, Stack } from 'react-bootstrap';
import { Html5QrcodeScanner } from 'html5-qrcode';
import ProductoEnCarrito from './ProductoEnCarrito';

const API = process.env.REACT_APP_BACKEND_API;

export const Carrito = () => {
    const { id, idSuper } = useParams();
    const navigate = useNavigate();
    const CART_STORAGE_KEY = `virtualCart_${id}`;

    // --- ESTADO DEL COMPONENTE ---
    const [carrito, setCarrito] = useState(null);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', variant: 'danger' });
    const scannerRef = useRef(null);
    const isCartFinalized = carrito?.estado === 'FINALIZADO';
    const [listaProd, setListaProd] = useState(() => {
        try {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Error al leer el carrito de localStorage", error);
            return [];
        }
    });

    // --- LÓGICA DE DATOS (API) ---
    const fetchCarritoData = useCallback(async () => {

            const [carritoRes, detallesRes] = await Promise.all([
                fetch(`${API}/carrito/${id}`),
                fetch(`${API}/detalle-carrito/${id}`)
            ]);
            const carritoData = await carritoRes.json();
            const serverDetailsData = await detallesRes.json();
            
            try {

                const localDataJSON = localStorage.getItem(CART_STORAGE_KEY);
                const localData = localDataJSON ? JSON.parse(localDataJSON) : [];
    
                const localQuantitiesMap = new Map();
                localData.forEach(producto => {
                    localQuantitiesMap.set(producto.id_producto, producto.cantidad);
                });
                
                // --- AQUÍ OCURRE LA MAGIA DE LA FUSIÓN ---
                const mergedDetails = serverDetailsData.map(serverProduct => {
                    if (localQuantitiesMap.has(serverProduct.id_producto)) {
                        return { ...serverProduct, cantidad: localQuantitiesMap.get(serverProduct.id_producto) };
                    }
                    // Si no, simplemente devolvemos el producto del servidor tal como vino.
                    return serverProduct;
            });

            setCarrito(carritoData);
            setListaProd(mergedDetails);
        } catch (err) {
            setError('No se pudieron cargar los datos del carrito.');
        } finally {
            setIsLoading(false);
        }
    }, [id]);


    const handleCloseScanner = async () => {
        // Si hay una instancia del escáner en nuestra referencia...
        if (scannerRef.current) {
            try {
                // Esperamos a que la librería termine de detener la cámara y limpiar la UI
                await scannerRef.current.clear();
            } catch (error) {
                console.error("Fallo al limpiar el escáner.", error);
            } finally {
                // Reseteamos nuestra referencia
                scannerRef.current = null;
            }
        }
        // SOLO DESPUÉS de que todo ha sido limpiado, cerramos el modal.
        setShowScannerModal(false);
    };
    
    
    useEffect(() => {
        fetchCarritoData();
    }, [fetchCarritoData]);

    useEffect(() => {
        const nuevoTotal = listaProd.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
        setTotal(nuevoTotal.toFixed(2));
    }, [listaProd]);

    useEffect(() => {
        if (listaProd && listaProd.length > 0) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(listaProd));
        } else {
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    }, [listaProd]);

    useEffect(() => {
        if (!carrito || carrito.estado == 'COMPRANDO') return; // Esperamos a tener los datos del carrito}
        try {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (!storedCart) {
                // Si el carrito local está vacío, actualizamos el estado del carrito en el backend a 'INICIADO'
                fetch(`${API}/carrito/${id}`, { method: 'PATCH', 
                                                headers: { 'Content-Type': 'application/json' }, 
                                                body: JSON.stringify({ estado: 'COMPRANDO' }) });
            }
        } catch (error) {
            console.error("Error al manejar el estado del carrito", error);
        }
            
    }, [listaProd]);


    // --- MANEJADORES DE EVENTOS ---
    const agregarProducto = async (ean) => {
        
        const productoYaExiste = listaProd.some(producto => producto.codigo_ean === parseInt(ean));
        if (productoYaExiste) {
            // Si el producto ya existe, mostramos una alerta de advertencia (amarilla).
            setNotification({ 
                show: true, 
                message: 'Este producto ya está en tu carrito. Puedes ajustar la cantidad con los botones.', 
                variant: 'warning' 
            });
            // Cerramos el escáner y detenemos la ejecución de la función aquí.
            await handleCloseScanner();
            return; 
        }
        
        try {
            const res = await fetch(`${API}/detalle-carrito/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "id_carrito": id, "codigo_ean": ean, "cantidad": 1 }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Producto no encontrado');
            }

            setNotification({
                show: true,
                message: '¡Producto agregado con éxito!',
                variant: 'success'
            });

            setShowScannerModal(false);
            await handleCloseScanner();
            fetchCarritoData();
        } catch (err) {
            
            setNotification({
                show: true,
                message: err.message,
                variant: 'danger'
            });

            await handleCloseScanner();
        }
    };

    const borrarProducto = async (idDetalle) => {
        await fetch(`${API}/detalle-carrito/${idDetalle}`, { method: 'DELETE' });
        fetchCarritoData();
    };
    
    const actualizarCantidadLocal = (idProducto, nuevaCantidad) => {
        setListaProd(listaProd.map(p => 
            p.id_producto === idProducto ? { ...p, cantidad: Math.max(1, nuevaCantidad) } : p
        ));
    };

    const finalizarCompra = async () => {
        const detalles = listaProd.map(p => ({ id: p.id, cantidad: p.cantidad }));
        await fetch(`${API}/detalle-carrito/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ detalles }),
        });
        localStorage.removeItem(CART_STORAGE_KEY);
        navigate(`/${idSuper}/carrito/${id}/pagar`);
    };

    // ++ LA LÓGICA DEL ESCÁNER AHORA ESTÁ DENTRO DEL COMPONENTE ++
    useEffect(() => {
        if (showScannerModal) {
            const scanner = new Html5QrcodeScanner('reader', {
                qrbox: { width: 250, height: 150 },
                fps: 10,
            });
   
            scannerRef.current = scanner;

            const success = (result) => {
                // No limpiamos aquí, solo llamamos a la función que agrega el producto
                agregarProducto(result);
            };
            const error = (err) => {
                // Podemos ignorar los errores de "no se encontró QR"
                // console.warn(err);
            };
            
            scanner.render(success, error);
        }
    }, [showScannerModal]); // <-- Se agrega agregarProducto a las dependencias

    // --- RENDERIZADO ---
    if (isLoading) {
        return <Container className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="danger" /></Container>;
    }

    return (
        <div className="d-flex flex-column vh-100">
            <Nav as="header" className="app-navbar p-3 flex-shrink-0">
                <span className="fw-bold">CARRITO Nº {id}</span>
                <span className='ms-auto' style={{ fontSize: '0.9rem' }}>Estado: {carrito?.estado}</span>
            </Nav>

            <main className="flex-grow-1" style={{ overflowY: 'auto' }}>
                <Container className="py-3">
                    {notification.show && (
                        <Alert 
                            variant={notification.variant} 
                            onClose={() => setNotification({ show: false, message: '', variant: 'danger' })} 
                            dismissible
                        >
                        {notification.message}
                        </Alert>
                    )}

                    {/* --- 2. MOSTRAMOS UNA ALERTA SI EL CARRITO ESTÁ FINALIZADO --- */}
                    {isCartFinalized && (
                        <Alert variant="info" className="mb-3">
                            <h5 className="alert-heading">Compra Finalizada</h5>
                            <p className="mb-0">
                                Este carrito ya ha sido procesado. No se pueden realizar más modificaciones.
                            </p>
                        </Alert>
                    )}

                    {listaProd.length > 0 ? (
                        <ListGroup>
                            {listaProd.map((p) => (
                                <ProductoEnCarrito
                                    key={p.id}
                                    producto={p}
                                    onIncrement={(idProd) => actualizarCantidadLocal(idProd, p.cantidad + 1)}
                                    onDecrement={(idProd) => actualizarCantidadLocal(idProd, p.cantidad - 1)}
                                    onDelete={borrarProducto}
                                    isCartFinalized={isCartFinalized}
                                />
                            ))}
                        </ListGroup>
                    ) : (
                        <div className="text-center text-muted p-5">
                            <h3>¡Tu carrito está vacío!</h3>
                            <p>Usa el botón "Escanear" para empezar a agregar productos.</p>
                        </div>
                    )}
                </Container>
            </main>

            <footer className="p-2 sticky-footer bg-light border-top shadow-lg flex-shrink-0">
                <Container>
                    <Row className="align-items-center mb-3">
                        <Col><span className="fs-5">Total:</span></Col>
                        <Col className="text-end"><span className="fs-4 fw-bold">${total}</span></Col>
                    </Row>
                    <Stack gap={2}>
                        <Button size="lg" variant="success" disabled={isCartFinalized} onClick={() => setShowScannerModal(true)}>Escanear Producto</Button>
                        <Button variant="danger" onClick={finalizarCompra} disabled={listaProd.length === 0 || isCartFinalized}>
                            Finalizar y Pagar
                        </Button>
                    </Stack>
                </Container>
            </footer>

            <Modal show={showScannerModal} onHide={handleCloseScanner} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Escanear Código de Barras</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="reader"></div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Carrito;
/*import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import { redirect, useParams } from 'react-router';
import { Col, Container, Row, Nav, Modal, Button } from 'react-bootstrap';
import { Html5QrcodeScanner } from 'html5-qrcode';



const API = process.env.REACT_APP_BACKEND_API


export const Carrito = () => {

    const { id, idSuper } = useParams()
    const [nombreSuper, setNombreSuper] = useState('')
    const [ean, setEan] = useState(0)
    const [listaProd, setListaProd] = useState([])
    const [count, setCount] = useState(0)
    const [scanCount, setScanCount] = useState(0)
    const [total, setTotal] = useState(0)
    const [estado, setEstado] = useState('')
    const [show, setShow] = useState(true);
    const [mensajeError, setMensajeError] = useState('');
    const [mostrarError, setMostrarError] = useState(false);



    useEffect(() => {
        if (listaProd.length > 0) {
            const lista = fetch(`${API}/carrito/${id}`, { 
                'mode': 'cors', 
                'method': 'PATCH',
                'headers': {'Content-Type': 'application/json'},
                'body': JSON.stringify({
                    'estado': 'COMPRANDO'
                })
            });
        setShow(false)
        } else {setShow(true)}
        getCarrito()
    })

    const mostrarMensajeError = (mensaje) => {
        setMensajeError(mensaje);
        setMostrarError(true);
        setTimeout(() => {
            setMostrarError(false);
        }, 3000); // El mensaje desaparecerá después de 3 segundos
    };

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
        // Calcular el total automáticamente cuando listaProd cambie
        let aux = 0;
        listaProd.forEach((p) => {
            aux += p.cantidad * p.precio;
        });
        setTotal(aux.toFixed(2));
    }, [listaProd]); // Escucha los cambios en listaProd

    useEffect(() => {
        listarProductos()
        nombreSupermercado()
        getCarrito()
    }, [count])

    // useEffect(() => {
    //     listarProductos()
    // }, [total])

    const getCarrito = async () => {
        const res = await fetch(`${API}/carrito/${id}`, { 'method': 'GET', 'mode': 'cors' })
        const data = await res.json()
        setEstado(data.estado)
    }

    const agregarProducto = async (ean) => {
        try {
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
            if (res.ok) {
                const data = await res.json();
                console.log('Producto agregado:', data);
                listarProductos(); // Actualiza la lista de productos después de agregar uno nuevo
            } else if (res.status === 404) {
                mostrarMensajeError('Producto no encontrado. Por favor, verifique el código EAN.');
            } else {
                mostrarMensajeError('Error al agregar el producto. Inténtelo de nuevo.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            mostrarMensajeError('Error al agregar el producto. Inténtelo de nuevo.');
        }   
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

    const handleRedirect = () => {
        window.location.href = `/${idSuper}/carrito/${id}/pagar`
    }
    

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

    // Función para incrementar la cantidad de un producto
    const incrementarCantidad = (idProducto) => {
        const nuevaLista = listaProd.map((producto) => {
            if (producto.id_producto === idProducto) {
                return { ...producto, cantidad: producto.cantidad + 1 };
            }
            return producto;
        });
        setListaProd(nuevaLista);
    };

    // Función para disminuir la cantidad de un producto
    const disminuirCantidad = (idProducto) => {
        const nuevaLista = listaProd.map((producto) => {
            if (producto.id_producto === idProducto && producto.cantidad > 1) {
                return { ...producto, cantidad: producto.cantidad - 1 };
            }
            return producto;
        });
        setListaProd(nuevaLista);
    };

    const finalizarCompra = async () => {
        try {
            // Construir el cuerpo de la solicitud con el formato esperado por el backend
            const detalles = listaProd.map((detalle) => ({
                id: detalle.id, // Asegúrate de que este sea el campo correcto para identificar el producto
                cantidad: detalle.cantidad,
            }));

            const res = await fetch(`${API}/detalle-carrito/`, {
                method: 'PATCH',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ detalles }),
            });

            if (res.ok) {
                console.log("Compra finalizada con éxito");
                handleRedirect(); // Redirigir al usuario a la página de pago
            } else {
                console.error("Error al finalizar la compra:", res.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    return (
        <div>
            <Nav className="navbar">
                <Nav.Item style={{fontWeight:'bold', paddingLeft:'10px'}}> CARRITO Nº {id}</Nav.Item>
                <Nav.Item style={{}}> Estado: {estado}</Nav.Item>
                <Nav.Item style={{paddingRight:'10px'}}> Supermercado: {nombreSuper}</Nav.Item>
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
                        <Row key={index} style={{ outline: 'solid', padding: '20px', textAlign: 'center' }}>
                            <Col>{p.id_producto}</Col>
                            <Col>{p.nombre}</Col>
                            <Col>$ {p.precio}</Col>
                            <Col>
                                <Button variant="secondary" size="sm" onClick={() => disminuirCantidad(p.id_producto)}>-</Button>
                                <span style={{ margin: '0 10px' }}>{p.cantidad}</span>
                                <Button variant="secondary" size="sm" onClick={() => incrementarCantidad(p.id_producto)}>+</Button>
                            </Col>
                            <Col>$ {(p.cantidad * p.precio).toFixed(2)}</Col>
                            <Col>
                                <Button variant="danger" onClick={() => { borrarProducto(p.id); listarProductos(); handleClick(); }}>
                                    Borrar
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    {show ? <div style={{ padding: '15px', fontWeight: 'bold', textAlign: 'center' }}> ¡El carrito está vacío! </div> : <></>}
                </Container>
                <Container fluid style={{ color: 'black', outline: 'solid', textAlign: 'center', padding: '10px', backgroundColor: 'lightblue' }}>
                    <Row className="justify-content-md-center">
                        <Col xs={10} style={{ fontWeight: 'bold' }}>TOTAL ${total} </Col>
                    </Row>
                </Container>

                {mostrarError && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '1rem',
                    zIndex: 1000,
                    transition: 'opacity 0.5s ease-in-out',
                    opacity: mostrarError ? 1 : 0,
                }}>
                    {mensajeError} 
                </div>)}
                
                <Container style={{ padding: '25px' }}>
                    <Row style={{ padding: '20px' }}>
                        <Button size='lg' variant='success' onClick={() => llamarScaner()}>Escanear</Button>
                    </Row>
                    <Row style={{ padding: '20px' }}>
                        <Button
                            variant='danger'
                            style={{ padding: '1rem' }}
                            onClick={() => finalizarCompra()}
                        >
                            Finalizar y pagar
                        </Button>
                    </Row>
                </Container>
                <div id="reader"></div>
            </div>
        </div>

    );
}

export default Carrito;*/