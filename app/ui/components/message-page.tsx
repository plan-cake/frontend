enum ButtonTypeEnum {
  primary = "primary",
  secondary = "secondary",
}
type ButtonType = keyof typeof ButtonTypeEnum;

type ButtonData = { type: ButtonType; label: string; onClick: () => void };

type MessagePageProps = {
  title: string;
  description: string;
  buttons: ButtonData[];
};

export default function MessagePage({
  title,
  description,
  buttons,
}: MessagePageProps) {
  return (
    <div className="text-center">
      <h2 className="mb-4 text-4xl font-bold">{title}</h2>
      <p className="mb-4">{description}</p>
      <div className="flex justify-center gap-4">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`mb-2 cursor-pointer rounded-full px-4 py-2 font-medium transition ${
              button.type === "primary"
                ? "bg-blue dark:bg-red"
                : "outline-2 outline-blue hover:bg-blue-100 dark:outline-red dark:hover:bg-red/25"
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}
