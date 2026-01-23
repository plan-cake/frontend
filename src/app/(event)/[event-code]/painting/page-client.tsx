"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import HeaderSpacer from "@/components/header-spacer";
import MobileFooterTray from "@/components/mobile-footer-tray";
import { useAvailability } from "@/core/availability/use-availability";
import { EventRange } from "@/core/event/types";
import ActionButton from "@/features/button/components/action";
import LinkButton from "@/features/button/components/link";
import { SelfAvailabilityResponse } from "@/features/event/availability/fetch-data";
import { validateAvailabilityData } from "@/features/event/availability/validate-data";
import TimeZoneSelector from "@/features/event/components/selectors/timezone";
import { ScheduleGrid } from "@/features/event/grid";
import EventInfoDrawer, { EventInfo } from "@/features/event/info-drawer";
import { RateLimitBanner, useToast } from "@/features/system-feedback";
import useCheckMobile from "@/lib/hooks/use-check-mobile";
import { MESSAGES } from "@/lib/messages";
import { formatApiError } from "@/lib/utils/api/handle-api-error";

export default function ClientPage({
  eventCode,
  eventName,
  eventRange,
  timeslots,
  initialData,
}: {
  eventCode: string;
  eventName: string;
  eventRange: EventRange;
  timeslots: Date[];
  initialData: SelfAvailabilityResponse | null;
}) {
  const router = useRouter();

  // AVAILABILITY STATE
  const { state, setDisplayName, setTimeZone, toggleSlot } =
    useAvailability(initialData);
  const { displayName, timeZone, userAvailability } = state;

  // TOASTS AND ERROR STATES
  const isMobile = useCheckMobile();
  const { addToast, removeToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isMobile) return;

    const toastId = addToast(
      "info",
      "Hold down shift to select multiple slots at once.",
      { title: "SHIFT TIP", isPersistent: true },
    );

    return () => {
      removeToast(toastId);
    };
  }, [addToast, removeToast, isMobile]);

  const handleNameChange = useDebouncedCallback(async (displayName) => {
    if (errors.displayName) setErrors((prev) => ({ ...prev, displayName: "" }));

    if (displayName === "") {
      setErrors((prev) => ({
        ...prev,
        displayName: MESSAGES.ERROR_NAME_MISSING,
      }));
      return;
    }

    try {
      const response = await fetch("/api/availability/check-display-name/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_code: eventCode,
          display_name: displayName,
        }),
      });

      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          displayName: MESSAGES.ERROR_NAME_TAKEN,
        }));
      } else {
        setErrors((prev) => ({ ...prev, displayName: "" }));
      }
    } catch (error) {
      console.error("Error checking name availability:", error);
      addToast("error", MESSAGES.ERROR_GENERIC);
    }
  }, 300);

  // SUBMIT AVAILABILITY
  const handleSubmitAvailability = async () => {
    setErrors({}); // reset errors

    try {
      const validationErrors = await validateAvailabilityData(state);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        Object.values(validationErrors).forEach((error) =>
          addToast("error", error),
        );
        return false;
      }

      const payload = {
        event_code: eventCode,
        display_name: displayName,
        availability: Array.from(userAvailability),
        time_zone: timeZone,
      };

      const response = await fetch("/api/availability/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push(`/${eventCode}`);
        return true;
      } else {
        const body = await response.json();
        const message = formatApiError(body);

        if (response.status === 429) {
          setErrors((prev) => ({
            ...prev,
            rate_limit: message || MESSAGES.ERROR_RATE_LIMIT,
          }));
        } else {
          addToast("error", message);
        }
        return false;
      }
    } catch (error) {
      console.error("Error submitting availability:", error);
      addToast("error", MESSAGES.ERROR_GENERIC);
      return false;
    }
  };

  // BUTTONS
  const cancelButton = (
    <LinkButton
      buttonStyle="transparent"
      label={initialData?.display_name ? "Cancel Edits" : "Cancel"}
      href={`/${eventCode}`}
    />
  );
  const submitButton = (
    <ActionButton
      buttonStyle="primary"
      label={
        initialData?.display_name
          ? "Update Availability"
          : "Submit Availability"
      }
      onClick={handleSubmitAvailability}
      loadOnSuccess
    />
  );

  return (
    <div className="flex flex-col space-y-4 pl-6 pr-6">
      <HeaderSpacer />

      {/* Rate Limit Error */}
      {errors.rate_limit && (
        <RateLimitBanner>{errors.rate_limit}</RateLimitBanner>
      )}

      {/* Header and Button Row */}
      <div className="flex w-full flex-wrap justify-between md:flex-row">
        <h1 className="text-2xl">{eventName}</h1>
        <EventInfoDrawer eventRange={eventRange} timezone={timeZone} />
        <div className="hidden items-center gap-2 md:flex">
          {cancelButton}
          {submitButton}
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-12 flex h-fit flex-col gap-4 md:mb-0 md:flex-row">
        {/* Left Panel */}
        <div className="md:top-25 h-fit w-full shrink-0 space-y-4 overflow-y-auto md:sticky md:w-80">
          <div className="w-fit">
            <p
              className={`text-error text-right text-xs ${errors.displayName ? "visible" : "invisible"}`}
            >
              {errors.displayName ? errors.displayName : "Error Placeholder"}
            </p>
            Hi,{" "}
            <input
              required
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                handleNameChange(e.target.value);
              }}
              placeholder="add your name"
              className={`inline-block w-auto border-b bg-transparent px-1 focus:outline-none ${
                errors.displayName
                  ? "border-error placeholder:text-error"
                  : "border-gray-400"
              }`}
            />
            <br />
            add your availabilities here
          </div>

          {/* Desktop-only Event Info */}
          <div className="bg-panel hidden rounded-3xl p-6 md:block">
            <EventInfo eventRange={eventRange} timezone={timeZone} />
          </div>

          <div className="bg-panel rounded-3xl p-6 text-sm">
            Displaying event in
            <span className="text-accent ml-1 font-bold">
              <TimeZoneSelector
                id="timezone-select"
                value={timeZone}
                onChange={setTimeZone}
              />
            </span>
          </div>
        </div>

        {/* Right Panel */}
        <ScheduleGrid
          mode="paint"
          isWeekdayEvent={eventRange.type === "weekday"}
          timezone={timeZone}
          onToggleSlot={toggleSlot}
          userAvailability={userAvailability}
          timeslots={timeslots}
        />
      </div>

      <MobileFooterTray buttons={[cancelButton, submitButton]} />
    </div>
  );
}
