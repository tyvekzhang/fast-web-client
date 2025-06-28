import SvgIcon from '@/components/svg-icon';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layout-store';

export default function FoldTrigger() {
  const { collapsed, toggleCollapsed } = useLayoutStore();

  return (
    <span
      className={cn(
        'flex h-12 cursor-pointer align-middle items-center justify-start',
        !collapsed && 'rotate-180',
      )}
      onClick={toggleCollapsed}
    >
      <SvgIcon name="Columns2" size="lg" className="text-gray-600" />
    </span>
  );
}
