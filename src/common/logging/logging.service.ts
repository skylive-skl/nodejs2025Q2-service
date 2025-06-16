import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import { mkdir, stat } from 'fs/promises';
import * as path from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel = process.env.LOG_LEVEL || 'info';
  private logFilePath = path.join(__dirname, '../../../logs/app.log');
  private errFilePath = path.join(__dirname, '../../../logs/app.error.log');
  private maxSizeKB = parseInt(process.env.LOG_FILE_MAX_SIZE_KB || '100', 10);

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private async writeLog(level: string, message: string) {
    if (!this.shouldLog(level)) return;

    const log = `[${new Date().toISOString()}] [${level.toUpperCase()}]: ${message}\n`;
    const logFilePath = level === 'error' ? this.errFilePath : this.logFilePath;

    const stats = await stat(logFilePath).catch(() => null);

    if (stats && stats.size > this.maxSizeKB * 1024) {
      const backupPath = `${logFilePath}.${Date.now()}`;
      await fs.promises.rename(logFilePath, backupPath);
    }

    process.stdout.write(log);

    const logDir = path.dirname(logFilePath);
    await mkdir(logDir, { recursive: true });
    const writeStream = fs.createWriteStream(logFilePath, { flags: 'a' });
    writeStream.write(log);
  }

  log(message: string) {
    this.writeLog('info', message);
  }

  error(message: string, trace?: string) {
    this.writeLog('error', `${message}\nTrace: ${trace || ''}`);
  }

  warn(message: string) {
    this.writeLog('warn', message);
  }

  debug(message: string) {
    this.writeLog('debug', message);
  }

  verbose(message: string) {
    this.writeLog('debug', message);
  }
}
