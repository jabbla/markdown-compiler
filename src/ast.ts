export enum AST_TYPE {
    CONTENT = 'content',
    HEAD_BLOCK = 'head_block',
    REFER_BLOCK = 'reference_block',
    CODE_BLOCK = 'code_block',
    LIST_BLOCK = 'list_block',
    PARAGRAPH = 'paragraph',

    TEXT = 'text',
    REFER_TEXT = 'refer_text',
    REFER_NEWLINE = 'refer_newline',
    LINK = 'link',
    IMAGE = 'image',
    BOLD_TEXT = 'bold_text',
    ITALIC_TEXT = 'italic_text',
    CODE_TEXT = 'code_text',
    NORMAL_TEXT = 'normal_text',
    LIST_ITEM = 'LIST_ITEM',
}

interface IBasicAst {
    type: AST_TYPE;
    children?: any;
}

export interface IListItem {
    type: AST_TYPE.LIST_ITEM;
    children: IText;
}

export interface IListBlock {
    type: AST_TYPE.LIST_BLOCK;
    ordered: boolean;
    children: IListItem[];
}

export interface ICodeText {
    type: AST_TYPE.CODE_TEXT;
    text: string;
}

export interface IBoldText {
    type: AST_TYPE.BOLD_TEXT;
    text: string;
}

export interface IItalicText {
    type: AST_TYPE.ITALIC_TEXT;
    text: string;
}

export interface ILink {
    type: AST_TYPE.LINK;
    text: string;
    url: string;
}

export interface IImage {
    type: AST_TYPE.IMAGE;
    alt: string;
    url: string;
}

export interface INormalText {
    type: AST_TYPE.NORMAL_TEXT;
    text: string;
}

export type TextChild = ICodeText | IBoldText | IItalicText | ILink | IImage | INormalText;

export interface IText {
    type: AST_TYPE.TEXT;
    children: TextChild[];
}

export interface IReferNewline {
    type: AST_TYPE.REFER_NEWLINE
}

type ReferTextChild = TextChild | IReferNewline;

export interface IReferText {
    type: AST_TYPE.REFER_TEXT;
    children: ReferTextChild[];
}

export interface IHeadBlock {
    type: AST_TYPE.HEAD_BLOCK;
    level: number;
    children: IText;
}

export interface IReferBlock {
    type: AST_TYPE.REFER_BLOCK;
    children: IReferText;
}

export interface ICodeBlock {
    type: AST_TYPE.CODE_BLOCK;
    language: string;
    text: string;
}

export interface IParagraph {
    type: AST_TYPE.PARAGRAPH;
    children: IText;
}

export type IBlock = IHeadBlock | IReferBlock | ICodeBlock | IListBlock | IParagraph;

export interface IContent {
    type: AST_TYPE.CONTENT;
    children: IBlock[];
}

export const AstCreator = {
    content({ children }: { children?: IBlock[] }) {
        return {
            type: AST_TYPE.CONTENT,
            children,
        };
    },
    headBlock({ level, children }: { level: number, children: IText }) {
        return {
            type: AST_TYPE.HEAD_BLOCK,
            level,
            children,
        };
    },
    referBlock({ children }: { children: IReferText }) {
        return {
            type: AST_TYPE.REFER_BLOCK,
            children
        };
    },
    codeBlock({ language, text }: { language: string, text: string }) {
        return {
            type: AST_TYPE.CODE_BLOCK,
            language,
            text
        };
    },
    listBlock({ ordered, children }: { ordered: boolean, children: IListItem[] }): IListBlock {
        return {
            type: AST_TYPE.LIST_BLOCK,
            ordered,
            children
        };
    },
    listItem({ children }: { children: IText }): IListItem {
        return {
            type: AST_TYPE.LIST_ITEM,
            children
        };
    },
    paragraph({ children }: { children: IText }) {
        return {
            type: AST_TYPE.PARAGRAPH,
            children
        };
    },
    text({ children }: { children: TextChild[] } ): IText {
        return {
            type: AST_TYPE.TEXT,
            children
        };
    },
    referText({ children }: { children: ReferTextChild[] }): IReferText {
        return {
            type: AST_TYPE.REFER_TEXT,
            children
        };
    },
    referNewline(): IReferNewline {
        return {
            type: AST_TYPE.REFER_NEWLINE
        };
    },
    link({ text, url }: { text: string, url: string }): ILink {
        return {
            type: AST_TYPE.LINK,
            text,
            url
        };
    },
    image({ alt, url }: { alt: string, url: string }): IImage {
        return {
            type: AST_TYPE.IMAGE,
            alt,
            url
        };
    },
    boldText({ text }: { text: string } ): IBoldText {
        return {
            type: AST_TYPE.BOLD_TEXT,
            text
        };
    },
    italicText({ text }: { text: string }): IItalicText {
        return {
            type: AST_TYPE.ITALIC_TEXT,
            text
        };
    },
    codeText({ text }: { text: string }): ICodeText {
        return {
            type: AST_TYPE.CODE_TEXT,
            text
        };
    },
    normalText({ text }: { text: string }): INormalText {
        return {
            type: AST_TYPE.NORMAL_TEXT,
            text
        };
    }
};