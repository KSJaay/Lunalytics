import './loading.scss';

const Loading = (props: React.HTMLProps<HTMLDivElement>) => (
  <div className="loading" {...props}>
    <img src="/logo.svg" alt="logo" />
  </div>
);

export default Loading;
