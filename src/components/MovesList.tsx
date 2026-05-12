import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { capitalize } from '@/lib/pokemon-api';
import { TypeBadge } from '@/components/TypeBadge';
import { type PokemonType, POKEMON_TYPES } from '@/lib/pokemon-types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MoveEntry {
  move: { name: string; url: string };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: { name: string };
    version_group: { name: string };
  }[];
}

interface MovesListProps {
  moves: MoveEntry[];
}

interface ParsedMove {
  name: string;
  url: string;
  level: number;
  method: string;
}

interface MoveDetail {
  name: string;
  type: { name: string };
  power: number | null;
  accuracy: number | null;
  damage_class: { name: string };
}

async function fetchMoveDetails(urls: string[]): Promise<Record<string, MoveDetail>> {
  const results: Record<string, MoveDetail> = {};
  // Fetch in batches of 20 to avoid hammering the API
  for (let i = 0; i < urls.length; i += 20) {
    const batch = urls.slice(i, i + 20);
    const responses = await Promise.all(
      batch.map(url => fetch(url).then(r => r.ok ? r.json() : null))
    );
    for (const data of responses) {
      if (data) results[data.name] = data;
    }
  }
  return results;
}

export function MovesList({ moves }: MovesListProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const categorized = useMemo(() => {
    const levelUp: ParsedMove[] = [];
    const tm: ParsedMove[] = [];
    const egg: ParsedMove[] = [];
    const tutor: ParsedMove[] = [];

    for (const m of moves) {
      const detail = m.version_group_details[m.version_group_details.length - 1];
      if (!detail) continue;

      const parsed: ParsedMove = {
        name: m.move.name,
        url: m.move.url,
        level: detail.level_learned_at,
        method: detail.move_learn_method.name,
      };

      switch (detail.move_learn_method.name) {
        case 'level-up': levelUp.push(parsed); break;
        case 'machine': tm.push(parsed); break;
        case 'egg': egg.push(parsed); break;
        case 'tutor': tutor.push(parsed); break;
      }
    }

    levelUp.sort((a, b) => a.level - b.level);
    tm.sort((a, b) => a.name.localeCompare(b.name));
    egg.sort((a, b) => a.name.localeCompare(b.name));
    tutor.sort((a, b) => a.name.localeCompare(b.name));

    return { levelUp, tm, egg, tutor };
  }, [moves]);

  const sections = [
    { key: 'levelUp', label: 'Level-Up Moves', data: categorized.levelUp, showLevel: true },
    { key: 'tm', label: 'TM / HM Moves', data: categorized.tm, showLevel: false },
    { key: 'egg', label: 'Egg Moves', data: categorized.egg, showLevel: false },
    { key: 'tutor', label: 'Tutor Moves', data: categorized.tutor, showLevel: false },
  ].filter(s => s.data.length > 0);

  // Collect all move URLs for the currently open section
  const openSectionData = sections.find(s => s.key === openSection);
  const moveUrls = useMemo(
    () => openSectionData?.data.map(m => m.url) ?? [],
    [openSectionData]
  );

  const { data: moveDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['move-details', openSection, moveUrls.length],
    queryFn: () => fetchMoveDetails(moveUrls),
    enabled: moveUrls.length > 0 && !!openSection,
    staleTime: 1000 * 60 * 30,
  });

  const toggle = (key: string) => {
    setOpenSection(prev => prev === key ? null : key);
  };

  return (
    <div className="space-y-2">
      {sections.map(section => (
        <div key={section.key} className="rounded-xl overflow-hidden border border-border/50">
          <button
            onClick={() => toggle(section.key)}
            className="w-full flex items-center justify-between px-4 py-3 bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <span className="font-medium text-sm">
              {section.label}
              <span className="ml-2 text-xs text-muted-foreground">({section.data.length})</span>
            </span>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform duration-200',
                openSection === section.key && 'rotate-180'
              )}
            />
          </button>

          {openSection === section.key && (
            <div className="max-h-80 overflow-y-auto bg-card">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card z-10">
                  <tr className="border-b border-border/50">
                    {section.showLevel && (
                      <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium w-12">Lv.</th>
                    )}
                    <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium">Move</th>
                    <th className="px-3 py-2 text-left text-xs text-muted-foreground font-medium w-20">Type</th>
                    <th className="px-3 py-2 text-center text-xs text-muted-foreground font-medium w-14">Cat.</th>
                    <th className="px-3 py-2 text-right text-xs text-muted-foreground font-medium w-14">Pwr</th>
                    <th className="px-3 py-2 text-right text-xs text-muted-foreground font-medium w-14">Acc</th>
                  </tr>
                </thead>
                <tbody>
                  {section.data.map((move, i) => {
                    const detail = moveDetails?.[move.name];
                    const isValidType = detail?.type?.name && POKEMON_TYPES.includes(detail.type.name as PokemonType);

                    return (
                      <tr
                        key={move.name}
                        className={cn(
                          'border-b border-border/30 last:border-0',
                          i % 2 === 0 ? 'bg-card' : 'bg-secondary/20'
                        )}
                      >
                        {section.showLevel && (
                          <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                            {move.level > 0 ? move.level : '—'}
                          </td>
                        )}
                        <td className="px-3 py-2 font-medium">{capitalize(move.name)}</td>
                        <td className="px-3 py-2">
                          {detailsLoading ? (
                            <Skeleton className="w-14 h-5 rounded-full" />
                          ) : isValidType ? (
                            <TypeBadge type={detail!.type.name as PokemonType} showLabel={false} />
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {detailsLoading ? (
                            <Skeleton className="w-8 h-4 mx-auto" />
                          ) : detail?.damage_class ? (
                            <span className={cn(
                              'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded',
                              detail.damage_class.name === 'physical' && 'bg-type-fighting/20 text-type-fighting',
                              detail.damage_class.name === 'special' && 'bg-type-psychic/20 text-type-psychic',
                              detail.damage_class.name === 'status' && 'bg-muted text-muted-foreground',
                            )}>
                              {detail.damage_class.name.slice(0, 3)}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-xs">
                          {detailsLoading ? (
                            <Skeleton className="w-8 h-4 ml-auto" />
                          ) : detail?.power ?? '—'}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-xs">
                          {detailsLoading ? (
                            <Skeleton className="w-8 h-4 ml-auto" />
                          ) : detail?.accuracy ? `${detail.accuracy}%` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
