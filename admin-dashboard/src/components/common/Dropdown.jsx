import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  ariaLabel = 'Select option',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleSelect = (option) => {
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative min-w-[170px]">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-[var(--color-bg-card)] px-4 py-3 text-left text-sm text-[var(--color-text-primary)] outline-none transition-colors dark:bg-[var(--color-dark-bg-main)] dark:text-[var(--color-text-secondary)] ${
          isOpen
            ? 'border-[var(--color-accent-gold)] ring-2 ring-[var(--color-accent-gold)]/20'
            : 'border-[var(--color-border-light)] hover:border-[var(--color-accent-gold)]'
        }`}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--color-text-secondary)] transition-transform duration-200  ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] p-1 shadow-xl dark:bg-[var(--color-dark-bg-main)] ">
          {options.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors dark:text-[var(--color-text-light)] ${
                  isSelected
                    ? 'bg-[var(--color-primary-medium)] text-[var(--color-text-light)]'
                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-input)]'
                }`}
              >
                <span>{option.label}</span>

                {isSelected && <Check className="h-4 w-4 text-[var(--color-accent-gold)]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
