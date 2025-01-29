// import dependencies
import PropTypes from 'prop-types';

// import local files
import useStatusContext from '../../../../../hooks/useConfigureStatus';
import StatusConfigureLayoutMetricsTypeBasic from './type/basic';

const StatusConfigureLayoutMetricsDropdown = ({ componentId, title }) => {
  const { getComponent } = useStatusContext();

  const { data: { showName, showPing } = {} } = getComponent(componentId);

  return (
    <>
      <div className="status-configure-layout-graph-title">Graph options</div>
      <div className="status-configure-layout-graph-container">
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

export default StatusConfigureLayoutMetricsDropdown;
