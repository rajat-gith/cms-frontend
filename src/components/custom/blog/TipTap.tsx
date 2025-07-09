"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type TiptapProps = {
	value: string;
	onChange: (value: string) => void;
};

const Tiptap = ({ value, onChange }: TiptapProps) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link.configure({ openOnClick: false }),
			Image,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Placeholder.configure({
				placeholder: "Start writing your blog...",
			}),
			TextStyle,
			Color,
			Highlight,
		],
		content: value,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value, false);
		}
	}, [value, editor]);

	if (!editor) return null;

	const renderButton = (
		label: string,
		command: () => void,
		isActive: boolean = false
	) => (
		<Button
			type="button"
			variant="ghost"
			onClick={command}
			className={`text-xs sm:text-sm px-2 py-1 ${
				isActive ? "bg-muted" : ""
			} cursor-pointer`}
		>
			{label}
		</Button>
	);

	return (
		<div className="border rounded-md w-full max-w-4xl mx-auto overflow-hidden">
			{/* Toolbar */}
			<div className="flex flex-wrap gap-1 border-b p-2 bg-gray-100 dark:bg-gray-800 overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
				{/* Render formatting buttons */}
				{renderButton(
					"Bold",
					() => editor.chain().focus(undefined).toggleBold().run(),
					editor.isActive("bold")
				)}
				{renderButton(
					"Italic",
					() => editor.chain().focus(undefined).toggleItalic().run(),
					editor.isActive("italic")
				)}
				{renderButton(
					"Underline",
					() =>
						editor.chain().focus(undefined).toggleUnderline().run(),
					editor.isActive("underline")
				)}
				{renderButton(
					"Strike",
					() => editor.chain().focus(undefined).toggleStrike().run(),
					editor.isActive("strike")
				)}
				{renderButton(
					"Bullet",
					() =>
						editor
							.chain()
							.focus(undefined)
							.toggleBulletList()
							.run(),
					editor.isActive("bulletList")
				)}
				{renderButton(
					"Ordered",
					() =>
						editor
							.chain()
							.focus(undefined)
							.toggleOrderedList()
							.run(),
					editor.isActive("orderedList")
				)}
				{renderButton(
					"Paragraph",
					() => editor.chain().focus(undefined).setParagraph().run(),
					editor.isActive("paragraph")
				)}
				{renderButton(
					"H1",
					() =>
						editor
							.chain()
							.focus(undefined)
							.toggleHeading({ level: 1 })
							.run(),
					editor.isActive("heading", { level: 1 })
				)}
				{renderButton(
					"H2",
					() =>
						editor
							.chain()
							.focus(undefined)
							.toggleHeading({ level: 2 })
							.run(),
					editor.isActive("heading", { level: 2 })
				)}
				{renderButton(
					"H3",
					() =>
						editor
							.chain()
							.focus(undefined)
							.toggleHeading({ level: 3 })
							.run(),
					editor.isActive("heading", { level: 3 })
				)}
				{renderButton(
					"Code",
					() => editor.chain().focus(undefined).toggleCode().run(),
					editor.isActive("code")
				)}
				{renderButton(
					"Quote",
					() =>
						editor
							.chain()
							.focus(undefined)
							.toggleBlockquote()
							.run(),
					editor.isActive("blockquote")
				)}
				{renderButton("HR", () =>
					editor.chain().focus(undefined).setHorizontalRule().run()
				)}
				{renderButton("Link", () => {
					const url = prompt("Enter link URL");
					if (url)
						editor
							.chain()
							.focus(undefined)
							.setLink({ href: url })
							.run();
				})}
				{renderButton("Image", () => {
					const url = prompt("Enter image URL");
					if (url)
						editor
							.chain()
							.focus(undefined)
							.setImage({ src: url })
							.run();
				})}
				{renderButton(
					"Left",
					() =>
						editor
							.chain()
							.focus(undefined)
							.setTextAlign("left")
							.run(),
					editor.isActive({ textAlign: "left" })
				)}
				{renderButton(
					"Center",
					() =>
						editor
							.chain()
							.focus(undefined)
							.setTextAlign("center")
							.run(),
					editor.isActive({ textAlign: "center" })
				)}
				{renderButton(
					"Right",
					() =>
						editor
							.chain()
							.focus(undefined)
							.setTextAlign("right")
							.run(),
					editor.isActive({ textAlign: "right" })
				)}
				{renderButton(
					"Highlight",
					() =>
						editor.chain().focus(undefined).toggleHighlight().run(),
					editor.isActive("highlight")
				)}
				{renderButton("Color", () => {
					const color = prompt("Enter hex color (e.g. #FF5733)");
					if (color)
						editor.chain().focus(undefined).setColor(color).run();
				})}
			</div>

			{/* Editor Content */}
			<div className="p-3 sm:p-4 prose max-w-none dark:prose-invert min-h-[300px] break-words">
				<EditorContent editor={editor} />
			</div>

			{/* Preview Output */}
			<div className="border-t mt-2 sm:mt-4 p-3 sm:p-4 bg-white dark:bg-gray-950 space-y-4 text-sm sm:text-base">
				<details open>
					<summary className="text-base font-semibold cursor-pointer">
						🔍 HTML Output
					</summary>
					<pre className="bg-gray-100 dark:bg-gray-800 text-sm p-2 rounded max-h-[300px] overflow-auto whitespace-pre-wrap break-words">
						{value}
					</pre>
				</details>

				
			</div>
		</div>
	);
};

export default Tiptap;
