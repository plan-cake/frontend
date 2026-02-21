import {
  AccountData,
  AllAvailability,
  DashboardData,
  EventCode,
  EventDetails,
  MessageResponse,
  SelfAvailability,
} from "@/lib/utils/api/types";

export const ROUTES = {
  auth: {
    /**
     * Registers a new user account that cannot be used until the email is verified.
     * @throws {400} - If the password is not strong enough.
     */
    register: "/auth/register/",
    /**
     * Attempts to resend the verification email for an unverified user account.
     */
    resendRegisterEmail: "/auth/resend-register-email/",
    /**
     * Verifies the email address of an unverified user account.
     * @throws 404 - If the verification code is invalid.
     */
    verifyEmail: "/auth/verify-email/",
    /**
     * Logs in a user account.
     * @throws 400 - If the user is already logged in.
     * @throws 400 - If the email or password is incorrect.
     */
    login: "/auth/login/",
    /**
     * Checks if the user is logged in, and returns account data if so.
     * @throws 401 - If the user is not logged in.
     */
    checkAccountAuth: "/auth/check-account-auth/",
    /**
     * Starts the password reset process by sending a password reset email.
     */
    startPasswordReset: "/auth/start-password-reset/",
    /**
     * Given a valid password reset token, resets the password for a user account.
     * @throws 400 - If the new password is not strong enough.
     * @throws 400 - If the new password is the same as the old password.
     * @throws 404 - If the reset token is invalid.
     */
    resetPassword: "/auth/reset-password/",
    /**
     * Logs out the current user.
     */
    logout: "/auth/logout/",
  },
  event: {
    /**
     * Creates a 'date' type event.
     * @throws 400 - If the timeslots are invalid.
     * @throws 400 - If the custom code is not available or invalid.
     */
    dateCreate: "/event/date-create/",
    /**
     * Creates a 'week' type event.
     * @throws 400 - If the timeslots are invalid.
     * @throws 400 - If the custom code is not available or invalid.
     */
    weekCreate: "/event/week-create/",
    /**
     * Checks if a custom event code is available for use.
     * @throws 400 - If the custom code is not available or invalid.
     */
    checkCode: "/event/check-code/",
    /**
     * Edits the details of a 'date' type event.
     * @throws 400 - If the timeslots are invalid.
     * @throws 404 - If the user is not the creator of the event.
     */
    dateEdit: "/event/date-edit/",
    /**
     * Edits the details of a 'week' type event.
     * @throws 400 - If the timeslots are invalid.
     * @throws 404 - If the user is not the creator of the event.
     */
    weekEdit: "/event/week-edit/",
    /**
     * Gets the details of an event, not including availability.
     * @throws 404 - If the event code is invalid.
     */
    getDetails: "/event/get-details/",
  },
  availability: {
    /**
     * Adds availability for the current user to an event.
     * @throws 400 - If the display name is unavailable.
     * @throws 400 - If the timeslots are invalid.
     * @throws 404 - If the event code is invalid.
     */
    add: "/availability/add/",
    /**
     * Checks if a display name is available for the current user in an event.
     * @throws 400 - If the display name is unavailable.
     * @throws 404 - If the event code is invalid.
     */
    checkDisplayName: "/availability/check-display-name/",
    /**
     * Gets the availability of the current user for an event.
     * @throws 400 - If the user is not a participant in the event.
     * @throws 404 - If the event code is invalid.
     */
    getSelf: "/availability/get-self/",
    /**
     * Gets the availability of all participants for an event.
     * @throws 404 - If the event code is invalid.
     */
    getAll: "/availability/get-all/",
    /**
     * Removes the availability of the current user from an event.
     * @throws 400 - If the user is not a participant in the event.
     * @throws 404 - If the event code is invalid.
     */
    removeSelf: "/availability/remove-self/",
    /**
     * Removes the availability of a participant from an event.
     * @throws 403 - If the user is not the creator of the event.
     * @throws 404 - If the participant does not exist.
     * @throws 404 - If the event code is invalid.
     */
    remove: "/availability/remove/",
  },
  dashboard: {
    /**
     * Gets data for the current user's dashboard.
     */
    get: "/dashboard/get/",
  },
  account: {
    /**
     * Sets the default display name for the current user.
     */
    setDefaultName: "/account/set-default-name/",
    /**
     * Removes the default display name for the current user.
     */
    removeDefaultName: "/account/remove-default-name/",
  },
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
};
