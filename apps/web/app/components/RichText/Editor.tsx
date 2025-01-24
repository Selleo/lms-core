import { EditorContent, useEditor } from "@tiptap/react";

import { cn } from "~/lib/utils";

import { plugins } from "./plugins";
import { defaultClasses } from "./styles";
import EditorToolbar from "./toolbar/EditorToolbar";

type EditorProps = {
  content?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
};

const Editor = ({ content, placeholder, onChange, id, className }: EditorProps) => {
  const editor = useEditor({
    extensions: [...plugins],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-xs sm:prose dark:prose-invert focus:outline-none max-w-full p-4",
      },
    },
  });

  if (!editor) return <></>;

  const editorClasses = cn("h-full", defaultClasses.ul, defaultClasses.ol, defaultClasses.taskList);

  return (
    <div className="prose w-full max-w-none overflow-hidden rounded-lg border border-neutral-300 bg-background dark:prose-invert [&_.ProseMirror]:leading-tight">
      <EditorToolbar editor={editor} />
      <div
        className={cn(
          "relative max-h-[600px] min-h-[200px] resize-y overflow-auto [&_.ProseMirror]:max-h-full [&_.ProseMirror]:min-h-full",
          className,
        )}
      >
        <EditorContent
          id={id}
          editor={editor}
          placeholder={placeholder}
          className={editorClasses}
        />
      </div>
    </div>
  );
};

export default Editor;
