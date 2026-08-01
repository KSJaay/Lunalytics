import { IoMdClose } from 'react-icons/io';

const Title = ({ text }: { text: string }) => {
  return (
    <div
      style={{
        paddingBottom: '8px',
        color: 'var(--font-light-color)',
      }}
    >
      {text}
    </div>
  );
};

const Item = ({
  item,
  activeItemId,
  onClick,
}: {
  item: { title: string; id: string; icon?: React.ReactNode };
  activeItemId?: string;
  onClick: () => void;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: item.id === activeItemId ? 'var(--accent-800)' : '',
        padding: '10px',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {item?.icon}
      {item.title}
    </div>
  );
};

const MenuSidePanel = ({
  items,
  activeItemId,
  onItemClick,
  isMobile,
  activeItemTitle,
  closeSettings,
}: {
  items: Array<{
    title: string;
    items: Array<{ title: string; id: string; icon?: React.ReactNode }>;
  }>;
  activeItemId?: string;
  onItemClick: (id: string) => void;
  isMobile?: boolean;
  activeItemTitle?: string;
  closeSettings?: () => void;
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--accent-900)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {isMobile ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 6px',
            borderBottom: '2px solid var(--accent-600)',
          }}
        >
          {activeItemTitle || 'Settings'}
          <div onClick={closeSettings} style={{ cursor: 'pointer' }}>
            <IoMdClose size={20} />
          </div>
        </div>
      ) : null}

      {items.map((section, index) => (
        <div key={index}>
          <Title text={section.title} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {section.items.map((item, itemIndex) => (
              <Item
                key={itemIndex}
                item={item}
                activeItemId={activeItemId}
                onClick={() => onItemClick(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuSidePanel;
