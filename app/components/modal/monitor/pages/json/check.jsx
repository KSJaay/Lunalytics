// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';
import Dropdown from '../../../../ui/dropdown';
import useDropdown from '../../../../../hooks/useDropdown';

const JsonChecks = [
  { id: '==', value: 'Equals' },
  { id: '!=', value: "Doesn't equal" },
  { id: '>', value: 'Is greater than' },
  { id: '>=', value: 'Is great than or equals' },
  { id: '<', value: 'Is less than' },
  { id: '<=', value: 'Is less than or equals' },
  { id: 'contains', value: 'Contains' },
  { id: 'not_contains', value: 'Does not contain' },
];

const MonitorJsonQueryCheck = ({ inputs, errors, handleInput }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown(
    true,
    JsonChecks[0].id
  );

  const json_query = inputs.json_query?.[0] || {};

  const json_operator =
    JsonChecks.find((check) => check.id === json_query.operator) ||
    JsonChecks[0];

  return (
    <div>
      <label className="input-label">JSON Check</label>
      <div className="input-short-description">
        JSON check expects a valid{' '}
        <a
          href="https://jsonata.org/"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--primary-700)' }}
        >
          jsonata
        </a>{' '}
        syntax to check the response body.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Input
          placeholder="$.body.name"
          onChange={(e) =>
            handleInput('json_query', [
              {
                key: e.target.value,
                operator: json_query.operator,
                value: json_query.value,
              },
            ])
          }
          value={json_query.key}
        />
        <Dropdown.Container
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          <Dropdown.Trigger
            asInput
            isOpen={dropdownIsOpen}
            toggleDropdown={toggleDropdown}
            id="http-json-dropdown"
          >
            {json_operator?.value}
          </Dropdown.Trigger>
          <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
            {JsonChecks.map((check) => (
              <Dropdown.Item
                key={check.id}
                onClick={() =>
                  handleInput('json_query', [
                    {
                      key: json_query.key,
                      operator: check.id,
                      value: json_query.value,
                    },
                  ])
                }
                showDot
                isSelected={json_query.operator === check.id}
              >
                {check.value}
              </Dropdown.Item>
            ))}
          </Dropdown.List>
        </Dropdown.Container>
        <Input
          placeholder="$.body.name"
          onChange={(e) =>
            handleInput('json_query', [
              {
                key: json_query.key,
                operator: json_query.operator,
                value: e.target.value,
              },
            ])
          }
          value={json_query.value}
        />
      </div>
      {errors.json_query && (
        <label className="input-error" id="text-input-http-json-error">
          {errors.json_query}
        </label>
      )}
    </div>
  );
};

MonitorJsonQueryCheck.displayName = 'MonitorJsonQueryCheck';

MonitorJsonQueryCheck.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorJsonQueryCheck;
