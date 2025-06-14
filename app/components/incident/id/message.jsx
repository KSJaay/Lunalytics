import './styles.scss';

// import dependencies
import dayjs from 'dayjs';
import classNames from 'classnames';
import { BsThreeDots } from 'react-icons/bs';

// import local files
import useContextStore from '../../../context';
import IncidentEditMessageModal from '../../modal/incident/editUpdate';

const IncidentIdMessage = ({
  incidentId,
  message = '',
  status = '',
  createdAt = null,
  incidentPosition,
}) => {
  const {
    modalStore: { openModal },
  } = useContextStore();

  const classes = classNames('iid-content', status);

  return (
    <div className={classes}>
      <div className="background">
        <div className="header">
          <div className="title">{status}</div>
        </div>
        <div
          className="icon"
          onClick={() =>
            openModal(
              <IncidentEditMessageModal
                incidentId={incidentId}
                incidentPosition={incidentPosition}
              />,
              false
            )
          }
        >
          <BsThreeDots />
        </div>
      </div>

      <div className="iid-description">{message}</div>

      <div className="iid-footer">
        Created at{' '}
        <span>
          {dayjs(new Date(createdAt)).format('MMMM DD, YYYY HH:mm A')}
        </span>
      </div>
    </div>
  );
};

export default IncidentIdMessage;
