# Specappular (VS Code Extension)

Generate code from simple specs, right inside VS Code.

## Features

- Define specs in YAML/JSON under `spec/`
- Generate code using EJS templates
- Validate specs
- Create new spec scaffold
- Optional auto-generate on save

## Commands

- Specappular: Generate Code from Spec
- Specappular: Validate Spec
- Specappular: Create New Spec
- Specappular: Clean Generated Code

## Configuration

- `specappular.specGlob` — default `spec/**/*.y?(a)ml`
- `specappular.templatesDir` — default `templates`
- `specappular.outputDir` — default `generated`
- `specappular.overwrite` — default `false`
- `specappular.autoGenerateOnSave` — default `false`

## Getting Started

1. Open this repo in VS Code.
2. Run `npm install`.
3. Press F5 to launch the Extension Development Host.
4. Create a spec via "Specappular: Create New Spec" or open `spec/examples/todo.yaml`.
5. Run "Specappular: Generate Code from Spec".

Templates are searched in your workspace `templates/` folder. If a template is not found, bundled templates are used as fallback.

## Spec Format

```yaml
version: 1
name: MyType
outputDir: generated
templates:
  - template: class.ejs
    target: "src/models/{{name}}.ts"
    context:
      className: "{{name}}"
      fields:
        - { name: "id", type: "number" }
```

- `name`: required
- `templates[]`: required
  - `template`: EJS template file name
  - `target`: relative or absolute path; supports `{{var}}` and EJS `<% %>` substitutions
  - `context`: additional data provided to the template

In templates, you can access `spec` and `context`.

## Notes

- Overwrite behavior is controlled by `specappular.overwrite`.
- `outputDir` can be set globally in settings or per-spec.
- This is a minimal baseline. We can add: preview, diagnostics, schema validation, watches, and multi-language template packs.
