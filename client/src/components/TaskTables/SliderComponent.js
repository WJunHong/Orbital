import React, { useState } from "react";
import {Slider} from "../../design/table_icons";

const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 100,
    label: "100%",
  },
];

export default function SliderComponent({ todo, updateAll }) {
  const [value, setValue] = useState(todo.progress);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
      <Slider
        value={value}
        aria-labelledby="continuous-slider"
        onChange={handleChange}
        onChangeCommitted={(e, val) => {
          document.querySelector(`#progressInput_${todo.todo_id}`).value = "";
          updateAll(todo, "progress", val);
        }}
        marks={marks}
        getArialValueText={todo.progress + "%"}
        className="progressSlider1"
      />
  );
}
