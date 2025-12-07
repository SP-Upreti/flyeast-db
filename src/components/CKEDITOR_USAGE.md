# CKEditor 5 Implementation Guide

## Overview
This project now includes a fully-featured CKEditor 5 implementation with comprehensive formatting options.

## Files Created
- `src/components/CKRichTextEditor.tsx` - Main CKEditor component
- `src/styles/ckeditor-custom.css` - Custom styling for CKEditor
- `src/components/CKEditorExample.tsx` - Example usage component

## Installation
The required packages have been installed:
```bash
pnpm add ckeditor5 @ckeditor/ckeditor5-react
```

## Basic Usage

```tsx
import CKRichTextEditor from '@/components/CKRichTextEditor';
import { useState } from 'react';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <CKRichTextEditor
      value={content}
      onChange={(data) => setContent(data)}
      placeholder="Start typing..."
      minHeight="400px"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Initial HTML content |
| `onChange` | `(data: string) => void` | - | Callback when content changes |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable editor |
| `minHeight` | `string` | `'400px'` | Minimum editor height |

## Features Included

### Text Formatting
- Bold, Italic, Underline, Strikethrough
- Subscript, Superscript
- Text color and background color
- Font family and font size
- Remove formatting

### Headings
- H1 through H6
- Paragraph

### Lists
- Bullet lists
- Numbered lists
- Todo lists (checkboxes)

### Alignment
- Left, Center, Right, Justify
- Indent/Outdent

### Rich Content
- Links with custom attributes
- Images (upload, URL, resize, align)
- Tables with merge cells
- Media embeds
- Code blocks
- Blockquotes
- Horizontal lines
- Page breaks

### Advanced Features
- Find and replace
- Special characters
- Highlight text
- Mentions (@mentions)
- Accessibility help
- Undo/Redo

## Displaying Content

Use the existing `RichTextContent` component to display the HTML output:

```tsx
import RichTextContent from '@/components/RichTextContent';

function DisplayContent({ htmlContent }) {
  return <RichTextContent content={htmlContent} />;
}
```

## Custom Styling

The editor includes custom CSS in `src/styles/ckeditor-custom.css`. You can modify this file to match your design system.

## Example Component

See `src/components/CKEditorExample.tsx` for a complete working example with preview functionality.

## License

This implementation uses CKEditor 5 with GPL license. For commercial use, you may need to purchase a commercial license from CKSource.

## Comparison with TipTap

Your project also has a TipTap implementation (`RichTextEditor.tsx`). Key differences:

**CKEditor 5:**
- More comprehensive out-of-the-box features
- Better table support with merge cells
- Built-in find/replace
- More polished UI
- GPL license (commercial license available)

**TipTap:**
- More customizable and extensible
- Lighter weight
- MIT license
- Better for custom implementations

Choose based on your needs!
