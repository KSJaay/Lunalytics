import { Trans } from 'react-i18next';
import { Dropdown, Input, PasswordInput, Textarea } from '@lunalytics/ui';

import SwitchWithText from '../../../ui/switch';

export const getNotificationComponent = (
  component,
  value: string | number | boolean,
  error: string | undefined,
  onChange: (
    value: string | number | boolean,
    key: string,
    isDataField: boolean
  ) => void,
  isEdit: boolean
) => {
  const { type, isDataField, key, options, subtitle, title, ...props } =
    component;

  if (type === 'input' || type === 'number') {
    return (
      <Input
        key={key}
        {...props}
        id={key}
        error={error}
        value={value}
        type={type === 'number' ? 'number' : 'text'}
        title={<Trans>{title}</Trans>}
        subtitle={
          subtitle && !isEdit ? (
            <>
              <Trans>{subtitle.text}</Trans>
              {subtitle.link && (
                <a
                  style={{ color: 'var(--primary-700)' }}
                  href={subtitle.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {subtitle.link}
                </a>
              )}
            </>
          ) : null
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value, key, isDataField);
        }}
      />
    );
  }

  if (type === 'password') {
    return (
      <PasswordInput
        key={key}
        {...props}
        id={key}
        value={value}
        error={error}
        title={<Trans>{title}</Trans>}
        subtitle={
          subtitle && !isEdit ? (
            <>
              <Trans>{subtitle.text}</Trans>
              {subtitle.link && (
                <a
                  style={{ color: 'var(--primary-700)' }}
                  href={subtitle.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {subtitle.link}
                </a>
              )}
            </>
          ) : null
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value, key, isDataField)
        }
      />
    );
  }

  if (type === 'switch') {
    return (
      <div style={{ padding: '1rem 0 0 0' }} id={key} key={key}>
        <SwitchWithText
          {...props}
          label={title}
          shortDescription={
            subtitle ? (
              <>
                <Trans>{subtitle.text}</Trans>
                {subtitle.link && (
                  <a
                    style={{ color: 'var(--primary-700)' }}
                    href={subtitle.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {subtitle.link}
                  </a>
                )}
              </>
            ) : null
          }
          checked={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.checked, key, isDataField)
          }
        />
      </div>
    );
  }

  if (type === 'dropdown') {
    return (
      <div className="luna-input-wrapper" id={key} key={key}>
        <label className="luna-input-title">Priority</label>
        <Dropdown
          fullWidth
          items={options.map((item) => {
            return {
              id: item.id || item.text,
              text: item.id,
              type: 'item',
              onClick: () => onChange(item.id, key, isDataField),
            };
          })}
        >
          <div style={{ width: '100%', textAlign: 'left' }}>
            {value || props.defaultValue}
          </div>
        </Dropdown>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <Textarea
        key={key}
        {...props}
        id={key}
        label={title}
        error={error}
        value={value}
        placeholder='{"Content-Type": "application/json"}'
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          onChange(e.target.value, key, isDataField);
        }}
        shortDescription={
          subtitle ? (
            <>
              <Trans>{subtitle.text}</Trans>
              {subtitle.link && (
                <a
                  style={{ color: 'var(--primary-700)' }}
                  href={subtitle.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {subtitle.link}
                </a>
              )}
            </>
          ) : null
        }
      >
        {value}
      </Textarea>
    );
  }

  if (type === 'empty') {
    return <div></div>;
  }

  return null;
};
