interface IStore {
  [key: string]: string;
}

export class InMemoryStore {
  private static instance: InMemoryStore;
  private store: IStore;

  private constructor() {
    this.store = {} as IStore;
  }

  static getInstance() {
    if (!InMemoryStore.instance) {
      InMemoryStore.instance = new InMemoryStore();
    }
    return InMemoryStore.instance;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  getItem(key: string): string | null {
    return this.store.hasOwnProperty(key) ? this.store[key] : null;
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  clear() {
    this.store = {} as IStore;
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}
