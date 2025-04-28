import React from 'react';
import PropTypes from 'prop-types';
import '../styles/_table.scss';
import TableRow from './TableRow';

export default function Table({
  columns,
  data,
  showActions = true,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-responsive mb-3">
      <table className="table table-hover align-middle">
        <thead className="table-primary">
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.title}</th>
            ))}
            {showActions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <TableRow
              key={item.id}
              item={item}
              columns={columns}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  showActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
