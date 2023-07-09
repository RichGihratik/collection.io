import { Injectable } from '@nestjs/common';
import { Service, UI } from './service.interface';
import { DatabaseService } from '@collection.io/prisma';

const themeList = [
  'Alcohol',
  'Coins',
  'Books',
  'Stamps',
  'Postcards',
  'Comics',
  'Action Figures',
  'Trading Cards',
  'Vinyl Records',
  'Movie Memorabilia',
  'Sports Jerseys',
  'Autographs',
  'Art Prints',
  'Antique Furniture',
  'Vintage Clothing',
  'Toy Cars',
  'Dolls',
  'Model Trains',
  'Musical Instruments',
  'Movie Props',
  'Fine China',
  'Wristwatches',
  'Jewelry',
  'Comic Books',
  'Bottles',
  'Sports Memorabilia',
  'Board Games',
  'Vintage Cameras',
  'Sneakers',
  'Figurines',
  'Vinyl Toys',
  'Vintage Posters',
  'Concert Tickets',
  'Vintage Magazines',
  'Musical Records',
  'Action Cameras',
  'Snow Globes',
  'Candles',
  'Shot Glasses',
  'Beer Steins',
  'Vintage Maps',
  'Pocket Knives',
  'Keychains',
  'Trading Pins',
  'Artifacts',
  'Antique Clocks',
  'Hats',
  'Lighters',
  'Fountain Pens',
  'Vintage Telephones',
  'Vinyl Music Albums',
];

@Injectable()
export class ThemeService implements Service {
  constructor(private db: DatabaseService) {}

  async execute(ui: UI): Promise<void> {
    return await this.db.$transaction(async (dbx) => {
      await dbx.collectionTheme.deleteMany();
      ui.print('All themes was deleted');
      await dbx.collectionTheme.createMany({
        data: themeList.map((theme) => ({ name: theme })),
      });
      ui.print('Themes was successfully recreated');
    });
  }
}
