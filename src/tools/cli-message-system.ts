import pc from "picocolors";

// Provides structured, colorized message output for the CLI.
type MessageLevel = "info" | "success" | "warning" | "error";

const LEVEL_STYLE: Record<MessageLevel, (text: string) => string> = {
	info: pc.cyan,
	success: pc.green,
	warning: pc.yellow,
	error: pc.red,
};

const LEVEL_LABEL: Record<MessageLevel, string> = {
	info: "INFO",
	success: "OK",
	warning: "WARN",
	error: "ERROR",
};

const LEVEL_ICON: Record<MessageLevel, string> = {
	info: "i",
	success: "+",
	warning: "!",
	error: "x",
};

function formatMessage(level: MessageLevel, message: string): string {
	const style = LEVEL_STYLE[level];
	const label = `${LEVEL_ICON[level]} ${LEVEL_LABEL[level]}`;
	return `${style(`[${label}]`)} ${message}`;
}

function writeStdout(message: string): void {
	process.stdout.write(`${message}\n`);
}

function writeStderr(message: string): void {
	process.stderr.write(`${message}\n`);
}

export function printBanner(title: string): void {
	writeStdout(pc.bold(pc.blue(title)));
}

export function printSection(title: string, lines: string[]): void {
	writeStdout(pc.magenta(pc.bold(title)));
	for (const line of lines) {
		writeStdout(`  ${line}`);
	}
}

export function printInfo(message: string): void {
	writeStdout(formatMessage("info", message));
}

export function printSuccess(message: string): void {
	writeStdout(formatMessage("success", message));
}

export function printWarning(message: string): void {
	writeStderr(formatMessage("warning", message));
}

export function printError(message: string): void {
	writeStderr(formatMessage("error", message));
}
