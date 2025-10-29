import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useColors } from '../hooks/useColors';

interface CustomCalendarProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
}

export default function CustomCalendar({ value, onChange, label, id }: CustomCalendarProps) {
  const { isFireflyMode, tokens } = useTheme();
  const colors = useColors();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const selectedDate = value ? new Date(value + 'T00:00:00') : null;

  const [currentMonth, setCurrentMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    onChange(`${year}-${month}-${dayStr}`);
    setIsOpen(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isSelectedDate = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label
        htmlFor={id}
        className="block text-xs tracking-wider mb-2 uppercase font-medium"
        style={{ color: colors.text.secondary }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          value={formatDisplayDate(value)}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 pr-12 border focus:outline-none focus:border-[#d4af37] transition-colors ${tokens.transitions.colorChange} text-sm cursor-pointer placeholder:text-sm`}
          style={{
            borderColor: colors.borders.secondary,
            backgroundColor: isFireflyMode ? '#1e2440' : colors.backgrounds.cardAlt,
            color: colors.text.primary,
          }}
          placeholder="Select date"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37] hover:text-[#c4a037] transition-colors"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {isOpen && (
        <div className={`absolute z-[100] mt-2 w-full border-2 border-[#d4af37] shadow-2xl p-4 frosted-glass`}
          style={{ backgroundColor: isFireflyMode ? 'rgba(37, 43, 74, 0.95)' : 'rgba(253, 252, 248, 0.95)' }}>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded hover:bg-[#d4af37]/10 transition-colors"
              style={{ color: colors.text.primary }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium tracking-wider" style={{ color: colors.text.primary }}>
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded hover:bg-[#d4af37]/10 transition-colors"
              style={{ color: colors.text.primary }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center text-xs font-medium py-2"
                style={{ color: colors.text.secondary }}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div key={index}>
                {day ? (
                  <button
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={`w-full aspect-square flex items-center justify-center text-sm rounded transition-all ${
                      isSelectedDate(day)
                        ? 'bg-[#d4af37] text-[#2c2416] font-bold scale-105 shadow-md'
                        : isToday(day)
                        ? 'text-[#d4af37] font-medium border border-[#d4af37]'
                        : 'hover:text-[#d4af37]'
                    }`}
                  >
                    {day}
                  </button>
                ) : (
                  <div className="w-full aspect-square" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t text-xs text-center" style={{ borderColor: colors.borders.secondary, color: colors.text.secondary }}>
            {value ? formatDisplayDate(value) : 'No date selected'}
          </div>
        </div>
      )}
    </div>
  );
}
