import { MarkdownAbstractSyntaxTree, RenderProps } from "react-markdown";
import visit from "unist-util-visit";

export interface Attachments {
  /** An object of attachment names to string content. This will be used to look up image content when a image node is encountered */
  [attachmentName: string]: string;
}

//jupyter notebook cell attachment spec dictates all attachments start with this prefix.
const ATTACHMENT_PREFIX = "attachment:";

export default function attachmentTransformer(
  attachments?: Attachments
): (
  node: MarkdownAbstractSyntaxTree,
  renderProps?: RenderProps
) => MarkdownAbstractSyntaxTree {
  return function (
    tree: MarkdownAbstractSyntaxTree,
    props?: RenderProps
  ): MarkdownAbstractSyntaxTree {
    if (!attachments) return tree;
    visit(tree as any, "image", function (node: any) {
      const imageUrl: string = node.url;
      //if image url has reserved attachment prefix and cellAttachments were provided attempt to inline attachment data in markdown.
      if (imageUrl.indexOf(ATTACHMENT_PREFIX) === 0) {
        const key: string = imageUrl.substring(
          ATTACHMENT_PREFIX.length,
          imageUrl.length
        );
        const dataSrc: string = attachments[key];
        if (dataSrc) {
          node.url = dataSrc;
        }
      }
    });
    return tree;
  };
}
