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

export const ROUTES = {
  auth: {
    checkAccountAuth: "/auth/check-account-auth/",
    login: "/auth/login/",
    logout: "/auth/logout/",
    register: "/auth/register/",
    resendRegisterEmail: "/auth/resend-register-email/",
    resetPassword: "/auth/reset-password/",
    startPasswordReset: "/auth/start-password-reset/",
    verifyEmail: "/auth/verify-email/",
  },
  event: {
    dateCreate: "/event/date-create/",
    weekCreate: "/event/week-create/",
    checkCode: "/event/check-code/",
    dateEdit: "/event/date-edit/",
    weekEdit: "/event/week-edit/",
    getDetails: "/event/get-details/",
  },
  availability: {
    add: "/availability/add/",
    checkDisplayName: "/availability/check-display-name/",
    getSelf: "/availability/get-self/",
    getAll: "/availability/get-all/",
    removeSelf: "/availability/remove-self/",
    remove: "/availability/remove/",
  },
  dashboard: {
    get: "/dashboard/get/",
  },
  account: {
    removeDefaultName: "/account/remove-default-name/",
    setDefaultName: "/account/set-default-name/",
  }
} as const;

export type ApiEndpoints = {
  [ROUTES.auth.checkAccountAuth]: AccountData;
  [ROUTES.auth.login]: AccountData;
  [ROUTES.auth.logout]: MessageResponse;
  [ROUTES.auth.register]: MessageResponse;
  [ROUTES.auth.resendRegisterEmail]: MessageResponse;
  [ROUTES.auth.resetPassword]: MessageResponse;
  [ROUTES.auth.startPasswordReset]: MessageResponse;
  [ROUTES.auth.verifyEmail]: MessageResponse;

  [ROUTES.event.dateCreate]: EventCode;
  [ROUTES.event.weekCreate]: EventCode;
  [ROUTES.event.checkCode]: MessageResponse;
  [ROUTES.event.dateEdit]: MessageResponse;
  [ROUTES.event.weekEdit]: MessageResponse;
  [ROUTES.event.getDetails]: EventDetails;

  [ROUTES.availability.add]: MessageResponse;
  [ROUTES.availability.checkDisplayName]: MessageResponse;
  [ROUTES.availability.getSelf]: SelfAvailability;
  [ROUTES.availability.getAll]: AllAvailability;
  [ROUTES.availability.removeSelf]: MessageResponse;
  [ROUTES.availability.remove]: MessageResponse;

  [ROUTES.dashboard.get]: DashboardData;

  [ROUTES.account.removeDefaultName]: MessageResponse;
  [ROUTES.account.setDefaultName]: MessageResponse;
}
