// import dependencies
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import { PiDotsSixVerticalBold } from '../../../../icons';
import useStatusPageContext from '../../../../../context/status-page';

const StatusConfigureLayoutHeaderLogo = ({ componentId }) => {
  const {
    settings: { textColor, title = 'Lunalytics', logo = '/logo.svg' },
    getComponent,
    layoutItems,
  } = useStatusPageContext();

  const {
    title: { showLogo, showTitle, logoSize, rotation, titleSize, alignment },
  } = useMemo(
    () => getComponent(componentId),
    [componentId, JSON.stringify(layoutItems)]
  );

  return (
    <div data-swapy-item="title" className="sclh-logo-container">
      <div className={`sclh-logo-content ${rotation} ${alignment}`}>
        {showLogo ? (
          <div className={`sclh-logo-image ${logoSize}`}>
            <img src={logo} alt="logo" />
          </div>
        ) : null}

        {showTitle ? (
          <div
            className={`sclh-logo-title ${titleSize}`}
            style={{ color: textColor }}
          >
            {title}
          </div>
        ) : null}
      </div>

      {showTitle || showLogo ? (
        <div className="sclh-title-handle-button">
          <PiDotsSixVerticalBold style={{ width: '24px', height: '24px' }} />
        </div>
      ) : null}
    </div>
  );
};

StatusConfigureLayoutHeaderLogo.displayName = 'StatusConfigureLayoutHeaderLogo';

StatusConfigureLayoutHeaderLogo.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default observer(StatusConfigureLayoutHeaderLogo);
