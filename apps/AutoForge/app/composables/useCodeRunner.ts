/**
 * Real code execution - IDE-style output
 * JS/TS: run in browser; Python: Pyodide (in-browser) or Piston (if self-hosted)
 */

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full'

let pyodidePromise: Promise<unknown> | null = null

const PISTON_WHITELIST_MSG =
  'The public Piston API is whitelist-only. Use JavaScript, TypeScript, or Python (runs in-browser).'

async function loadPyodide(): Promise<{
  runPython: (code: string, opts?: { globals?: unknown }) => unknown
  setStdout: (opts: { batched?: (msg: string) => void }) => void
}> {
  if (pyodidePromise) return pyodidePromise as Promise<any>
  pyodidePromise = (async () => {
    const loadPyodideFn = (window as any).loadPyodide
    if (!loadPyodideFn) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script')
        s.src = `${PYODIDE_CDN}/pyodide.js`
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Failed to load Pyodide'))
        document.head.appendChild(s)
      })
    }
    return (window as any).loadPyodide({ indexURL: `${PYODIDE_CDN}/` })
  })()
  return pyodidePromise as Promise<any>
}

const PROBLEM_RUN_CONFIG: Record<
  string,
  { fnName: string; fnNamePython: string; argKeys: string[] }
> = {
  'two-sum': { fnName: 'twoSum', fnNamePython: 'two_sum', argKeys: ['nums', 'target'] },
  'valid-parentheses': { fnName: 'isValid', fnNamePython: 'is_valid', argKeys: ['s'] },
  'merge-two-sorted-lists': { fnName: 'mergeTwoLists', fnNamePython: 'merge_two_lists', argKeys: ['list1', 'list2'] },
  'longest-substring-without-repeating': { fnName: 'lengthOfLongestSubstring', fnNamePython: 'length_of_longest_substring', argKeys: ['s'] },
  'trapping-rain-water': { fnName: 'trap', fnNamePython: 'trap', argKeys: ['height'] },
}

function parseLeetCodeStyleInput(input: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const trimmed = input.trim()
  if (!trimmed) return result

  try {
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      const parsed = JSON.parse(trimmed)
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : { value: parsed }
    }

    // Split by comma only when not inside brackets/quotes
    const parts: string[] = []
    let depth = 0
    let inString = false
    let quote = ''
    let start = 0
    for (let i = 0; i < trimmed.length; i++) {
      const c = trimmed[i]
      if (inString) {
        if (c === quote && trimmed[i - 1] !== '\\') inString = false
        continue
      }
      if (c === '"' || c === "'") {
        inString = true
        quote = c
      } else if (c === '[' || c === '{' || c === '(') {
        depth++
      } else if (c === ']' || c === '}' || c === ')') {
        depth--
      } else if (c === ',' && depth === 0) {
        parts.push(trimmed.slice(start, i).trim())
        start = i + 1
      }
    }
    parts.push(trimmed.slice(start).trim())

    for (const part of parts) {
      const eqIdx = part.indexOf('=')
      if (eqIdx === -1) continue
      const key = part.slice(0, eqIdx).trim()
      let valStr = part.slice(eqIdx + 1).trim()
      let val: unknown
      if (valStr.startsWith('[') || valStr.startsWith('{')) {
        val = JSON.parse(valStr)
      } else if (valStr.startsWith('"') || valStr.startsWith("'")) {
        val = valStr.slice(1, -1)
      } else if (valStr === 'true' || valStr === 'false') {
        val = valStr === 'true'
      } else {
        val = Number(valStr)
        if (Number.isNaN(val as number)) val = valStr
      }
      result[key] = val
    }
    return result
  } catch {
    return result
  }
}

export type RunResult = {
  success: boolean
  output: string
  result: unknown
  error?: string
  durationMs: number
  stdout?: string
  stderr?: string
}

