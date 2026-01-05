"use client";

import { useState } from "react";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import RateLimitBanner from "@/components/banner/rate-limit";
import HeaderSpacer from "@/components/header-spacer";
import MobileFooterTray from "@/components/mobile-footer-tray";
import SegmentedControl from "@/components/segmented-control";
import TextInputField from "@/components/text-input-field";
import { EventProvider, useEventContext } from "@/core/event/context";
import { EventRange } from "@/core/event/types";
import ActionButton from "@/features/button/components/action";
import LinkButton from "@/features/button/components/link";
import TimeSelector from "@/features/event/components/selectors/time";
import AdvancedOptions from "@/features/event/editor/advanced-options";
import DateRangeSelection from "@/features/event/editor/date-range/selector";
import { EventEditorType } from "@/features/event/editor/types";
import { validateEventData } from "@/features/event/editor/validate-data";
import ScheduleGrid from "@/features/event/grid/grid";
import GridPreviewDialog from "@/features/event/grid/preview-dialog";
import FormSelectorField from "@/features/selector/components/selector-field";
import { MESSAGES } from "@/lib/messages";
import submitEvent from "@/lib/utils/api/submit-event";
import { cn } from "@/lib/utils/classname";

type EventEditorProps = {
  type: EventEditorType;
  initialData?: {
    title: string;
    code: string;
    eventRange: EventRange;
  };
};

type SegmentedControlOption = "details" | "preview";

export default function EventEditor({ type, initialData }: EventEditorProps) {
  return (
    <EventProvider initialData={initialData}>
      <EventEditorContent type={type} initialData={initialData} />
    </EventProvider>
  );
}

function EventEditorContent({ type, initialData }: EventEditorProps) {
  const {
    state,
    setTitle,
    setCustomCode,
    setStartTime,
    setEndTime,
    errors,
    handleError,
    clearAllErrors,
    handleGenericError,
  } = useEventContext();
  const { title, customCode, eventRange } = state;
  const router = useRouter();

  const [mobileTab, setMobileTab] = useState<SegmentedControlOption>("details");

  // TOASTS AND ERROR STATES
  const handleCustomCodeChange = useDebouncedCallback(async (customCode) => {
    if (type === "edit") return;

    if (errors.customCode) handleError("customCode", "");
    if (customCode === "") {
      return;
    }

    try {
      const response = await fetch("/api/event/check-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_code: customCode }),
      });

      if (!response.ok) {
        handleError("customCode", MESSAGES.ERROR_EVENT_CODE_TAKEN);
      } else {
        setCustomCode(customCode);
      }
    } catch (error) {
      console.error("Error checking custom code availability:", error);
      handleError("api", MESSAGES.ERROR_GENERIC);
    }
  }, 300);

  // SUBMIT EVENT INFO
  const submitEventInfo = async () => {
    clearAllErrors();

    try {
      const validationErrors = await validateEventData(type, state);
      if (Object.keys(validationErrors).length > 0) {
        Object.values(validationErrors).forEach(([field, error]) => {
          handleError(field, error);
          handleError("toast", error);
        });
        return false;
      }

      const success = await submitEvent(
        { title, code: customCode, eventRange },
        type,
        eventRange.type,
        (code: string) => router.push(`/${code}`),
        handleError,
      );

      return success;
    } catch (error) {
      console.error("Submission failed:", error);
      handleGenericError();
      return false;
    }
  };

  // BUTTONS
  const cancelButton = (
    <LinkButton
      buttonStyle="transparent"
      label="Cancel Edits"
      href={`/${initialData?.code}`}
    />
  );
  const submitButton = (
    <ActionButton
      buttonStyle="primary"
      label={type === "edit" ? "Update Event" : "Create Event"}
      onClick={submitEventInfo}
      loadOnSuccess
    />
  );

  return (
    <div className="flex min-h-dvh flex-col space-y-4 pl-6 pr-6">
      <HeaderSpacer />

      {/* Rate Limit Error */}
      {errors.rate_limit && (
        <RateLimitBanner>{errors.rate_limit}</RateLimitBanner>
      )}

      <div className="-mb-1 flex w-full items-center justify-between">
        <div className="md:w-1/2">
          <TextInputField
            id={"event-name"}
            type="text"
            label="Event Name"
            value={title}
            onChange={setTitle}
            error={errors.title || errors.api}
            classname="text-2xl font-semibold"
          />
        </div>
        <div className="hidden gap-2 md:flex">
          {type === "edit" && cancelButton}
          {submitButton}
        </div>
      </div>

      <div className="md:hidden">
        <SegmentedControl
          value={mobileTab}
          onChange={setMobileTab}
          options={[
            { label: "Event Details", value: "details" },
            { label: "Grid Preview", value: "preview" },
          ]}
        />
      </div>

      <div
        className={cn(
          "w-full grid-cols-1 gap-y-2",
          mobileTab === "preview" ? "hidden md:grid" : "grid",
          "md:grow md:grid-cols-[auto_1fr] md:grid-rows-[auto_repeat(7,minmax(0,25px))_1fr_25px] md:gap-x-4 md:gap-y-2",
        )}
      >
        <DateRangeSelection editing={type === "edit"} />

        <label
          className={`flex items-center gap-2 md:col-start-1 md:row-start-2 ${errors.timeRange ? "text-error" : ""}`}
        >
          Possible Times
          {errors.timeRange && <ExclamationTriangleIcon className="h-4 w-4" />}
        </label>
        <div className="flex flex-col gap-2 md:col-start-1 md:row-span-7 md:row-start-3">
          <FormSelectorField label="FROM" htmlFor="from-time-dropdown">
            <TimeSelector
              id="from-time-dropdown"
              value={eventRange.timeRange.from}
              onChange={setStartTime}
            />
          </FormSelectorField>

          <FormSelectorField label="UNTIL" htmlFor="to-time-dropdown">
            <TimeSelector
              id="to-time-dropdown"
              value={eventRange.timeRange.to}
              onChange={setEndTime}
            />
          </FormSelectorField>
        </div>

        <div className="md:content md:col-start-1 md:row-start-9 md:flex md:max-w-[250px] md:items-end">
          <AdvancedOptions
            isEditing={type === "edit"}
            errors={errors}
            handleCustomCodeChange={handleCustomCodeChange}
          />
        </div>
        <div className="h-16 md:hidden" />
        <div className="hidden flex-1 md:col-start-2 md:row-span-9 md:row-start-2 md:block">
          <GridPreviewDialog eventRange={eventRange} />
        </div>
      </div>

      <div
        className={cn(
          "bg-panel min-h-screen rounded-3xl p-4 md:hidden",
          mobileTab === "details" ? "hidden" : "block",
        )}
      >
        <ScheduleGrid
          mode="preview"
          eventRange={eventRange}
          disableSelect={true}
          timezone={eventRange.timezone}
        />
        <div className="h-16" />
      </div>

      <MobileFooterTray
        buttons={
          type === "edit" ? [cancelButton, submitButton] : [submitButton]
        }
      />
    </div>
  );
}
