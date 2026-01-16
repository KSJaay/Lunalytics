import './loading.scss';
import '../../components/navigation/left.scss';
import '../../components/navigation/index.scss';

import { Input } from '@lunalytics/ui';
import { useTranslation } from 'react-i18next';

import LeftNavigation from '../navigation/left';

interface LoadingProps extends React.HTMLProps<HTMLDivElement> {
  asContainer?: boolean;
  maxWidth?: boolean;
  activeUrl?: string;
}

const Loading = ({
  asContainer,
  maxWidth = true,
  activeUrl = '/home',
  ...props
}: LoadingProps) => {
  const { t } = useTranslation();

  if (asContainer) {
    return (
      <div className="navigation-container">
        <LeftNavigation activeUrl={activeUrl} />

        <main className="navigation-content">
          <div className="navigation-sidebar">
            <div className="navigation-input-container">
              <Input placeholder={t('common.search') + '...'} key="search" />
            </div>
          </div>
          <div className="navigation-header">
            <div className="navigation-children">
              <div className={'loading'} {...props}>
                <img src="/logo.svg" alt="logo" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={maxWidth ? 'loading max-width' : 'loading'} {...props}>
      <img src="/logo.svg" alt="logo" />
    </div>
  );
};

export default Loading;
