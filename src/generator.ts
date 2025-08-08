import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import ejs from 'ejs';
import fg from 'fast-glob';
import slash from 'slash';
import { loadSpec, Spec, TemplateSpec } from './spec/loader';
import { logger } from './logger';

export interface GenerateOptions {
  templatesDir: string;
  outputDir: string;
  overwrite: boolean;
  extensionTemplatesDir: string;
}

function getConfig(): GenerateOptions {
  const cfg = vscode.workspace.getConfiguration('specappular');
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  const root = workspaceFolder?.uri.fsPath ?? process.cwd();
  const templatesDir = path.resolve(root, cfg.get<string>('templatesDir', 'templates'));
  const outputDir = path.resolve(root, cfg.get<string>('outputDir', 'generated'));
  const overwrite = cfg.get<boolean>('overwrite', false);
  const extension = vscode.extensions.getExtension('mattleibow.specappular');
  const extensionTemplatesDir = extension
    ? path.join(extension.extensionPath, 'templates')
    : path.join(__dirname, '..', 'templates');
  return { templatesDir, outputDir, overwrite, extensionTemplatesDir };
}

function hasCurlyVars(s: string) {
  return /{{\s*[\w.]+\s*}}/.test(s);
}

function get(obj: any, key: string) {
  return key.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

function substituteCurlyVars(input: string, context: any) {
  return input.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const v = get(context, key);
    return v === undefined || v === null ? '' : String(v);
  });
}

async function resolveTemplatePath(templateName: string, opt: GenerateOptions) {
  const local = path.join(opt.templatesDir, templateName);
  if (await fs.pathExists(local)) return local;
  const bundled = path.join(opt.extensionTemplatesDir, templateName);
  if (await fs.pathExists(bundled)) return bundled;
  return null;
}

async function renderTemplateToFile(tpl: TemplateSpec, spec: Spec, opt: GenerateOptions, specDir: string) {
  const context = { spec, ...spec, ...(tpl.context || {}) };

  const templatePath = await resolveTemplatePath(tpl.template, opt);
  if (!templatePath) {
    logger.warn(`Template not found: ${tpl.template}`);
    return;
  }

  let targetRel = tpl.target;
  if (hasCurlyVars(targetRel)) {
    targetRel = substituteCurlyVars(targetRel, context);
  } else {
    targetRel = ejs.render(targetRel, context, { async: false });
  }

  const baseOut = spec.outputDir ? path.resolve(specDir, spec.outputDir) : opt.outputDir;
  const targetAbs = path.isAbsolute(targetRel) ? targetRel : path.resolve(baseOut, targetRel);

  await fs.ensureDir(path.dirname(targetAbs));
  if (await fs.pathExists(targetAbs)) {
    if (!opt.overwrite) {
      logger.info(`Skip existing file (overwrite=false): ${slash(path.relative(vscode.workspace.workspaceFolders?.[0].uri.fsPath || '', targetAbs))}`);
      return;
    }
  }

  const templateStr = await fs.readFile(templatePath, 'utf8');
  const output = await ejs.render(templateStr, context, { async: true });
  await fs.writeFile(targetAbs, output, 'utf8');
  logger.info(`Generated: ${slash(path.relative(vscode.workspace.workspaceFolders?.[0].uri.fsPath || '', targetAbs))}`);
}

export async function generateForSpecUri(uri: vscode.Uri) {
  const { spec, errors } = await loadSpec(uri);
  if (errors.length) {
    vscode.window.showErrorMessage(`Spec validation failed: ${errors.join('; ')}`);
    errors.forEach(e => logger.error(e));
    return;
  }
  const opt = getConfig();
  const specDir = path.dirname(uri.fsPath);
  const templates = spec.templates ?? [];
  if (!templates.length) {
    vscode.window.showWarningMessage('Spec has no templates[] entries.');
    return;
  }

  for (const tpl of templates) {
    await renderTemplateToFile(tpl, spec, opt, specDir);
  }
}

export async function generateAllSpecs() {
  const cfg = vscode.workspace.getConfiguration('specappular');
  const pattern = cfg.get<string>('specGlob', 'spec/**/*.y?(a)ml');
  const root = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  if (!root) return;

  const matches = await fg(pattern, { cwd: root, absolute: true });
  if (!matches.length) {
    vscode.window.showInformationMessage('No spec files found.');
    return;
  }
  for (const file of matches) {
    await generateForSpecUri(vscode.Uri.file(file));
  }
}