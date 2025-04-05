import { TbDownload, TbUpload, TbActivityHeartbeat } from 'react-icons/tb';

const GraphPing = ({ data }) => {
  const sortedData = [...data].sort((a, b) => a.latency - b.latency);

  const averageLatency = Math.floor(
    sortedData.reduce((acc, curr) => acc + curr.latency, 0) / sortedData.length
  );
  const lowestLatency = sortedData[0].latency;
  const highestLatency = sortedData[sortedData.length - 1].latency;

  return (
    <div className="mcgp-container">
      <div className="mcgp-item">
        <div className="mcgp-header">
          <div className="mcgp-icon">
            <TbActivityHeartbeat size={24} />
          </div>
          <div className="mcgp-title">{averageLatency} ms</div>
        </div>
        <div className="mcgp-subtitle">Average</div>
      </div>

      <div className="mcgp-item">
        <div className="mcgp-header">
          <div className="mcgp-icon green">
            <TbDownload size={24} />
          </div>
          <div className="mcgp-title">{lowestLatency} ms</div>
        </div>
        <div className="mcgp-subtitle">Minimum</div>
      </div>

      <div className="mcgp-item">
        <div className="mcgp-header">
          <div className="mcgp-icon red">
            <TbUpload size={24} />
          </div>
          <div className="mcgp-title">{highestLatency} ms</div>
        </div>
        <div className="mcgp-subtitle">Maximum</div>
      </div>
    </div>
  );
};

export default GraphPing;
