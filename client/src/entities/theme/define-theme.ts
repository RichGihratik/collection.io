import {
  ThemeOptions as MuiOptions,
  createTheme as createMuiTheme,
} from '@mui/material';
import { deepmerge } from '@mui/utils';
import { useMemo, useState } from 'react';

export interface Themes {
  muiTheme: MuiOptions;
  datatableTheme: string | null;
};

export function useDefineTheme() {
  const [options, setOptions] = useState<Themes>({
    muiTheme: {},
    datatableTheme: null,
  });

  const muiTheme = useMemo(() => {
    return createMuiTheme(options.muiTheme);
  }, [options.muiTheme]);

  const datatableTheme = options.datatableTheme;

  function updateOptions(opts: Partial<Themes>) {
    setOptions({
      muiTheme: opts.muiTheme
        ? deepmerge(options.muiTheme, opts.muiTheme)
        : options.muiTheme,
      datatableTheme:
        opts.datatableTheme === undefined
          ? options.datatableTheme
          : opts.datatableTheme,
    });
  }

  return {
    updateOptions,
    datatableTheme,
    muiTheme,
  };
}