import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { Input, Preview } from '@lunalytics/ui';

// import local files
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StatusPagePreview = ({ children }) => {
  const {
    statusStore: { allStatusPages = [], setActiveStatusPage },
  } = useContextStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!allStatusPages?.length) return [];

    return allStatusPages
      .filter((statusPage) => {
        if (search) {
          const lowercaseSearch = search?.toLowerCase() || '';
          return (
            statusPage?.statusUrl?.toLowerCase()?.includes(lowercaseSearch) ||
            statusPage?.settings?.title
              ?.toLowerCase()
              ?.includes(lowercaseSearch)
          );
        }
        return true;
      })
      .map((statusPage) => {
        return (
          <div
            className="status-page-preview-content"
            key={statusPage.statusId}
            onClick={() => {
              navigate('/status-pages');
              setActiveStatusPage(statusPage.statusId);
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>{statusPage.settings.title}</div>
              <div
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--font-light-color)',
                }}
              >
                {statusPage.statusUrl === 'default'
                  ? '/'
                  : `/status/${statusPage.statusUrl}`}
              </div>
            </div>
          </div>
        );
      });
  }, [search, JSON.stringify(allStatusPages)]);

  if (!items.length) return children;

  const input = (
    <Input
      placeholder="Search monitors..."
      onChange={(event) => {
        setSearch(event.target.value?.trim() || '');
      }}
    />
  );

  return (
    <Preview
      items={
        items.length > 0
          ? [input, ...items]
          : [
              input,
              <div
                style={{
                  padding: '3rem 0',
                  textAlign: 'center',
                  color: 'var(--font-light-color)',
                }}
                key="no-status-page-preview"
              >
                No status pages found
              </div>,
            ]
      }
      popupClassName="status-page-preview-container"
    >
      {children}
    </Preview>
  );
};

StatusPagePreview.displayName = 'StatusPagePreview';

StatusPagePreview.propTypes = {
  children: PropTypes.node.isRequired,
};

export default observer(StatusPagePreview);
