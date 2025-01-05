import puppeteer, { Browser, Page } from 'puppeteer';
import process from 'process';

class PeggyOnline {
  parserSource: string;

  static open(parserSource: string): Promise<void> {
    return new PeggyOnline(parserSource).open();
  }

  constructor(parserSource: string) {
    this.parserSource = parserSource;
  }

  async open(): Promise<void> {
    const browser = await this.launchBrowser();

    async function shutdownHandler() {
      await browser.close();
    }

    this.attachShutdownHandler(shutdownHandler);
    const page = await this.openPage(browser);
    await this.addGrammar(page);
  }

  async launchBrowser() {
    return puppeteer.launch({
      args: ['--start-maximized'],
      defaultViewport: null,
      headless: false,
    });
  }

  async openPage(browser: Browser): Promise<Page> {
    const [page] = await browser.pages();
    await page.setViewport({ width: 0, height: 0 });
    await page.goto('https://peggyjs.org/online.html');
    return page;
  }

  async addGrammar(page: Page) {
    await page.evaluate((grammar) => {
      // eslint-disable-next-line no-undef
      const textarea = document.getElementById('grammar');
      if (!textarea) return;

      const editorNode = textarea.nextSibling;
      if (!editorNode) return;

      // @ts-expect-error There is no way to validate that the CodeMirror object is present
      const editor = editorNode.CodeMirror;
      editor.setValue(grammar);
    }, this.parserSource);
  }

  attachShutdownHandler(shutdownHandler: (...args: any[]) => void) {
    ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((event) => {
      process.on(event, shutdownHandler);
    });
  }
}

export default PeggyOnline;
