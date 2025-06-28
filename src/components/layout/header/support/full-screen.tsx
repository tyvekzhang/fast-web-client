import SvgIcon from '@/components/svg-icon';
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
          <SvgIcon name="Maximize2" />
        ) : (
          <SvgIcon name="Minimize2" />
        )}
      </span>
    </Tooltip>
  );
}
