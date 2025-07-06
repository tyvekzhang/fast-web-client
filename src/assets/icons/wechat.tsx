import { IconProps } from './type';

export default function WeChatIcon({
  size = 24,
  color = '#07C160',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5 14C7.4 14 6.5 13.1 6.5 12C6.5 10.9 7.4 10 8.5 10C9.6 10 10.5 10.9 10.5 12C10.5 13.1 9.6 14 8.5 14ZM15.5 14C14.4 14 13.5 13.1 13.5 12C13.5 10.9 14.4 10 15.5 10C16.6 10 17.5 10.9 17.5 12C17.5 13.1 16.6 14 15.5 14Z"
        fill={color}
      />
      <path
        d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 4C7.582 4 4 7.582 4 12C4 14.396 5.05 16.575 6.75 18.15L6 20L7.85 19.25C9.425 20.95 11.604 22 14 22C18.418 22 22 18.418 22 14C22 9.582 18.418 6 14 6H12V4Z"
        fill={color}
      />
    </svg>
  );
}
