// import styles
import './input.scss';

const TextInput = ({ label, id, ...props }) => {
  return (
    <>
      {label && (
        <label className="text-input-label" for={id}>
          {label}
        </label>
      )}
      <input type="text" className="text-input" {...props} />
    </>
  );
};

export default TextInput;
