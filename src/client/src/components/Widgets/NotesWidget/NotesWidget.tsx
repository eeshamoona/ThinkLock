import React, { useEffect } from "react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import "./notesWidget.scss";
import { useMantineTheme } from "@mantine/core";
import {
  getNotes,
  updateNotesWidget,
} from "../../../services/widgetsAPICallerService";

interface NotesWidgetProps {
  id: number;
}
const NotesWidget = ({ id }: NotesWidgetProps) => {
  const theme = useMantineTheme();

  const [content, setContent] = React.useState<string>("");

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await getNotes(id);
      setContent(res);
    };
    fetchNotes();
  }, [id]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        Placeholder.configure({ placeholder: "Start Typing..." }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ],
      content: content,
      onBlur({ editor }) {
        const updatedContent = editor.getHTML().toString();
        updateNotesWidget(id, updatedContent).then(() => {
          setContent(updatedContent);
        });
      },
    },
    [content]
  );
  return (
    <RichTextEditor
      editor={editor}
      className="notes-widget-container"
      h={"100%"}
    >
      <RichTextEditor.Toolbar
        sticky
        className="notes-widget-toolbar"
        style={{
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        }}
      >
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content className="notes-widget-content" />
    </RichTextEditor>
  );
};

export default NotesWidget;
