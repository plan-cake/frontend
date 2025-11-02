import { ComponentProps, ReactElement } from "react";

import ActionButton from "@/features/button/components/action-button";
import LinkButton from "@/features/button/components/link-button";

/**
 * An array of buttons.
 *
 * Each element can be either an `ActionButton` or `LinkButton` component.
 */
export type ButtonArray = (
    | ReactElement<ComponentProps<typeof ActionButton>>
    | ReactElement<ComponentProps<typeof LinkButton>>
)[];
