import { EditorContent, useEditor } from "@tiptap/react";
// eslint-disable-next-line import/no-named-as-default
import StarterKit from "@tiptap/starter-kit";

import { cn } from "~/lib/utils";

type ViewerProps = {
  content: string;
  style?: "default" | "prose";
  className?: string;
  variant?: "default" | "lesson";
};

const defaultClasses = {
  ul: "[&>div>ul]:list-disc [&>div>ul]:list-inside [&>div>ul>li>p]:inline",
  ol: "[&>div>ol]:list-decimal [&>div>ol]:list-inside [&>div>ol>li>p]:inline",
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
    extensions: [StarterKit],
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

  const editorClasses = cn(defaultClasses.ul, defaultClasses.ol, ...variantClasses);

  return (
    <article className={classNames}>
      <EditorContent editor={editor} readOnly={true} className={editorClasses} />
    </article>
  );
};

export default Viewer;
