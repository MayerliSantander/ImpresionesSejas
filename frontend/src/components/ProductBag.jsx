import React from 'react';
import GenericButton from './GenericButton';
import { TbTrash } from "react-icons/tb";
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormInput from './FormInput';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { sendQuotation } from '../services/quotationService';

export default function ProductBag({ bag, onRemove, onClose, onClearBag }) {
  const handleQuoteSubmit = async (values, {resetForm}) => {
    try {
      const dto = {
        phone: values.phone,
        bag: bag.map(item => ({
          name: item.name,
          selectedOptions: item.selectedOptions
        }))
      };
      await sendQuotation(dto);
      console.log('Cotización enviada con:', { phone: values.phone, bag });
      alert('Cotización enviada. Nos pondremos en contacto contigo.');
      resetForm();
      onClearBag();
      onClose();
    } catch (error) {
      console.error('Error al enviar la cotización:', error);
      alert('Hubo un error al enviar la cotización.');
    }
  };

  const validationSchema = Yup.object().shape({
    phone: Yup.string()
      .required('El celular es obligatorio')
      .test('is-valid-phone', 'Número no válido', (value) => validatePhoneNumber(value))
  });

  const validatePhoneNumber = (phone) => {
    if (!phone) return false;
    const phoneNumber = parsePhoneNumberFromString(phone, 'BO');
    return phoneNumber && phoneNumber.isValid() && phoneNumber.country === 'BO';
  }

  return (
    <div 
			className="bag-modal-right"
			onClick={(e) => e.stopPropagation()}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="h3">Bolsa</h5>
        <GenericButton
          variant="light"
          circle
          icon={<span>&times;</span>}
          onClick={onClose}
        />
      </div>
      {bag.length === 0 ? (
        <p>La bolsa está vacía.</p>
      ) : (
        <>
          <ul className="bag-list">
            {bag.map((item, idx) => (
              <li key={idx} className="bag-item">
                <div className="bag-item-header">
                  <strong>{item.name}</strong>
                  <GenericButton
                    variant="light"
                    circle
                    className="trash-button"
                    icon={<TbTrash size={18} />}
                    onClick={() => onRemove(idx)}
                  />
                </div>
                <ul className="bag-item-options">
                  {Object.entries(item.selectedOptions).map(([k, v]) => (
                    <li key={k}>
                      {k}: {v}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <Formik
            initialValues={{ phone: '' }}
            validationSchema={validationSchema}
            onSubmit={handleQuoteSubmit}
          >
            <Form className="quote-section">
              <FormInput
                name="phone"
                type="text"
                label="Celular para cotización"
                placeholder="Ingresa tu número de celular"
              />
              <GenericButton variant="blue-primary" className="w-100" type="submit">
                Realizar cotización
              </GenericButton>
            </Form>
          </Formik>
        </>
      )}
    </div>
  );
}
