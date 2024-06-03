// import dependencies
import PropTypes from 'prop-types';

// import local files
import useSelect from '../../../../../hooks/useSelect';
import Select from '../../../../ui/select';
import statusCodes from '../../../../../constant/statusCodes.json';

const MonitorHttpStatusCodes = ({
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
    <>
      <label className="text-input-label">Accepted Status Codes</label>
      <Select.Container isOpen={selectIsOpen} toggleSelect={toggleSelect}>
        <Select.Trigger
          asInput
          isOpen={selectIsOpen}
          toggleSelect={toggleSelect}
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
    </>
  );
};

MonitorHttpStatusCodes.displayName = 'MonitorHttpStatusCodes';

MonitorHttpStatusCodes.propTypes = {
  selectedIds: PropTypes.array,
  handleStatusCodeSelect: PropTypes.func.isRequired,
};

export default MonitorHttpStatusCodes;
