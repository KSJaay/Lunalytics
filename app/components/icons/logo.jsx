// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../context';

const StatusLogo = ({ size = '250' }) => {
  const {
    globalStore: { monitors },
  } = useContextStore();

  const totalMonitors = monitors.length;
  const offlineMonitors = monitors.filter(
    (monitor = {}) => monitor.heartbeats[0]?.isDown
  ).length;

  const color = !offlineMonitors
    ? 'var(--primary-700)'
    : offlineMonitors === totalMonitors
    ? 'var(--red-700)'
    : 'var(--yellow-700)';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 512 512"
      data-bbox="25.84723441615452 0.6991222460005702 460.3055311676909 511.3008777539994"
    >
      <g transform="matrix(2.974789619445801, 0, 0, 2.974789619445801, -116.94267272949219, -406.0020751953125)">
        <g
          transform="matrix(1.9531590938568115, 0, 0, 1.9531590938568115, 27.580556869506836, 124.99699401855469)"
          fill="#343b3f"
        >
          <path
            d="M53.6 15.2c-1-4.4 2.8-8.2 7.2-7.2c2.2 0.5 4 2.3 4.5 4.5c1 4.4-2.8 8.2-7.2 7.2C55.9 19.2 54.1 17.4 53.6 15.2z M77.2 71.3  c-3.4-0.5-6.2 2.4-5.7 5.7c0.3 2.1 2 3.8 4.1 4.1c3.4 0.5 6.2-2.4 5.7-5.7C81.1 73.4 79.3 71.6 77.2 71.3z M50.2 42.5  c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5s7.5-3.4 7.5-7.5S54.3 42.5 50.2 42.5z M81 50c7.4 8.3 10.5 16.5 7.3 22  c-1 1.8-2.7 3.2-4.8 4.2c0-1.1-0.3-2.1-0.7-3c1.3-0.7 2.3-1.6 3-2.7c2.5-4.3-0.4-11.1-6.7-18.3c-2.9 3-6.3 5.9-10 8.6  c-0.5 4.7-1.3 9.1-2.4 13c1.1 0.2 2.2 0.4 3.2 0.6c-0.2 0.6-0.3 1.2-0.3 1.9c0 0.4 0 0.8 0.1 1.1c-1.3-0.2-2.6-0.4-3.9-0.7  C62.1 87.3 56.6 94 50.2 94c-6.4 0-11.9-6.7-15.4-17.3c-1.4 0.3-2.8 0.5-4.1 0.7c-1.8 0.2-3.5 0.3-5.1 0.3c-6.6 0-11.3-2-13.5-5.7  c-1.2-2.1-1.5-4.6-1-7.3c0.8 0.6 1.8 1 2.9 1c-0.2 1.8 0 3.5 0.8 4.8c2 3.5 7.7 4.9 15.6 3.9c1.2-0.2 2.4-0.4 3.6-0.6  c-1.1-3.9-1.9-8.3-2.4-13c-3.8-2.7-7.1-5.6-10.1-8.6c-0.8 0.9-1.6 1.9-2.3 2.8c-0.1 0.2-0.2 0.3-0.4 0.5c-0.6-0.6-1.3-1-2-1.3  c-0.1-0.3-0.1-0.4-0.2-0.7c0.9-1.2 1.8-2.3 2.8-3.5c-1-1.1-1.9-2.1-2.7-3.2C11 39.3 9.4 32.7 12.1 28c2.7-4.7 9.3-6.6 18.6-5.4  c1.3 0.2 2.7 0.4 4.1 0.7C38.2 12.7 43.8 6 50.2 6c1.6 0 3.2 0.4 4.7 1.3c-0.9 0.6-1.6 1.4-2.2 2.2C51.9 9.2 51 9 50.2 9  c-4.9 0-9.5 5.9-12.5 15c4 1 8.2 2.5 12.5 4.4c4.2-1.9 8.5-3.4 12.5-4.4c-0.3-0.8-0.6-1.7-0.9-2.5c1-0.3 1.9-0.8 2.7-1.4  c0.4 1 0.8 2.1 1.2 3.2c1.4-0.3 2.8-0.5 4.1-0.7c9.3-1.2 15.9 0.7 18.6 5.4c2.7 4.7 1.1 11.3-4.6 18.8C82.9 47.8 82 48.9 81 50z   M66.5 26.2c1.1 3.9 1.9 8.3 2.4 13c3.8 2.8 7.2 5.7 10.1 8.6c0.8-0.9 1.6-1.9 2.3-2.8c4.8-6.3 6.4-12 4.4-15.5  c-1.6-2.8-5.5-4.2-10.9-4.2c-1.4 0-3 0.1-4.7 0.3C68.9 25.7 67.7 25.9 66.5 26.2z M53.8 30.1c2 1 4 2.1 6 3.2c2 1.2 3.9 2.3 5.7 3.6  c-0.5-3.6-1.2-6.9-2-10C60.4 27.7 57.1 28.7 53.8 30.1z M66 40.8c-2.4-1.7-5-3.4-7.7-5c-2.7-1.6-5.4-3-8.1-4.2  c-2.7 1.2-5.4 2.7-8.1 4.2c-2.7 1.6-5.3 3.2-7.7 4.9c-0.3 3-0.4 6-0.4 9.2c0 3.1 0.2 6.2 0.4 9.2c2.4 1.7 5 3.4 7.7 4.9  c2.7 1.6 5.4 3 8.1 4.2c2.7-1.2 5.4-2.7 8.1-4.2c2.7-1.6 5.3-3.2 7.7-4.9c0.3-3 0.4-6 0.4-9.2C66.5 46.9 66.3 43.8 66 40.8z   M36.8 26.8c-0.9 3.1-1.5 6.4-2 10c1.8-1.2 3.8-2.4 5.7-3.6c2-1.1 4-2.2 6-3.2C43.2 28.7 40 27.6 36.8 26.8z M19.1 45  c0.7 0.9 1.5 1.9 2.3 2.8c2.9-3 6.3-5.9 10.1-8.6c0.5-4.7 1.3-9.1 2.4-13c-1.2-0.3-2.4-0.5-3.6-0.6c-1.7-0.2-3.2-0.3-4.7-0.3  c-5.4 0-9.3 1.5-10.9 4.2C12.6 33 14.2 38.6 19.1 45z M31.1 56.8c-0.1-2.2-0.2-4.5-0.2-6.8c0-2.3 0.1-4.6 0.2-6.8  c-2.8 2.2-5.4 4.5-7.7 6.8C25.7 52.3 28.3 54.6 31.1 56.8z M36.8 73.2c3.1-0.8 6.4-1.9 9.7-3.2c-2-1-4-2.1-6-3.2  c-2-1.1-3.9-2.3-5.7-3.6C35.3 66.7 36 70.1 36.8 73.2z M62.7 76c-4-1-8.2-2.5-12.5-4.4c-4.3 1.9-8.5 3.4-12.5 4.4  c3 9.1 7.5 15 12.5 15C55.1 91 59.6 85.1 62.7 76z M65.6 63.1c-1.8 1.2-3.8 2.4-5.7 3.6c-2 1.1-4 2.2-6 3.2c3.3 1.3 6.6 2.4 9.7 3.2  C64.4 70.1 65.1 66.7 65.6 63.1z M76.9 50c-2.2-2.3-4.8-4.6-7.7-6.8c0.1 2.2 0.2 4.5 0.2 6.8c0 2.3-0.1 4.6-0.2 6.8  C72.1 54.6 74.6 52.3 76.9 50z M13.8 63.7c2.7 0.4 5-1.9 4.6-4.6c-0.3-1.7-1.6-3.1-3.3-3.3c-2.7-0.4-5 1.9-4.6 4.6  C10.8 62.1 12.1 63.4 13.8 63.7z"
            transform="matrix(1, 0, 0, 1, 0, 0)"
            fill="#343b3f"
          ></path>
        </g>
        <path
          transform="matrix(0.16042782366275787, 0, 0, 0.16042782366275787, 117.3463363647461, 214.6293182373047)"
          data-type="circle"
          data-cx="50"
          data-cy="50"
          data-r="50"
          d="M50 50m-50 0a50 50 0 1 0 100 0a50 50 0 1 0 -100 0"
          fill={color}
        ></path>
        <path
          transform="matrix(0.08217416703701019, 0, 0, 0.08217416703701019, 172.4744415283203, 269.7574462890625)"
          fill={color}
          data-type="circle"
          data-cx="50"
          data-cy="50"
          data-r="50"
          d="M50 50m-50 0a50 50 0 1 0 100 0a50 50 0 1 0 -100 0"
        ></path>
        <path
          transform="matrix(0.11053752899169922, 0, 0, 0.11053752899169922, 138.0159454345703, 146.51744079589844)"
          fill={color}
          data-type="circle"
          data-cx="50"
          data-cy="50"
          data-r="50"
          d="M50 50m-50 0a50 50 0 1 0 100 0a50 50 0 1 0 -100 0"
        ></path>
        <path
          transform="matrix(0.06109251454472542, 0, 0, 0.06109251454472542, 52.60169982910156, 238.7217559814453)"
          fill={color}
          data-type="circle"
          data-cx="50"
          data-cy="50"
          data-r="50"
          d="M50 50m-50 0a50 50 0 1 0 100 0a50 50 0 1 0 -100 0"
        ></path>
      </g>
    </svg>
  );
};

StatusLogo.displayName = 'StatusLogo';

StatusLogo.propTypes = {
  size: PropTypes.string,
};

export default observer(StatusLogo);
