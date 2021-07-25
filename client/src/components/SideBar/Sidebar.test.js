import React from "react";
import Sidebar from "./Sidebar";
import {
  render,
  fireEvent,
  screen,
  getByPlaceholderText,
  act,
  waitForElement,
} from "@testing-library/react";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import styles from "./Sidebar.module.css";

describe("A series of test cases for the sidebar", () => {
  test("The sidebar's initial state", () => {
    render(<Sidebar match={{ path: "/" }} />);
    expect(document.querySelector(".overviewPage").style.backgroundColor).toBe(
      "rgb(18, 30, 79)"
    );
  });
  test("The sidebar's state after clicking main tasks", () => {
    render(<Sidebar match={{ path: "/taskpage" }} />);
    expect(document.querySelector(".taskPage").style.backgroundColor).toBe(
      "rgb(18, 30, 79)"
    );
  });
  test("Click on add button and input a list", () => {
    render(<Sidebar match={{ path: "/taskpage" }} />);
    fireEvent.click(document.querySelector(`.${styles.addListButton}`));
    fireEvent.click(document.querySelector(`.${styles.addListName}`));
    userEvent.type(document.querySelector(`.${styles.addListName}`), "a");
    fireEvent.click(document.querySelector(`.${styles.confirmButton}`));
    expect(
      document.querySelector(`.${styles.addList}`).classList.contains("hidden")
    ).not.toBeTruthy();

    expect(ok).toBeTruthy();
  });
});
