import { Faker } from "@faker-js/faker";

export interface Service {
  execute(ui: UI): Promise<number>;
}

export type Options<T> = {
  title: string;
  map: Record<string, T>;
};

export enum MsgType {
  Info = 'info',
  Success = 'success',
  Error = 'error',
}

export interface UI {
  askString(title: string): Promise<string>;
  askInt(title: string): Promise<number>;
  print(str: string, type?: MsgType): void;
  askOptions<T>(options: Options<T>): Promise<T>;
  askBool(title: string): Promise<boolean>;
  setProgress(title: string, itemCount: number): (updateProgress: number) => void;
  askFaker(): Promise<() => Faker>;
  clearDisplay(upperLinesCount?: number): void;
  drawSeparator(length?: number): void;
}
