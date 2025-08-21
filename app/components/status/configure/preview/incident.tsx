// import local files
import StatusIncidentBasic from '../layout/incidents/design/basic';
import StatusIncidentPretty from '../layout/incidents/design/pretty';
import StatusIncidentSimple from '../layout/incidents/design/simple';

const StatusPageIncident = ({
  incidents = '',
  design = '',
  status = '',
  size = '',
  titleSize = '',
  title = '',
}) => {
  if (status === 'Operational') {
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
        title={title}
      />
    );
  }

  return (
    <StatusIncidentSimple
      incidents={incidents}
      status={status}
      size={size}
      titleSize={titleSize}
      title={title}
    />
  );
};

StatusPageIncident.displayName = 'StatusPageIncident';

export default StatusPageIncident;
