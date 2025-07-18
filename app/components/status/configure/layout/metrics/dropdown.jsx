// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import StatusConfigureLayoutMetricsTypeBasic from './type/basic';
import useStatusPageContext from '../../../../../context/status-page';

const StatusConfigureLayoutMetricsDropdown = ({ componentId, title }) => {
  const { getComponent } = useStatusPageContext();

  const { data: { showName, showPing } = {} } = getComponent(componentId);

  return (
    <>
      <div className="sclg-title">Graph options</div>
      <div className="sclg-container">
        <StatusConfigureLayoutMetricsTypeBasic
          showPing={showPing}
          showTitle={showName ? title : false}
        />
      </div>
    </>
  );
};

StatusConfigureLayoutMetricsDropdown.displayName =
  'StatusConfigureLayoutMetricsDropdown';

StatusConfigureLayoutMetricsDropdown.propTypes = {
  componentId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default observer(StatusConfigureLayoutMetricsDropdown);
