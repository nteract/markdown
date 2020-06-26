import * as React from "react";
import { mount } from "enzyme";

import { toAttachments } from "../src/attachment/attachment";
import { Attachments } from "../src/attachment/attachment-transformer";
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

const inlineAttachment = "![image.png](attachment:spot-the-difference-2a.jpg)";

const cellAttachments = {
  "spot-the-difference-2a.jpg": {
    "image/jpeg":
      "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4",
  },
  "someotherimage.png": {
    "image/png": "someothercontent",
  },
};

const attchmnts: Attachments = toAttachments(cellAttachments);

//uses value 'mocked' defined in test-setup.js for return of URL.createObjectURL. Jest can't execute logic that uses this method.
describe("attachment", () => {
  test("toAttachments properly converts jupyter nb format cell attachments to markdown AST based attachments", () => {
    expect(attchmnts["spot-the-difference-2a.jpg"]).toEqual("mocked");
    expect(attchmnts["someotherimage.png"]).toEqual("mocked");
  });

  test("Attachments should be added to source if there is matching reference", () => {
    const wrapped = mount(
      <MarkdownRender
        source={buildSource(inlineAttachment)}
        attachments={attchmnts}
      ></MarkdownRender>
    );
    const imgProps = wrapped.find("img").props();
    expect(imgProps).toHaveProperty("src", "mocked");
  });

  test("Images should be unaffected if they are not juptyer attachments", () => {
    const wrapped = mount(
      <MarkdownRender
        source={buildSource("(![img](bogus.jpg)")}
      ></MarkdownRender>
    );
    const imgProps = wrapped.find("img").props();
    expect(imgProps).toHaveProperty("src", "bogus.jpg");
  });
});
