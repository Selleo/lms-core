import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
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
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex items-start gap-2 [&_p]:inline [&_p]:m-0",
        },
        onReadOnlyChecked: (_node, _checked) => {
          return true;
        },
      }),
    ],
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
    <div className="prose w-full max-w-none overflow-hidden rounded-lg border border-neutral-300 bg-background dark:prose-invert [&_.ProseMirror]:leading-tight">
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
