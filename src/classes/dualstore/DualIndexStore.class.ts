import { createHash } from 'node:crypto';

export type Sha1Hex = string;

export function sha1Hex(input: string): Sha1Hex {
  return createHash('sha1').update(input).digest('hex');
}

export class DualIndexStore<T> {
  private byHash = new Map<Sha1Hex, T>();
  private hashByName = new Map<string, Sha1Hex>();
  private namesByHash = new Map<Sha1Hex, Set<string>>();

  hasHash(hash: Sha1Hex): boolean {
    return this.byHash.has(hash);
  }

  hasName(name: string): boolean {
    return this.hashByName.has(name);
  }

  getByHash(hash: Sha1Hex): T | undefined {
    return this.byHash.get(hash);
  }

  getByName(name: string): T | undefined {
    const hash = this.hashByName.get(name);
    return hash ? this.byHash.get(hash) : undefined;
  }

  // Add or replace the value for a hash; optionally attach names.
  set(hash: Sha1Hex, value: T, names: string[] = []): void {
    this.byHash.set(hash, value);
    for (const name of names) this.addName(hash, name);
  }

  addName(hash: Sha1Hex, name: string): void {
    if (!this.byHash.has(hash)) {
      throw new Error(`Cannot add name; unknown hash: ${hash}`);
    }

    const existing = this.hashByName.get(name);
    if (existing && existing !== hash) {
      throw new Error(`Name already bound to a different hash: ${name}`);
    }

    this.hashByName.set(name, hash);

    let set = this.namesByHash.get(hash);
    if (!set) {
      set = new Set<string>();
      this.namesByHash.set(hash, set);
    }
    set.add(name);
  }

  deleteName(name: string): boolean {
    const hash = this.hashByName.get(name);
    if (!hash) return false;

    this.hashByName.delete(name);

    const set = this.namesByHash.get(hash);
    if (set) {
      set.delete(name);
      if (set.size === 0) this.namesByHash.delete(hash);
    }
    return true;
  }

  deleteHash(hash: Sha1Hex): boolean {
    const existed = this.byHash.delete(hash);
    if (!existed) return false;

    const names = this.namesByHash.get(hash);
    if (names) {
      for (const name of names) this.hashByName.delete(name);
      this.namesByHash.delete(hash);
    }
    return true;
  }

  rename(oldName: string, newName: string): void {
    const hash = this.hashByName.get(oldName);
    if (!hash) throw new Error(`Unknown name: ${oldName}`);
    if (this.hashByName.has(newName))
      throw new Error(`Name exists: ${newName}`);

    this.deleteName(oldName);
    this.addName(hash, newName);
  }

  listNames(hash: Sha1Hex): string[] {
    return [...(this.namesByHash.get(hash) ?? [])];
  }
}
