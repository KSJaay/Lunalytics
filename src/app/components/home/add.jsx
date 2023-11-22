// import local files
import FaPlus from '../icons/faPlus';

// import styles
import './add.scss';

const AddMonitor = () => {
  return (
    <div className="home-add-monitor-container">
      <div>
        <FaPlus width={50} height={50} />
      </div>
      <div className="home-add-monitor-title">Add Monitor</div>
    </div>
  );
};

export default AddMonitor;
