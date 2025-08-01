import { UnfoldIcon } from '@/assets/icons';
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
      <UnfoldIcon></UnfoldIcon>
    </span>
  );
}
