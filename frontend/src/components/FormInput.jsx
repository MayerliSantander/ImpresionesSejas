import PropTypes from 'prop-types';
import { useField } from 'formik';

export default function FormInput({ label, as = 'input', ...props }) {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div className="mb-3">
      <label htmlFor={props.id || props.name} className="form-label">{label}</label>
      {as === 'textarea' ? (
        <textarea
          className={`form-control${hasError ? ' is-invalid' : ''}`}
          {...field}
          {...props}
        />
      ) : (
        <input
          className={`form-control custom-form-input${hasError ? ' is-invalid' : ''}`}
          {...field}
          {...props}
        />
      )}
      {hasError && <div className="invalid-feedback d-block mt-1">{meta.error}</div>}
    </div>
  );
}

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  as: PropTypes.oneOf(['input', 'textarea']),
};
