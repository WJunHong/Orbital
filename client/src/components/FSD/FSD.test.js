import React from "react";
import FSD from "./FSD";
import {
  render,
  fireEvent,
  screen,
  getByPlaceholderText,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import styles from "./FSD.module.css";

describe("A series of tests for filter, sort, delete component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
  });

  test("Opening the Filter and Sort options", () => {
    act(() => {
      const { queryByTestId } = render(<FSD name={"mt"} />);
      const filterButton = screen.getByLabelText("filter");
      const sortButton = screen.getByLabelText("sort");
      fireEvent.click(filterButton);
      fireEvent.click(sortButton);
    });
    expect(
      document
        .querySelector(`.${styles.filterOptions}`)
        .classList.contains("hidden")
    ).not.toBeTruthy();
    expect(
      document
        .querySelector(`.${styles.sortOptions}`)
        .classList.contains("hidden")
    ).not.toBeTruthy();
    expect(
      document.querySelector(`.${styles.filterButton}`).style.backgroundColor
    ).toBe("red");
    expect(
      document.querySelector(`.${styles.sortButton}`).style.backgroundColor
    ).toBe("red");
  });

  test("Checking for LocalStorage Filter", () => {
    act(() => {
      render(<FSD name={"mt"} />);
    });
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(3);
  });
  test("Creating LocalStorage Filter", () => {
    act(() => {
      render(<FSD name={"mt"} />);
    });
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  });
  test("Check LocalStorage Filter upon clicking priority", () => {
    const filterObj = {
      priority: [1],
      deadline: [null, null],
      progress: [0, 100],
      todoDate: [null, null],
      properties: [],
    };
    act(() => {
      render(<FSD name={"mt"} />);
      const filterButton = screen.getByLabelText("filter");
      const sortButton = screen.getByLabelText("sort");
      fireEvent.click(filterButton);
      fireEvent.click(document.querySelector(`.${styles.priorityButton}`));
    });
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "filter-mt/",
      JSON.stringify(filterObj)
    );
  });
});
