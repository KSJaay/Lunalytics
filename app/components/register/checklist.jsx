import './checklist.scss';

// import dependencies
import PropTypes from 'prop-types';

const RegisterChecklist = ({ password = '' }) => {
  const handEightCharacters = password.length >= 8;
  const hasLetter = /[a-zA-Z]+/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()-_+=]+/.test(password);

  return (
    <div style={{ margin: '15px 0 15px 3px' }}>
      <div className="check-title">Must contain at least:</div>
      <div>
        <div className="check-container">
          <input
            readOnly
            checked={handEightCharacters}
            type="checkbox"
            id="cbx2"
            className="check-input"
          />

          <label htmlFor="cbx2" className="check">
            <svg width="18px" height="18px" viewBox="0 0 18 18">
              <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
              <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>
          <div className="check-description">Eight characters</div>
        </div>

        <div className="check-container">
          <input
            readOnly
            checked={hasLetter}
            type="checkbox"
            id="cbx2"
            className="check-input"
          />

          <label htmlFor="cbx2" className="check">
            <svg width="18px" height="18px" viewBox="0 0 18 18">
              <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
              <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>
          <div className="check-description">One letter</div>
        </div>

        <div className="check-container">
          <input
            readOnly
            checked={hasNumberOrSymbol}
            type="checkbox"
            id="cbx2"
            className="check-input"
          />

          <label htmlFor="cbx2" className="check">
            <svg width="18px" height="18px" viewBox="0 0 18 18">
              <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
              <polyline points="1 9 7 14 15 4"></polyline>
            </svg>
          </label>
          <div className="check-description">One number or symbol</div>
        </div>
      </div>
    </div>
  );
};

RegisterChecklist.displayName = 'RegisterChecklist';

RegisterChecklist.propTypes = {
  password: PropTypes.string,
};

export default RegisterChecklist;
