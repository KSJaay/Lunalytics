import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Input, Preview } from '@lunalytics/ui';

// import local files
import useContextStore from '../../context';
import { filterData } from '../../../shared/utils/search';

const StatusPagePreview = ({ children }) => {
  const {
    statusStore: { allStatusPages = [], setActiveStatusPage },
  } = useContextStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!allStatusPages?.length) return [];

    const filteredStatusPages = !search
      ? allStatusPages
      : filterData(allStatusPages, search, ['settings.title', 'statusUrl']);

    return filteredStatusPages.map((statusPage) => {
      const handleOnClick = () => {
        setActiveStatusPage(statusPage.statusId);
        navigate('/status-pages');
      };

      return (
        <div
          className="navigation-preview-content"
          key={statusPage.statusId}
          onClick={handleOnClick}
        >
          <div className="navigation-preview-item">
            <div>{statusPage.settings.title}</div>
            <div className="navigation-preview-subtitle">
              {statusPage.statusUrl === 'default'
                ? '/'
                : `/status/${statusPage.statusUrl}`}
            </div>
          </div>
        </div>
      );
    });
  }, [search, JSON.stringify(allStatusPages)]);

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
        !items?.length
          ? [
              input,
              <div
                className="navigation-preview-no-items"
                key="no-status-page-preview"
              >
                No status pages found
              </div>,
            ]
          : [input].concat(items)
      }
      popupClassName="navigation-preview-container"
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
