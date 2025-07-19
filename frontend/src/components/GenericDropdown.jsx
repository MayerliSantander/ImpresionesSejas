import { useField } from 'formik';
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/GenericDropdown.scss';

export default function GenericDropdown({ label, options, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;
  const hasError = meta.touched && meta.error;

  const handleSelect = (option) => {
    setValue(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown w-100">
      <label className="dropdown-label body-16 mb-1">{label}</label>

      <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
        <Dropdown.Toggle
          variant="light"
          className={`custom-dropdown-toggle d-flex justify-content-between align-items-center ${isOpen ? 'open' : ''} ${hasError ? 'is-invalid' : ''}`}
        >
          <span className="paragraph-14">
            {field.value || `Seleccione ${label.toLowerCase()}`}
          </span>
          <FaChevronDown />
        </Dropdown.Toggle>

        <Dropdown.Menu className="w-100">
          {options.map((option, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => handleSelect(option)}
              active={field.value === option}
              className="paragraph-14"
            >
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {hasError && (
        <div className="error-message">{meta.error}</div>
      )}
    </div>
  );
}
