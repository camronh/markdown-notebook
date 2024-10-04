import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as nbformat from "@jupyterlab/nbformat";

export async function convertMarkdownToNotebook(
  markdownUri: vscode.Uri
): Promise<void> {
  try {
    // Read the markdown file
    const markdownContent = await fs.promises.readFile(
      markdownUri.fsPath,
      "utf8"
    );

    // Parse the markdown content into cells
    const cells = parseMarkdownToCells(markdownContent);

    // Create the notebook data
    const notebookData: vscode.NotebookData = {
      cells: cells.map((cell) => ({
        kind: cell.kind,
        languageId: cell.languageId,
        value: cell.value,
        outputs: [],
        metadata: {},
      })),
      metadata: {
        custom: {
          cells: [],
          metadata: {
            language_info: {
              name: "python",
            },
          },
          nbformat: 4,
          nbformat_minor: 2,
        },
      },
    };

    // Create the new notebook file path
    const notebookPath = markdownUri.fsPath.replace(/\.md$/, ".ipynb");
    const notebookUri = vscode.Uri.file(notebookPath);

    // Create the notebook content
    const notebookContent = JSON.stringify(
      {
        cells: notebookData.cells.map((cell) => ({
          cell_type:
            cell.kind === vscode.NotebookCellKind.Code ? "code" : "markdown",
          source: cell.value.split("\n"),
          metadata: {},
          outputs: [],
        })),
        metadata: notebookData.metadata,
        nbformat: 4,
        nbformat_minor: 2,
      },
      null,
      2
    );

    // Save the notebook content
    await vscode.workspace.fs.writeFile(
      notebookUri,
      Buffer.from(notebookContent, "utf8")
    );

    // Open the new notebook document
    const notebook = await vscode.workspace.openNotebookDocument(notebookUri);
    await vscode.window.showNotebookDocument(notebook);

    vscode.window.showInformationMessage(
      `Converted ${path.basename(markdownUri.fsPath)} to notebook`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error converting markdown to notebook: ${error}`
    );
  }
}

export async function convertNotebookToMarkdown(
  notebookUri: vscode.Uri
): Promise<void> {
  try {
    // Read the notebook file
    const notebookContent = await fs.promises.readFile(
      notebookUri.fsPath,
      "utf8"
    );
    const notebook = JSON.parse(notebookContent) as nbformat.INotebookContent;

    // Convert the notebook to markdown
    let markdownContent = "";
    for (const cell of notebook.cells) {
      if (cell.cell_type === "markdown") {
        // Remove the incorrect split and join operations
        markdownContent += Array.isArray(cell.source)
          ? cell.source.join("")
          : cell.source;
        markdownContent += "\n\n";
      } else if (cell.cell_type === "code") {
        markdownContent += "```python\n";
        markdownContent += Array.isArray(cell.source)
          ? cell.source.join("")
          : cell.source;
        markdownContent += "\n```\n\n";

        // Include outputs
        if (cell.outputs) {
          for (const output of cell.outputs as nbformat.IOutput[]) {
            if (output.output_type === "stream") {
              markdownContent += "```\n";
              markdownContent += Array.isArray(output.text)
                ? output.text.join("")
                : output.text;
              markdownContent += "\n```\n\n";
            } else if (
              output.output_type === "execute_result" ||
              output.output_type === "display_data"
            ) {
              if (output.data["text/plain"]) {
                markdownContent += "```\n";
                markdownContent += Array.isArray(output.data["text/plain"])
                  ? output.data["text/plain"].join("")
                  : output.data["text/plain"];
                markdownContent += "\n```\n\n";
              }
              // Add support for other output types (e.g., images) here if needed
            }
          }
        }
      }
    }

    // Create the new markdown file path
    const markdownPath = notebookUri.fsPath.replace(/\.ipynb$/, ".md");
    const markdownUri = vscode.Uri.file(markdownPath);

    // Save the markdown content
    await vscode.workspace.fs.writeFile(
      markdownUri,
      Buffer.from(markdownContent, "utf8")
    );

    // Open the new markdown document
    const document = await vscode.workspace.openTextDocument(markdownUri);
    await vscode.window.showTextDocument(document);

    vscode.window.showInformationMessage(
      `Converted ${path.basename(notebookUri.fsPath)} to markdown`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error converting notebook to markdown: ${error}`
    );
  }
}

export async function convertNotebookToMarkdownAndCopy(
  notebookUri: vscode.Uri
): Promise<void> {
  try {
    // Read the notebook file
    const notebookContent = await fs.promises.readFile(
      notebookUri.fsPath,
      "utf8"
    );
    const notebook = JSON.parse(notebookContent) as nbformat.INotebookContent;

    // Convert the notebook to markdown
    let markdownContent = "";
    for (const cell of notebook.cells) {
      if (cell.cell_type === "markdown") {
        markdownContent += Array.isArray(cell.source)
          ? cell.source.join("")
          : cell.source;
        markdownContent += "\n\n";
      } else if (cell.cell_type === "code") {
        markdownContent += "```python\n";
        markdownContent += Array.isArray(cell.source)
          ? cell.source.join("")
          : cell.source;
        markdownContent += "\n```\n\n";

        // Include outputs
        if (cell.outputs) {
          for (const output of cell.outputs as nbformat.IOutput[]) {
            if (output.output_type === "stream") {
              markdownContent += "```\n";
              markdownContent += Array.isArray(output.text)
                ? output.text.join("")
                : output.text;
              markdownContent += "\n```\n\n";
            } else if (
              output.output_type === "execute_result" ||
              output.output_type === "display_data"
            ) {
              if (output.data["text/plain"]) {
                markdownContent += "```\n";
                markdownContent += Array.isArray(output.data["text/plain"])
                  ? output.data["text/plain"].join("")
                  : output.data["text/plain"];
                markdownContent += "\n```\n\n";
              }
              // Add support for other output types (e.g., images) here if needed
            }
          }
        }
      }
    }

    // Copy the markdown content to the clipboard
    await vscode.env.clipboard.writeText(markdownContent);

    vscode.window.showInformationMessage(
      `Converted ${path.basename(notebookUri.fsPath)} to markdown and copied to clipboard`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error converting notebook to markdown and copying: ${error}`
    );
  }
}

interface Cell {
  kind: vscode.NotebookCellKind;
  languageId: string;
  value: string;
}

function parseMarkdownToCells(markdownContent: string): Cell[] {
  const cells: Cell[] = [];
  const lines = markdownContent.split("\n");
  let currentCell: Cell | null = null;

  for (const line of lines) {
    if (line.startsWith("```python")) {
      // Start a new code cell
      if (currentCell) {
        cells.push(currentCell);
      }
      currentCell = {
        kind: vscode.NotebookCellKind.Code,
        languageId: "python",
        value: "",
      };
    } else if (
      line.startsWith("```") &&
      currentCell?.kind === vscode.NotebookCellKind.Code
    ) {
      // End the current code cell
      cells.push(currentCell);
      currentCell = null;
    } else if (currentCell?.kind === vscode.NotebookCellKind.Code) {
      // Add line to the current code cell
      currentCell.value += line + "\n";
    } else {
      // Add line to a markdown cell
      if (!currentCell || currentCell.kind !== vscode.NotebookCellKind.Markup) {
        if (currentCell) {
          cells.push(currentCell);
        }
        currentCell = {
          kind: vscode.NotebookCellKind.Markup,
          languageId: "markdown",
          value: "",
        };
      }
      currentCell.value += line + "\n";
    }
  }

  if (currentCell) {
    cells.push(currentCell);
  }

  return cells;
}
