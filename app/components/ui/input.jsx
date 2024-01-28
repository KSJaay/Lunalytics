// import styles
import './input.scss';

const TextInput = ({ label, id, error, ...props }) => {
  return (
    <>
      {label && <label className="text-input-label">{label}</label>}
      <input type="text" className="text-input" id={id} {...props} />
      {error && <label className="text-input-error">{error}</label>}
    </>
  );
};

export default TextInput;
