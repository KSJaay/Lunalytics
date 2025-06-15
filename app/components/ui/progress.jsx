import './progress.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ProgressBar = ({ sections = 1, progress = 1 }) => {
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

ProgressBar.displayName = 'ProgressBar';

ProgressBar.propTypes = {
  sections: PropTypes.number,
  progress: PropTypes.number,
};

export default ProgressBar;
