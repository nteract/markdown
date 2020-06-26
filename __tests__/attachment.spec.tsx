import * as React from "react";
import { mount } from "enzyme";

import MarkdownRender from "../src";

function buildSource(attachment?: string): string {
  return `
   "## Calling PLTE (and other GraphQL APIs) from Python\n",
    "\n",
    "\n",
    "The PLTE API is exposed via [GraphQL](https://graphql.org/), which is a REST-like interface served over HTTP.  The advantage of GraphQL is that it allows the user to specify which fields they would like to receive, and also provides mechanisms for extensibility (roughly analogous to SQL joins).\n",
    "\n",
    "\n",
    "${attachment}",
    "\n",
    "\n"
`;
}

const cellAttachments = {
  "spot-the-difference-2a.jpg":
    "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4",
  "someotherimage.png": "data:image/png;base64,someothercontent",
};

const inlineAttachment = "![image.png](attachment:spot-the-difference-2a.jpg)";

describe("attachment", () => {
  test("Attachment should be added to source if the source contains a valid jupyter attachment reference", () => {
    const wrapped = mount(
      <MarkdownRender
        source={buildSource(inlineAttachment)}
        attachments={cellAttachments}
      ></MarkdownRender>
    );
    const imgProps = wrapped.find("img").props();
    expect(imgProps).toHaveProperty(
      "src",
      "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4"
    );
  });

  test("Source is unaffected when it contains jupyter attachment reference and cell attachments is not provided", () => {
    const wrapped = mount(
      <MarkdownRender source={buildSource(inlineAttachment)}></MarkdownRender>
    );
    const imgProps = wrapped.find("img").props();
    expect(imgProps).toHaveProperty(
      "src",
      "attachment:spot-the-difference-2a.jpg"
    );
  });

  test("Source is unaffected when empty attachment is provided", () => {
    const wrapped = mount(
      <MarkdownRender
        source={buildSource("(![someimg](bogus.jpg)")}
        attachments={{}}
      ></MarkdownRender>
    );
    const imgProps = wrapped.find("img").props();
    expect(imgProps).toHaveProperty("src", "bogus.jpg");
  });

  test("Source is unaffected when it contains jupyter attachment reference and empty attachment is provided", () => {
    const wrapped = mount(
      <MarkdownRender
        source={buildSource(inlineAttachment)}
        attachments={{}}
      ></MarkdownRender>
    );
    const imgProps = wrapped.find("img").props();
    expect(imgProps).toHaveProperty(
      "src",
      "attachment:spot-the-difference-2a.jpg"
    );
  });

  test("Source is unaffected when it contains no jupyter attachment reference and cell attachments are provided", () => {
    const wrapped = mount(
      <MarkdownRender
        source={buildSource("(![someimg](bogus.jpg)")}
        attachments={cellAttachments}
      ></MarkdownRender>
    );
    const imgProps = wrapped.find("img").props();
    expect(imgProps).toHaveProperty("src", "bogus.jpg");
  });
});
