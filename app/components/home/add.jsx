// import local files
import { useNavigate } from 'react-router-dom';
import FaPlus from '../icons/faPlus';

// import styles
import './add.scss';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import ContextStore from '../../context';

const AddMonitor = () => {
  const navigate = useNavigate();

  const {
    userStore: { user },
  } = useContext(ContextStore);

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
