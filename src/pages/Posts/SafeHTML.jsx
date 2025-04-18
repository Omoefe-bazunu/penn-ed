import React from "react";
import DOMPurify from "dompurify";

const SafeHTML = ({ html, className, maxLength }) => {
  if (!html) return null;

  let processedHtml = html;
  if (maxLength && html.length > maxLength) {
    processedHtml = `${html.substring(0, maxLength)}...`;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(processedHtml),
      }}
    />
  );
};

export default SafeHTML;
