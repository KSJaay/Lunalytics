import './styles.scss';

// import dependencies
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

const StatusConfigureLayoutHistoryList = ({
  incidents = [],
  size,
  ...props
}) => {
  const incidentsList = [];

  for (let i = 0; i < size; i++) {
    const today = new Date().setHours(0, 0, 0, 0);
    const ms = today - 86400000 * i;

    const exists = incidents.filter((incident) => {
      const createdAt = new Date(incident.createdAt).getTime();
      return createdAt >= ms && createdAt < ms + 86400000;
    });

    if (!exists.length) {
      incidentsList.push({ createdAt: ms });
    } else {
      incidentsList.push(exists);
    }
  }

  return (
    <div className="sclh-container" {...props}>
      <div className="sclh-title">PAST INCIDENTS</div>

      {incidentsList.map((incident, index) => {
        if (incident.length) {
          return (
            <div key={index}>
              <div className="sclh-date">
                {dayjs(incident[0].createdAt).format('MMM DD, YYYY')}
              </div>
              {incident.map((item) => {
                return (
                  <div className="sclhi-container" key={item.incidentId}>
                    <div className="sclhi-title">{item.title}</div>
                    {item.messages
                      .map((message, index) => {
                        return (
                          <div key={index} className="sclhi-text-container">
                            <div className="sclhi-text">
                              <span className="sclhi-subtitle">
                                {message.status}
                              </span>{' '}
                              - {message.message}
                            </div>
                            <div className="sclhi-date">
                              {dayjs(message.createdAt).format('lll')}
                            </div>
                          </div>
                        );
                      })
                      .reverse()}
                  </div>
                );
              })}
            </div>
          );
        }

        return (
          <div key={index}>
            <div className="sclh-date">
              {dayjs(incident.createdAt).format('MMM DD, YYYY')}
            </div>
            <div className="sclh-subtitle">
              {!incident?.title ? 'No incidents reported.' : incident.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

StatusConfigureLayoutHistoryList.displayName =
  'StatusConfigureLayoutHistoryList';

export default StatusConfigureLayoutHistoryList;
