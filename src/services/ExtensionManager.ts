import { Extension, TextDocument } from '../types/Extension';
import { EventEmitter } from 'events';

class ExtensionManager extends EventEmitter {
  private extensions: Map<string, Extension>;
  private activeExtensions: Set<string>;
  private documentVersions: Map<string, number>;

  constructor() {
    super();
    this.extensions = new Map();
    this.activeExtensions = new Set();
    this.documentVersions = new Map();
  }

  async registerExtension(extension: Extension): Promise<void> {
    if (this.extensions.has(extension.id)) {
      throw new Error(`Extension with id ${extension.id} is already registered`);
    }
    this.extensions.set(extension.id, extension);
    this.emit('extension:registered', extension);
  }

  async activateExtension(id: string): Promise<void> {
    const extension = this.extensions.get(id);
    if (!extension) {
      throw new Error(`Extension ${id} not found`);
    }

    if (this.activeExtensions.has(id)) {
      return;
    }

    await extension.activate();
    this.activeExtensions.add(id);
    this.emit('extension:activated', extension);
  }

  async deactivateExtension(id: string): Promise<void> {
    const extension = this.extensions.get(id);
    if (!extension || !this.activeExtensions.has(id)) {
      return;
    }

    await extension.deactivate();
    this.activeExtensions.delete(id);
    this.emit('extension:deactivated', extension);
  }

  async getCompletions(document: TextDocument, position: Position): Promise<CompletionItem[]> {
    const items: CompletionItem[] = [];
    for (const extension of this.getActiveExtensionsForLanguage(document.languageId)) {
      if (extension.provideCompletions) {
        const completions = await extension.provideCompletions(document, position);
        items.push(...completions);
      }
    }
    return items;
  }

  async getDiagnostics(document: TextDocument): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];
    for (const extension of this.getActiveExtensionsForLanguage(document.languageId)) {
      if (extension.provideDiagnostics) {
        const results = await extension.provideDiagnostics(document);
        diagnostics.push(...results);
      }
    }
    return diagnostics;
  }

  async formatDocument(document: TextDocument): Promise<TextEdit[]> {
    for (const extension of this.getActiveExtensionsForLanguage(document.languageId)) {
      if (extension.provideFormatting) {
        return await extension.provideFormatting(document);
      }
    }
    return [];
  }

  getDebugProvider(languageId: string): DebuggerProvider | undefined {
    for (const extension of this.getActiveExtensionsForLanguage(languageId)) {
      if (extension.provideDebugger) {
        return extension.provideDebugger();
      }
    }
    return undefined;
  }

  private *getActiveExtensionsForLanguage(languageId: string): Generator<Extension> {
    for (const [id, extension] of this.extensions) {
      if (
        this.activeExtensions.has(id) &&
        extension.languages.includes(languageId)
      ) {
        yield extension;
      }
    }
  }
}

export const extensionManager = new ExtensionManager();