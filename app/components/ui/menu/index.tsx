import '../../../styles/pages/settings.scss';
import './styles.scss';

import { useEffect, useMemo, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { observer } from 'mobx-react-lite';

import MenuSidePanel from './sidePanel';
import { IoArrowBack } from 'react-icons/io5';
import useModalContext from '../../../context/modal';

const Menu = observer(
  ({
    items = [],
  }: {
    items: Array<{
      title: string;
      items: Array<{
        id: string;
        title: string;
        component?: React.FC;
      }>;
    }>;
  }) => {
    const { closeSettings } = useModalContext();
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [isMobileWindow, setIsMobileWindow] = useState<boolean>(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobileWindow((prev) => {
          const isMobile = window.innerWidth < 1024;
          if (!prev && isMobile) {
            setActiveItemId(null);
          }
          return isMobile;
        });
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const backButton = () => setActiveItemId(null);

    const activeItem = useMemo(() => {
      if (isMobileWindow && !activeItemId) {
        return null;
      }

      const flatItems = items.flatMap((section) => section.items);
      return flatItems.find((i) => i.id === activeItemId) || flatItems[0];
    }, [activeItemId, items, isMobileWindow]);

    const ActiveComponent =
      activeItem?.component || (() => <div>Select an item</div>);

    return (
      <div className="menu">
        <div className="menu-container">
          <div className="menu-content">
            {isMobileWindow && activeItem ? null : (
              <MenuSidePanel
                items={items}
                activeItemId={activeItem?.id}
                onItemClick={(id) => setActiveItemId(id)}
                isMobile={isMobileWindow}
                activeItemTitle={activeItem?.title}
                closeSettings={closeSettings}
              />
            )}
            <div
              className="menu-main-content"
              style={{
                display: isMobileWindow && !activeItem ? 'none' : 'block',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 6px',
                  borderBottom: '2px solid var(--accent-600)',
                  marginBottom: '12px',
                }}
              >
                {isMobileWindow ? (
                  <div onClick={backButton} style={{ cursor: 'pointer' }}>
                    <IoArrowBack size={20} />
                  </div>
                ) : null}
                {activeItem?.title || 'Select an item'}
                <div onClick={closeSettings} style={{ cursor: 'pointer' }}>
                  <IoMdClose size={20} />
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  display: 'flex',
                }}
              >
                <ActiveComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Menu;
