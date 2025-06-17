import * as React from 'react';
import { useEditor, EditorContent, type EditorEvents, type EditorOptions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { cn } from '@/lib/utils';
import { TiptapToolbar } from './TiptapToolbar';

export interface TiptapEditorProps extends Omit<Partial<EditorOptions>, 'content' | 'extensions'> {
  /**
   * The HTML content or JSON content for the editor
   */
  value?: string | object;
  /**
   * Callback when the editor content changes
   */
  onChange?: (value: string) => void;
  /**
   * Callback when the editor is blurred
   */
  onBlur?: (event: EditorEvents['blur']) => void;
  /**
   * Placeholder text to show when the editor is empty
   */
  placeholder?: string;
  /**
   * Whether the editor is disabled
   */
  disabled?: boolean;
  /**
   * Custom class name for the editor container
   */
  className?: string;
  /**
   * Custom class name for the editor content
   */
  contentClassName?: string;
  /**
   * Custom class name for the toolbar
   */
  toolbarClassName?: string;
  /**
   * Whether to show the toolbar
   * @default true
   */
  showToolbar?: boolean;
  /**
   * Custom toolbar items to render
   */
  toolbarItems?: React.ReactNode;
  /**
   * Character limit for the editor content
   */
  maxLength?: number;
  /**
   * Whether to show the character count
   * @default true
   */
  showCharacterCount?: boolean;
  /**
   * Custom character count renderer
   */
  renderCharacterCount?: (props: { count: number; maxLength?: number }) => React.ReactNode;
  /**
   * Custom error message to show when the character limit is exceeded
   */
  characterLimitErrorMessage?: string;
  /**
   * Whether to show the placeholder when the editor is focused
   * @default true
   */
  showPlaceholderWhenFocused?: boolean;
}

/**
 * A rich text editor component built with Tiptap
 */
export const TiptapEditor = React.forwardRef<HTMLDivElement, TiptapEditorProps>(({
  value = '',
  onChange,
  onBlur,
  placeholder = 'Escreva algo incrível...',
  disabled = false,
  className,
  contentClassName,
  toolbarClassName,
  showToolbar = true,
  toolbarItems,
  maxLength,
  showCharacterCount = true,
  renderCharacterCount,
  characterLimitErrorMessage = 'Limite de caracteres excedido',
  showPlaceholderWhenFocused = true,
  editorProps,
  ...editorOptions
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 p-2 rounded font-mono text-sm',
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded max-w-full h-auto',
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Título ${node.attrs.level}`;
          }
          return placeholder;
        },
        showOnlyWhenEditable: !showPlaceholderWhenFocused,
        showOnlyCurrent: false,
      }),
    ],
    content: value,
    editorProps: {
      ...editorProps,
      attributes: {
        class: cn(
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none',
          'min-h-[150px] p-4',
          contentClassName
        ),
        ...editorProps?.attributes,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    onBlur: ({ event }) => {
      if (onBlur) {
        onBlur(event);
      }
    },
    editable: !disabled,
    ...editorOptions,
  });

  // Update editor content when value prop changes
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  // Handle character limit
  const characterCount = editor ? editor.storage.characterCount?.characters() || 0 : 0;
  const isOverLimit = maxLength !== undefined && characterCount > maxLength;

  // Handle focus/blur
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(event as any);
    }
  };

  // Clean up editor on unmount
  React.useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Handle image upload
  const handleImageUpload = (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle paste event for images
  const handlePaste = (view: any, event: ClipboardEvent) => {
    if (!editor || disabled) return false;

    const items = Array.from(event.clipboardData?.items || []);
    const { files } = event.clipboardData || {};

    // Check for image files
    const imageFiles = Array.from(files || []).filter(
      (file) => file.type.indexOf('image') > -1
    );

    if (imageFiles.length === 0) return false;

    event.preventDefault();

    // Upload each image
    imageFiles.forEach(async (file) => {
      const base64 = await handleImageUpload(file);
      editor.chain().focus().setImage({ src: base64 }).run();
    });

    return true;
  };

  // Handle drop event for images
  const handleDrop = (view: any, event: DragEvent, _slice: any, moved: boolean) => {
    if (!editor || disabled || moved) return false;

    const files = event.dataTransfer?.files || [];
    const imageFiles = Array.from(files).filter(
      (file) => file.type.indexOf('image') > -1
    );

    if (imageFiles.length === 0) return false;

    event.preventDefault();

    // Upload each image
    imageFiles.forEach(async (file) => {
      const base64 = await handleImageUpload(file);
      const { schema } = view.state;
      const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
      const node = schema.nodes.image.create({ src: base64 });
      const transaction = view.state.tr.insert(coordinates.pos, node);
      view.dispatch(transaction);
    });

    return true;
  };

  // Set up editor event handlers
  React.useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          ...editor.options.editorProps,
          handlePaste,
          handleDrop,
        },
      });
    }
  }, [editor, disabled]);

  // Render character count
  const renderCharacterCountContent = () => {
    if (renderCharacterCount) {
      return renderCharacterCount({ count: characterCount, maxLength });
    }

    return (
      <div className={cn(
        'text-xs text-muted-foreground mt-1 text-right',
        isOverLimit && 'text-destructive font-medium'
      )}>
        {characterCount}
        {maxLength !== undefined && ` / ${maxLength}`}
      </div>
    );
  };

  // Render error message if character limit is exceeded
  const renderError = () => {
    if (!isOverLimit) return null;

    return (
      <div className="mt-1 text-sm text-destructive font-medium">
        {characterLimitErrorMessage}
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative rounded-md border border-input bg-background ring-offset-background',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed',
        isFocused && 'ring-2 ring-ring ring-offset-2',
        className
      )}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {showToolbar && (
        <TiptapToolbar 
          editor={editor} 
          className={toolbarClassName}
          disabled={disabled}
        >
          {toolbarItems}
        </TiptapToolbar>
      )}
      
      <EditorContent editor={editor} className="relative" />
      
      {(showCharacterCount || isOverLimit) && (
        <div className="px-4 pb-2">
          {showCharacterCount && renderCharacterCountContent()}
          {isOverLimit && renderError()}
        </div>
      )}
    </div>
  );
});

TiptapEditor.displayName = 'TiptapEditor';

export default TiptapEditor;
