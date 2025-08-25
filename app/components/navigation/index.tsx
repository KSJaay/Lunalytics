// import styles
import './index.scss';

// import dependencies
import { useState } from 'react';
import { Input } from '@lunalytics/ui';
import { useTranslation } from 'react-i18next';

// import local files
import LeftNavigation from './left';

interface NavigationProps {
  children: React.ReactNode;
  leftChildren?: React.ReactNode;
  leftButton: React.ReactNode;
  rightChildren?: React.ReactNode;
  activeUrl?: string;
  header: {
    HeaderComponent?: React.ComponentType<any>;
    props?: any;
  };
  handleSearchUpdate: (value: string) => void;
}

const Navigation = ({
  children,
  leftChildren,
  leftButton,
  rightChildren,
  activeUrl = '/home',
  header,
  handleSearchUpdate,
}: NavigationProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { t } = useTranslation();

  const { HeaderComponent, props } = header;

  return (
    <div className="navigation-container">
      <LeftNavigation activeUrl={activeUrl} />

      <main className="navigation-content">
        {leftChildren && (
          <div className="navigation-sidebar">
            <div className="navigation-input-container">
              <Input
                placeholder={t('common.search') + '...'}
                key="search"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSearchUpdate(e.target.value?.trim())
                }
              />
            </div>
            {leftChildren}

            {leftButton && (
              <div className="navigation-buttons">{leftButton}</div>
            )}
          </div>
        )}
        <div className="navigation-header">
          {HeaderComponent ? (
            <HeaderComponent
              {...props}
              isInfoOpen={isInfoOpen}
              setIsInfoOpen={setIsInfoOpen}
              rightChildren={!!rightChildren}
            />
          ) : null}
          <div className="navigation-children">{children}</div>
        </div>

        {rightChildren ? (
          <div
            className={`navigation-sidebar-right ${
              isInfoOpen ? 'open' : 'closed'
            }`}
          >
            {rightChildren}
          </div>
        ) : null}
      </main>
    </div>
  );
};

Navigation.displayName = 'Navigation';

export default Navigation;