export function useCodeRunner() {
  async function runJavaScriptOrTypeScript(
    code: string,
    input: string,
    slug: string
  ): Promise<RunResult> {
    const start = Date.now()
    const config = PROBLEM_RUN_CONFIG[slug]
    if (!config) {
      return {
        success: false,
        output: `Unknown problem: ${slug}`,
        result: null,
        durationMs: Date.now() - start,
      }
    }

    const args = parseLeetCodeStyleInput(input)
    const argValues = config.argKeys.map((k) => args[k])

    const logs: string[] = []
    const consoleOverrides = {
      log: (...a: unknown[]) => logs.push(a.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' ')),
      warn: (...a: unknown[]) => logs.push('WARN: ' + a.map(String).join(' ')),
      error: (...a: unknown[]) => logs.push('ERROR: ' + a.map(String).join(' ')),
    }

    try {
      const logs: string[] = []
      const capture = (...args: unknown[]) => {
        logs.push(args.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' '))
      }
      const allParams = [...config.argKeys, '___capture']
      const fn = new Function(
        ...allParams,
        `
        "use strict";
        const ___origLog = console.log, ___origWarn = console.warn, ___origError = console.error;
        console.log = (...a) => { ___capture(...a); ___origLog.apply(console, a); };
        console.warn = (...a) => { ___capture('WARN:', ...a); ___origWarn.apply(console, a); };
        console.error = (...a) => { ___capture('ERROR:', ...a); ___origError.apply(console, a); };
        ${code}
        return ${config.fnName}(${config.argKeys.join(', ')});
      `
      )
      const result = fn(...argValues, capture)
      const durationMs = Date.now() - start
      const stdout = logs.join('\n')

      let output = ''
      if (stdout) output += `stdout:\n${stdout}\n\n`
      output += `Return: ${typeof result === 'object' ? JSON.stringify(result) : String(result)}`
      output += `\n\n✓ Executed in ${durationMs}ms`

      return {
        success: true,
        output,
        result,
        durationMs,
        stdout,
      }
    } catch (err) {
      const durationMs = Date.now() - start
      const msg = err instanceof Error ? err.message : String(err)
      const stack = err instanceof Error ? err.stack : undefined
      const errOutput = [
        `Error: ${msg}`,
        stack ? `\nStack trace:\n${stack}` : '',
        `\n✗ Failed after ${durationMs}ms`,
      ].join('')
      return {
        success: false,
        output: errOutput,
        result: null,
        error: msg,
        durationMs,
      }
    }
  }

  async function runPythonViaPyodide(
    code: string,
    input: string,
    slug: string
  ): Promise<RunResult> {
    const start = Date.now()
    const config = PROBLEM_RUN_CONFIG[slug]
    if (!config) {
      return {
        success: false,
        output: `Unknown problem: ${slug}`,
        result: null,
        durationMs: Date.now() - start,
      }
    }

    const args = parseLeetCodeStyleInput(input)
    const stdinStr = JSON.stringify(args)
    const escapedStdin = stdinStr.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    const wrapped = `${code}\n\nimport json\nargs = json.loads("${escapedStdin}")\nresult = ${config.fnNamePython}(${config.argKeys.map((k) => `args["${k}"]`).join(', ')})\nresult`

    try {
      const pyodide = await loadPyodide()
      const stdout: string[] = []
      pyodide.setStdout({ batched: (msg: string) => stdout.push(msg) })

      let result = pyodide.runPython(wrapped)
      if (result != null && typeof (result as any).toJs === 'function') {
        result = (result as any).toJs()
      }
      const durationMs = Date.now() - start
      const stdoutStr = stdout.join('')

      const resultStr = result != null ? (typeof result === 'object' ? JSON.stringify(result) : String(result)) : ''
      let output = ''
      if (stdoutStr) output += `stdout:\n${stdoutStr}\n\n`
      output += `Return: ${resultStr || 'None'}`
      output += `\n\n✓ Executed in ${durationMs}ms`

      return {
        success: true,
        output,
        result,
        durationMs,
        stdout: stdoutStr,
      }
    } catch (err: any) {
      const durationMs = Date.now() - start
      const msg = err?.message ?? String(err)
      const traceback = err?.traceback ?? err?.python_traceback ?? ''
      const errOutput = [
        `Error: ${msg}`,
        traceback ? `\n${traceback}` : '',
        `\n✗ Failed after ${durationMs}ms`,
      ].join('')
      return {
        success: false,
        output: errOutput,
        result: null,
        error: msg,
        durationMs,
      }
    }
  }

  async function runViaPiston(
    code: string,
    language: string,
    stdin: string,
    slug: string
  ): Promise<RunResult> {
    const start = Date.now()
    if (language === 'go') {
      return {
        success: false,
        output: 'Go execution requires a backend. Use JavaScript, TypeScript, or Python for now.',
        result: null,
        durationMs: Date.now() - start,
      }
    }

    const config = PROBLEM_RUN_CONFIG[slug]
    const wrapped =
      config
        ? `${code}\n\nimport sys\nimport json\nargs = json.loads(sys.stdin.read())\nresult = ${config.fnNamePython}(${config.argKeys.map((k) => `args["${k}"]`).join(', ')})\nprint(json.dumps(result))`
        : code

    const configNuxt = useRuntimeConfig()
    const pistonUrl = (configNuxt.public?.pistonUrl as string) || 'https://emkc.org/api/v2/piston'

    try {
      const res = await fetch(`${pistonUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'python',
          version: '3.10.0',
          files: [{ name: 'main.py', content: wrapped }],
          stdin: config ? JSON.stringify(parseLeetCodeStyleInput(stdin)) : stdin,
        }),
      })
      const data = (await res.json()) as {
        run?: { stdout?: string; stderr?: string; code?: number; output?: string }
        compile?: { stdout?: string; stderr?: string; output?: string; code?: number }
        message?: string
      }
      const durationMs = Date.now() - start
      const run = data.run
      const compile = data.compile
      const stdout = run?.stdout ?? run?.output ?? ''
      const stderr = run?.stderr ?? ''
      const exitCode = run?.code ?? 0

      // Check compile-stage errors first (syntax/compile errors for compiled languages)
      const compileStderr = compile?.stderr ?? compile?.output ?? ''
      const compileFailed = compile && compile.code !== 0 && compile.code != null
      if (compileFailed && compileStderr) {
        return {
          success: false,
          output: `Compile error:\n\n${compileStderr}\n\n✗ Compilation failed after ${durationMs}ms`,
          result: null,
          error: compileStderr,
          durationMs,
          stderr: compileStderr,
        }
      }

      if (!res.ok || data.message) {
        const rawMsg = (data.message as string) || stderr || 'Execution failed'
        const isWhitelistError =
          res.status === 403 ||
          String(rawMsg).toLowerCase().includes('whitelist') ||
          String(rawMsg).toLowerCase().includes('engineerman')
        const outputMsg = isWhitelistError ? PISTON_WHITELIST_MSG : rawMsg
        return {
          success: false,
          output: outputMsg,
          result: null,
          error: rawMsg,
          durationMs,
          stdout,
          stderr,
        }
      }

      // Runtime errors (non-zero exit): show stderr prominently first
      const failed = exitCode !== 0
      const output = [
        failed && stderr ? `Runtime error:\n\n${stderr}\n` : stderr ? `stderr:\n${stderr}\n` : '',
        stdout ? `stdout:\n${stdout}\n` : '',
        `Exit code: ${exitCode}`,
        failed ? `\n✗ Failed after ${durationMs}ms` : `\n✓ Executed in ${durationMs}ms`,
      ]
        .filter(Boolean)
        .join('')

      return {
        success: !failed,
        output,
        result: stdout.trim(),
        durationMs,
        stdout,
        stderr,
      }
    } catch (err) {
      const durationMs = Date.now() - start
      const msg = err instanceof Error ? err.message : String(err)
      const isCorsOrForbidden = /cors|403|forbidden|failed to fetch/i.test(msg)
      const outputMsg = isCorsOrForbidden
        ? `Network/access error. The public Piston API may be restricted.\n\n${PISTON_WHITELIST_MSG}`
        : `Network error: ${msg}\n\n${PISTON_WHITELIST_MSG}`
      return {
        success: false,
        output: outputMsg,
        result: null,
        error: msg,
        durationMs,
      }
    }
  }

  async function run(
    code: string,
    language: string,
    input: string,
    slug: string
  ): Promise<RunResult> {
    const lang = language.toLowerCase()
    if (lang === 'javascript' || lang === 'typescript') {
      return runJavaScriptOrTypeScript(code, input, slug)
    }
    if (lang === 'python') {
      return runPythonViaPyodide(code, input, slug)
    }
    if (lang === 'go') {
      return {
        success: false,
        output: 'Go execution requires a backend. Use JavaScript, TypeScript, or Python.',
        result: null,
        durationMs: 0,
      }
    }
    return runViaPiston(code, lang, input, slug)
  }

  return { run, parseLeetCodeStyleInput }
}
