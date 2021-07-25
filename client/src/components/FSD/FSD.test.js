import React from "react";
import FSD from "./FSD";
import { render, fireEvent, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import styles from "./FSD.module.css";

describe("A series of tests for filter, sort, delete component", () => {
  var k = {};
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  test("Opening the Filter and Sort options", () => {
    act(() => {
      render(<FSD name={"mt"} listName={"mt"} />);
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
      render(<FSD name={"mt"} listName={"mt"} />);
    });
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(3);
  });
  test("Creating LocalStorage Filter", () => {
    act(() => {
      render(<FSD name={"mt"} listName={"mt"} />);
    });
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  });
  test("Check LocalStorage Filter upon clicking priority", () => {
    const filterObj = {
      priority: [2, 1],
      deadline: [null, null],
      progress: [0, 100],
      todoDate: [null, null],
      properties: [],
    };
    act(() => {
      render(<FSD name={"mt"} listName={"mt"} />);
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
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "filter-mt/mt",
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
      render(<FSD name={"mt"} listName={"mt"} />);
      const filterButton = screen.getByLabelText("filter");

      fireEvent.click(filterButton);
      fireEvent.click(screen.queryByTestId(`priority2`));
      fireEvent.click(document.querySelector(`.${styles.clearPriority}`));
    });
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "filter-mt/mt",
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
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(4);
  });
  test("Check LocalStorage Filter upon date filter selected", () => {
    const filterObj = {
      priority: [],
      deadline: [new Date("22 July 2021 16:00:00").toISOString(), null],
      progress: [0, 100],
      todoDate: [null, null],
      properties: [],
    };
    render(<FSD name={"mt"} listName={"mt"} />);
    const filterButton = screen.getByLabelText("filter");
    fireEvent.click(filterButton);
    fireEvent.click(document.querySelector(`.deadlineStartDate`));
    userEvent.type(
      document.querySelector(`.deadlineStartDate`),
      "23-07-2021{enter}"
    );
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "filter-mt/mt",
      JSON.stringify(filterObj)
    );
  });
  test("Sort options click Alphabetical", () => {
    const sortObj = { sort: "Alphabetical", direction: "descending" };

    render(<FSD name={"mt"} listName={"mt"} />);
    const sortButton = screen.getByLabelText("sort");
    fireEvent.click(sortButton);
    fireEvent.click(document.querySelector(`#sort-Alphabetical`));
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "sort-mt/mt",
      JSON.stringify(sortObj)
    );
  });
  test("Sort options un-click Alphabetical", () => {
    const sortObj = { sort: "dateAdded", direction: "descending" };

    render(<FSD name={"mt"} listName={"mt"} />);
    const sortButton = screen.getByLabelText("sort");
    fireEvent.click(sortButton);
    fireEvent.click(document.querySelector(`#sort-Alphabetical`));
    fireEvent.click(document.querySelector(`#sort-Alphabetical`));
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "sort-mt/mt",
      JSON.stringify(sortObj)
    );
  });
  test("Sort options click Alphabetical, then click ascending", () => {
    const sortObj = { sort: "Alphabetical", direction: "ascending" };
    render(<FSD name={"mt"} listName={"mt"} />);
    const sortButton = screen.getByLabelText("sort");
    fireEvent.click(sortButton);
    fireEvent.click(document.querySelector(`#sort-Alphabetical`));
    fireEvent.click(document.querySelector(`.${styles.arrowStyle}`));
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "sort-mt/mt",
      JSON.stringify(sortObj)
    );
  });
  test("Sort options click, then press reset", () => {
    const sortObj = { sort: "dateAdded", direction: "descending" };
    render(<FSD name={"mt"} listName={"mt"} />);
    const sortButton = screen.getByLabelText("sort");
    fireEvent.click(sortButton);
    fireEvent.click(document.querySelector(`#sort-Alphabetical`));
    fireEvent.click(document.querySelector(`.${styles.arrowStyle}`));
    fireEvent.click(document.querySelector(`.${styles.clearSortButton}`));
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "sort-mt/mt",
      JSON.stringify(sortObj)
    );
  });
});
