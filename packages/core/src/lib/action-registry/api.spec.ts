import { createActionRegistry } from './api';
import { vi } from 'vitest';

describe('createActionRegistry', () => {
  it('returns an ActionRegistry object', () => {
    const registry = createActionRegistry();

    expect(registry).toBeDefined();

    expect(registry).toHaveProperty('listActions');
    expect(registry).toHaveProperty('has');
    expect(registry).toHaveProperty('addAction');
    expect(registry).toHaveProperty('execute');
  });

  it('should add a new command', () => {
    const registry = createActionRegistry();

    registry.addAction({
      id: 'test',
      event: 'test',
      defaultLabel: 'test',
      fn: () => {},
    });

    expect(registry.has('test')).toBe(true);
  });

  it('should list all commands', () => {
    const registry = createActionRegistry();

    registry.addAction({
      id: 'test',
      event: 'test',
      defaultLabel: 'test',
      fn: () => {},
    });
    registry.addAction({
      id: 'test2',
      event: 'test2',
      defaultLabel: 'test2',
      fn: () => {},
    });

    expect(registry.listActions()).toEqual(['test', 'test2']);
  });

  it('should execute a command', () => {
    const registry = createActionRegistry();

    const fn = vi.fn((a: number, b: number) => {
      return a + b;
    });

    registry.addAction({
      id: 'test',
      event: 'test',
      defaultLabel: 'test',
      fn,
    });

    registry.execute('test', 1, 2);

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith(1, 2);
    expect(fn).toHaveReturnedWith(3);
  });
});
