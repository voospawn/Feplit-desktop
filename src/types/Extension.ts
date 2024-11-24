export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  languages: string[];
  activate: () => Promise<void>;
  deactivate: () => Promise<void>;
  provideCompletions?: (document: TextDocument, position: Position) => Promise<CompletionItem[]>;
  provideDiagnostics?: (document: TextDocument) => Promise<Diagnostic[]>;
  provideFormatting?: (document: TextDocument) => Promise<TextEdit[]>;
  provideDebugger?: () => DebuggerProvider;
}

export interface TextDocument {
  uri: string;
  languageId: string;
  version: number;
  getText(): string;
  positionAt(offset: number): Position;
  offsetAt(position: Position): number;
}

export interface Position {
  line: number;
  character: number;
}

export interface CompletionItem {
  label: string;
  kind: CompletionItemKind;
  detail?: string;
  documentation?: string;
  insertText?: string;
}

export interface Diagnostic {
  range: Range;
  severity: DiagnosticSeverity;
  message: string;
  source?: string;
  code?: string | number;
}

export interface Range {
  start: Position;
  end: Position;
}

export interface TextEdit {
  range: Range;
  newText: string;
}

export interface DebuggerProvider {
  startDebugSession: () => Promise<DebugSession>;
  stopDebugSession: () => Promise<void>;
  setBreakpoint: (file: string, line: number) => Promise<void>;
  removeBreakpoint: (file: string, line: number) => Promise<void>;
  continue: () => Promise<void>;
  stepOver: () => Promise<void>;
  stepInto: () => Promise<void>;
  stepOut: () => Promise<void>;
  evaluate: (expression: string) => Promise<any>;
}

export interface DebugSession {
  id: string;
  type: string;
  onBreakpoint: (callback: (event: BreakpointEvent) => void) => void;
  onOutput: (callback: (event: OutputEvent) => void) => void;
  onTerminated: (callback: () => void) => void;
}

export enum CompletionItemKind {
  Text = 1,
  Method = 2,
  Function = 3,
  Constructor = 4,
  Field = 5,
  Variable = 6,
  Class = 7,
  Interface = 8,
  Module = 9,
  Property = 10,
  Unit = 11,
  Value = 12,
  Enum = 13,
  Keyword = 14,
  Snippet = 15,
  Color = 16,
  File = 17,
  Reference = 18,
  Folder = 19,
  EnumMember = 20,
  Constant = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25,
}