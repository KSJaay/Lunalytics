import './add.scss';

// import dependencies
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

// import icons
import FaPlus from '../icons/faPlus';

// import local files
import useContextStore from '../../context';

const AddMonitor = () => {
  const navigate = useNavigate();

  const {
    userStore: { user },
  } = useContextStore();

  if (!user.canEdit) return null;

  return (
    <div
      className="home-add-monitor-container"
      onClick={() => navigate('/monitor/add')}
    >
      <div>
        <FaPlus width={50} height={50} />
      </div>
      <div className="home-add-monitor-title">Add Monitor</div>
    </div>
  );
};

export default observer(AddMonitor);
