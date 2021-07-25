import React from "react";
import Login from "./Login";
import { withRouter } from "react-router";
import { AuthContext, AuthProvider } from "../../Auth";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockValue = {
  error: null,
  isAuthenticated: true,
  currentUser: 'phony',
  login: jest.fn(),
  logout: jest.fn(),
  getAccessToken: jest.fn(),
}

describe("Login", () => {
  test("Input empty", () => {
    const history = { push: jest.fn() };
    const testUser = { currentUser: true };
    act(() => {
    const { queryByTestId } = render(
      <AuthProvider value={mockValue}>
        <Login history={history} testUser={testUser} />
      </AuthProvider>
    );

    const form = queryByTestId("loginForm");
    const email = queryByTestId("inputLoginEmail");
    const password = queryByTestId("inputLoginPassword");
    // fireEvent.submit(form);
    screen.debug();

    })
    // expect(screen.getByLabelText("Please enter email")).toBeTruthy();
    // expect(screen.getByLabelText("Please enter password")).toBeTruthy();
  });
});
