import React from "react";
import InputTodo from "./InputTodo";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Series of tests for inputting a new task", () => {
  test("Initial rendering", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    const form = queryByTestId("InputTodo-form");
    expect(button).toBeTruthy();
    expect(form.classList.contains("hidden")).toBeTruthy();
  });
  test("Opening input task form", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    const form = queryByTestId("InputTodo-form");
    fireEvent.click(button);
    expect(!form.classList.contains("hidden")).toBeTruthy();
  });
  /*
   * Click anywhere -> focus on text box -> typing -> textContent should be non-empty
   */
  test("Filling up task form", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    const form = queryByTestId("InputTodo-form");
    fireEvent.click(button);
    expect(!form.classList.contains("hidden")).toBeTruthy();
    fireEvent.click(document.getElementById("something1"));
    userEvent.type(document.getElementById("something1"), "Hello");
    expect(document.getElementById("something1").textContent).toBe("Hello");
  });
});
