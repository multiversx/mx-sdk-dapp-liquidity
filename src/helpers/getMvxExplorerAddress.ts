import { InMemoryStore } from '../store/inMemoryStore';

export const getMvxExplorerAddress = () => {
  return InMemoryStore.getInstance().getItem('mvxExplorerAddress') ?? '';
};
