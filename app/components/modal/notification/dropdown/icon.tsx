const NotificationIcon = ({ name, icon }: { name: string; icon: string }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img src={`/notifications/${icon}`} style={{ width: '22px' }} />
      <div>{name}</div>
    </div>
  );
};

NotificationIcon.displayName = 'NotificationIcon';

export default NotificationIcon;
