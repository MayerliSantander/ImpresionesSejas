import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import GenericButton from './GenericButton';

export default function ConfirmModal({
  show,
  title,
  body,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <GenericButton variant="outline-secondary" onClick={onCancel}>
          {cancelLabel}
        </GenericButton>
        <GenericButton variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </GenericButton>
      </Modal.Footer>
    </Modal>
  );
}

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
};
