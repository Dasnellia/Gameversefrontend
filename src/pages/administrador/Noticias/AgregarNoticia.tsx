import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import '../../../css/AgregarNoticia.css';
import { crearNoticia } from '../../../api/apiNoticias';
import { useUser } from '../../../context/UserContext';

interface AgregarNoticiaProps {
  onCerrar: () => void;
  onAgregar: () => void;
  show: boolean;
}

const AgregarNoticia: React.FC<AgregarNoticiaProps> = ({ onCerrar, onAgregar, show }) => {
  const [name, setName] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { usuario: _usuario } = useUser(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foto) {
      setError('Debe seleccionar una imagen.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('descripcion', descripcion);
      formData.append('foto', foto);

      await crearNoticia(formData);
      setName('');
      setDescripcion('');
      setFoto(null);
      setError(null);
      onAgregar();
      onCerrar(); 
    } catch (err) {
      setError('Error al crear la noticia. Intente nuevamente.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  return (
    <Modal show={show} onHide={onCerrar} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Agregar Nueva Noticia</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-dark text-white">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-secondary text-white"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="bg-secondary text-white"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Foto</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              required
              className="bg-secondary text-white"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Agregar Noticia
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AgregarNoticia;