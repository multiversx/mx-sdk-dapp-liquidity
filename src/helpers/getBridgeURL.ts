import { InMemoryStore } from '../store/inMemoryStore';

export const getBridgeURL = () => {
  return InMemoryStore.getInstance().getItem('bridgeURL') ?? '';
};
