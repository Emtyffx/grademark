"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uk } from "date-fns/locale";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DateTimePicker({
  date,
  setDate,
  className,
}: DateTimePickerProps) {
  const [selectedTab, setSelectedTab] = React.useState<"date" | "time">("date");

  const handleSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      if (selectedDate) {
        const newDate = new Date(date || new Date());
        newDate.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        );
        setDate(newDate);
      }
    },
    [date, setDate],
  );

  const handleTimeChange = React.useCallback(
    (value: string, type: "hours" | "minutes") => {
      if (!date) {
        const newDate = new Date();
        if (type === "hours") {
          newDate.setHours(Number.parseInt(value, 10));
        } else {
          newDate.setMinutes(Number.parseInt(value, 10));
        }
        setDate(newDate);
        return;
      }

      const newDate = new Date(date);
      if (type === "hours") {
        newDate.setHours(Number.parseInt(value, 10));
      } else {
        newDate.setMinutes(Number.parseInt(value, 10));
      }
      setDate(newDate);
    },
    [date, setDate],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          {date ? (
            <>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PPP, p", {
                locale: uk,
              })}
            </>
          ) : (
            <>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Оберіть дату і час</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Tabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as "date" | "time")}
        >
          <div className="flex items-center justify-between px-3 pt-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="date">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Дата
              </TabsTrigger>
              <TabsTrigger value="time">
                <Clock className="mr-2 h-4 w-4" />
                Час
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="date" className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              initialFocus
            />
          </TabsContent>
          <TabsContent value="time" className="p-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="grid gap-1 text-center">
                <div className="text-sm font-medium">Години</div>
                <Select
                  value={date ? date.getHours().toString() : undefined}
                  onValueChange={(value) => handleTimeChange(value, "hours")}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1 text-center">
                <div className="text-sm font-medium">Хвилини</div>
                <Select
                  value={date ? date.getMinutes().toString() : undefined}
                  onValueChange={(value) => handleTimeChange(value, "minutes")}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
