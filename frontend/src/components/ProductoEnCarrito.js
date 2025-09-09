// En un nuevo archivo: ProductoEnCarrito.js
import React from 'react';
import { ListGroup, Button, Col, Row, Stack } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons'; // Ícono de basura

const ProductoEnCarrito = ({ producto, onIncrement, onDecrement, onDelete, isCartFinalized }) => {
  const subtotal = (producto.cantidad * producto.precio).toFixed(2);

  return (
    <ListGroup.Item className="mb-3 shadow-sm">
      <Row className="align-items-center">
        {/* Columna principal con el nombre y precio */}
        <Col>
          <div className="fw-bold">{producto.nombre}</div>
          <small className="text-muted">${producto.precio} / unidad</small>
        </Col>

        {/* Columna con los controles de cantidad y subtotal */}
        <Col xs="auto">
          <Stack gap={2} className="align-items-center">
            {/* Controles de cantidad */}
            <Stack direction="horizontal" gap={2} className="align-items-center">
              <Button variant="outline-secondary" size="sm" disabled={isCartFinalized} onClick={() => onDecrement(producto.id_producto)}>-</Button>
              <span className="fw-bold">{producto.cantidad}</span>
              <Button variant="outline-secondary" size="sm" disabled={isCartFinalized} onClick={() => onIncrement(producto.id_producto)}>+</Button>
            </Stack>
            
            {/* Subtotal y botón de borrar */}
            <div className="d-flex justify-content-between align-items-center w-100">
              <span className="fw-bold me-3">${subtotal}</span>
              <Button variant="outline-danger" size="sm" disabled={isCartFinalized} onClick={() => onDelete(producto.id)}>
                <Trash />
              </Button>
            </div>
          </Stack>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default ProductoEnCarrito;