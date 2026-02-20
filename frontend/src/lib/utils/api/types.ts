export type MessageResponse = {
  message: string[];
}

export type AccountData = {
  email: string;
  default_display_name: string;
}

export type EventCode = {
  event_code: string;
}

export type EventDetails = {
  title: string;
  duration: number | null;
  timeslots: string[];
  time_zone: string;
  is_creator: boolean;
  event_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}

export type SelfAvailability = {
  display_name: string;
  available_dates: string[];
  time_zone: string;
}

export type AllAvailability = {
  user_display_name: string;
  participants: string[];
  availability: {
    [timeslot: string]: string[];
  }
}

export type DashboardEvent = {
  title: string;
  event_type: string;
  duration: number | null;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  time_zone: string;
  participants: string[];
  event_code: string;
}

export type DashboardData = {
  created_events: DashboardEvent[];
  participated_events: DashboardEvent[];
}

export type ApiEndpoints = {
  '/auth/check-account-auth/': AccountData;
  '/auth/login/': AccountData;
  '/auth/logout/': MessageResponse;
  '/auth/register/': MessageResponse;
  '/auth/resend-register-email/': MessageResponse;
  '/auth/reset-password/': MessageResponse;
  '/auth/start-password-reset/': MessageResponse;
  '/auth/verify-email/': MessageResponse;

  '/event/date-create/': EventCode;
  '/event/week-create/': EventCode;
  '/event/check-code/': MessageResponse;
  '/event/date-edit/': MessageResponse;
  '/event/week-edit/': MessageResponse;
  '/event/get-details/': EventDetails;

  '/availability/add/': MessageResponse;
  '/availability/check-display-name/': MessageResponse;
  '/availability/get-self/': SelfAvailability;
  '/availability/get-all/': AllAvailability;
  '/availability/remove-self/': MessageResponse;
  '/availability/remove/': MessageResponse;

  '/dashboard/get/': DashboardData;

  '/account/remove-default-name/': MessageResponse;
  '/account/set-default-name/': MessageResponse;
}
