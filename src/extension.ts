import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const out = vscode.window.createOutputChannel('Specappular');

  const getRoot = (): string | undefined => {
    const wf = vscode.workspace.workspaceFolders?.[0];
    return wf?.uri.fsPath;
  };

  const ensureDir = async (p: string) => {
    await fs.mkdir(p, { recursive: true });
  };

  const pathExists = async (p: string) => {
    try {
      await fs.access(p);
      return true;
    } catch {
      return false;
    }
  };

  const writeFileIfMissing = async (file: string, content: string) => {
    if (await pathExists(file)) return false;
    await ensureDir(path.dirname(file));
    await fs.writeFile(file, content, 'utf8');
    return true;
  };

  const writeFile = async (file: string, content: string) => {
    await ensureDir(path.dirname(file));
    await fs.writeFile(file, content, 'utf8');
  };

  const openIfExists = async (file: string) => {
    try {
      const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(file));
      await vscode.window.showTextDocument(doc, { preview: false });
    } catch {
      // ignore
    }
  };

  const scaffoldSpec = async (appName: string) => {
    const root = getRoot();
    if (!root) {
      vscode.window.showErrorMessage('Open a folder before running Specappular: Initialize App Spec.');
      return;
    }

    const dirs = ['spec', 'spec/app', 'spec/backends/webapi', 'spec/frontends/console', 'spec/domains', 'spec/data', 'spec/tests', 'codegen', 'src', '.specapp'];
    for (const d of dirs) await ensureDir(path.join(root, d));

    // Minimal placeholder specs
    const indexMd = path.join(root, 'spec', 'index.md');
    const appOverview = path.join(root, 'spec', 'app', 'overview.md');
    const beOverview = path.join(root, 'spec', 'backends', 'webapi', 'overview.md');
    const feOverview = path.join(root, 'spec', 'frontends', 'console', 'overview.md');
    const domainsReadme = path.join(root, 'spec', 'domains', 'README.md');
    const dataReadme = path.join(root, 'spec', 'data', 'README.md');
    const testsReadme = path.join(root, 'spec', 'tests', 'README.md');

    const created: string[] = [];
    if (await writeFileIfMissing(indexMd, mdIndex(appName))) created.push('spec/index.md');
    if (await writeFileIfMissing(appOverview, mdAppOverview(appName))) created.push('spec/app/overview.md');
    if (await writeFileIfMissing(beOverview, mdBackendOverview())) created.push('spec/backends/webapi/overview.md');
    if (await writeFileIfMissing(feOverview, mdFrontendOverview())) created.push('spec/frontends/console/overview.md');
    if (await writeFileIfMissing(domainsReadme, mdDomainsReadme())) created.push('spec/domains/README.md');
    if (await writeFileIfMissing(dataReadme, mdDataReadme())) created.push('spec/data/README.md');
    if (await writeFileIfMissing(testsReadme, mdTestsReadme())) created.push('spec/tests/README.md');

    // Drop a keep file for codegen
    await writeFileIfMissing(path.join(root, 'codegen', '.keep'), '');

    if (created.length === 0) {
      vscode.window.showInformationMessage('Specappular: Spec scaffold already exists. No files created.');
    } else {
      vscode.window.showInformationMessage(`Specappular: Created ${created.length} files.`);
      out.appendLine('[init] Created files:');
      for (const f of created) out.appendLine('  - ' + f);
      // Open index
      await openIfExists(indexMd);
    }
  };

  const tryOpenCopilotChat = async () => {
    const candidates = [
      'github.copilot.chat.open',
      'github.copilot.openPanel',
      'workbench.action.chat.open',
      'workbench.panel.chat.view.focus'
    ];
    for (const cmd of candidates) {
      try {
        const commands = await vscode.commands.getCommands(true);
        const ok = commands.includes(cmd);
        if (ok) {
          try {
            await vscode.commands.executeCommand(cmd);
            return true;
          } catch {
            // continue
          }
        }
      } catch {
        // continue
      }
    }
    return false;
  };

  const generate = async () => {
    const root = getRoot();
    if (!root) {
      vscode.window.showErrorMessage('Open a folder before running Specappular: Generate.');
      return;
    }

    const stamp = new Date().toISOString();
    out.show(true);
    out.appendLine(`[generate] ${stamp} Starting generate...`);
    out.appendLine(`[generate] Pretending to contact AI with message: "hello"`);

    // Create a tiny artifact so the command "does something"
    const helloPath = path.join(root, 'codegen', 'hello.txt');
    await writeFile(helloPath, `hello from Specappular generate at ${stamp}\n`);

    // Attempt to surface Copilot Chat if installed
    const opened = await tryOpenCopilotChat();
    if (opened) {
      vscode.window.showInformationMessage('Specappular: Opened Copilot Chat. Type "hello" to test the connection.');
      out.appendLine('[generate] Opened Copilot Chat panel.');
    } else {
      vscode.window.showInformationMessage('Specappular: Generated codegen/hello.txt. Copilot Chat not detected.');
      out.appendLine('[generate] Copilot Chat not detected. Skipped opening chat.');
    }

    out.appendLine('[generate] Done.');
  };

  const registerAutoGenerate = () => {
    const cfg = vscode.workspace.getConfiguration('specappular');
    const enabled = cfg.get<boolean>('autoGenerateOnSave', false);

    // Clean up previous registrations
    autoSubs.forEach(d => d.dispose());
    autoSubs = [];

    if (!enabled) return;

    // Trigger generate when saving Markdown files under spec/
    const sub = vscode.workspace.onDidSaveTextDocument(doc => {
      const wk = getRoot();
      if (!wk) return;
      const p = doc.uri.fsPath.replace(/\\/g, '/');
      const inSpec = p.includes('/spec/') && p.toLowerCase().endsWith('.md');
      if (inSpec) {
        generate();
      }
    });

    autoSubs.push(sub);
  };

  let autoSubs: vscode.Disposable[] = [];

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('specappular.init', async () => {
      const appName = await vscode.window.showInputBox({
        title: 'Specappular: App Name',
        prompt: 'Enter the name of your app',
        placeHolder: 'MyApp',
        validateInput: v => (!v?.trim() ? 'App name is required' : undefined)
      });
      if (!appName) return;
      await scaffoldSpec(appName.trim());
    }),

    vscode.commands.registerCommand('specappular.generate', async () => {
      await generate();
    }),

    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('specappular.autoGenerateOnSave')) {
        registerAutoGenerate();
      }
    }),

    out
  );

  // Initialize auto-generate-on-save if enabled
  registerAutoGenerate();
}

