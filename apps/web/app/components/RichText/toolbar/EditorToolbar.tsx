import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { ToggleGroup, Toolbar } from "~/components/ui/toolbar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

import { FormatType } from "./FormatType";

import type { Editor } from "@tiptap/react";

type EditorToolbarProps = {
  editor: Editor;
};

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const handleToggle = (action: () => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    action();
  };

  return (
    <Toolbar className="m-0 flex items-center justify-between p-2" aria-label="Formatting options">
      <TooltipProvider>
        <ToggleGroup className="flex flex-row items-center gap-x-1" type="multiple">
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                className={`bg-transparent text-black ${editor.isActive("bold") ? "bg-blue-100" : "hover:bg-blue-100"}`}
                onClick={handleToggle(() => editor.chain().focus().toggleBold().run())}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold: Makes selected text bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                className={`bg-transparent text-black ${editor.isActive("italic") ? "bg-blue-100" : "hover:bg-blue-100"}`}
                onClick={handleToggle(() => editor.chain().focus().toggleItalic().run())}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic: Italicizes the selected text</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                className={`bg-transparent text-black ${editor.isActive("strike") ? "bg-blue-100" : "hover:bg-blue-100"}`}
                onClick={handleToggle(() => editor.chain().focus().toggleStrike().run())}
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Strikethrough: Adds a line through the text</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                className={`bg-transparent text-black ${editor.isActive("bulletList") ? "bg-blue-100" : "hover:bg-blue-100"}`}
                onClick={handleToggle(() => editor.chain().focus().toggleBulletList().run())}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List: Starts a bulleted list</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                className={`bg-transparent text-black ${editor.isActive("orderedList") ? "bg-blue-100" : "hover:bg-blue-100"}`}
                onClick={handleToggle(() => editor.chain().focus().toggleOrderedList().run())}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ordered List: Starts a numbered list</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                className={`bg-transparent text-black ${editor.isActive("codeBlock") ? "bg-blue-100" : "hover:bg-blue-100"}`}
                onClick={handleToggle(() => editor.chain().focus().toggleCodeBlock().run())}
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Code Block: Formats text as code</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                className={`bg-transparent text-black ${editor.isActive("blockquote") ? "bg-blue-100" : "hover:bg-blue-100"}`}
                onClick={handleToggle(() => editor.chain().focus().toggleBlockquote().run())}
              >
                <Quote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Quote: Formats text as a blockquote</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                onClick={handleToggle(() => editor.chain().focus().setHorizontalRule().run())}
                className={`bg-transparent text-black hover:bg-blue-100`}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Horizontal Rule: Inserts a horizontal line</TooltipContent>
          </Tooltip>
          <FormatType editor={editor} />
        </ToggleGroup>
        <ToggleGroup
          className="flex flex-row gap-x-1 items-center invisible sm:visible"
          type="multiple"
        >
          <Button
            size="sm"
            onClick={handleToggle(() => editor.chain().focus().undo().run())}
            className={`bg-transparent text-black ${editor.can().chain().focus().undo().run() ? "hover:bg-blue-100" : ""}`}
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            onClick={handleToggle(() => editor.chain().focus().redo().run())}
            className={`bg-transparent text-black ${editor.can().chain().focus().redo().run() ? "hover:bg-blue-100" : ""}`}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </ToggleGroup>
      </TooltipProvider>
    </Toolbar>
  );
};

export default EditorToolbar;
