const BLOOD_RED = "\u001b[38;2;138;3;3m";
const RESET = "\u001b[0m";
const DIM = "\u001b[2m";

const BANNER_LINES = [
  "███╗   ███╗      ███████╗██████╗ ███████╗ ██████╗",
  "████╗ ████║      ██╔════╝██╔══██╗██╔════╝██╔════╝",
  "██╔████╔██║█████╗███████╗██████╔╝█████╗  ██║     ",
  "██║╚██╔╝██║╚════╝╚════██║██╔═══╝ ██╔══╝  ██║     ",
  "██║ ╚═╝ ██║      ███████║██║     ███████╗╚██████╗",
  "╚═╝     ╚═╝      ╚══════╝╚═╝     ╚══════╝ ╚═════╝"
];

export function printBanner(): void {
  const banner = BANNER_LINES.map((line) => `${BLOOD_RED}${line}${RESET}`).join("\n");
  console.log(`\n${banner}`);
  console.log(`${DIM}M-SPEC · Spec-Driven Development Scaffold${RESET}\n`);
}

export function printProgress(detail: string): void {
  console.log(`${BLOOD_RED}•${RESET} ${detail}`);
}
