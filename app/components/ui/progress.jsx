import classNames from 'classnames';
import './progress.scss';

const ProgressBar = ({ sections = 1, progress = 1 }) => {
  // create an array of divs that match the number of sections

  const sectionsArray = Array.from({ length: sections }, (_, i) => {
    const classes = classNames({
      'progress-section': i + 1 > progress,
      'progress-section-active': i + 1 === progress,
      'progress-section-complete': i + 1 < progress,
    });

    return <div key={i} className={classes}></div>;
  });

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        marginTop: '20px',
        justifyContent: 'center',
      }}
    >
      {sectionsArray}
    </div>
  );
};

export default ProgressBar;
