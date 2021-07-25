import React from "react";
import InputTodo from "./InputTodo";
import {
  render,
  fireEvent,
  screen,
  getByPlaceholderText,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import styles from "./InputTodo.module.css";

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
  test("Clicking on priority button opens option dropdown", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(`.${styles.sideButton1}`));
    expect(
      !document
        .querySelector(`.${styles.priorityOptions}`)
        .classList.contains("hidden")
    ).toBeTruthy();
  });
  test("Clicking on priority option changes color of priority button", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    const listItem = queryByTestId("test1");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(`.${styles.sideButton1}`));
    fireEvent.click(listItem);
    expect(document.querySelector(`.${styles.sideButton1}`).style.color).toBe(
      "red"
    );
    expect(
      document
        .querySelector(`.${styles.priorityOptions}`)
        .classList.contains("hidden")
    ).toBeTruthy();
  });
  test("Clicking on the alarm icon shows the end tododate options", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    const listItem = queryByTestId("test1");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    expect(
      !document.getElementById("endTimeOption").classList.contains("hidden")
    ).toBeTruthy();
  });
  test("Custom input of a date into todo start date with no AM", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    fireEvent.click(document.querySelector(`.react-datepicker-wrapper`));
    userEvent.type(
      screen.getByPlaceholderText("Input Tododate"),
      "30-11-2021 12:00{enter}"
    );
    expect(screen.getByPlaceholderText("Input Tododate").value).toBe(
      "30-11-2021 12:00 AM"
    );
  });
  test("Custom input of a date into todo start date with date that has already passed", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    fireEvent.click(document.querySelector(`.react-datepicker-wrapper`));
    userEvent.type(
      screen.getByPlaceholderText("Input Tododate"),
      "23-07-2021 12:00{enter}"
    );
    expect(screen.getByPlaceholderText("Input Tododate").value).toBe("");
  });
  test("Custom input of a date into todo start date with no minutes", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    fireEvent.click(document.querySelector(`.react-datepicker-wrapper`));
    userEvent.type(
      document.querySelector(`.${styles.todoText}`),
      "30-11-2021 12"
    );
    fireEvent.keyDown(document.querySelector(`.${styles.todoText}`), {
      key: "Enter",
      code: "Enter",
    });
    expect(screen.getByPlaceholderText("Input Tododate").value).toBe(
      "30-11-2021 12:00 AM"
    );
  });
  test("Custom input of a date into todo start date with no time", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    fireEvent.click(document.querySelector(`.react-datepicker-wrapper`));
    userEvent.type(document.querySelector(`.${styles.todoText}`), "30-11-2021");
    fireEvent.keyDown(document.querySelector(`.${styles.todoText}`), {
      key: "Enter",
      code: "Enter",
    });
    expect(screen.getByPlaceholderText("Input Tododate").value).toBe(
      "30-11-2021 12:00 AM"
    );
  });
  test("Custom input of a date into todo start date with wrong date", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    fireEvent.click(document.querySelector(`.react-datepicker-wrapper`));
    userEvent.type(document.querySelector(`.${styles.todoText}`), "30-11-202");
    fireEvent.keyDown(document.querySelector(`.${styles.todoText}`), {
      key: "Enter",
      code: "Enter",
    });
    expect(screen.getByPlaceholderText("Input Tododate").value).toBe(
      "30-11-2021 12:00 AM"
    );
  });
  test("Custom input of a date into todo start date with no year", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    fireEvent.click(document.querySelector(`.react-datepicker-wrapper`));
    userEvent.type(document.querySelector(`.${styles.todoText}`), "30-11");
    fireEvent.keyDown(document.querySelector(`.${styles.todoText}`), {
      key: "Enter",
      code: "Enter",
    });
    expect(screen.getByPlaceholderText("Input Tododate").value).toBe(
      "30-11-2021 12:00 AM"
    );
  });
  test("Custom input of a date into todo start date with no month", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    fireEvent.click(document.querySelector(`.react-datepicker-wrapper`));
    userEvent.type(document.querySelector(`.${styles.todoText}`), "30-0");
    fireEvent.keyDown(document.querySelector(`.${styles.todoText}`), {
      key: "Enter",
      code: "Enter",
    });
    expect(screen.getByPlaceholderText("Input Tododate").value).toBe(
      "30-07-2021 12:00 AM"
    );
  });
  test("Custom input of a date into todo start date with only day", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    fireEvent.click(document.querySelector(`.react-datepicker-wrapper`));
    userEvent.type(document.querySelector(`.${styles.todoText}`), "30");
    fireEvent.keyDown(document.querySelector(`.${styles.todoText}`), {
      key: "Enter",
      code: "Enter",
    });
    expect(screen.getByPlaceholderText("Input Tododate").value).toBe(
      "30-07-2021 12:00 AM"
    );
  });
  test("Custom input of a date into todo start date with bad time input", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    fireEvent.click(document.querySelector(`.react-datepicker-wrapper`));
    userEvent.type(
      document.querySelector(`.${styles.todoText}`),
      "30-11-2021 12:99 CM"
    );
    fireEvent.keyDown(document.querySelector(`.${styles.todoText}`), {
      key: "Enter",
      code: "Enter",
    });
    expect(screen.getByPlaceholderText("Input Tododate").value).toBe(
      "30-11-2021 12:09 AM"
    );
  });
  test("Custom input of a date into todo start date with invalid string", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(".alarmIcon"));
    fireEvent.click(document.querySelector(`.react-datepicker-wrapper`));
    userEvent.type(
      document.querySelector(`.${styles.todoText}`),
      "Weird stuff typed"
    );
    fireEvent.keyDown(document.querySelector(`.${styles.todoText}`), {
      key: "Enter",
      code: "Enter",
    });
    expect(screen.getByPlaceholderText("Input Tododate").value).toBe("");
  });
  test("Selecting input for deadline", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(`.${styles.deadlineIcon}`));
    expect(screen.getByPlaceholderText("Input Deadline").focus).toBeTruthy();
    fireEvent.click(document.querySelector(`#something1`));
    fireEvent.click(document.querySelector(`.${styles.deadlineText}`));
    expect(screen.getByPlaceholderText("Input Deadline").focus).toBeTruthy();
  });
  test("Custom input for deadline", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(`.${styles.deadlineText}`));
    userEvent.type(screen.getByPlaceholderText("Input Deadline"), "30-12-2021");
    fireEvent.keyDown(document.querySelector(`.${styles.deadlineText}`), {
      key: "Enter",
      code: "Enter",
    });
    expect(screen.getByPlaceholderText("Input Deadline").value).toBe(
      "30-12-2021 12:00 AM"
    );
  });
  // Unable to manually input end date time for now
  test("Add property", () => {
    act(() => {
      const { queryByTestId } = render(<InputTodo />);
      const button = queryByTestId("expand-InputTodo-button");
      fireEvent.click(button);
      fireEvent.click(screen.getByPlaceholderText("Add Property +"));
      userEvent.type(
        screen.getByPlaceholderText("Add Property +"),
        "testMe123{enter}"
      );
    });
    expect(screen.getByPlaceholderText("Add Property +").value).toBe("");
    expect(document.querySelector(`.${styles.propertyChip}`)).toBeTruthy();
  });
  test("Add empty property", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(`.${styles.addPropertyField}`));
    userEvent.type(screen.getByPlaceholderText("Add Property +"), "{enter}");
    expect(!document.querySelector(`.${styles.propertyChip}`)).toBeTruthy();
  });
  test("Delete property", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(`.${styles.addPropertyField}`));
    userEvent.type(
      screen.getByPlaceholderText("Add Property +"),
      "tester{enter}"
    );
    expect(screen.queryByTestId("tester")).toBeTruthy();
    fireEvent.click(screen.queryByTestId(`tester_close`));
    expect(screen.queryByTestId("tester")).not.toBeTruthy();
  });
  test("Typing repeated properties property", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.querySelector(`.${styles.addPropertyField}`));
    userEvent.type(
      screen.getByPlaceholderText("Add Property +"),
      "tester{enter}"
    );
    expect(screen.queryByTestId("tester")).toBeTruthy();
    userEvent.type(
      screen.getByPlaceholderText("Add Property +"),
      "tester{enter}"
    );
    expect(screen.queryAllByTestId("tester").length).toBe(1);
  });
  test("Submit Todo", () => {
    const handleSubmit = jest.fn((e) => e);
    const { queryByTestId } = render(<InputTodo handleSubmit={handleSubmit} />);
    const button = queryByTestId("expand-InputTodo-button");
    const form = queryByTestId("InputTodo-form");
    fireEvent.click(button);
    expect(!form.classList.contains("hidden")).toBeTruthy();
    fireEvent.click(document.getElementById("something1"));
    userEvent.type(document.getElementById("something1"), "Hello");
    expect(document.getElementById("something1").textContent).toBe("Hello");
    fireEvent.submit(form);
    expect(handleSubmit).toBeCalledTimes(1);
  });
  test("Cancel Button", () => {
    const { queryByTestId } = render(<InputTodo />);
    const button = queryByTestId("expand-InputTodo-button");
    fireEvent.click(button);
    fireEvent.click(document.getElementById("something1"));
    userEvent.type(document.getElementById("something1"), "Hello");
    fireEvent.click(document.querySelector(`.${styles.cancelButton}`));
    expect(document.getElementById("something1").textContent).toBe("");
    expect(document.querySelector(`.${styles.todoText}`).value).toBe("");
    expect(document.querySelector(`.${styles.todoTime}`).value).toBe("");
    expect(document.querySelector(`.${styles.deadlineText}`).value).toBe("");
    expect(document.querySelector(`.${styles.addPropertyField}`).value).toBe(
      ""
    );
    expect(document.querySelector(`.${styles.propertyChip}`)).not.toBeTruthy();
    expect(document.querySelector(`.${styles.sideButton1}`).style.color).toBe(
      "white"
    );
  });
});
