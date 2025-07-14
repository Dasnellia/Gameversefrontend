interface PerfilModalProps {
  visible: boolean;
  onClose: () => void;
}

const PerfilModal = (props: PerfilModalProps) => {
  if (!props.visible) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-center p-4">
          <div className="modal-header justify-content-end">
            <button
              type="button"
              className="btn-close"
              onClick={props.onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <h5 className="fw-bold mb-3 negro">¡Información actualizada correctamente!</h5>
            <div className="checkmark-box mb-3">&#10003;</div>
            <p className="mb-0 negro">
              Tu información de usuario ha sido guardada con éxito.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilModal;