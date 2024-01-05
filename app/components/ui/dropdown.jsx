import './dropdown.scss';

const Dropdown = ({ label, options, ...props }) => {
  return (
    <div className="dropdown-group">
      <label className="dropdown-label">{label}</label>
      <select className="dropdown-control" {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
