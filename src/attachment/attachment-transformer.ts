import { MarkdownAbstractSyntaxTree, RenderProps } from "react-markdown";
const visit = require("unist-util-visit"); //TODO define proper types for this or add types dev dependency

export interface CellAttachments {
  [key: string]: CellAttachment;
}

export interface CellAttachment {
  [key: string]: string;
}

//jupyter notebook cell attachment spec dictates all attachments start with this prefix.
const ATTACHMENT_PREFIX = "attachment:";

export default function attachmentTransformer(
  cellAttachments?: CellAttachments
): (
  node: MarkdownAbstractSyntaxTree,
  renderProps?: RenderProps
) => MarkdownAbstractSyntaxTree {
  return function (
    tree: MarkdownAbstractSyntaxTree,
    props?: RenderProps
  ): MarkdownAbstractSyntaxTree {
    visit(tree, "image", function (node: any) {
      const imageUrl: string = node.url;
      //if image url has reserved attachment prefix and cellAttachments were provided attempt to inline attachment data in markdown.
      if (imageUrl.indexOf(ATTACHMENT_PREFIX) === 0 && cellAttachments) {
        const key: string = imageUrl.substring(
          ATTACHMENT_PREFIX.length,
          imageUrl.length
        );
        const dataSrc = getAttachmentAsDataSrc(cellAttachments, key);
        if (dataSrc) node.url = dataSrc;
      }
    });
    return tree;
  };
}

/**
 * Get attachment data from the cell attachments map
 * @param cellAttachments The map of cell attachments
 * @param key The key of the cell attachment to get the data for from the map
 */
function getAttachmentAsDataSrc(
  cellAttachments: CellAttachments,
  key: string
): string | undefined {
  const attachmentData = cellAttachments[key];
  if (attachmentData) {
    //It shouldn't be possible to have more than one key since the parent object is keyed off the file name.
    const mediaType = Object.keys(attachmentData)[0];
    const base64 = attachmentData[mediaType];
    return inlineImage(base64, mediaType);
  } else {
    return undefined;
  }
}

/**
 * Construct inline image data with base64 content.
 * @param base64 The content as base64
 * @param mediaType The media type of the base64 content
 */
function inlineImage(base64: string, mediaType: string): string {
  return "data:" + mediaType + ";" + "base64" + "," + base64;
}
