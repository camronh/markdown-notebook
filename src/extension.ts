import * as vscode from "vscode";
import {
  convertMarkdownToNotebook,
  convertNotebookToMarkdown,
  convertNotebookToMarkdownAndCopy,
} from "./convert";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    "DEBUG: Markdown to Notebook extension is now active - UPDATED VERSION"
  );

  // Register the command to convert markdown to notebook
  let convertToNotebook = vscode.commands.registerCommand(
    "markdown-to-notebook.convertToNotebook",
    async (uri: vscode.Uri) => {
      console.log(
        "DEBUG: Convert to Notebook command triggered - UPDATED VERSION",
        uri
      );

      if (uri && uri.scheme === "file" && uri.path.endsWith(".md")) {
        vscode.window.showInformationMessage("Converting to Notebook");
        await convertMarkdownToNotebook(uri);
      } else {
        console.log("Please select a markdown file to convert.");
        vscode.window.showErrorMessage(
          "Please select a markdown file to convert."
        );
      }
    }
  );

  // Register the command to convert notebook to markdown
  let convertToMarkdown = vscode.commands.registerCommand(
    "markdown-to-notebook.convertToMarkdown",
    async (uri: vscode.Uri) => {
      console.log("DEBUG: Convert to Markdown command triggered", uri);

      if (uri && uri.scheme === "file" && uri.path.endsWith(".ipynb")) {
        vscode.window.showInformationMessage("Converting to Markdown");
        await convertNotebookToMarkdown(uri);
      } else {
        console.log("Please select a notebook file to convert.");
        vscode.window.showErrorMessage(
          "Please select a notebook file to convert."
        );
      }
    }
  );

  // Register the command to copy notebook to markdown
  let copyToMarkdownDisposable = vscode.commands.registerCommand(
    "markdown-to-notebook.copyToMarkdown",
    async (uri: vscode.Uri) => {
      console.log("DEBUG: Copy to Markdown command triggered", uri);
      if (uri && uri.scheme === "file" && uri.path.endsWith(".ipynb")) {
        vscode.window.showInformationMessage("Copying to Markdown");
        await convertNotebookToMarkdownAndCopy(uri);
      } else {
        console.log("Please select a notebook file to copy.");
        vscode.window.showErrorMessage(
          "Please select a notebook file to copy."
        );
      }
    }
  );

  context.subscriptions.push(
    convertToNotebook,
    convertToMarkdown,
    copyToMarkdownDisposable
  );
  console.log("Commands registered:", context.subscriptions.length);
}

export function deactivate() {}
