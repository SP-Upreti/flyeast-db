import React from "react";

interface RichTextContentProps {
  content: string;
  className?: string;
}

/**
 * Component to display rich text content with proper styling
 * Use this to render HTML content from the RichTextEditor
 */
const RichTextContent: React.FC<RichTextContentProps> = ({
  content,
  className = "",
}) => {
  return (
    <div
      className={`prose-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextContent