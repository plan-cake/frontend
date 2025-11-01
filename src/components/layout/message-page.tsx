import { ComponentProps, ReactElement } from "react";

import ActionButton from "@/features/button/components/action-button";
import LinkButton from "@/features/button/components/link-button";

type MessagePageProps = {
  title: string;
  description?: string;
  /**
   * An array of buttons to display on the page, in a row.
   *
   * Each element can be either an `ActionButton` or `LinkButton` component.
   */
  buttons: (
    | ReactElement<ComponentProps<typeof ActionButton>>
    | ReactElement<ComponentProps<typeof LinkButton>>
  )[];
};

export default function MessagePage({
  title,
  description,
  buttons,
}: MessagePageProps) {
  return (
    <div className="text-center">
      <h2 className="mb-4 text-4xl font-bold">{title}</h2>
      {description && <p className="mb-4">{description}</p>}
      <div className="flex justify-center gap-4">
        {buttons.map((button, index) => (
          <div key={index}>{button}</div>
        ))}
      </div>
    </div>
  );
}
