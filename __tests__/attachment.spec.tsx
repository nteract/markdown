import * as React from "react";
import { mount } from "enzyme";
import Markdown from "../src";

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

const defaultAttachment = "![image.png](attachment:spot-the-difference-2a.jpg)";

describe("cell attachments", () => {
  test("it should render attachment data inline when attachments are provided and a valid attachment reference is in the source", () => {
    const attachments = {
      "spot-the-difference-2a.jpg": {
        "image/jpeg": "somecontent",
      },
      "someotherimage.png": {
        "image/png": "someothercontent",
      },
    };
    const wrapper = mount(
      <Markdown
        source={buildSource(defaultAttachment)}
        attachments={attachments}
      />
    );
    expect(
      wrapper.contains(
        <img alt="image.png" src="data:image/jpeg;base64,somecontent" />
      )
    );
  });

  test("it should have no effect on source when no attachments are provided and source contains an attachment reference", () => {
    const wrapper = mount(<Markdown source={buildSource(defaultAttachment)} />);
    expect(
      wrapper.contains(
        <img alt="image.png" src="attachment:spot-the-difference-2a.jpg" />
      )
    );
  });

  test("it should have no effect on source when attachments are provided and source has no attachment reference", () => {
    const attachment = {
      throwAway: {
        "image/png": "theImageContent",
      },
    };
    mount(<Markdown source={buildSource()} attachments={attachment} />);
  });

  test("it should have no effect on source when attachments are provided and source has an attachment reference that is not in attachments object", () => {
    const attachment = {
      throwAway: {
        "image/png": "theImageContent",
      },
    };
    mount(
      <Markdown
        source={buildSource(defaultAttachment)}
        attachments={attachment}
      />
    );
  });
});
