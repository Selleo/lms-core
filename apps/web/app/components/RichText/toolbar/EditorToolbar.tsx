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

import { Toggle } from "~/components/ui/toggle";
import { ToggleGroup, Toolbar } from "~/components/ui/toolbar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

import { FormatType } from "./FormatType";

import type { Editor } from "@tiptap/react";

type EditorToolbarProps = {
  editor: Editor;
};

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const checkIsWordSelected = () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    return selectedText === "[word]";
  };

  const isWordSelected = checkIsWordSelected();

  return (
    <Toolbar className="m-0 flex items-center justify-between p-2" aria-label="Formatting options">
      <TooltipProvider>
        <ToggleGroup className="flex flex-row items-center gap-x-1" type="multiple">
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                pressed={editor.isActive("bold")}
              >
                <Bold className="h-4 w-4" />
                <TooltipContent>Bold: Makes selected text bold</TooltipContent>
              </Toggle>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                pressed={editor.isActive("italic")}
                value="italic"
              >
                <Italic className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic: Italicizes the selected text</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                pressed={editor.isActive("strike")}
              >
                <Strikethrough className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strikethrough: Adds a line through the text</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                pressed={editor.isActive("bulletList")}
              >
                <List className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet List: Starts a bulleted list</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                pressed={editor.isActive("orderedList")}
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Ordered List: Starts a numbered list</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                pressed={editor.isActive("codeBlock")}
              >
                <Code className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Code Block: Formats text as code</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                pressed={editor.isActive("blockquote")}
              >
                <Quote className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Quote: Formats text as a blockquote</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                size="sm"
                onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Minus className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Horizontal Rule: Inserts a horizontal line</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                size="sm"
                onPressedChange={() => {
                  const { from, to } = editor.state.selection;

                  if (from !== to) {
                    editor.chain().focus().insertContentAt({ from, to }, "[word]").run();
                  }
                }}
                pressed={isWordSelected}
              >
                [w]
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Word: Wraps selected text with [word]</TooltipContent>
          </Tooltip>
          <FormatType editor={editor} />
        </ToggleGroup>
        <ToggleGroup
          className="flex flex-row gap-x-1 items-center invisible sm:visible"
          type="multiple"
        >
          <Toggle
            size="sm"
            onPressedChange={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </Toggle>

          <Toggle
            size="sm"
            onPressedChange={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </Toggle>
        </ToggleGroup>
      </TooltipProvider>
    </Toolbar>
  );
};

export default EditorToolbar;
