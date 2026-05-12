import { Skeleton } from '@/components/ui/skeleton';

export function PokemonCardSkeleton({ view }: { view: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <div className="glass rounded-2xl flex items-center gap-4 p-3 px-5">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-4 flex-1 max-w-[120px]" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl flex flex-col items-center p-5 pt-12">
      <Skeleton className="w-24 h-24 rounded-full" />
      <Skeleton className="h-5 w-24 mt-3" />
      <div className="flex gap-1.5 mt-2">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
    </div>
  );
}
