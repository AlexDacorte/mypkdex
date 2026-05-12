import { Icon } from '@iconify/react';
import { PokemonType, TYPE_COLORS, TYPE_ICONS } from '@/lib/pokemon-types';
import { cn } from '@/lib/utils';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function TypeBadge({ type, size = 'sm', showLabel = true, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        'type-badge',
        TYPE_COLORS[type].bg,
        TYPE_COLORS[type].text,
        size === 'md' && 'px-3 py-1.5 text-sm',
        className
      )}
    >
      <Icon icon={TYPE_ICONS[type]} className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {showLabel && type}
    </span>
  );
}
