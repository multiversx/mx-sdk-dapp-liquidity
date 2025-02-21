import { InMemoryStore } from '../store/inMemoryStore';

export const getMvxApiURL = () => {
  return InMemoryStore.getInstance().getItem('mvxApiURL') ?? '';
};
