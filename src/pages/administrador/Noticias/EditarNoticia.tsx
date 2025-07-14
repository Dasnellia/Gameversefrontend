import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import '../../../css/EditarNoticia.css';
import { editarNoticia } from '../../../api/apiNoticias';
import type { DetalleNoticia } from '../Noticias/ListadoNoticias'; 

interface EditarNoticiaProps {
  noticiaActual: DetalleNoticia | null;
  onCerrar: () => void;
  onGuardar: () => void; // recarga noticias después de guardar
  show: boolean;
}

const EditarNoticia: React.FC<EditarNoticiaProps> = ({ noticiaActual, onCerrar, onGuardar, show }) => {
  const [name, setName] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (noticiaActual) {
      setName(noticiaActual.titulo);
      setDescripcion(noticiaActual.contenido);
      setFoto(null);
    } else {
      setName('');
      setDescripcion('');
      setFoto(null);
    }
  }, [noticiaActual]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticiaActual) return;

    try {
      const formData = new FormData();

      if (name !== noticiaActual.titulo) {
        formData.append('name', name);
      }
      if (descripcion !== noticiaActual.contenido) {
        formData.append('descripcion', descripcion);
      }
      if (foto) {
        formData.append('foto', foto);
      }

      if (Array.from(formData.keys()).length === 0) {
        setError('No se hicieron cambios.');
        return;
      }

      await editarNoticia(noticiaActual.id, formData); // ✅ peticion real
      setError(null);
      onGuardar(); // recarga lista
      onCerrar();  // cierra modal
    } catch (err) {
      setError('Error al editar la noticia.');
    }
  };

  return (
    <Modal show={show} onHide={onCerrar} centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Editar Noticia</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-dark text-white">
          {error && <Alert variant="danger">{error}</Alert>}
          {noticiaActual ? (
            <>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) setFoto(file);
                  }}
                  className="bg-secondary text-white"
                />
                {noticiaActual.imagen && !foto && (
                  <Form.Text className="text-muted">
                    Foto actual: {noticiaActual.imagen.split('/').pop()}
                  </Form.Text>
                )}
                {foto && (
                  <Form.Text className="text-muted">
                    Nueva foto: {foto.name}
                  </Form.Text>
                )}
              </Form.Group>
            </>
          ) : (
            <p>Seleccione una noticia para editar.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditarNoticia;
