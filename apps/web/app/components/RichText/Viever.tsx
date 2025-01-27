import { EditorContent, useEditor } from "@tiptap/react";

import { cn } from "~/lib/utils";

import { plugins } from "./plugins";
import { defaultClasses } from "./styles";

type ViewerProps = {
  content: string;
  style?: "default" | "prose";
  className?: string;
  variant?: "default" | "lesson";
};

const lessonVariantClasses = {
  layout: "[&>div]:flex [&>div]:flex-col [&>div]:gap-y-6",
  h2: "[&>div>h2]:h6 [&>div>h2]:text-neutral-950",
  p: "[&>div>p]:body-base [&>div>p>strong]:body-base-md [&>div>p]:text-neutral-900",
  ul: "[&>div>ul>li>p]:body-base [&>div>ul>li>p]:text-neutral-900 [&>div>ul>li>p>strong]:body-base-md [&>div>ul>li>p>strong]:text-neutral-950",
  ol: "[&>div>ol>li>p]:body-base [&>div>ol>li>p]:text-neutral-900 [&>div>ol>li>p>strong]:body-base-md [&>div>ol>li>p>strong]:text-neutral-950",
};

const Viewer = ({ content, style, className, variant = "default" }: ViewerProps) => {
  const editor = useEditor({
    extensions: [...plugins],
    content: content,
    editable: false,
  });

  if (!editor) return <></>;

  const classNames = cn(
    { "prose-mt-0 prose max-w-none dark:prose-invert": style === "prose" },
    className,
  );

  const variantClasses =
    variant === "lesson"
      ? [
          lessonVariantClasses.h2,
          lessonVariantClasses.p,
          lessonVariantClasses.layout,
          lessonVariantClasses.ol,
          lessonVariantClasses.ul,
        ]
      : [];

  const editorClasses = cn(
    defaultClasses.ul,
    defaultClasses.ol,
    defaultClasses.taskList,
    ...variantClasses,
  );

  return (
    <article className={classNames}>
      <EditorContent editor={editor} readOnly={true} className={editorClasses} />
    </article>
  );
};

export default Viewer;
