import SvgIcon from '@/components/assist/svg-icon';
import { useFullscreen } from 'ahooks';
import { Tooltip } from 'antd';

export default function FullScreen() {
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body);

  return (
    <Tooltip
      title={isFullscreen ? '退出全屏' : '进入全屏'}
      placement="bottom"
      mouseEnterDelay={0.5}
    >
      <span onClick={toggleFullscreen}>
        {!isFullscreen ? (
          <SvgIcon name="Fullscreen" />
        ) : (
          <SvgIcon name="Minimize" />
        )}
      </span>
    </Tooltip>
  );
}
