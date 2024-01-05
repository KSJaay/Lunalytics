// import styles
import './input.scss';

const TextInput = ({ label, id, ...props }) => {
  return (
    <>
      {label && (
        <label className="text-input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input type="text" className="text-input" id={id} {...props} />
    </>
  );
};

export default TextInput;
