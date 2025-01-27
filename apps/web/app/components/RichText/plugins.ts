import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { StarterKit } from "@tiptap/starter-kit";

export const plugins = [
  StarterKit,
  TaskList.configure({
    HTMLAttributes: {
      class: "list-none",
    },
  }),
  TaskItem.configure({
    nested: true,
    HTMLAttributes: {
      class: "flex items-start gap-2 [&_p]:inline [&_p]:m-0",
    },
    onReadOnlyChecked: (_node, _checked) => true,
  }),
];
