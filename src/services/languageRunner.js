export async function runCode(language, code) {
  try {
    return await window.electron.runCode({ language, code });
  } catch (error) {
    throw new Error(`Execution error: ${error.message}`);
  }
}