import { IconProps } from './type';

const GoogleIcon: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  ...props
}) => (
  <svg
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    {...props}
  >
    <path d="M998.4 465.6H524.8v139.2H864C846.4 800 686.4 884.8 534.4 884.8c-195.2 0-368-152-368-372.8 0-212.8 164.8-372.8 368-372.8C691.2 139.2 784 240 784 240l96-100.8S752 0 529.6 0C247.2 0 28.8 228 28.8 512S247.2 1024 529.6 1024c272 0 457.6-190.4 457.6-457.6 0-33.6-4.8-56.8-4.8-56.8z" />
  </svg>
);

export default GoogleIcon;
