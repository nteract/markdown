import { emptyMarkdownCell } from "@nteract/commutable";
import { mount, shallow } from "enzyme";
import React from "react";

import { MarkdownPreviewer } from "../src/markdown-previewer";

describe("MarkdownPreviewer ", () => {
  test("can be rendered", () => {
    const cell = shallow(
      <MarkdownPreviewer {...emptyMarkdownCell.toJS()}>
        <p>test</p>
      </MarkdownPreviewer>
    );
    expect(cell).not.toBeNull();
  });

  test("toggles view mode with key events", () => {
    const focusEditor = jest.fn();

    const cell = mount(
      <MarkdownPreviewer
        {...emptyMarkdownCell.toJS()}
        focusEditor={focusEditor}
        editorFocused={false}
        cellFocused
      >
        <p>Test</p>
      </MarkdownPreviewer>
    );

    // Starts in view mode
    expect(cell.state("view")).toBe(true);
    cell.simulate("keydown", { key: "Enter" });
    /** This is here to simulate the effect of the focusedEditor state
     * being update.
     */
    cell.setProps({ editorFocused: true });
    expect(focusEditor).toBeCalled();
    expect(cell.state("view")).toBe(false);
    expect(focusEditor).toHaveBeenCalled();

    cell.simulate("keydown", { key: "Enter", shiftKey: true });
    // Stays in view mode on shift enter
    /** This is here to simulate the effect of the focusedEditor state
     * being update.
     */
    cell.setProps({ editorFocused: false });
    expect(cell.state("view")).toBe(true);
    // Enter key enters edit mode
    // Back to view mode
    cell.simulate("keydown", { key: "Enter", shiftKey: true });
    expect(cell.state("view")).toBe(true);
  });

  test("navigates to the previous cell with the up arrow key", () => {
    const focusAbove = jest.fn();

    const cell = shallow(
      <MarkdownPreviewer {...emptyMarkdownCell.toJS()} focusAbove={focusAbove}>
        <p>Test</p>
      </MarkdownPreviewer>
    );

    cell.simulate("keydown", { key: "ArrowUp" });

    expect(focusAbove).toHaveBeenCalled();
  });

  test("navigates to the next cell with the down arrow key", () => {
    const focusBelow = jest.fn();

    const cell = shallow(
      <MarkdownPreviewer {...emptyMarkdownCell.toJS()} focusBelow={focusBelow}>
        <p>Test</p>
      </MarkdownPreviewer>
    );

    cell.simulate("keydown", { key: "ArrowDown" });

    expect(focusBelow).toHaveBeenCalled();
  });
});
