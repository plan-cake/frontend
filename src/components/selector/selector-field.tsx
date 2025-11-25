type FormSelectorFieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

export default function FormSelectorField({
  label,
  htmlFor,
  children,
}: FormSelectorFieldProps) {
  return (
    <>
      <label htmlFor={htmlFor} className="text-gray-400">
        {label}
      </label>
      {children}
    </>
  );
}
