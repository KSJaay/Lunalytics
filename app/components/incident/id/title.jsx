import { useState } from 'react';
import { Button, Input } from '@lunalytics/ui';

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
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="ic-title-width"
          />
        </div>
      ) : (
        <div className="ic-title">{userInput}</div>
      )}
      {canManageIncidents && (
        <Button
          color="gray"
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
