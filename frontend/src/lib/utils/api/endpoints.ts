import {
  AccountData,
  AllAvailability,
  DashboardData,
  EventCode,
  EventDetails,
  MessageResponse,
  SelfAvailability,
} from "@/lib/utils/api/types";

/**
 * A helper to define an API endpoint route object.
 * @template Res The expected response type.
 * @template Req The expected request body/query parameter type.
 * @param url The path of the API endpoint, not including the base URL.
 */
function route<Res, Req = void>(url: string) {
  return {
    url,
    // Just for type inference, not used at runtime
    __req: undefined as unknown as Req,
    __res: undefined as unknown as Res,
  } as const;
}

// Helpers to extract types from the route object
export type InferReq<T> = T extends { __req: infer R } ? R : never;
export type InferRes<T> = T extends { __res: infer R } ? R : never;

export const ROUTES = {
  auth: {
    /**
     * Registers a new user account that cannot be used until the email is verified.
     * @throws {400} - If the password is not strong enough.
     */
    register: route<MessageResponse>("/auth/register/"),
    /**
     * Attempts to resend the verification email for an unverified user account.
     */
    resendRegisterEmail: route<MessageResponse>("/auth/resend-register-email/"),
    /**
     * Verifies the email address of an unverified user account.
     * @throws 404 - If the verification code is invalid.
     */
    verifyEmail: route<MessageResponse>("/auth/verify-email/"),
    /**
     * Logs in a user account.
     * @throws 400 - If the user is already logged in.
     * @throws 400 - If the email or password is incorrect.
     */
    login: route<AccountData>("/auth/login/"),
    /**
     * Checks if the user is logged in, and returns account data if so.
     * @throws 401 - If the user is not logged in.
     */
    checkAccountAuth: route<AccountData>("/auth/check-account-auth/"),
    /**
     * Starts the password reset process by sending a password reset email.
     */
    startPasswordReset: route<MessageResponse>("/auth/start-password-reset/"),
    /**
     * Given a valid password reset token, resets the password for a user account.
     * @throws 400 - If the new password is not strong enough.
     * @throws 400 - If the new password is the same as the old password.
     * @throws 404 - If the reset token is invalid.
     */
    resetPassword: route<MessageResponse>("/auth/reset-password/"),
    /**
     * Logs out the current user.
     */
    logout: route<MessageResponse>("/auth/logout/"),
  },
  event: {
    /**
     * Creates a 'date' type event.
     * @throws 400 - If the timeslots are invalid.
     * @throws 400 - If the custom code is not available or invalid.
     */
    dateCreate: route<EventCode>("/event/date-create/"),
    /**
     * Creates a 'week' type event.
     * @throws 400 - If the timeslots are invalid.
     * @throws 400 - If the custom code is not available or invalid.
     */
    weekCreate: route<EventCode>("/event/week-create/"),
    /**
     * Checks if a custom event code is available for use.
     * @throws 400 - If the custom code is not available or invalid.
     */
    checkCode: route<MessageResponse>("/event/check-code/"),
    /**
     * Edits the details of a 'date' type event.
     * @throws 400 - If the timeslots are invalid.
     * @throws 404 - If the user is not the creator of the event.
     */
    dateEdit: route<MessageResponse>("/event/date-edit/"),
    /**
     * Edits the details of a 'week' type event.
     * @throws 400 - If the timeslots are invalid.
     * @throws 404 - If the user is not the creator of the event.
     */
    weekEdit: route<MessageResponse>("/event/week-edit/"),
    /**
     * Gets the details of an event, not including availability.
     * @throws 404 - If the event code is invalid.
     */
    getDetails: route<EventDetails>("/event/get-details/"),
  },
  availability: {
    /**
     * Adds availability for the current user to an event.
     * @throws 400 - If the display name is unavailable.
     * @throws 400 - If the timeslots are invalid.
     * @throws 404 - If the event code is invalid.
     */
    add: route<MessageResponse>("/availability/add/"),
    /**
     * Checks if a display name is available for the current user in an event.
     * @throws 400 - If the display name is unavailable.
     * @throws 404 - If the event code is invalid.
     */
    checkDisplayName: route<MessageResponse>("/availability/check-display-name/"),
    /**
     * Gets the availability of the current user for an event.
     * @throws 400 - If the user is not a participant in the event.
     * @throws 404 - If the event code is invalid.
     */
    getSelf: route<SelfAvailability>("/availability/get-self/"),
    /**
     * Gets the availability of all participants for an event.
     * @throws 404 - If the event code is invalid.
     */
    getAll: route<AllAvailability>("/availability/get-all/"),
    /**
     * Removes the availability of the current user from an event.
     * @throws 400 - If the user is not a participant in the event.
     * @throws 404 - If the event code is invalid.
     */
    removeSelf: route<MessageResponse>("/availability/remove-self/"),
    /**
     * Removes the availability of a participant from an event.
     * @throws 403 - If the user is not the creator of the event.
     * @throws 404 - If the participant does not exist.
     * @throws 404 - If the event code is invalid.
     */
    remove: route<MessageResponse>("/availability/remove/"),
  },
  dashboard: {
    /**
     * Gets data for the current user's dashboard.
     */
    get: route<DashboardData>("/dashboard/get/"),
  },
  account: {
    /**
     * Sets the default display name for the current user.
     */
    setDefaultName: route<MessageResponse>("/account/set-default-name/"),
    /**
     * Removes the default display name for the current user.
     */
    removeDefaultName: route<MessageResponse>("/account/remove-default-name/"),
  },
} as const;
