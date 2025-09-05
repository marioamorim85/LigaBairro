'use client';

import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value = '',
  onChange,
  placeholder = "Selecionar data e hora",
  label,
  disabled = false
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? value.split('T')[0] : '');
  const [selectedTime, setSelectedTime] = useState(value ? value.split('T')[1]?.slice(0, 5) || '' : '');

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Get current time in HH:MM format
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      onChange(`${date}T${selectedTime}`);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      onChange(`${selectedDate}T${time}`);
    }
  };

  const formatDisplayValue = (dateTimeValue: string) => {
    if (!dateTimeValue) return placeholder;
    
    try {
      const date = new Date(dateTimeValue);
      const dateStr = date.toLocaleDateString('pt-PT', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      // Format time manually to avoid seconds and other unwanted parts
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      
      return `${dateStr}, ${timeStr}`;
    } catch {
      return placeholder;
    }
  };

  const clearSelection = () => {
    setSelectedDate('');
    setSelectedTime('');
    onChange('');
    setIsOpen(false);
  };

  const quickSelectOptions = [
    {
      label: 'Hoje à tarde (15:00)',
      getValue: () => {
        const today = new Date();
        return `${today.toISOString().split('T')[0]}T15:00`;
      }
    },
    {
      label: 'Amanhã de manhã (09:00)',
      getValue: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return `${tomorrow.toISOString().split('T')[0]}T09:00`;
      }
    },
    {
      label: 'Fim de semana (Sáb 10:00)',
      getValue: () => {
        const nextSaturday = new Date();
        const daysUntilSaturday = 6 - nextSaturday.getDay();
        nextSaturday.setDate(nextSaturday.getDate() + (daysUntilSaturday || 7));
        return `${nextSaturday.toISOString().split('T')[0]}T10:00`;
      }
    }
  ];

  const handleQuickSelect = (getValue: () => string) => {
    const dateTimeValue = getValue();
    const [date, time] = dateTimeValue.split('T');
    setSelectedDate(date);
    setSelectedTime(time);
    onChange(dateTimeValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start text-left font-normal"
      >
        <Calendar className="w-4 h-4 mr-2" />
        {formatDisplayValue(value)}
      </Button>

      {isOpen && (
        <Card className="absolute z-50 mt-1 w-full shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Quick Select Options */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Opções rápidas:</p>
                <div className="space-y-1">
                  {quickSelectOptions.map((option, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handleQuickSelect(option.getValue)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <hr />

              {/* Manual Date/Time Selection */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Selecionar manualmente:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Data</label>
                    <Input
                      type="date"
                      value={selectedDate}
                      min={today}
                      onChange={(e) => {
                        handleDateChange(e.target.value);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Hora</label>
                    <Input
                      type="time"
                      value={selectedTime}
                      min={selectedDate === today ? currentTime : undefined}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                >
                  Limpar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}