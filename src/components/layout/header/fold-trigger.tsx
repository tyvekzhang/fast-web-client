import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layout-store';
import { Sidebar } from 'lucide-react';

export default function FoldTrigger() {
  const { collapsed, toggleCollapsed } = useLayoutStore();

  return (
    <span
      className={cn(
        'flex h-12 cursor-pointer align-middle items-center justify-start',
        collapsed && 'rotate-180',
      )}
      onClick={toggleCollapsed}
    >
      <Sidebar size={22} className="text-gray-600"></Sidebar>
    </span>
  );
}
