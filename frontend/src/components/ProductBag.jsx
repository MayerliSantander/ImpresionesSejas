import GenericButton from './GenericButton';
import { TbTrash } from "react-icons/tb";
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormInput from './FormInput';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { sendQuotation } from '../services/quotationService';
import { IoClose } from 'react-icons/io5';
import '../styles/_Bag.scss';
import { useEffect, useState } from 'react';

export default function ProductBag({ bag, onRemove, onClose, onClearBag }) {
  const [initialPhone, setInitialPhone] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('userPhone') || '';
    setInitialPhone(saved);
  }, []);

  const toE164 = (raw) => {
    if (!raw) return null;
    let s = String(raw).trim();

    s = s.replace(/^whatsapp:/i, '').trim();

    s = s.replace(/[\s().-]/g, '');

    if (s.startsWith('00')) s = '+' + s.slice(2);

    const pn = parsePhoneNumberFromString(s);
    if (!pn || !pn.isValid()) return null;

    return pn.number;
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return false;
    return !!toE164(phone);
  }
  
  const validationSchema = Yup.object().shape({
    phone: Yup.string()
      .required('El celular es obligatorio')
      .test('is-valid-phone', 'Número no válido (usa formato internacional, p.ej. +59176829374 o 00442071234567).', (value) => validatePhoneNumber(value))
  });

  const handleQuoteSubmit = async (values, {resetForm}) => {
    try {
      const dto = {
        phone: values.phone,
        bag: {
          quotationDetailDtos: bag.map(item => ({
            productId: item.productId,
            quantity: item.selectedOptions.quantity,
            materialId: item.selectedOptions.paper.id,
            activityIds: [
              item.selectedOptions.printType.id,
              ...(item.selectedOptions.finish ? [item.selectedOptions.finish.id] : [])
            ]
          }))
        }
      };
      await sendQuotation(dto);
      localStorage.setItem('userPhone', values.phone);
      alert('Cotización enviada. Nos pondremos en contacto contigo.');
      resetForm();
      onClearBag();
      onClose();
    } catch (error) {
      console.error('Error al enviar la cotización:', error);
      alert('Hubo un error al enviar la cotización.');
    }
  };

  return (
    <div 
			className="bag-modal-right"
			onClick={(e) => e.stopPropagation()}
    >
      <div className="bag-header">
        <h5 className="bag-title">Bolsa</h5>
        <GenericButton
          variant="light"
          circle
          icon={<IoClose size={20} />}
          onClick={onClose}
          className="close-button"
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
                  <div className="bag-item-name">{item.name}</div>
                  <GenericButton
                    variant="light"
                    circle
                    className="trash-button"
                    icon={<TbTrash size={18} />}
                    onClick={() => onRemove(idx)}
                  />
                </div>
                <ul className="bag-item-options">
                  {Object.entries(item.selectedOptions).map(([k, v]) => {
                    if (!v) return null;
                    const etiquetas = {
                      size: 'Tamaño',
                      quantity: 'Cantidad',
                      paper: 'Tipo de papel',
                      printType: 'Impresión',
                      finish: 'Acabado'
                    };
                    if (k === 'finish' && v === '') return null;
                    const valorVisible = typeof v === 'object' && v.label ? v.label : v;
                    return (
                      <li key={k}>
                        <strong>{etiquetas[k] || k}:</strong> {valorVisible}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          <Formik
            initialValues={{ phone: initialPhone || '' }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleQuoteSubmit}
          >
            <Form className="quote-section">
              <FormInput
                name="phone"
                type="text"
                label="Celular para cotización"
                placeholder="Ingresa tu número Ej.: +59178459374 o 00442071234567"
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
