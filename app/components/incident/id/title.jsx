import { useState } from 'react';
import Button from '../../ui/button';
import TextInput from '../../ui/input';

const IncidentIdTitle = ({
  title,
  isFocused,
  handleChange,
  canManageIncidents,
}) => {
  const [userInput, setUserInput] = useState(title);

  return (
    <div className="ic-header">
      {isFocused ? (
        <div className="ic-title">
          <TextInput
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            containerStyle={{ flex: 1 }}
          />
        </div>
      ) : (
        <div className="ic-title">{userInput}</div>
      )}
      {canManageIncidents && (
        <Button
          onClick={() => handleChange(userInput)}
          outline={isFocused && 'green'}
        >
          {isFocused ? 'Save' : 'Edit'}
        </Button>
      )}
    </div>
  );
};

export default IncidentIdTitle;
