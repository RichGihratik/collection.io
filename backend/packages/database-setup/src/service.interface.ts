export interface Service {
  execute(ui: UI): Promise<void>;
}

export type Options<T extends string> = {
  title: string;
  map: Record<string, T>;
};

export interface UI {
  askString(title: string): Promise<string>;
  print(str: string): void;
  askOptions<T extends string>(options: Options<T>): Promise<T>;
  clearDisplay(): void;
}
