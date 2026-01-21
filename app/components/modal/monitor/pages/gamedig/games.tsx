// import local files
import useDropdown from '../../../../../hooks/useDropdown';
import useFetch from '../../../../../hooks/useFetch';
import Dropdown from '../../../../ui/dropdown';

const MonitorGameDigOptions = ({
  error,
  handleSelect,
  selectValue,
}: {
  error?: string;
  selectValue: string;
  handleSelect: (id: string, port: number) => void;
}) => {
  const {
    data,
    isLoading,
    error: fetchError,
  } = useFetch({
    url: '/api/games',
  });

  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  if (fetchError) {
    <div className="luna-input-wrapper">
      <label className="input-label">Game</label>
      <label className="luna-input-subtitle">Select game server to query</label>
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
          Error loading games, please contact support.
        </Dropdown.Trigger>
      </Dropdown.Container>

      {error && (
        <label className="input-error" id="text-input-dns-record-type-error">
          {error}
        </label>
      )}
    </div>;
  }

  if (isLoading || !data) {
    return (
      <div className="luna-input-wrapper">
        <label className="input-label">Game</label>
        <label className="luna-input-subtitle">
          Select game server to query
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
            Loading games...
          </Dropdown.Trigger>
        </Dropdown.Container>

        {error && (
          <label className="input-error" id="text-input-dns-record-type-error">
            {error}
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">Game</label>
      <label className="luna-input-subtitle">Select game server to query</label>
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
          {data?.find((game: any) => game.id === selectValue)?.n ||
            'Select a game'}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          {data?.map((game: any) => (
            <Dropdown.Item
              id={`dns-record-type-${game.id}`}
              key={game.id}
              onClick={() => {
                handleSelect(game.id, game.p);
                toggleDropdown();
              }}
            >
              {game.n}
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

MonitorGameDigOptions.displayName = 'MonitorGameDigOptions';

export default MonitorGameDigOptions;
