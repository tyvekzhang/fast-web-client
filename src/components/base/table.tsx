import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

interface Column {
  key: string;
  title: string;
}

interface ExpandableRow {
  key: string;
  data: { [key: string]: any };
  children?: ExpandableRow[];
}

interface TailwindTableProps {
  columns: Column[];
  data: ExpandableRow[];
}

const TailwindTable: React.FC<TailwindTableProps> = ({ columns, data }) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleSelection = (key: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    setSelectedRows(newSelection);
  };

  const toggleExpand = (key: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedRows(newExpanded);
  };

  const renderRow = (row: ExpandableRow, level: number = 0) => {
    return (
      <React.Fragment key={row.key}>
        <tr className={`${level > 0 ? 'bg-gray-50' : ''}`}>
          <td className="px-6 py-4 whitespace-nowrap">
            <input
              type="checkbox"
              checked={selectedRows.has(row.key)}
              onChange={() => toggleSelection(row.key)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </td>
          {row.children && (
            <td className="px-6 py-4 whitespace-nowrap">
              <button onClick={() => toggleExpand(row.key)}>
                {expandedRows.has(row.key) ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </td>
          )}
          {columns.map((column) => (
            <td key={column.key} className="px-6 py-4 whitespace-nowrap">
              {row.data[column.key]}
            </td>
          ))}
        </tr>
        {row.children && expandedRows.has(row.key) && row.children.map((child) => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Select
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Expand
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{data.map((row) => renderRow(row))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTable;
