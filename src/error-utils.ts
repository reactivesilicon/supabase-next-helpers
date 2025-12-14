export function throwIfError(
  error: any | null | undefined,
  method: string,
  ...args: any[]
): asserts error is null {
  if (error) {
    throwError(error, method, ...args);
  }
}

export function throwError(error: any, method: string, ...args: any[]): never {
  logError(error, method, ...args);
  throw error;
}

export function logIfError(error: any | null | undefined, method: string, ...args: any[]): void {
  if (error) {
    logError(error, method, ...args);
  }
}

export function logError(error: any, method: string, ...args: any[]): void {
  const report = {
    method: method,
    error: error,
    stringifiedArgs: JSON.stringify(args, null, 2),
    args: args,
  };

  console.error(report);
}
