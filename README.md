# Markdown to Notebook Converter

This Visual Studio Code extension allows you to easily convert between Markdown files and Jupyter notebooks, as well as copy notebook contents as Markdown.

## Features

1. **Convert Markdown to Notebook**: Transform your Markdown files into Jupyter notebooks with proper cell separation.
2. **Convert Notebook to Markdown**: Convert Jupyter notebooks into well-formatted Markdown files, including code blocks and outputs.
3. **Copy Notebook as Markdown**: Quickly copy the contents of a Jupyter notebook as Markdown to your clipboard.

## Usage

### Converting Markdown to Notebook

1. Right-click on a Markdown file in the Explorer or Editor context menu.
2. Select "Convert to Notebook".
3. The extension will create a new `.ipynb` file and open it in the Notebook editor.

### Converting Notebook to Markdown

1. Right-click on a Jupyter notebook (`.ipynb`) file in the Explorer or Editor context menu.
2. Select "Convert to Markdown".
3. The extension will create a new `.md` file and open it in the text editor.

### Copying Notebook as Markdown

1. Right-click on a Jupyter notebook (`.ipynb`) file in the Explorer or Editor context menu.
2. Select "Copy to Markdown".
3. The notebook contents will be converted to Markdown and copied to your clipboard.

You can also access the "Copy to Markdown" command from the editor title menu when viewing a Jupyter notebook.

## Requirements

- Visual Studio Code version 1.60.0 or higher

## Extension Settings

This extension does not add any VS Code settings.

## Known Issues

- Image outputs from notebooks are not currently supported in the Markdown conversion.

## Release Notes

### 0.0.1

Initial release of the Markdown to Notebook Converter extension.

- Added "Convert to Notebook" command
- Added "Convert to Markdown" command
- Added "Copy to Markdown" command

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the [MIT License](LICENSE).