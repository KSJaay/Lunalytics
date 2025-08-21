import { observer } from 'mobx-react-lite';

// import local files
import useStatusPageContext from '../../../../context/status-page.js';
import ColorPicker from '../../../ui/colorPicker';

const StatusConfigureAppearanceColors = () => {
  const {
    settings: { headerBackground, background, textColor, highlight },
    changeValues,
  } = useStatusPageContext();

  return (
    <div className="scc-container">
      <div>
        <ColorPicker
          label="Header background:"
          color={headerBackground}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changeValues({ headerBackground: e.target.value })
          }
          setColor={(value) => changeValues({ headerBackground: value })}
        />
      </div>

      <div>
        <ColorPicker
          label="Header text color:"
          color={textColor}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changeValues({ textColor: e.target.value })
          }
          setColor={(value) => changeValues({ textColor: value })}
        />
      </div>

      <div>
        <ColorPicker
          label="Background color:"
          color={background}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changeValues({ background: e.target.value })
          }
          setColor={(value) => changeValues({ background: value })}
        />
      </div>

      <div>
        <ColorPicker
          label="Highlight color:"
          color={highlight}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changeValues({ highlight: e.target.value })
          }
          setColor={(value) => changeValues({ highlight: value })}
        />
      </div>
    </div>
  );
};

StatusConfigureAppearanceColors.displayName = 'StatusConfigureAppearanceColors';

export default observer(StatusConfigureAppearanceColors);
