// import local files
import useStatusContext from '../../../../hooks/useConfigureStatus';
import ColorPicker from '../../../ui/colorPicker';

const StatusConfigureAppearanceColors = () => {
  const {
    settings: { headerBackground, background, textColor, highlight },
    changeValues,
  } = useStatusContext();

  return (
    <div className="scc-container">
      <div>
        <ColorPicker
          label="Header background:"
          color={headerBackground}
          onChange={(e) => changeValues({ headerBackground: e.target.value })}
          setColor={(value) => changeValues({ headerBackground: value })}
        />
      </div>

      <div>
        <ColorPicker
          label="Header text color:"
          color={textColor}
          onChange={(e) => changeValues({ textColor: e.target.value })}
          setColor={(value) => changeValues({ textColor: value })}
        />
      </div>

      <div>
        <ColorPicker
          label="Background color:"
          color={background}
          onChange={(e) => changeValues({ background: e.target.value })}
          setColor={(value) => changeValues({ background: value })}
        />
      </div>

      <div>
        <ColorPicker
          label="Highlight color:"
          color={highlight}
          onChange={(e) => changeValues({ highlight: e.target.value })}
          setColor={(value) => changeValues({ highlight: value })}
        />
      </div>
    </div>
  );
};

StatusConfigureAppearanceColors.displayName = 'StatusConfigureAppearanceColors';

StatusConfigureAppearanceColors.propTypes = {};

export default StatusConfigureAppearanceColors;
