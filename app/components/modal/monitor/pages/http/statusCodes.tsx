// import local files
import useSelect from '../../../../../hooks/useSelect';
import Select from '../../../../ui/select';
import statusCodes from '../../../../../constant/statusCodes.json';

const MonitorHttpStatusCodes = ({
  error,
  selectedIds = [],
  handleStatusCodeSelect,
}) => {
  const { selectIsOpen, selectSearch, handleSearch, toggleSelect } =
    useSelect(false);

  const filteredStatusCodes = statusCodes.filter((code) =>
    code.includes(selectSearch)
  );

  const monitorStatusCodes = Array.isArray(selectedIds) ? selectedIds : [];

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">Accepted Status Codes</label>
      <Select.Container isOpen={selectIsOpen} toggleSelect={toggleSelect}>
        <Select.Trigger
          asInput
          isOpen={selectIsOpen}
          toggleSelect={toggleSelect}
          color="var(--lunaui-accent-900)"
        >
          {monitorStatusCodes?.join(', ')}
        </Select.Trigger>
        <Select.List
          fullWidth
          isOpen={selectIsOpen}
          selectSearch={selectSearch}
          handleSearch={handleSearch}
        >
          {filteredStatusCodes.map((code) => (
            <Select.Item
              key={code}
              onClick={() => handleStatusCodeSelect(code)}
              showDot
              isSelected={monitorStatusCodes.includes(code)}
            >
              {code}
            </Select.Item>
          ))}
        </Select.List>
      </Select.Container>
      {error ? <label className="input-error">{error}</label> : null}
    </div>
  );
};

MonitorHttpStatusCodes.displayName = 'MonitorHttpStatusCodes';

export default MonitorHttpStatusCodes;
