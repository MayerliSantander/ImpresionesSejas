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

  const selectedOption = options.find(opt => opt.id === field.value);

  const handleSelect = (option) => {
    setValue(option.id);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown w-100 mb-2">
      <label className="dropdown-label body-16 mb-2">{label}</label>

      <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
        <Dropdown.Toggle
          variant="light"
          className={`custom-dropdown-toggle d-flex justify-content-between align-items-center ${isOpen ? 'open' : ''} ${hasError ? 'is-invalid' : ''}`}
        >
          <span className="paragraph-14">
            {selectedOption ? selectedOption.label : `Seleccione ${label.toLowerCase()}`}
          </span>
          <FaChevronDown />
        </Dropdown.Toggle>

        <Dropdown.Menu className="w-100">
          {options.map((option) => (
            <Dropdown.Item
              key={option.id}
              onClick={() => handleSelect(option)}
              active={field.value === option.id}
              className="paragraph-14"
            >
              {option.label}
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
