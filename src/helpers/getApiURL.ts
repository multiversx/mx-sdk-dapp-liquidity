import { InMemoryStore } from '../store/inMemoryStore';

export const getApiURL = () => {
  return InMemoryStore.getInstance().getItem('apiURL') ?? '';
};
