import { Attachments } from "./attachment-transformer";

/** Conforms to the jupyter nb cell attachment spec */
export interface CellAttachments {
  /** The name of the attachment to be used for lookup via the img markup */
  [attachmentName: string]: {
    /** A series of mimetype keys to base64 content */
    [mimeType: string]: string;
  };
}

/**
 * Utility function that takes jupyter nb format cell attachment and returns @Attachments
 * @Attachments is an object with the file name as the key and the value as a blob url.
 * @param cellAttachments Jupyter nb format cell attachments
 */
export function toAttachments(cellAttachments: CellAttachments): Attachments {
  const attachments = Object.keys(cellAttachments).map((key) =>
    Object.keys(cellAttachments[key]).map((mimeType) =>
      toAttachment(key, mimeType, cellAttachments[key][mimeType])
    )
  );
  const flattened = attachments.flat(1);
  return flattened.reduce((acc, i) => Object.assign(acc, i));
}

/**
 * Converts content to a blob url and returns an attachment with the attachmentName as the key
 * @param attachmentName The name of the attachment
 * @param mediaType The media type of the content
 * @param content The original content
 */
function toAttachment(
  attachmentName: string,
  mediaType: string,
  content: string
): Attachments {
  const decodedData = window.atob(content);
  const uInt8Array = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }
  const blob = new Blob([uInt8Array], {
    type: mediaType,
  });

  const url = URL.createObjectURL(blob);
  return { [attachmentName]: url };
}
