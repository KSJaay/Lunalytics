import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TbDownload, TbUpload, TbActivityHeartbeat } from 'react-icons/tb';

const GraphPing = ({ data }) => {
  const { t } = useTranslation();

  const { averageLatency, lowestLatency, highestLatency } = useMemo(() => {
    const sorted = [...data].sort((a, b) => a.latency - b.latency);
    const averageLatency =
      Math.floor(
        sorted.reduce((acc, curr) => acc + curr.latency, 0) / sorted.length
      ) || 0;
    const lowestLatency = sorted[0]?.latency || 0;
    const highestLatency = sorted[sorted.length - 1]?.latency || 0;

    return {
      averageLatency,
      lowestLatency,
      highestLatency,
    };
  }, [data]);

  return (
    <div className="mcgp-container">
      <div className="mcgp-item">
        <div className="mcgp-header">
          <div className="mcgp-icon">
            <TbActivityHeartbeat size={24} />
          </div>
          <div className="mcgp-title">{averageLatency} ms</div>
        </div>
        <div className="mcgp-subtitle">{t('home.monitor.graph.average')}</div>
      </div>

      <div className="mcgp-item">
        <div className="mcgp-header">
          <div className="mcgp-icon green">
            <TbDownload size={24} />
          </div>
          <div className="mcgp-title">{lowestLatency} ms</div>
        </div>
        <div className="mcgp-subtitle">{t('home.monitor.graph.minimum')}</div>
      </div>

      <div className="mcgp-item">
        <div className="mcgp-header">
          <div className="mcgp-icon red">
            <TbUpload size={24} />
          </div>
          <div className="mcgp-title">{highestLatency} ms</div>
        </div>
        <div className="mcgp-subtitle">{t('home.monitor.graph.maximum')}</div>
      </div>
    </div>
  );
};

export default GraphPing;
