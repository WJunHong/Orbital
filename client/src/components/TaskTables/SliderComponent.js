import React, { useState } from "react";
import { Slider } from "../../design/table_icons";

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
  /**
   * Function 1: Takes in new value for the slider and passes it into the setter.
   * @param {Object} event The event object tied to slider change.
   * @param {int} newValue The new value the slider slides to.
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Slider
      value={value}
      aria-labelledby="continuous-slider"
      onChange={handleChange}
      onChangeCommitted={(e, val) => {
        /**
         * Function 2: Calls the updateAll function and resets the progress input.
         */
        document.querySelector(`#progressInput_${todo.todo_id}`).value = "";
        updateAll(todo, "progress", val);
      }}
      marks={marks}
      getArialValueText={todo.progress + "%"}
      className="progressSlider1"
      valueLabelDisplay="auto"
    />
  );
}
