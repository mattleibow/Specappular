import * as vscode from 'vscode';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as fs from 'fs-extra';

export interface TemplateSpec {
  template: string;
  target: string;
  context?: any;
}

export interface Spec {
  name: string;
  version?: number;
  outputDir?: string;
  templates?: TemplateSpec[];
  [key: string]: any;
}

export async function loadSpec(uri: vscode.Uri): Promise<{ spec: Spec; errors: string[] }> {
  const errors: string[] = [];
  try {
    const content = await fs.readFile(uri.fsPath, 'utf8');
    let data: any;
    const ext = path.extname(uri.fsPath).toLowerCase();
    if (ext === '.yaml' || ext === '.yml') {
      data = yaml.load(content);
    } else if (ext === '.json') {
      data = JSON.parse(content);
    } else {
      errors.push(`Unsupported spec file extension: ${ext}`);
      return { spec: {} as Spec, errors };
    }

    const spec = (data || {}) as Spec;
    if (!spec.name) errors.push('Missing required field: name');
    if (!Array.isArray(spec.templates)) errors.push('Missing required field: templates[]');

    return { spec, errors };
  } catch (e: any) {
    errors.push(`Failed to load spec: ${e.message}`);
    return { spec: {} as Spec, errors };
  }
}

export function isSpecFile(uri: vscode.Uri): boolean {
  const ext = path.extname(uri.fsPath).toLowerCase();
  return ['.yaml', '.yml', '.json'].includes(ext) && uri.fsPath.includes(path.sep + 'spec' + path.sep);
}