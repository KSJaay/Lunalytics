// import styles
import './index.scss';

// import dependencies
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';
import { useTranslation } from 'react-i18next';

// import local files
import LeftNavigation from './left';

const Navigation = ({
  children,
  leftChildren,
  leftButton,
  rightChildren,
  activeUrl = '/home',
  header = {},
  handleSearchUpdate,
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { t } = useTranslation();

  const { HeaderComponent, props } = header;

  return (
    <div className="navigation-container">
      <LeftNavigation activeUrl={activeUrl} />

      <main className="navigation-content">
        {leftChildren && (
          <div className="navigation-sidebar">
            <div className="navigation-input-container">
              <Input
                placeholder={t('common.search') + '...'}
                key="search"
                onChange={(e) => handleSearchUpdate(e.target.value)}
              />
            </div>
            {leftChildren}

            {leftButton && (
              <div className="navigation-buttons">{leftButton}</div>
            )}
          </div>
        )}
        <div className="navigation-header">
          <HeaderComponent
            {...props}
            isInfoOpen={isInfoOpen}
            setIsInfoOpen={setIsInfoOpen}
            rightChildren={!!rightChildren}
          />
          <div className="navigation-children">{children}</div>
        </div>

        {rightChildren ? (
          <div
            className={`navigation-sidebar-right ${
              isInfoOpen ? 'open' : 'closed'
            }`}
          >
            {rightChildren}
          </div>
        ) : null}
      </main>
    </div>
  );
};

Navigation.displayName = 'Navigation';

Navigation.propTypes = {
  children: PropTypes.node,
  activeUrl: PropTypes.string,
};

export default Navigation;
