import { Injectable } from '@nestjs/common';
import { terminal as term } from 'terminal-kit';
import { TestService } from './test.service';
import { Options, UI, Service } from './service.interface';
import { stdout } from 'node:process';
import { clearScreenDown, cursorTo } from 'node:readline';
import { ThemeService } from './theme.service';

@Injectable()
export class AppService implements UI {
  constructor(private test: TestService, private theme: ThemeService) {}

  private serviceList: Record<string, Service> = {
    Test: this.test,
    Theme: this.theme,
  };

  private isExit = false;

  async start() {
    const options: Record<string, string> = Object.keys(
      this.serviceList,
    ).reduce((acc, key) => {
      acc[key] = key;
      return acc;
    }, {});

    while (!this.isExit) {
      try {
        this.clearDisplay();
        const key = await this.askOptions({
          title: 'Select service to generate',
          map: options,
        });

        await this.serviceList[key].execute(this);
      } catch (e) {
        if (e === 'exit') return;
        else throw e;
      }
    }
  }

  print(str: string) {
    term.bold.cyan(`${str}\n`);
  }

  async askString(title: string): Promise<string> {
    term.bold.cyan(`\n${title} `);
    const input = await term.inputField({}).promise;
    if (!input) throw new TypeError('Input was undefined');
    return input;
  }

  async askOptions<T extends string>(options: Options<T>): Promise<T> {
    term.bold.cyan(`\n${options.title} \n`);

    const values: T[] = [];
    const display: string[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(options.map)) {
      display.push(`${i++}. ${key} `);
      values.push(value);
    }

    const exitIndex = display.push('X. Exit ') - 1;

    const result = await term.singleColumnMenu(display).promise;
    term('\n');
    if (result.selectedIndex === exitIndex) {
      term.bold.cyan('Bye!\n');
      term.processExit(0);
      throw 'exit';
    } else return values[result.selectedIndex];
  }

  clearDisplay() {
    const repeatCount = stdout.rows - 2;
    const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : '';
    console.log(blank);
    cursorTo(stdout, 0, 0);
    clearScreenDown(stdout);
  }
}
