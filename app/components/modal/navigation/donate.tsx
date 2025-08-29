// import dependencies
import { Button, Modal } from '@lunalytics/ui';

interface NavigationDonateModalProps {
  closeModal: () => void;
}

const NavigationDonateModal = ({ closeModal }: NavigationDonateModalProps) => {
  return (
    <Modal onClose={closeModal} size="sm" height="sm">
      <div className="navigation-left-support-container">
        <div className="navigation-left-support-title">
          Support Development of Lunalytics
        </div>

        <div className="navigation-left-support-content">
          <div className="navigation-left-support-description">
            <div>
              You can purchase a supporter key to help develop Lunalytics. By
              contributing you allow us to put more time into maintaining the
              application and create new features for everyone.
            </div>

            <div>
              Payments are processed through Github Sponsors. Once a donation
              has been made retrieve your key from{' '}
              <a href="https://lunalytics.xyz/redeem">our website</a> and redeem
              it here. <a href="https://lunalytics.xyz/redeem">Learn more.</a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="navigation-left-support-price">
              <div className="navigation-left-support-price-title">
                Full Supporter
              </div>
              <div className="navigation-left-support-price-subtitle">$108</div>
              <ul className="navigation-left-support-list-item">
                <li>For unlimited users</li>
                <li>One time payment</li>
                <li>Support status</li>
              </ul>
              <Button fullWidth variant="flat" color="yellow">
                Donate
              </Button>
            </div>
            <div className="navigation-left-support-price">
              <div
                style={{
                  fontSize: 'var(--font-2xl)',
                  fontWeight: 600,
                  paddingBottom: '4px',
                }}
              >
                Limited Supporter
              </div>
              <div className="navigation-left-support-price-subtitle">$25</div>

              <ul className="navigation-left-support-list-item">
                <li>For 5 users or less</li>
                <li>One time payment</li>
                <li>Support status</li>
              </ul>

              <Button fullWidth variant="flat" color="yellow">
                Donate
              </Button>
            </div>
          </div>
        </div>

        <div className="navigation-left-support-button">
          <Button
            color="blue"
            variant="flat"
            onClick={() => {}}
            id="notification-create-button"
            as="a"
            href={`https://github.com/KSJaay/Lunalytics/releases`}
            target="_blank"
          >
            What&#39;s new?
          </Button>
        </div>
      </div>
    </Modal>
  );
};

NavigationDonateModal.displayName = 'NavigationDonateModal';

export default NavigationDonateModal;
