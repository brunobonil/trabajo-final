import React, { useState, useEffect } from 'react'; // <-- Asegúrate de importar useEffect
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { LockFill } from 'react-bootstrap-icons';

const API = process.env.REACT_APP_BACKEND_API;

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { idSuper } = useParams();
  const [nombreSuper, setNombreSuper] = useState('...');

  useEffect(() => {
    const fetchNombreSupermercado = async () => {
      if (!idSuper) return;

      try {
        const res = await fetch(`${API}/supermercado/${idSuper}`);
        if (!res.ok) {
          throw new Error('No se pudo encontrar el supermercado.');
        }
        const data = await res.json();
        setNombreSuper(data.nombre);
      } catch (error) {
        console.error(error);
        setNombreSuper('Supermercado'); // Un nombre genérico en caso de error
      }
    };

    fetchNombreSupermercado(); // Ejecutamos la función
  }, [idSuper]); // El efecto se volverá a ejecutar si el idSuper cambia

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error('Usuario o contraseña incorrectos.');
      }

      const data = await res.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      
      navigate(`/${idSuper}/backoffice`);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="shadow-sm" style={{ width: '350px' }}>
        <Card.Body className="p-4 text-center">
          <LockFill size={40} className="mb-3" />
          
          <h3 className="mb-1">Backoffice</h3>
          <p className="text-muted mb-3 fs-5">{nombreSuper}</p>

          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Nombre de usuario"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="danger" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Ingresar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;