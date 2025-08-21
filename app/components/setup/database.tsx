// import dependencies
import { Input } from '@lunalytics/ui';

// import local files
import Dropdown from '../ui/dropdown';
import useDropdown from '../../hooks/useDropdown';
import useSetupFormContext from '../../hooks/useSetup';
import setupValidators from '../../../shared/validators/setup';

const databaseTypes = {
  'better-sqlite3': { title: 'SQLite', img: 'sqlite', value: 'better-sqlite3' },
  pg: { title: 'PostgreSQL', img: 'postgresql', value: 'pg' },
};

const pgInputs = [
  {
    id: 'postgresHost',
    title: 'Postgres host',
    type: 'text',
    placeholder: 'localhost',
  },
  {
    id: 'postgresPort',
    title: 'Postgres port',
    type: 'text',
    placeholder: '5432',
  },
  {
    id: 'postgresUser',
    title: 'Postgres user',
    type: 'text',
    placeholder: 'postgres',
  },
  {
    id: 'postgresPassword',
    title: 'Postgres password',
    type: 'password',
    placeholder: 'Strong-Password',
  },
];

const DropdownItem = ({ title, img, value, handleInput, inputs }) => {
  return (
    <Dropdown.Item
      showDot
      dotColor="primary"
      onClick={() => handleInput(value)}
      isSelected={inputs['databaseType'] === value}
    >
      <img
        src={`/logo/${img}.svg`}
        alt={title}
        style={{ width: '20px', height: '20px' }}
      />
      <div>{title}</div>
    </Dropdown.Item>
  );
};

DropdownItem.displayName = 'DropdownItem';

const SetupDatabaseForm = () => {
  const { handleInput, inputs, errors, setErrors } = useSetupFormContext();
  const { dropdownIsOpen, toggleDropdown } = useDropdown(false, 'SQLite');

  const changeDatabaseType = (value) => {
    handleInput({ target: { id: 'databaseType', value } });
    toggleDropdown();
  };

  return (
    <>
      <label className="input-label">Database</label>
      <Dropdown.Container
        position="center"
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        id="setup-database-status"
      >
        <Dropdown.Trigger
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          asInput
        >
          {!inputs['databaseType'] ? 'Select Database' : null}
          {inputs['databaseType'] && databaseTypes[inputs['databaseType']] ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={`/logo/${databaseTypes[inputs['databaseType']].img}.svg`}
                alt={databaseTypes[inputs['databaseType']].title}
                style={{ width: '20px', height: '20px' }}
              />
              <div>{databaseTypes[inputs['databaseType']].title}</div>
            </div>
          ) : null}
        </Dropdown.Trigger>

        <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
          {Object.values(databaseTypes).map((type) => (
            <DropdownItem
              id="databaseType"
              key={type.value}
              title={type.title}
              img={type.img}
              value={type.value}
              handleInput={changeDatabaseType}
              inputs={inputs}
            />
          ))}
        </Dropdown.List>
      </Dropdown.Container>
      <Input
        type="text"
        id="databaseName"
        title="Database name"
        error={errors['databaseName']}
        value={inputs['databaseName'] || ''}
        onChange={handleInput}
        onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
          const nameValidator = setupValidators['databaseName'];
          if (nameValidator) {
            nameValidator(e.target.value, setErrors);
          }
        }}
        placeholder="Lunalytics"
      />

      {inputs['databaseType'] === 'pg'
        ? pgInputs.map((input) => {
            const validator = setupValidators[input.id];

            return (
              <Input
                key={input.id}
                {...input}
                error={errors[input.id]}
                onChange={handleInput}
                value={inputs[input.id] || ''}
                onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                  validator(e.target.value, setErrors)
                }
              />
            );
          })
        : null}
    </>
  );
};

SetupDatabaseForm.displayName = 'SetupDatabaseForm';

export default SetupDatabaseForm;
