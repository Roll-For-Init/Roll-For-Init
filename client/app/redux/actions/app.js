import { LOADING_ON, LOADING_OFF } from './types';

export const finishLoading = () => ({
  type: LOADING_OFF,
});

export const setLoading = () => ({
  type: LOADING_ON,
});
