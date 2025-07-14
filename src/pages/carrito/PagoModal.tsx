interface PagoModalProps {
  visible: boolean;
  onClose: () => void;
}

function PagoModal(props: PagoModalProps) {
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
            <h5 className="fw-bold mb-3">¡Pago completado exitosamente!</h5>
            <div className="checkmark-box mb-3">&#10003;</div>
            <p className="mb-0">
              Las claves para tus juegos comprados han sido enviadas a tu correo electrónico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagoModal;