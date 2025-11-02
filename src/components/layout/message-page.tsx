import { ButtonArray } from "@/features/button/button-array";

type MessagePageProps = {
  title: string;
  description?: string;
  buttons: ButtonArray;
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
