import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Check } from 'lucide-react';

/**
 * Mobile-friendly bottom sheet picker that replaces floating Radix Select popovers.
 * Falls back to the same UX on desktop since vaul Drawer works there too.
 *
 * Props:
 *   open        boolean
 *   onOpenChange fn(bool)
 *   title       string
 *   options     string[] | { value, label }[]
 *   value       string  (currently selected value)
 *   onChange    fn(value)
 */
export default function BottomSheetPicker({ open, onOpenChange, title, options = [], value, onChange }) {
  const normalised = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  const pick = (v) => {
    onChange(v);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-card border-border/60 max-h-[70vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="font-syne text-sm text-muted-foreground uppercase tracking-wider">
            {title}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
          {normalised.map(({ value: v, label }) => (
            <button
              key={v}
              onClick={() => pick(v)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl mb-1.5 text-sm font-medium transition-all border ${
                value === v
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'border-transparent text-foreground hover:bg-muted/60'
              }`}
            >
              {label}
              {value === v && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}