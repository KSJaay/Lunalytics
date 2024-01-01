// import local files
import { useNavigate } from 'react-router-dom';
import FaPlus from '../icons/faPlus';

// import styles
import './add.scss';

const AddMonitor = () => {
  const navigate = useNavigate();
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

export default AddMonitor;
