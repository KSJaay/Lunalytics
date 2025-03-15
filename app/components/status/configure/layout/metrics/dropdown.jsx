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

export default StatusConfigureLayoutMetricsDropdown;
