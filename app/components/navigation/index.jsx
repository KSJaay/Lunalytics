// import styles
import './index.scss';

// import dependencies
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from '@lunalytics/ui';

// import local files
import LeftNavigation from './left';

const Navigation = ({
  children,
  leftChildren,
  onLeftClick,
  rightChildren,
  activeUrl = '/home',
  header = {},
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const { HeaderComponent, props } = header;

  return (
    <div className="navigation-container">
      <LeftNavigation activeUrl={activeUrl} />

      <main className="navigation-content">
        <div className="navigation-sidebar">
          <div className="navigation-input-container">
            <Input placeholder="Search..." />
          </div>
          <div className="navigation-monitor-items">{leftChildren}</div>

          <div className="navigation-buttons">
            <Button variant="flat" fullWidth onClick={onLeftClick}>
              Add Monitor
            </Button>
          </div>
        </div>
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
