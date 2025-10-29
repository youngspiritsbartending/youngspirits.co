import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useColors } from '../hooks/useColors';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
}

export default function TimePicker({ value, onChange, label, id }: TimePickerProps) {
  const { isFireflyMode, tokens } = useTheme();
  const colors = useColors();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateTimeOptions = () => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        times.push(timeStr);
      }
    }
    return times;
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hour, min] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${String(min).padStart(2, '0')} ${period}`;
  };

  const parseInput = (input: string) => {
    const cleaned = input.trim().toLowerCase();

    const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
    if (!match) return null;

    let hour = parseInt(match[1]);
    const min = match[2] ? parseInt(match[2]) : 0;
    const period = match[3];

    if (hour < 0 || hour > 23 || min < 0 || min >= 60) return null;

    if (period) {
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
    } else if (hour >= 1 && hour <= 11) {
      hour += 12;
    }

    const roundedMin = Math.round(min / 30) * 30;
    const finalMin = roundedMin === 60 ? 0 : roundedMin;
    const finalHour = roundedMin === 60 ? (hour + 1) % 24 : hour;

    return `${String(finalHour).padStart(2, '0')}:${String(finalMin).padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsed = parseInput(inputValue);
    if (parsed) {
      onChange(parsed);
      setInputValue(parsed);
    } else {
      setInputValue(value);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const parsed = parseInput(inputValue);
      if (parsed) {
        onChange(parsed);
        setInputValue(parsed);
        setIsOpen(false);
      }
    }
  };

  const handleTimeSelect = (time: string) => {
    onChange(time);
    setInputValue(time);
    setIsOpen(false);
  };

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen && scrollContainerRef.current && value) {
      setTimeout(() => {
        if (!scrollContainerRef.current) return;
        const timeOptions = generateTimeOptions();
        const selectedIndex = timeOptions.findIndex(time => time === value);

        if (selectedIndex !== -1) {
          const itemHeight = 36;
          const containerHeight = scrollContainerRef.current.clientHeight;
          const scrollPosition = (selectedIndex * itemHeight) - (containerHeight / 2) + (itemHeight / 2);

          scrollContainerRef.current.scrollTop = Math.max(0, scrollPosition);
        }
      }, 0);
    }
  }, [isOpen, value]);

  const timeOptions = generateTimeOptions();

  return (
    <div ref={dropdownRef} className="relative">
      <label htmlFor={id} className="block text-xs tracking-wider mb-2 uppercase font-medium" style={{ color: colors.text.secondary }}>
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          value={formatTime(inputValue)}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onClick={handleInputClick}
          className={`w-full px-4 py-3 pr-12 border focus:outline-none focus:border-[#d4af37] transition-colors ${tokens.transitions.colorChange} text-sm cursor-pointer placeholder:text-sm`}
          style={{
            borderColor: colors.borders.secondary,
            backgroundColor: isFireflyMode ? '#1e2440' : colors.backgrounds.cardAlt,
            color: colors.text.primary,
          }}
          placeholder="5:00 PM"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37] hover:text-[#c4a037] transition-colors"
        >
          <Clock className="w-5 h-5" />
        </button>
      </div>

      {isOpen && (
        <div
          ref={scrollContainerRef}
          className={`absolute z-[100] mt-1 w-full border-2 border-[#d4af37] shadow-lg max-h-64 overflow-y-auto frosted-glass`}
          style={{ backgroundColor: isFireflyMode ? 'rgba(37, 43, 74, 0.95)' : 'rgba(253, 252, 248, 0.95)' }}
        >
          {timeOptions.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => handleTimeSelect(time)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                time === value
                  ? 'bg-[#d4af37] text-[#2c2416] font-medium'
                  : 'hover:opacity-80'
              }`}
              style={time === value ? {} : { color: colors.text.primary }}
            >
              {formatTime(time)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
