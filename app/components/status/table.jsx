// import node_modules
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';

// import local files
import Table from '../ui/table';

const StatusListTable = ({
  columns,
  rows,
  defaultSortKey,
  defaultSortDirection = 'asc',
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    if (defaultSortKey) {
      setSortConfig({ key: defaultSortKey, direction: 'asc' });
    }
  }, [defaultSortKey, defaultSortDirection]);

  const sortedData = [...rows].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key]?.value || b[sortConfig.key];
    const bVal = b[sortConfig.key]?.value || b[sortConfig.key];

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return sortConfig.direction === 'asc'
      ? aVal.toString().localeCompare(bVal.toString())
      : bVal.toString().localeCompare(aVal.toString());
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <FaSortAmountUp />
      ) : (
        <FaSortAmountDown />
      );
    }
    return '  ';
  };

  return (
    <Table.Container>
      <Table.Header>
        <Table.Row>
          {columns.map((column) => {
            return column.sortable === false ? (
              <Table.Head key={column.id} align={column.align}>
                {column.value}
              </Table.Head>
            ) : (
              <Table.Head
                key={column.id}
                onClick={() => handleSort(column.id)}
                className="sortable"
                align={column.align}
              >
                <div>
                  {column.value}
                  <span className="sort-icon">{renderSortIcon(column.id)}</span>
                </div>
              </Table.Head>
            );
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortedData.map((row, index) => {
          return (
            <Table.Row key={index}>
              {columns.map((column, index) => {
                const {
                  value = '',
                  component,
                  hoverable,
                  className = '',
                  ...props
                } = row[column.id] || {};

                const classes = classNames(className, {
                  hoverable,
                });

                const render = component || value;

                return (
                  <Table.Cell key={index} className={classes} {...props}>
                    {render}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Container>
  );
};

export default StatusListTable;
