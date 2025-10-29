import { Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useColors } from '../hooks/useColors';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
}

export default function DatePicker({ value, onChange, label, id }: DatePickerProps) {
  const { isFireflyMode, tokens } = useTheme();
  const colors = useColors();

  return (
    <div>
      <label htmlFor={id} className="block text-xs tracking-wider mb-2 uppercase font-medium" style={{ color: colors.text.secondary }}>
        {label}
      </label>
      <div className="relative">
        <input
          type="date"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 pr-12 border focus:outline-none focus:border-[#d4af37] transition-colors ${tokens.transitions.colorChange} text-sm cursor-pointer ${
            isFireflyMode ? 'border-[#3a4060] bg-[#1a1f3a] text-[#f5f3ed] [color-scheme:dark]' : 'border-[#e5dcc5] bg-[#fdfcf8] text-[#2c2416] [color-scheme:light]'
          }`}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'textfield',
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37] pointer-events-none">
          <Calendar className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
