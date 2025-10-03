"use client";

import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

import React, { useState } from "react";
import { EditorState, ContentState } from "draft-js";

export default function MyRichTextEditor({ value, onChange }) {
  const [editorState, setEditorState] = useState(
    value
      ? EditorState.createWithContent(ContentState.createFromText(value))
      : EditorState.createEmpty()
  );

  const handleEditorChange = (state) => {
    setEditorState(state);
    const rawText = state.getCurrentContent().getPlainText();
    onChange(rawText);
  };

  const toolbarOptions = {
    options: ["inline", "blockType", "fontSize", "list", "textAlign", "link", "emoji", "image", "history"],
    inline: { options: ["bold", "italic", "underline", "strikethrough", "monospace"] },
    
  };

  return (
    <div className="border rounded-md p-2">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        toolbar={toolbarOptions}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
    </div>
  );
}
