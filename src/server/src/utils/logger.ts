export class Logger {
  DB_LOG_PREFIX: string = "[db]";
  FG_RED: string = "\x1b[31m";
  FG_GREEN: string = "\x1b[32m";
  FG_RESET: string = "\x1b[0m";

  /**
   * Log a success message to the console
   * @param message
   */
  success(message: string): void {
    console.log(
      `${this.FG_GREEN}${this.DB_LOG_PREFIX}${message}${this.FG_RESET}`
    );
  }

  /**
   * Log an error message to the console
   * @param message
   */
  error(message: string): void {
    console.log(
      `${this.FG_RED}}${this.DB_LOG_PREFIX}${message}${this.FG_RESET}`
    );
  }
}
