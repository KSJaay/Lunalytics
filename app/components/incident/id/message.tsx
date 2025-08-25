import './styles.scss';

// import dependencies
import dayjs from 'dayjs';
import classNames from 'classnames';
import { MdEdit } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';

// import local files
import useContextStore from '../../../context';
import IncidentEditMessageModal from '../../modal/incident/editUpdate';
import IncidentDeleteMessageModal from '../../modal/incident/deleteMessage';

interface IncidentIdMessageProps {
  incidentId: string;
  message?: string;
  status?: string;
  createdAt?: string | null;
  incidentPosition: number;
}

const IncidentIdMessage = ({
  incidentId,
  message = '',
  status = '',
  createdAt = null,
  incidentPosition,
}: IncidentIdMessageProps) => {
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
              />
            )
          }
        >
          <MdEdit />
        </div>
        <div
          className="icon"
          onClick={() =>
            openModal(
              <IncidentDeleteMessageModal
                incidentId={incidentId}
                incidentPosition={incidentPosition}
              />
            )
          }
        >
          <FaTrashCan />
        </div>
      </div>

      <div className="iid-description">{message}</div>

      <div className="iid-footer">
        Created at{' '}
        <span>
          {createdAt
            ? dayjs(new Date(createdAt)).format('MMMM DD, YYYY HH:mm A')
            : null}
        </span>
      </div>
    </div>
  );
};

export default IncidentIdMessage;
