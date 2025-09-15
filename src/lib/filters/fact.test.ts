import { describe, it, expect } from 'vitest';
import { facts } from './fact';

describe('Cube filter', () => {
  it('cubes a sequence', () => {
    const input = [4, 2, 8, 3, 9, 4, 10];
    const expected = [24, 2, 40320, 6, 362880, 24, 3628800];
    expect(facts(input)).toEqual(expected);
  });
});