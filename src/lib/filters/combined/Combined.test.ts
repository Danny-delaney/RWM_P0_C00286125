import { describe, it, expect } from 'vitest';
import { Combined } from './Combined';

describe('Combined function', () => {
  it('gets the factorial of a list of numbers converst to string then reverses the string of numbers separated by spaces and commas', () => { 
    const input = [4, 3, 2, 1, 7]; 
    const expected = "5040 1 2 6 24";
    expect(Combined(input)).toEqual(expected);
  });
});