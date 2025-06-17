import * as React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Code2,
  Pilcrow,
  Minus,
  ListChecks,
  ListTodo,
  ListPlus,
  ListStart,
  ListEnd,
  ListX,
  ListTree,
  ListMinus,
  ListFilter,
  ListVideo,
  ListRestart,
  ListCollapse,
  ListOrderedIcon,
  ListChecks as ListCheckIcon,
  ListTodo as ListTodoIcon,
  ListPlus as ListPlusIcon,
  ListStart as ListStartIcon,
  ListEnd as ListEndIcon,
  ListX as ListXIcon,
  ListTree as ListTreeIcon,
  ListMinus as ListMinusIcon,
  ListFilter as ListFilterIcon,
  ListVideo as ListVideoIcon,
  ListRestart as ListRestartIcon,
  ListCollapse as ListCollapseIcon,
  ListOrdered as ListOrderedIcon,
  ListChecks as ListChecksIcon,
  ListTodo as ListTodoIcon2,
  ListPlus as ListPlusIcon2,
  ListStart as ListStartIcon2,
  ListEnd as ListEndIcon2,
  ListX as ListXIcon2,
  ListTree as ListTreeIcon2,
  ListMinus as ListMinusIcon2,
  ListFilter as ListFilterIcon2,
  ListVideo as ListVideoIcon2,
  ListRestart as ListRestartIcon2,
  ListCollapse as ListCollapseIcon2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Toggle } from '../ui/toggle';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface TiptapToolbarProps {
  editor: Editor | null;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const TiptapToolbar: React.FC<TiptapToolbarProps> = ({
  editor,
  className,
  children,
  disabled = false,
}) => {
  const [linkUrl, setLinkUrl] = React.useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);

  if (!editor) return null;

  const setLink = () => {
    if (!linkUrl) return;
    
    // If there's a selection, wrap it in a link
    if (editor.state.selection.empty) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    }
    
    setLinkUrl('');
    setIsLinkDialogOpen(false);
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
    setIsLinkDialogOpen(false);
  };

  const addImage = () => {
    if (!imageUrl) return;
    
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setIsImageDialogOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
  };

  const isActive = (type: string, options: Record<string, any> = {}) => {
    return editor.isActive(type, options) ? 'bg-accent' : '';
  };

  const toolbarItems = [
    {
      name: 'bold',
      icon: <Bold className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: isActive('bold'),
      title: 'Negrito',
      shortcut: 'Ctrl+B',
    },
    {
      name: 'italic',
      icon: <Italic className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: isActive('italic'),
      title: 'Itálico',
      shortcut: 'Ctrl+I',
    },
    {
      name: 'underline',
      icon: <Underline className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: isActive('underline'),
      title: 'Sublinhado',
      shortcut: 'Ctrl+U',
    },
    {
      name: 'strike',
      icon: <Strikethrough className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: isActive('strike'),
      title: 'Tachado',
      shortcut: 'Ctrl+Shift+S',
    },
    {
      type: 'divider',
    },
    {
      name: 'heading1',
      icon: <Heading1 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: isActive('heading', { level: 1 }),
      title: 'Título 1',
      shortcut: 'Ctrl+Alt+1',
    },
    {
      name: 'heading2',
      icon: <Heading2 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: isActive('heading', { level: 2 }),
      title: 'Título 2',
      shortcut: 'Ctrl+Alt+2',
    },
    {
      name: 'heading3',
      icon: <Heading3 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: isActive('heading', { level: 3 }),
      title: 'Título 3',
      shortcut: 'Ctrl+Alt+3',
    },
    {
      name: 'paragraph',
      icon: <Pilcrow className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setParagraph().run(),
      isActive: isActive('paragraph'),
      title: 'Parágrafo',
      shortcut: 'Ctrl+Alt+0',
    },
    {
      type: 'divider',
    },
    {
      name: 'bulletList',
      icon: <List className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: isActive('bulletList'),
      title: 'Lista com marcadores',
      shortcut: 'Ctrl+Shift+8',
    },
    {
      name: 'orderedList',
      icon: <ListOrdered className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: isActive('orderedList'),
      title: 'Lista numerada',
      shortcut: 'Ctrl+Shift+7',
    },
    {
      name: 'taskList',
      icon: <ListChecksIcon className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleTaskList().run(),
      isActive: isActive('taskList'),
      title: 'Lista de tarefas',
      shortcut: 'Ctrl+Alt+T',
    },
    {
      type: 'divider',
    },
    {
      name: 'blockquote',
      icon: <Quote className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: isActive('blockquote'),
      title: 'Citação',
      shortcut: 'Ctrl+Shift+9',
    },
    {
      name: 'code',
      icon: <Code className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: isActive('code'),
      title: 'Código em linha',
      shortcut: 'Ctrl+`',
    },
    {
      name: 'codeBlock',
      icon: <Code2 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: isActive('codeBlock'),
      title: 'Bloco de código',
      shortcut: 'Ctrl+Alt+C',
    },
    {
      type: 'divider',
    },
    {
      name: 'link',
      icon: <Link2 className="h-4 w-4" />,
      onClick: () => {
        const previousUrl = editor.getAttributes('link').href;
        setLinkUrl(previousUrl || '');
        setIsLinkDialogOpen(true);
      },
      isActive: isActive('link'),
      title: 'Inserir link',
      shortcut: 'Ctrl+K',
    },
    {
      name: 'image',
      icon: <ImageIcon className="h-4 w-4" />,
      onClick: () => setIsImageDialogOpen(true),
      isActive: isActive('image'),
      title: 'Inserir imagem',
      shortcut: 'Ctrl+Shift+I',
    },
    {
      type: 'divider',
    },
    {
      name: 'alignLeft',
      icon: <AlignLeft className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: isActive('textAlign', { align: 'left' }),
      title: 'Alinhar à esquerda',
      shortcut: 'Ctrl+Shift+L',
    },
    {
      name: 'alignCenter',
      icon: <AlignCenter className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: isActive('textAlign', { align: 'center' }),
      title: 'Centralizar',
      shortcut: 'Ctrl+Shift+E',
    },
    {
      name: 'alignRight',
      icon: <AlignRight className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: isActive('textAlign', { align: 'right' }),
      title: 'Alinhar à direita',
      shortcut: 'Ctrl+Shift+R',
    },
    {
      name: 'alignJustify',
      icon: <AlignJustify className="h-4 w-4" />,
      onClick: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: isActive('textAlign', { align: 'justify' }),
      title: 'Justificar',
      shortcut: 'Ctrl+Shift+J',
    },
    {
      type: 'divider',
    },
    {
      name: 'undo',
      icon: <Undo2 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().undo().run(),
      isDisabled: !editor.can().undo(),
      title: 'Desfazer',
      shortcut: 'Ctrl+Z',
    },
    {
      name: 'redo',
      icon: <Redo2 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().redo().run(),
      isDisabled: !editor.can().redo(),
      title: 'Refazer',
      shortcut: 'Ctrl+Y',
    },
  ];

  return (
    <div className={cn('border-b border-border bg-muted/50 p-1', className)}>
      <div className="flex flex-wrap items-center gap-1">
        {toolbarItems.map((item, index) => {
          if (item.type === 'divider') {
            return <div key={`divider-${index}`} className="mx-1 h-6 w-px bg-border" />;
          }

          return (
            <Tooltip key={item.name} content={item.title} shortcut={item.shortcut}>
              <Toggle
                size="sm"
                pressed={!!item.isActive}
                onPressedChange={item.onClick}
                disabled={disabled || item.isDisabled}
                className={cn(
                  'h-8 w-8 p-0',
                  item.isActive && 'bg-accent text-accent-foreground',
                  'hover:bg-muted-foreground/10',
                  'focus-visible:ring-1 focus-visible:ring-ring',
                  'transition-colors duration-200',
                  'flex items-center justify-center'
                )}
              >
                {item.icon}
                <span className="sr-only">{item.title}</span>
              </Toggle>
            </Tooltip>
          );
        })}
        
        {children}
      </div>

      {/* Link Dialog */}
      <Popover open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <PopoverTrigger asChild>
          <button className="hidden" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Inserir link</h4>
              <p className="text-sm text-muted-foreground">
                Digite o URL do link
              </p>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="https://exemplo.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setLink();
                  }
                }}
                className="flex-1"
                autoFocus
              />
              <Button type="button" onClick={setLink}>
                Aplicar
              </Button>
            </div>
            {editor.isActive('link') && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={unsetLink}
                className="w-full"
              >
                Remover link
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Image Dialog */}
      <Popover open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <PopoverTrigger asChild>
          <button className="hidden" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Inserir imagem</h4>
              <p className="text-sm text-muted-foreground">
                Insira a URL da imagem ou faça upload de um arquivo
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">URL da imagem</Label>
                <div className="flex space-x-2">
                  <Input
                    id="image-url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addImage}>
                    Inserir
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou
                  </span>
                </div>
              </div>
              <div>
                <Label
                  htmlFor="file-upload"
                  className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                >
                  <Upload className="mb-1 h-5 w-5" />
                  <span className="text-center">
                    Arraste uma imagem ou clique para fazer upload
                  </span>
                  <span className="text-xs text-muted-foreground/70">
                    Formatos suportados: JPG, PNG, GIF, WEBP (máx. 5MB)
                  </span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Tooltip component for toolbar buttons
const Tooltip = ({
  children,
  content,
  shortcut,
}: {
  children: React.ReactNode;
  content: string;
  shortcut?: string;
}) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="invisible absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
        <div className="flex items-center gap-2">
          <span>{content}</span>
          {shortcut && (
            <kbd className="rounded bg-background/20 px-1.5 py-0.5 text-xs">
              {shortcut}
            </kbd>
          )}
        </div>
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </div>
    </div>
  );
};

export default TiptapToolbar;
