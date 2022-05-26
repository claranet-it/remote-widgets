import { useMemo } from "react";

const CompassForm = ({
  initialValue,
  name,
  title,
  options,
}: {
  initialValue: string;
  title: string;
  name: string;
  options: string[];
}) => {
  const values = useMemo(() => ["1", "2", "3", "4", "5"], []);
  return (
    <fieldset>
      <legend>{title}:</legend>

      {values.map((value, index) => (
        <label key={index}>
          <input
            type="radio"
            defaultChecked={value === initialValue}
            name={name}
            value={value}
          />{" "}
          {options[index]}
        </label>
      ))}
    </fieldset>
  );
};

export default CompassForm;
