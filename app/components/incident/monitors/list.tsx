import { observer } from 'mobx-react-lite';
import useContextStore from '../../../context';

const IncidentMonitorsList = ({ selectedMonitors, handleSelected }) => {
  const {
    globalStore: { allMonitors },
  } = useContextStore();

  return (
    <div className="icml-container">
      {allMonitors.map((monitor) => (
        <div
          className="icml-item"
          key={monitor.monitorId}
          onClick={() => handleSelected(monitor.monitorId)}
        >
          <div className="icml-item-name-container">
            <div>{monitor.name}</div>
            <div className="icml-item-url">{monitor.url}</div>
          </div>
          <input
            className="icml-item-input"
            type="checkbox"
            checked={selectedMonitors?.includes(monitor.monitorId)}
            onChange={() => handleSelected(monitor.monitorId)}
            onClick={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
          />
        </div>
      ))}
    </div>
  );
};

export default observer(IncidentMonitorsList);
