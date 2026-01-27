import { ComponentProps, ReactElement } from "react";

import TextInputField from "@/components/text-input-field";

/**
 * An array of text input fields for authentication forms.
 *
 * Each element is a `TextInputField` component.
 */
export type AuthFieldArray = ReactElement<
  ComponentProps<typeof TextInputField>
>[];
