import { listOfFonts } from '../../../app/constant/status.js';
import { StatusPageValidatorError } from '../../utils/errors.js';

const themes = ['Auto', 'Light', 'Dark'];

const isHexColor = (color) => {
  const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
  return hexRegex.test(color);
};

const isPathOrUrl = (path) => {
  const urlRegex = /^(https?:\/\/[^\s\/$.?#].[^\s]*|\/[^\s]*)$/;
  return urlRegex.test(path);
};

const homepageRegex = /^[a-zA-Z0-9_\- ]{1,64}$/;

const validateStatusSettings = ({
  font,
  theme,
  headerBackground,
  background,
  textColor,
  highlight,
  url,
  logo,
  title,
  homepageUrl,
  isPublic,
  hidePaused,
}) => {
  if (!listOfFonts.includes(font)) {
    throw new StatusPageValidatorError(
      'Invalid font style. Please select a valid font style.'
    );
  }

  if (!themes.includes(theme)) {
    throw new StatusPageValidatorError(
      'Theme should be either "Auto", "Light", or "Dark".'
    );
  }

  if (!isHexColor(headerBackground)) {
    throw new StatusPageValidatorError(
      'Header background color should be a valid hex color.'
    );
  }

  if (!isHexColor(background)) {
    throw new StatusPageValidatorError(
      'Background color should be a valid hex color.'
    );
  }

  if (!isHexColor(textColor)) {
    throw new StatusPageValidatorError(
      'Text color should be a valid hex color.'
    );
  }

  if (!isHexColor(highlight)) {
    throw new StatusPageValidatorError(
      'Highlight color should be a valid hex color.'
    );
  }

  if (url !== 'default' && !homepageRegex.test(url)) {
    throw new StatusPageValidatorError(
      'URL should be either "default" or a url path.'
    );
  }

  if (!isPathOrUrl(logo)) {
    throw new StatusPageValidatorError(
      'Logo URL should be either a path or a URL.'
    );
  }

  if (!homepageRegex.test(title)) {
    throw new StatusPageValidatorError(
      'Title should be between 1 and 64 characters. Only letters, numbers, underscores, spaces, and dashes are allowed.'
    );
  }

  if (homepageUrl && !isPathOrUrl(homepageUrl)) {
    throw new StatusPageValidatorError(
      'Homepage URL should be either a path or a URL.'
    );
  }

  if (typeof isPublic !== 'boolean') {
    throw new StatusPageValidatorError(
      'Publicly accessible should be a boolean value.'
    );
  }

  if (typeof hidePaused !== 'boolean') {
    throw new StatusPageValidatorError(
      'Hide paused monitors should be a boolean value.'
    );
  }
};

export default validateStatusSettings;
