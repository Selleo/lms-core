import { EditorContent, useEditor } from "@tiptap/react";
// eslint-disable-next-line import/no-named-as-default
import StarterKit from "@tiptap/starter-kit";

import { cn } from "~/lib/utils";

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
    extensions: [StarterKit],
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

  return (
    <div className="prose bg-background dark:prose-invert w-full max-w-none overflow-hidden rounded-lg border border-neutral-300 [&_.ProseMirror]:leading-tight">
      <EditorToolbar editor={editor} />
      <div
        className={cn(
          "relative max-h-[600px] min-h-[200px] resize-y overflow-auto [&_.ProseMirror]:max-h-full [&_.ProseMirror]:min-h-full",
          className,
        )}
      >
        <EditorContent id={id} editor={editor} placeholder={placeholder} className="h-full" />
      </div>
    </div>
  );
};

export default Editor;
