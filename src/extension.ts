import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { generateAllSpecs, generateForSpecUri } from './generator';
import { isSpecFile, loadSpec } from './spec/loader';
import { logger } from './logger';

export async function activate(context: vscode.ExtensionContext) {
  logger.info('Specappular activated');

  const cmdGenerate = vscode.commands.registerCommand('specappular.generateCode', async (uri?: vscode.Uri) => {
    if (uri && isSpecFile(uri)) {
      await generateForSpecUri(uri);
    } else {
      const pick = await vscode.window.showQuickPick(
        ['Generate from all specs', 'Pick a spec file...'],
        { placeHolder: 'What would you like to generate?' }
      );
      if (!pick) return;
      if (pick.startsWith('Generate from all')) {
        await generateAllSpecs();
      } else {
        const chosen = await vscode.window.showOpenDialog({
          canSelectMany: false,
          openLabel: 'Select Spec',
          filters: { 'Spec Files': ['yaml', 'yml', 'json'] }
        });
        if (chosen && chosen[0]) {
          await generateForSpecUri(chosen[0]);
        }
      }
    }
  });

  const cmdValidate = vscode.commands.registerCommand('specappular.validateSpec', async (uri?: vscode.Uri) => {
    let target: vscode.Uri | undefined = uri;
    if (!target) {
      const editor = vscode.window.activeTextEditor;
      if (editor) target = editor.document.uri;
    }
    if (!target) {
      vscode.window.showInformationMessage('Open a spec file or right-click a spec to validate.');
      return;
    }
    const { errors } = await loadSpec(target);
    if (errors.length) {
      errors.forEach(e => logger.error(e));
      vscode.window.showErrorMessage(`Spec has ${errors.length} issue(s). See "Specappular" output.`);
      logger.show();
    } else {
      vscode.window.showInformationMessage('Spec is valid.');
    }
  });

  const cmdCreate = vscode.commands.registerCommand('specappular.createSpec', async () => {
    const name = await vscode.window.showInputBox({ prompt: 'Enter spec name', placeHolder: 'MyFeature' });
    if (!name) return;
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) return;

    const specDir = path.join(folder.uri.fsPath, 'spec');
    await fs.ensureDir(specDir);
    const specPath = path.join(specDir, `${name}.yaml`);
    const initial = [
      'version: 1',
      `name: ${name}`,
      'outputDir: generated',
      'templates:',
      '  - template: class.ejs',
      '    target: "src/models/{{name}}.ts"',
      '    context:',
      '      className: "{{name}}"'
    ].join('\n');
    await fs.writeFile(specPath, initial, 'utf8');
    const doc = await vscode.workspace.openTextDocument(specPath);
    await vscode.window.showTextDocument(doc);
    vscode.window.showInformationMessage(`Spec created: ${path.relative(folder.uri.fsPath, specPath)}`);
  });

  const cmdClean = vscode.commands.registerCommand('specappular.cleanGenerated', async () => {
    const cfg = vscode.workspace.getConfiguration('specappular');
    const outDir = cfg.get<string>('outputDir', 'generated');
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) return;
    const abs = path.resolve(folder.uri.fsPath, outDir);
    const yes = await vscode.window.showWarningMessage(
      `Delete generated output folder "${path.relative(folder.uri.fsPath, abs)}"?`,
      { modal: true },
      'Delete'
    );
    if (yes === 'Delete') {
      await fs.remove(abs);
      vscode.window.showInformationMessage('Generated output cleaned.');
    }
  });

  context.subscriptions.push(cmdGenerate, cmdValidate, cmdCreate, cmdClean);

  const cfg = vscode.workspace.getConfiguration('specappular');
  if (cfg.get<boolean>('autoGenerateOnSave', false)) {
    const sub = vscode.workspace.onDidSaveTextDocument(async (doc) => {
      const uri = doc.uri;
      if (isSpecFile(uri)) {
        await generateForSpecUri(uri);
      }
    });
    context.subscriptions.push(sub);
  }
}

export function deactivate() {}