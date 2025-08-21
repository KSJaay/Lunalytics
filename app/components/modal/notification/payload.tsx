import './styles.scss';

const parseJson = (value: object) => {
  const json = JSON.stringify(value, null, 2)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
};

const NotificationModalPayload = ({
  message,
}: {
  message: string | object;
}) => {
  const __html = typeof message === 'object' ? parseJson(message) : message;

  return <div className="json-format" dangerouslySetInnerHTML={{ __html }} />;
};

NotificationModalPayload.displayName = 'NotificationModalPayload';

export default NotificationModalPayload;
