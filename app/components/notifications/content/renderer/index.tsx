import { getNotificationComponent } from './components';
import * as NotificationPlatformContent from '../../../../../shared/notifications/layout/index';

const NotificationRenderer = ({
  inputs,
  errors,
  handleInput,
  isEdit = false,
}: {
  inputs: any;
  errors: any;
  handleInput: any;
  isEdit: boolean;
}) => {
  const componentOnclick = (value: any, key: string, isDataField: boolean) => {
    if (isDataField) {
      handleInput({ key: 'data', value: { ...inputs.data, [key]: value } });
    } else {
      handleInput({ key, value });
    }
  };

  const components = inputs && NotificationPlatformContent[inputs?.platform];


  if (!components) {
    return null;
  }

  const Content = components.map((component, index) => {
    if (component.type === 'group') {
      return (
        <div
          className={isEdit ? 'notification-content-container' : ''}
          key={'group-' + index}
        >
          {component.items.map((component) => {
            const value = component.isDataField
              ? inputs.data?.[component.key]
              : inputs[component.key];
            return getNotificationComponent(
              component,
              value,
              errors[component.key],
              componentOnclick,
              isEdit
            );
          })}
        </div>
      );
    }

    const value = component.isDataField
      ? inputs.data?.[component.key]
      : inputs[component.key];

    return getNotificationComponent(
      component,
      value,
      errors[component.key],
      componentOnclick,
      isEdit
    );
  });

  return Content;
};

export default NotificationRenderer;
