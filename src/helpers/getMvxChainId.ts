import { InMemoryStore } from '../store/inMemoryStore';

export const getMvxChainId = () => {
  return InMemoryStore.getInstance().getItem('mvxChainId') ?? '';
};
