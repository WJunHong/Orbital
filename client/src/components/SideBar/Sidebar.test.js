import React from "react";
import Sidebar from "./Sidebar";
import {
  render,
  fireEvent,
  screen,
  getByPlaceholderText,
  act,
} from "@testing-library/react";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import styles from "./Sidebar.module.css";
import l from "firebase";
import "firebase/auth";

// Supplied because need a logged in user for sidebar to function properly
// jest.mock("firebase", () => {
//   return {
//     auth: jest.fn().mockReturnValue({
//       currentUser: {
//         uid: 1,
//       },
//     }),
//   };
// });
/*.mockReturnValueOnce({
    currentUser: { email: "example@gmail.com", uid: 1, emailVerified: true },
  });*/
const user = {
  uid: "1",
};
describe("A series of test cases for the sidebar", () => {
  test("The sidebar's initial state", () => {
    render(<Sidebar match={{ path: "/" }} testUser={user} />);
    expect(document.querySelector(".overviewPage").style.backgroundColor).toBe(
      "rgb(18, 30, 79)"
    );
  });
  test("The sidebar's state after clicking main tasks", () => {
    render(<Sidebar match={{ path: "/taskpage" }} testUser={user} />);
    expect(document.querySelector(".taskPage").style.backgroundColor).toBe(
      "rgb(18, 30, 79)"
    );
  });

  test("Click on add button and input a list", () => {
    render(<Sidebar match={{ path: "/taskpage" }} testUser={user} />);
    fireEvent.click(document.querySelector(`.${styles.addListButton}`));
    fireEvent.click(document.querySelector(`.${styles.addListName}`));
    userEvent.type(document.querySelector(`.${styles.addListName}`), "bee");
    expect(document.querySelector(`.${styles.addListName}`).textContent).toBe(
      "bee"
    );
    // For some reason, does not close the window and clear the input
    act(() => {
      fireEvent.click(document.querySelector(`.${styles.confirmButton}`));
    });
    expect(document.querySelector(`.${styles.addListName}`).textContent).toBe(
      "bee"
    );
    expect(
      document.querySelector(`.${styles.addList}`).classList.contains("hidden")
    ).toBeTruthy();
    expect(document.querySelector(`.SLbee`)).toBeTruthy();
  });
});
