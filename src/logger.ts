import * as vscode from 'vscode';

class Logger {
  private channel = vscode.window.createOutputChannel('Specappular');

  info(message: string) {
    this.channel.appendLine(`[info] ${message}`);
  }

  warn(message: string) {
    this.channel.appendLine(`[warn] ${message}`);
  }

  error(message: string) {
    this.channel.appendLine(`[error] ${message}`);
  }

  show() {
    this.channel.show();
  }
}

export const logger = new Logger();