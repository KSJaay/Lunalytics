// import styles
import './pill.scss';

const Pill = ({}) => {
  const pills = Array.from({ length: 16 }, (_, i) => (
    <div className="pill" key={i} />
  ));

  return <div className="pill-container">{pills}</div>;
};

export default Pill;
