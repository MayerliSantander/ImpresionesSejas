import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/GenericDropdown.scss';

export default function GenericDropdown({ label, options, value, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    if (onSelect) onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown w-100">
      <label className="dropdown-label body-16 mb-1">{label}</label>
      <Dropdown
        show={isOpen}
        onToggle={(isOpen) => setIsOpen(isOpen)}
      >
        <Dropdown.Toggle
          variant="light"
          className={`custom-dropdown-toggle d-flex justify-content-between align-items-center ${isOpen ? 'open' : ''}`}
        >
          <span className='paragraph-14'>{value || `Seleccione ${label.toLowerCase()}`}</span>
          <FaChevronDown />
        </Dropdown.Toggle>

        <Dropdown.Menu className="w-100">
          {options.map((option, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => handleSelect(option)}
              active={value === option}
							className='paragraph-14'
            >
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
