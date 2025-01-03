import * as Accordion from "@radix-ui/react-accordion";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor, Node } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import type { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { QuestionType } from "../QuizLessonForm.types";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

type FillInTheBlankQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
};

const ButtonNode = Node.create({
  name: "button",
  group: "inline",
  inline: true,
  content: "text*",
  parseHTML() {
    return [
      {
        tag: "button",
      },
    ];
  },
  renderHTML({ node }) {
    return [
      "button",

      {
        type: "button",
        class: "bg-primary-200 text-white px-4 rounded-xl cursor-pointer align-baseline",
      },
      node.textContent,
    ];
  },
});

const FillInTheBlanksQuestion = ({ form, questionIndex }: FillInTheBlankQuestionProps) => {
  const [newWord, setNewWord] = useState("");
  const [isAddingWord, setIsAddingWord] = useState(false);
  const [addedWords, setAddedWords] = useState<string[]>([]);
  const errors = form.formState.errors;
  const { t } = useTranslation();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Color,
      TextStyle,
      ButtonNode,
      Highlight.configure({ multicolor: true }),
    ],
    content: form.getValues(`questions.${questionIndex}.description`) || "",
  });

  const currentOptions = form.getValues(`questions.${questionIndex}.options`) || [];

  const handleDragStart = (word: string, e: React.DragEvent) => {
    e.dataTransfer.setData("text", word);
  };

  function containsButtonWithWord(word: string) {
    const currentValue = form.getValues(`questions.${questionIndex}.description`);

    const escapedWord = word.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&");

    const regex = new RegExp(
      `<button type="button" class="bg-primary-200 text-white px-4 rounded-xl cursor-pointer align-baseline">[\\s\\S]*?\\b${escapedWord}\\b[\\s\\S]*?<\\/button>`,
      "s",
    );

    return regex.test(currentValue as string);
  }

  const handleRemoveWord = (index: number) => {
    const updatedOptions = currentOptions.filter((_, i) => i !== index);
    form.setValue(`questions.${questionIndex}.options`, updatedOptions, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const word = e.dataTransfer.getData("text");
    if (!word || !editor) return;

    if (containsButtonWithWord(word)) return;

    const buttonHTML = `<button type="button" class="bg-primary-200 text-white px-4 rounded-xl cursor-pointer align-baseline">
    ${word}
    <span class="text-white cursor-pointer" data-word="${word}" onmousedown="event.preventDefault(); handleDelete(event)">X</span>
  </button>`;

    editor.chain().focus().insertContent(buttonHTML).run();

    const regex = /<button[^>]*class="[^"]*bg-primary-200[^"]*"[^>]*>([^<]+)<\/button>/g;

    const currentValue = form.getValues(`questions.${questionIndex}.description`) as string;

    const buttonValues = currentValue
      ? [...currentValue.matchAll(regex)]
          .map((match) => match[1]?.trim() || "")
          .map((text) => text.replace(/\n/g, "").split(" ")[0])
      : [];

    const updatedOptions = [...currentOptions];

    buttonValues.forEach((button: string, index: number) => {
      const optionIndex = updatedOptions.findIndex((option) => option.optionText === button);

      if (optionIndex !== -1) {
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          displayOrder: index + 1,
          isCorrect: true,
        };
      }
    });

    form.setValue(`questions.${questionIndex}.options`, updatedOptions, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setAddedWords(buttonValues);
  };

  const handleAddWord = () => {
    const trimmedWord = newWord.trim();

    if (trimmedWord !== "" && !currentOptions.some((option) => option.optionText === trimmedWord)) {
      const newOption = {
        optionText: trimmedWord,
        isCorrect: false,
        displayOrder: currentOptions.length + 1,
      };

      form.setValue(`questions.${questionIndex}.options`, [...currentOptions, newOption], {
        shouldDirty: true,
      });

      setNewWord("");
      setIsAddingWord(false);
    } else {
      setIsAddingWord(false);
    }
  };

  const handleRemoveQuestion = () => {
    const currentQuestions = form.getValues("questions") || [];
    const updatedQuestions = currentQuestions.filter((_, index) => index !== questionIndex);
    form.setValue("questions", updatedQuestions, { shouldDirty: true });
  };

  useEffect(() => {
    if (!editor) return;

    editor.on("update", () => {
      const html = editor.getHTML();
      form.setValue(`questions.${questionIndex}.description`, html, { shouldDirty: true });
    });

    return () => {
      editor.off("update");
    };
  }, [editor, form, questionIndex]);

  useEffect(() => {
    if (editor && form.getValues(`questions.${questionIndex}.description`) !== editor.getHTML()) {
      const content = form.getValues(`questions.${questionIndex}.description`);
      editor.commands.setContent(content as string);
    }
  }, [form.getValues(`questions.${questionIndex}.description`), editor, questionIndex, form]);

  useEffect(() => {
    if (!editor) return;

    const handleEditorClick = (event: MouseEvent) => {
      const button = (event?.target as HTMLElement).closest("button");

      if (button) {
        button.removeAttribute("contenteditable");
        const buttonHtml = button.outerHTML;
        form.setValue(
          `questions.${questionIndex}.description`,
          form.getValues(`questions.${questionIndex}.description`)?.replace(buttonHtml, ""),
          { shouldDirty: true },
        );

        const optionValue = button.innerText.trim().replace(/\s+/g, " ").split(" ")[0];

        if (optionValue) {
          const updatedOptions = form
            .getValues(`questions.${questionIndex}.options`)
            ?.map((option) =>
              option.optionText === optionValue ? { ...option, isCorrect: false } : option,
            );
          form.setValue(`questions.${questionIndex}.options`, updatedOptions, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
        button.remove();

        const currentValue = form.getValues(`questions.${questionIndex}.description`) as string;

        const regex = /<button[^>]*class="[^"]*bg-primary-200[^"]*"[^>]*>([^<]+)<\/button>/g;

        const buttonValues = currentValue
          ? [...currentValue.matchAll(regex)]
              .map((match) => match[1]?.trim() || "")
              .map((text) => text.replace(/\n/g, "").split(" ")[0])
          : [];

        const updatedOptions = form
          .getValues(`questions.${questionIndex}.options`)
          ?.map((option) => {
            return {
              ...option,
              displayOrder: buttonValues.indexOf(option.optionText) + 1,
              isCorrect: buttonValues.includes(option.optionText),
            };
          });

        form.setValue(`questions.${questionIndex}.options`, updatedOptions, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    };

    editor.view.dom.addEventListener("click", handleEditorClick);

    return () => {
      editor.view.dom.removeEventListener("click", handleEditorClick);
    };
  }, [editor, form, questionIndex]);

  return (
    <Accordion.Root key={questionIndex} type="single" collapsible>
      <Accordion.Item value={`item-${questionIndex}`}>
        <div className="p-2 mt-3 rounded-xl border-0 transition-all duration-300">
          <div className="ml-14">
            <span className="text-red-500 mr-1">*</span>
            <Label className="body-sm-md">{t("words")}</Label>
            <div className="flex flex-wrap gap-2 items-center">
              {currentOptions.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-4 rounded-full flex items-center justify-between space-x-2",
                    option.isCorrect ? "bg-success-100" : "bg-primary-200",
                  )}
                  draggable={!containsButtonWithWord(option.optionText)}
                  onDragStart={(e) => handleDragStart(option.optionText, e)}
                >
                  <Icon name="DragAndDropIcon" />
                  {addedWords.includes(option.optionText) && <Icon name="Success" />}
                  <span>{option.optionText}</span>
                  <Button
                    onClick={() => handleRemoveWord(index)}
                    type="button"
                    className="text-color-black bg-transparent p-0 rounded-full"
                  >
                    X
                  </Button>
                </div>
              ))}
              <div className="flex items-center">
                {!isAddingWord && (
                  <Button
                    onClick={() => setIsAddingWord(true)}
                    type="button"
                    className="mt-4 bg-blue-700 text-white rounded-full flex items-center mb-4"
                  >
                    <Icon name="Plus" />
                    {t("addWords")}
                  </Button>
                )}
              </div>

              {isAddingWord && (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder={t("fillInTheBlankEnterWord")}
                    className="flex-1"
                  />
                  <Button onClick={handleAddWord} type="button" className="bg-blue-700 text-white">
                    {t("add")}
                  </Button>
                  <Button
                    onClick={() => setIsAddingWord(false)}
                    type="button"
                    className="bg-red-500 border border-neutral-200 text-red-500 bg-color-transparent"
                  >
                    {t("common.button.cancel")}
                  </Button>
                </div>
              )}
            </div>
            <>
              {errors && (
                <p className="text-red-500 text-sm ml-">
                  {(errors?.questions as { options?: { message?: string } })?.options?.message}
                </p>
              )}
            </>

            <FormField
              control={form.control}
              name={`questions.${questionIndex}.description`}
              render={() => (
                <FormItem className="mt-5">
                  <Label htmlFor="description" className="body-sm-md">
                    <span className="text-red-500 mr-1">*</span>
                    {t("sentences")}
                  </Label>
                  <FormControl>
                    <EditorContent
                      editor={editor}
                      className="w-full h-40 p-4 border border-gray-300 rounded-lg bg-white text-black"
                      onDrop={handleDrop}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              className="text-error-700 bg-color-white mb-4 border border-neutral-300 mt-4"
              onClick={handleRemoveQuestion}
            >
              {t("deleteQuestion")}
            </Button>
          </div>
        </div>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default FillInTheBlanksQuestion;
