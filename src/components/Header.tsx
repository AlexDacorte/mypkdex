import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: 'Browse', icon: 'mdi:pokeball' },
  { path: '/favorites', label: 'Favorites', icon: 'mdi:heart' },
  { path: '/compare', label: 'Compare', icon: 'mdi:scale-balance' },
  { path: '/team', label: 'Team', icon: 'mdi:account-group' },
];

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const goToRandom = () => {
    const id = Math.floor(Math.random() * 1025) + 1;
    navigate(`/pokemon/${id}`);
  };

  return (
    <header className="glass-strong sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <Icon icon="mdi:pokeball" className="w-7 h-7 text-destructive" />
          <span className="font-bold text-xl tracking-tight">Pokédex</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon icon={item.icon} className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={goToRandom}
            className="ml-1 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Random Pokémon"
          >
            <Icon icon="mdi:dice-5" className="w-5 h-5" />
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-1 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Icon icon={theme === 'dark' ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'} className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
