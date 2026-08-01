// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';

const recordTypes = [
  'A',
  'AAAA',
  'CAA',
  'CNAME',
  'MX',
  'NS',
  'PTR',
  'SOA',
  'SRV',
  'TXT',
];
const defaultValue = 'A';

const MonitorDnsRecordTypes = ({
  error,
  handleSelect,
  selectValue = defaultValue,
}: {
  error?: string;
  selectValue: string;
  handleSelect: (method: string) => void;
}) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">Resource Record Type</label>
      <label className="luna-input-subtitle">
        Select the DNS record type to query
      </label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="dns-record-type-dropdown"
          color="var(--lunaui-accent-900)"
        >
          {selectValue}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {recordTypes.map((recordType) => (
            <Dropdown.Item
              id={`dns-record-type-${recordType}`}
              key={recordType}
              onClick={() => {
                handleSelect(recordType);
                toggleDropdown();
              }}
            >
              {recordType}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>

      {error && (
        <label className="input-error" id="text-input-dns-record-type-error">
          {error}
        </label>
      )}
    </div>
  );
};

MonitorDnsRecordTypes.displayName = 'MonitorDnsRecordTypes';

export default MonitorDnsRecordTypes;
