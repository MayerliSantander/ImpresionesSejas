import React from 'react';
import PropTypes from 'prop-types';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function TableRow({
  item,
  columns,
  showActions,
  onEdit,
  onDelete,
}) {
  return (
    <tr>
      {columns.map(col => (
        <td key={col.key}>
          {col.render ? col.render(item) : item[col.key]}
        </td>
      ))}
      {showActions && (
        <td>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => onEdit(item)}
            >
              <FiEdit2 />
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(item)}
            >
              <FiTrash2 />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}

TableRow.propTypes = {
  item: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  showActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

TableRow.defaultProps = {
  showActions: true,
  onEdit: () => {},
  onDelete: () => {},
};
