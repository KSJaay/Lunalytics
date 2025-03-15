// import dependencies
import PropTypes from 'prop-types';

// import local files
import StatusIncidentBasic from '../layout/incidents/design/basic';
import StatusIncidentPretty from '../layout/incidents/design/pretty';
import StatusIncidentSimple from '../layout/incidents/design/simple';

const StatusPageIncident = ({
  incidents = '',
  incidentsStatus = '',
  design = '',
  status = '',
  size = '',
  titleSize = '',
}) => {
  if (incidentsStatus === 'Operational') {
    return null;
  }

  if (design === 'Minimal') {
    return <StatusIncidentBasic status={status} incidents={incidents} />;
  }

  if (design === 'Pretty') {
    return (
      <StatusIncidentPretty
        incidents={incidents}
        status={status}
        size={size}
        titleSize={titleSize}
      />
    );
  }

  return (
    <StatusIncidentSimple
      incidents={incidents}
      status={status}
      size={size}
      titleSize={titleSize}
    />
  );
};

StatusPageIncident.displayName = 'StatusPageIncident';

StatusPageIncident.propTypes = {
  incidents: PropTypes.array.isRequired,
  incidentsStatus: PropTypes.string.isRequired,
  design: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  titleSize: PropTypes.string.isRequired,
};

export default StatusPageIncident;
