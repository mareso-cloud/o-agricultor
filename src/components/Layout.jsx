import { Outlet, Link, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, List, Sun, Moon, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const [dark, setDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/plants', icon: Leaf, label: 'Plantas' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center glow-green-sm">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-playfair font-bold text-lg gradient-text">GreenLog Pro</span>
              <p className="text-xs text-muted-foreground -mt-1 font-inter">Cultivo Indoor</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path}>
                <Button
                  variant={location.pathname === path ? 'default' : 'ghost'}
                  size="sm"
                  className={`gap-2 ${location.pathname === path ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark(!dark)}
              className="text-muted-foreground hover:text-foreground"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="flex">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link key={path} to={path} className="flex-1">
              <div className={`flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                location.pathname === path ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <Icon className="w-5 h-5" />
                {label}
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}