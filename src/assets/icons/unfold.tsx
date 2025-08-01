import { IconProps } from './type';

const UnfoldIcon: React.FC<IconProps> = ({
  size = 20,
  color = 'currentColor',
}) => (
  <svg
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
  >
    <path d="M127.6 259h768.9c35.4 0 64.1-28.7 64.1-64.1s-28.7-64.1-64.1-64.1H127.6c-35.4 0-64.1 28.7-64.1 64.1S92.2 259 127.6 259zM896.4 765H127.6c-35.4 0-64.1 28.7-64.1 64.1s28.7 64.1 64.1 64.1h768.9c35.4 0 64.1-28.7 64.1-64.1S931.8 765 896.4 765zM127.6 576.1H512c35.4 0 64.1-28.7 64.1-64.1s-28.7-64-64.1-64H127.6c-35.4 0-64.1 28.7-64.1 64.1s28.7 64 64.1 64zM938.8 477l-159.1-88.4c-28.2-15.6-62.8 4.7-62.7 36.9v176.7c0 32.2 34.6 52.6 62.8 36.9l159.1-88.4c28.8-15.9 28.8-57.6-0.1-73.7z" />
  </svg>
);

export default UnfoldIcon;
