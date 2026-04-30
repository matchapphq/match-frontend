import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  CountryFlag,
  formatPhoneInput,
  getCountryDialCode,
  getPhonePlaceholder,
  PHONE_COUNTRY_ORDER,
  type PhoneCountry,
} from '../../utils/phone';

interface PhoneInputFieldProps {
  id?: string;
  name?: string;
  value: string;
  country: PhoneCountry;
  onChange: (value: string) => void;
  onCountryChange: (country: PhoneCountry) => void;
  autoComplete?: string;
  required?: boolean;
  ariaInvalid?: boolean;
  sizeClassName?: string;
  textClassName?: string;
  disabled?: boolean;
}

export function PhoneInputField({
  id,
  name,
  value,
  country,
  onChange,
  onCountryChange,
  autoComplete = 'tel',
  required = false,
  ariaInvalid = false,
  sizeClassName = 'py-3',
  textClassName = 'text-base',
  disabled = false,
}: PhoneInputFieldProps) {
  const phoneCountryPickerRef = useRef<HTMLDivElement | null>(null);
  const [isPhoneCountryMenuOpen, setIsPhoneCountryMenuOpen] = useState(false);

  useEffect(() => {
    if (!isPhoneCountryMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (phoneCountryPickerRef.current && !phoneCountryPickerRef.current.contains(event.target as Node)) {
        setIsPhoneCountryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPhoneCountryMenuOpen]);

  const wrapperClasses = ariaInvalid
    ? 'border-red-500 focus-within:ring-red-500'
    : 'border-gray-200 focus-within:ring-[#5a03cf] dark:border-gray-700';

  const handleCountryChange = (nextCountry: PhoneCountry) => {
    onCountryChange(nextCountry);
    onChange(formatPhoneInput(value, nextCountry));
    setIsPhoneCountryMenuOpen(false);
  };

  return (
    <div
      className={isPhoneCountryMenuOpen ? 'relative z-50' : 'relative'}
      ref={phoneCountryPickerRef}
    >
      <div
        className={`flex w-full items-center rounded-xl border bg-gray-50 px-4 text-gray-900 transition-all focus-within:ring-2 dark:bg-gray-800 dark:text-white ${wrapperClasses} ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => !disabled && setIsPhoneCountryMenuOpen((previousState) => !previousState)}
          className={`flex shrink-0 items-center gap-3 pr-4 text-gray-900 dark:text-white ${sizeClassName} ${textClassName} ${disabled ? 'cursor-not-allowed' : ''}`}
          disabled={disabled}
        >
          <CountryFlag country={country} />
          <span className="font-medium">{country}</span>
          <span className="text-gray-500 dark:text-gray-400">{getCountryDialCode(country)}</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${isPhoneCountryMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <div className="ml-1 flex flex-1 items-center self-stretch border-l border-gray-300 pl-4 dark:border-gray-600">
          <input
            id={id}
            name={name}
            type="tel"
            inputMode="tel"
            value={value}
            onChange={(event) => onChange(formatPhoneInput(event.target.value, country))}
            autoComplete={autoComplete}
            required={required}
            disabled={disabled}
            aria-invalid={ariaInvalid}
            className={`w-full bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white dark:placeholder:text-gray-500 disabled:cursor-not-allowed ${sizeClassName} ${textClassName}`}
            placeholder={getPhonePlaceholder(country)}
          />
        </div>
      </div>

      {isPhoneCountryMenuOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[60] min-w-[190px] rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {PHONE_COUNTRY_ORDER.map((phoneCountry) => (
            <button
              key={phoneCountry}
              type="button"
              onClick={() => handleCountryChange(phoneCountry)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${
                phoneCountry === country
                  ? 'bg-[#5a03cf]/10 text-[#5a03cf]'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <CountryFlag country={phoneCountry} />
              <span className="font-medium">{phoneCountry}</span>
              <span className="text-gray-500 dark:text-gray-400">{getCountryDialCode(phoneCountry)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
