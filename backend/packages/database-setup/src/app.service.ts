import { stdout } from 'node:process';
import { clearScreenDown, cursorTo } from 'node:readline';
import { terminal as term } from 'terminal-kit';
import { Injectable } from '@nestjs/common';
import { fakerEN, fakerRU } from '@faker-js/faker';
import { Options, UI, Service, MsgType } from './service.interface';
import { ThemeService } from './theme.service';
import { UserService } from './user.service';
import { CollectionService } from './collection.service';
import { ItemService } from './item.service';

function isInt(input: string) {
  return (
    typeof +input === 'number' && !isNaN(+input) && (+input | 0) === +input
  );
}

@Injectable()
export class AppService implements UI {
  constructor(
    private theme: ThemeService,
    private user: UserService,
    private collection: CollectionService,
    private item: ItemService,
  ) {}

  private serviceList: Record<string, Service> = {
    Theme: this.theme,
    User: this.user,
    Collection: this.collection,
    Item: this.item,
  };

  private isExit = false;

  async start() {
    let spaces = 0;
    while (!this.isExit) {
      try {
        this.clearDisplay(spaces);
        const service = await this.askOptions({
          title: '\nSelect service to generate',
          map: this.serviceList,
        });

        spaces = await service.execute(this);
      } catch (e) {
        if (e === 'exit') {
          term.bold.cyan('\nBye!\n');
          term.processExit(0);
          return;
        } else throw e;
      }
    }
  }

  setProgress(
    title: string,
    itemCount: number,
  ): (updateProgress: number) => void {
    const progress = term.progressBar({
      title: `${title} (${0}/${itemCount})`,
      titleStyle: term.cyan.bold,
      titleSize: 50,
      percent: true,
    });

    return (updateProgress: number) => {
      progress.update({
        title: `${title} (${updateProgress}/${itemCount})`,
        progress: updateProgress / itemCount,
      });
      if (updateProgress === itemCount) {
        progress.stop();
        term.eraseLine();
      }
    };
  }

  print(str: string, type = MsgType.Info) {
    switch (type) {
      case MsgType.Info:
        term.bold.cyan(`${str}\n`);
        break;
      case MsgType.Success:
        term.bold.brightGreen(`${str}\n`);
        break;
      case MsgType.Error:
        term.bold.brightRed(`${str}\n`);
        break;
    }
  }

  async askString(title: string): Promise<string> {
    term.bold.cyan(`${title} `);
    let input: string | undefined;
    while (!input) {
      input = await term.inputField({}).promise;
    }
    if (input === 'exit') throw 'exit';
    term('\n');
    return input;
  }

  async askInt(title: string, positiveOnly = true): Promise<number> {
    let result: number | undefined = undefined;
    while (!result) {
      const input = await this.askString(title);
      if (isInt(input) && (!positiveOnly || +input >= 0)) result = +input;
    }

    return result;
  }

  async askOptions<T>(options: Options<T>): Promise<T> {
    term.bold.cyan(`${options.title} \n`);

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
    if (result.selectedIndex === exitIndex) throw 'exit';
    else return values[result.selectedIndex];
  }

  async askBool(title: string) {
    return await this.askOptions({
      title,
      map: {
        Yes: true,
        No: false,
      },
    });
  }

  async askFaker() {
    return await this.askOptions({
      title: 'What locale?',
      map: {
        Rus: () => fakerRU,
        Eng: () => fakerEN,
        Random: () => fakerEN.helpers.arrayElement([fakerEN, fakerRU]),
      },
    });
  }

  drawSeparator(length = 64 + 6) {
    term('\n' + '='.repeat(length) + '\n');
  }

  clearDisplay(upperLinesCount = 0) {
    const repeatCount = stdout.rows - 2 - upperLinesCount;
    const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : '';
    console.log(blank);
    cursorTo(stdout, 0, upperLinesCount);
    clearScreenDown(stdout);
  }
}
