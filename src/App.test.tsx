import { render } from "@testing-library/react";
import React from "react";

import App from "./App";

describe("smoke test", () => {
  it("should mount the app with no errors", () => {
    render(<App />);

    expect(true).toBeTruthy();
  });
});
