// import dependencies
import PropTypes from 'prop-types';
import MonitorIconGrid from './grid';
import { Input, Popover } from '@lunalytics/ui';

import useFetch from '../../../../../../hooks/useFetch';
import { useMemo, useState } from 'react';

const MonitorIconSelect = ({ inputs, handleInput }) => {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useFetch({
    url: '/api/icons',
  });

  const icons = useMemo(() => {
    return (
      data?.filter((icon) =>
        icon.n.toLowerCase().includes(search.toLowerCase())
      ) || data
    );
  }, [search, data]);

  if (isError || isLoading || !icons)
    return (
      <div className="luna-input-wrapper">
        <label className="input-label">Monitor Type</label>
        <label className="luna-input-subtitle">
          Select the type of monitor you want to setup
        </label>
        <Popover
          color="var(--lunaui-accent-900)"
          trigger={isError ? 'Unable to load icons' : 'Select Icon'}
        />
      </div>
    );

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">Monitor Type</label>
      <label className="luna-input-subtitle">
        Select the type of monitor you want to setup
      </label>
      <Popover
        color="var(--lunaui-accent-900)"
        trigger={
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              fontWeight: 500,
            }}
          >
            <img
              src={inputs?.icon?.url}
              style={{ width: '30px', height: '30px' }}
            />
            <div>{inputs?.icon?.name}</div>
          </div>
        }
      >
        <div>
          <Input
            placeholder="Search for an icon..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value.trim());
            }}
          />
          <MonitorIconGrid icons={icons} handleInput={handleInput} />
        </div>
      </Popover>
    </div>
  );
};

MonitorIconSelect.displayName = 'MonitorIconSelect';

MonitorIconSelect.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
};

export default MonitorIconSelect;