export function deactivate() {}

// --- Markdown templates ---
function mdIndex(appName: string): string {
  return `# ${appName}

Welcome to your Specappular app spec.

- Start in app/overview.md to describe your app.
- Describe your backend in backends/webapi/overview.md.
- Describe your frontend in frontends/console/overview.md.
- Capture domain concepts under domains/.
- Capture data storage and persistence under data/.
- Add test scenarios under tests/.

Next steps:
1. Edit these files with plain English specs.
2. Run "Specappular: Generate" to simulate generation (creates codegen/hello.txt for now).
`;
}

function mdAppOverview(appName: string): string {
  return `# App Overview

- Name: ${appName}
- Description: Briefly describe your app's purpose and users.
- Architecture: Console frontend + ASP.NET Core Web API backend.
`;
}

function mdBackendOverview(): string {
  return `# Backend (ASP.NET Core Web API)

- Endpoints:
  - GET /todos — list items
  - POST /todos — create item
  - etc.

- Models: TodoItem { id: number, title: string, completed: boolean }
`;
}

function mdFrontendOverview(): string {
  return `# Frontend (Console)

- Screens/flows:
  - List todos
  - Add todo
  - Toggle completion
`;
}

function mdDomainsReadme(): string {
  return `# Domains

Describe your domain entities and behaviors here.
`;
}

function mdDataReadme(): string {
  return `# Data

Describe storage strategy (e.g., EF Core, database schema, migrations).
`;
}

function mdTestsReadme(): string {
  return `# Tests

Document test cases for:
- Model
- API
- Database
- UI/Console
- E2E flows
`;
}