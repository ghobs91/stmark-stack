import * as migration_20260927_195313_initial from './20260927_195313_initial';

export const migrations = [
  {
    up: migration_20260927_195313_initial.up,
    down: migration_20260927_195313_initial.down,
    name: '20260927_195313_initial'
  },
];
