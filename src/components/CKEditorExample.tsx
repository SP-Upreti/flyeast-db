import { useState } from 'react';
import CKRichTextEditor from './CKRichTextEditor';
import RichTextContent from './RichTextContent';

/**
 * Example component showing how to use CKRichTextEditor
 */
export default function CKEditorExample() {
  const [content, setContent] = useState('<p>Start typing your content here...</p>');
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">CKEditor 5 Example</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          {showPreview ? 'Show Editor' : 'Show Preview'}
        </button>
        <button
          onClick={() => setContent('')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Content
        </button>
      </div>

      {!showPreview ? (
        <CKRichTextEditor
          value={content}
          onChange={(data) => {
            console.log('Content changed:', data);
            setContent(data);
          }}
          placeholder="Write something amazing..."
          minHeight="500px"
        />
      ) : (
        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Preview:</h2>
          <RichTextContent content={content} />
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">HTML Output:</h3>
        <pre className="text-xs overflow-x-auto bg-white p-3 rounded">
          {content}
        </pre>
      </div>
    </div>
  );
}
