const IncidentIdHeaderItem = ({ title, subtitle }) => {
  return (
    <div className="iidh-item">
      <div style={{ display: 'flex' }}>
        <div className="title">{title}</div>
      </div>
      <div className="subtitle">{subtitle}</div>
    </div>
  );
};

export default IncidentIdHeaderItem;
