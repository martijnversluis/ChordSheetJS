/**
 * Simple store implementation without external dependencies
 * @template T The state object type
 */
export class Store<T extends object> {
  private state: T;

  private listeners: Map<keyof T | '*', Set<(value: any, oldValue: any) => void>>;

  /**
     * Create a new store
     * @param initialState Initial state object
     */
  constructor(initialState: T) {
    this.state = { ...initialState };
    this.listeners = new Map();
  }

  /**
     * Get current state
     */
  getState(): Readonly<T> {
    return { ...this.state };
  }

  /**
     * Update state
     * @param newState Partial state to merge with current state
     */
  setState(newState: Partial<T>): void {
    const changedKeys: (keyof T)[] = [];
    const oldValues: Partial<T> = {};

    // Track changed values
    Object.keys(newState).forEach((key) => {
      const typedKey = key as keyof T;
      if (this.state[typedKey] !== newState[typedKey]) {
        changedKeys.push(typedKey);
        oldValues[typedKey] = this.state[typedKey];
      }
    });

    // Update state
    this.state = { ...this.state, ...newState };

    // Notify listeners
    changedKeys.forEach((key) => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.forEach((listener) => listener(this.state[key], oldValues[key]));
      }
    });

    // Notify global listeners
    const globalListeners = this.listeners.get('*');
    if (globalListeners && changedKeys.length > 0) {
      globalListeners.forEach((listener) => listener(this.state, oldValues));
    }
  }

  /**
     * Subscribe to state changes
     * @param key State property to watch (or '*' for all changes)
     * @param callback Function to call when state changes
     * @returns Unsubscribe function
     */
  subscribe<K extends keyof T>(
    key: K | '*',
    callback: (value: K extends '*' ? T : T[K], oldValue: K extends '*' ? Partial<T> : T[K]) => void,
  ): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    const keyListeners = this.listeners.get(key)!;
    keyListeners.add(callback as any);

    // Return unsubscribe function
    return () => {
      keyListeners.delete(callback as any);
      if (keyListeners.size === 0) {
        this.listeners.delete(key);
      }
    };
  }

  /**
     * Get value for a specific key
     * @param key The key to retrieve
     */
  get<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }
}

/**
   * Create a store with the given initial state
   * @param initialState Initial state object
   * @returns Store object and helper functions
   */
export function createStore<T extends object>(initialState: T) {
  const store = new Store(initialState);

  return {
    // Get the current state (readonly)
    getState: (): Readonly<T> => store.getState(),

    // Update state with new values
    setState: (newState: Partial<T>): void => store.setState(newState),

    // Subscribe to changes on a specific key
    subscribe: <K extends keyof T>(
      key: K | '*',
      callback: (value: K extends '*' ? T : T[K], oldValue: K extends '*' ? Partial<T> : T[K]) => void,
    ): () => void => store.subscribe(key, callback),

    // Get a specific value
    get: <K extends keyof T>(key: K): T[K] => store.get(key),
  };
}
