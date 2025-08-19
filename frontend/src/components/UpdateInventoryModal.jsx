import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import GenericButton from './GenericButton';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormInput from './FormInput';

const schema = Yup.object({
  quantity: Yup.number()
    .typeError('La cantidad debe ser un número.')
    .integer('La cantidad debe ser un entero.')
    .min(0, 'La cantidad debe ser mayor o igual a 0.')
    .required('La cantidad es obligatoria.'),
});

export default function UpdateInventoryModal({
  show,
  material,
  initialQuantity = 0,
  onClose,
  onSaved,
  onError,
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Formik
        enableReinitialize
        initialValues={{ quantity: Number.isFinite(initialQuantity) ? initialQuantity : 0 }}
        validationSchema={schema}
        onSubmit={async ({ quantity }, { setSubmitting, setStatus }) => {
          setStatus({ error: '' });
          try {
            await onSaved(Number(quantity));
          } catch (err) {
            const msg =
              err?.response?.data?.message ||
              err?.message ||
              'Error al actualizar inventario.';
            setStatus({ error: msg });
            onError?.(msg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>Actualizar inventario</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="mb-2">
                <strong>Material:</strong> {material.materialName} {material.type}
              </div>

              <FormInput
                label="Cantidad (≥ 0)"
                name="quantity"
                type="number"
                min="0"
                step="1"
                disabled={isSubmitting}
              />

              {status?.error && (
                <div className="alert alert-danger mt-2">{status.error}</div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <GenericButton
                variant="outline-secondary"
                onClick={onClose}
                disabled={isSubmitting}
                type="button"
              >
                Cancelar
              </GenericButton>
              <GenericButton
                variant="blue-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </GenericButton>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

UpdateInventoryModal.propTypes = {
  show: PropTypes.bool.isRequired,
  material: PropTypes.object,
  initialQuantity: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  onError: PropTypes.func,
};
