
import React from "react";
import Heading from "./Heading"
import {
  render,
  act,
  queryByTestId,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Test Render Heading", () => {
  test("Test Timing and Name Display", () => {
    const testUser = {displayName: "Bob"};
    const { queryByTestId } = render(<Heading testUser={testUser}/>);
    const time = new Date().getHours();
    let str = "Good ";
    if (time >= 6 && time < 12) {
      str += "Morning";
    } else if (time >= 12 && time < 19) {
      str += "Afternoon";
    } else if (time >= 19 && time < 21) {
      str += "Evening";
    } else {
      str += "Night";
    }
    str += ", Bob";

    expect(queryByTestId("greeting").textContent).toBe(str);
  });

  test("Avator Icon Render", () => {
    const {queryByTestId} = render(<Heading />);
    expect(queryByTestId("headingDP")).tobeTruthy();
  })

  test("Render Profile Dropdown Menu", () => {
    const { queryByTestId } = render(<Heading />);
    const displayPicture = queryByTestId("headingDP");
    expect(queryByTestId("profileDropdown").classList.contains("hidden")).toBe(true);
    userEvent.click(displayPicture);
    expect(queryByTestId("profileDropdown").classList.contains("hidden")).toBe(false);
  })
})
