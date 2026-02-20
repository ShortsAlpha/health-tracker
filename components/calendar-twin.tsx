"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { addMonths, format, startOfYear } from "date-fns"

interface CalendarTwinProps {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
  yearRange?: [number, number] // [start, end] years
  activeDates?: string[] // array of 'YYYY-MM-DD' strings
}

export function CalendarTwin({
  value,
  onChange,
  className,
  yearRange = [2000, 2035],
  activeDates = [],
}: CalendarTwinProps) {
  const [view, setView] = React.useState<"month" | "year">("month")
  const [current, setCurrent] = React.useState<Date>(value ?? new Date())

  const handleSelect = (date: Date) => {
    onChange?.(date)
  }

  const goPrev = () => {
    if (view === "month") setCurrent(addMonths(current, -1))
    if (view === "year") {
      const prev = new Date(current)
      prev.setFullYear(prev.getFullYear() - 12)
      setCurrent(prev)
    }
  }

  const goNext = () => {
    if (view === "month") setCurrent(addMonths(current, 1))
    if (view === "year") {
      const next = new Date(current)
      next.setFullYear(next.getFullYear() + 12)
      setCurrent(next)
    }
  }

  const renderMonth = (month: Date) => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1)
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    const days: Date[] = []
    for (let i = 1; i <= end.getDate(); i++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), i))
    }

    return (
      <div className="w-full">
        <div className="mb-6 text-center text-xl font-medium">
          {format(month, "MMMM yyyy")}
        </div>
        <div className="grid grid-cols-7 text-sm text-muted-foreground mb-4">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="h-10 flex items-center justify-center font-semibold">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
          {Array.from({ length: start.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14" />
          ))}
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const isSelected = value && day.toDateString() === value.toDateString()
            const hasData = activeDates.includes(dateStr)

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleSelect(day)}
                className={cn(
                  "relative h-14 w-14 m-0.5 flex flex-col items-center justify-center rounded-xl text-lg font-medium transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "hover:bg-accent hover:text-foreground"
                )}
              >
                <span>{day.getDate()}</span>
                {hasData && (
                  <span className={cn(
                    "absolute bottom-2 h-1.5 w-1.5 rounded-full",
                    isSelected ? "bg-primary-foreground" : "bg-primary"
                  )} />
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderYearGrid = () => {
    const currentYear = current.getFullYear()
    const start = Math.max(yearRange[0], currentYear - (currentYear % 12))
    const years = Array.from({ length: 12 }, (_, i) => start + i)

    return (
      <div className="p-2 w-full">
        <div className="grid grid-cols-3 gap-4">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => {
                const newDate = startOfYear(current)
                newDate.setFullYear(y)
                setCurrent(newDate)
                setView("month")
              }}
              className={cn(
                "h-16 rounded-xl text-lg font-medium transition-colors",
                y === currentYear
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-foreground"
              )}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "p-6 w-[1000px] mx-auto",
        className
      )}
    >
      <div className="flex items-center justify-between mb-8 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          className="h-10 w-10 *:size-6"
        >
          <ChevronLeft />
        </Button>

        <button
          onClick={() => setView(view === "month" ? "year" : "month")}
          className="text-2xl font-bold hover:underline"
        >
          {view === "month"
            ? format(current, "MMMM yyyy")
            : `${current.getFullYear()}`}
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          className="h-10 w-10 *:size-6"
        >
          <ChevronRight />
        </Button>
      </div>

      {view === "month" ? (
        <div className="flex gap-16 px-4">
          {renderMonth(current)}
          {renderMonth(addMonths(current, 1))}
        </div>
      ) : (
        renderYearGrid()
      )}
    </div>
  )
}
