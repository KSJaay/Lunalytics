import { useState, type ReactNode } from 'react';

type Column<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  defaultValue?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  initialSortKey?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
  className?: string;
};

function sortData<T>(data: T[], key: keyof T, direction: 'asc' | 'desc') {
  return [...data].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;

    return 0;
  });
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  initialSortKey,
  initialSortDirection = 'asc',
  className = '',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | undefined>(initialSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    initialSortDirection
  );

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = sortKey ? sortData(data, sortKey, sortDirection) : data;

  return (
    <div className={`monitor-uptime-container ${className}`}>
      <div className="monitor-uptime-header-container">
        {columns.map((col) => (
          <div key={String(col.key)} className="monitor-uptime-header">
            {col.sortable ? (
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                  cursor: 'pointer',
                  color: 'inherit',
                }}
                onClick={() => handleSort(col.key)}
                aria-label={`Sort by ${col.label}`}
              >
                {col.label}
                {sortKey === col.key ? (
                  <span style={{ marginLeft: 6 }}>
                    {sortDirection === 'asc' ? '◮' : '⧨'}
                  </span>
                ) : null}
              </button>
            ) : (
              col.label
            )}
          </div>
        ))}
      </div>
      {sortedData.map((row, rowIdx) => (
        <div className="monitor-uptime-content" key={rowIdx}>
          {columns.map((col) =>
            col.render ? (
              col.render(row[col.key], row)
            ) : (
              <div className="monitor-uptime-info" key={String(col.key)}>
                {row[col.key] || col.defaultValue}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
}
