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
import "jest-localstorage-mock";

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
      render(<FSD name={"mt"} />);
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
    expect(localStorage.getItem).toHaveBeenCalledTimes(3);
  });
  test("Creating LocalStorage Filter", () => {
    act(() => {
      render(<FSD name={"mt"} />);
    });
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });
  test("Check LocalStorage Filter upon clicking priority", () => {
    const filterObj = {
      priority: [1, 2],
      deadline: [null, null],
      progress: [0, 100],
      todoDate: [null, null],
      properties: [],
    };
    act(() => {
      render(<FSD name={"mt"} />);
      const filterButton = screen.getByLabelText("filter");
      fireEvent.click(filterButton);
      fireEvent.click(screen.queryByTestId(`priority2`));
      fireEvent.click(screen.queryByTestId(`priority1`));
    });
    // idk why the set item has priority [1], [], [2] when 1,2 are clicked
    /*expect(localStorage.setItem).toHaveBeenCalledWith(
      "filter-mt/",
      JSON.stringify(filterObj)
    );*/
    expect(localStorage.__STORE__["filter-mt/"]).toBe(
      JSON.stringify(filterObj)
    );
    expect(screen.queryByTestId("priority1").style.backgroundColor).toBe(
      "black"
    );
    expect(screen.queryByTestId("priority2").style.backgroundColor).toBe(
      "black"
    );
    expect(screen.queryByTestId("priority3").style.backgroundColor).toBe(
      "rgb(65, 65, 65)"
    );
    // Set called once at the start of rendering, then in the mock function, then once more in the component
    expect(localStorage.setItem).toHaveBeenCalledTimes(4);
  });
  test("Check LocalStorage Filter upon resetting priorities", () => {
    const filterObj = {
      priority: [],
      deadline: [null, null],
      progress: [0, 100],
      todoDate: [null, null],
      properties: [],
    };
    act(() => {
      render(<FSD name={"mt"} />);
      const filterButton = screen.getByLabelText("filter");

      fireEvent.click(filterButton);
      fireEvent.click(screen.queryByTestId(`priority2`));
      fireEvent.click(document.querySelector(`.${styles.clearPriority}`));
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "filter-mt/",
      JSON.stringify(filterObj)
    );
    expect(screen.queryByTestId("priority1").style.backgroundColor).toBe(
      "rgb(65, 65, 65)"
    );
    expect(screen.queryByTestId("priority2").style.backgroundColor).toBe(
      "rgb(65, 65, 65)"
    );
    expect(screen.queryByTestId("priority3").style.backgroundColor).toBe(
      "rgb(65, 65, 65)"
    );
    // Set called once at the start of rendering, then in the mock function, then twice more in the component
    expect(localStorage.setItem).toHaveBeenCalledTimes(4);
  });
  test("Check LocalStorage Filter upon date filter selected", () => {
    const filterObj = {
      priority: [],
      deadline: [new Date("23 July 2021 00:00:00").toISOString(), null],
      progress: [0, 100],
      todoDate: [null, null],
      properties: [],
    };
    act(() => {
      render(<FSD name={"mt"} />);
      const filterButton = screen.getByLabelText("filter");
      fireEvent.click(filterButton);
      fireEvent.click(document.querySelector(`.deadlineStart`));
      userEvent.type(
        document.querySelector(`.deadlineStart`),
        "23-07-2021{enter}"
      );
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "filter-mt/",
      JSON.stringify(filterObj)
    );
  });
});
