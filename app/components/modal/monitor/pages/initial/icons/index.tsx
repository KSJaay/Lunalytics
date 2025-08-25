// import dependencies
import MonitorIconGrid from './grid';
import { Input, Popover } from '@lunalytics/ui';

import useFetch from '../../../../../../hooks/useFetch';
import { useMemo, useState } from 'react';

const MonitorIconSelect = ({
  inputs,
  handleInput,
}: {
  inputs: any;
  handleInput: (key: string, value: any) => void;
}) => {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useFetch({
    url: '/api/icons',
  });

  const icons = useMemo(() => {
    return (
      data?.filter((icon: { u: string; n: string; f: string }) =>
        icon.n.toLowerCase().includes(search.toLowerCase())
      ) || data
    );
  }, [search, data]);

  if (isError || isLoading || !icons)
    return (
      <div className="luna-input-wrapper">
        <label className="input-label">Monitor Icon</label>
        <label className="luna-input-subtitle">
          Select an icon for your monitor
        </label>
        <Popover
          color="var(--lunaui-accent-900)"
          trigger={isError ? 'Unable to load icons' : 'Select Icon'}
        />
      </div>
    );

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">Monitor Icon</label>
      <label className="luna-input-subtitle">
        Select an icon for your monitor
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
              setSearch(e.target.value);
            }}
          />
          <div style={{ padding: '12px 0 0 5px' }}>
            The following icons are provided by{' '}
            <a
              href="https://selfh.st"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary-700)' }}
            >
              Selfh.st
            </a>
          </div>
          <MonitorIconGrid icons={icons} handleInput={handleInput} />
        </div>
      </Popover>
    </div>
  );
};

MonitorIconSelect.displayName = 'MonitorIconSelect';

export default MonitorIconSelect;
