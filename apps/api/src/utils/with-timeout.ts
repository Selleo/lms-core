export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error("Operation timed out")), ms),
  );
  return Promise.race([promise, timeout]);
}
