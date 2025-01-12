import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import axios from "axios";

jest.mock("axios");

describe("App Component", () => {
  test("renders login page when no token is provided", () => {
    render(<App />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test("fetches and displays tasks when a token is provided", async () => {
    const mockTasks = [
      { id: 1, name: "Task 1" },
      { id: 2, name: "Task 2" },
    ];
    axios.get.mockResolvedValueOnce({ data: mockTasks });

    render(<App />);
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "1234" },
    });
    fireEvent.click(screen.getByText(/Login/i));

    const task1 = await screen.findByText(/Task 1/);
    const task2 = await screen.findByText(/Task 2/);

    expect(task1).toBeInTheDocument();
    expect(task2).toBeInTheDocument();
  });

  test("shows error message when login fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Invalid credentials"));
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "wrongUser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongPassword" },
    });
    fireEvent.click(screen.getByText(/Login/i));

    const errorMessage = await screen.findByText(/Invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("fetches and displays team stats", async () => {
    const mockStats = { totalTasks: 10, completedTasks: 8 };
    axios.get.mockResolvedValueOnce({ data: mockStats });

    render(<App />);
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "testPassword" },
    });
    fireEvent.click(screen.getByText(/Login/i));

    const totalTasks = await screen.findByText(/totalTasks/i);
    const completedTasks = await screen.findByText(/completedTasks/i);

    expect(totalTasks).toBeInTheDocument();
    expect(completedTasks).toBeInTheDocument();
  });
});
