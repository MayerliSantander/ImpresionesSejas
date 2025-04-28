import React from 'react';
import '../styles/_search-bar.scss';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="search-bar input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <span className="input-group-text bg-white">
        <FiSearch />
      </span>
    </div>
  );
}
