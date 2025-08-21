// import local files
import { FaCircleCheck } from '../../icons';
import classNames from 'classnames';

const colors = ['Blue', 'Purple', 'Green', 'Yellow', 'Red', 'Cyan', 'Pink'];

const SettingsPersonalisationAccent = ({ color, setColor }) => {
  return (
    <>
      <div className="settings-subtitle">Accent</div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {colors.map((colorName) => {
          const classes = classNames(
            'settings-accent-container',
            `settings-accent-${colorName.toLowerCase()}`,
            {
              'settings-accent-blue--active': color === 'Blue',
              'settings-accent-cyan--active': color === 'Cyan',
              'settings-accent-green--active': color === 'Green',
              'settings-accent-pink--active': color === 'Pink',
              'settings-accent-purple--active': color === 'Purple',
              'settings-accent-red--active': color === 'Red',
              'settings-accent-yellow--active': color === 'Yellow',
            }
          );

          return (
            <div
              key={colorName}
              className={classes}
              onClick={() => setColor(colorName)}
            >
              {color === colorName && (
                <div className="settings-theme-icon">
                  <FaCircleCheck style={{ width: '24px', height: '24px' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

SettingsPersonalisationAccent.displayName = 'SettingsPersonalisationAccent';

export default SettingsPersonalisationAccent;
