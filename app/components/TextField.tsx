import { FC, InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  id: string;
};

const TextField: FC<Props> = ({ label, id, ...otherProps }) => {
  return (
    <>
      <label className="input-label" htmlFor={id}>
        {label}
      </label>
      <input className="input" type="text" id={id} name={id} {...otherProps} />
    </>
  );
};

export default TextField;
