import { describe, it, expect } from 'vitest';
import { itemsData } from './itemsData';

describe('itemsData', () => {
  it('should not have any duplicate item names', () => {
    const itemNames = new Set<string>();
    const duplicates: string[] = [];

    // Check each item in itemsData
    itemsData.forEach((item) => {
      if (itemNames.has(item.name)) {
        duplicates.push(item.name);
      } else {
        itemNames.add(item.name);
      }
    });

    // If there are any duplicates, the test will fail with a descriptive message
    if (duplicates.length > 0) {
      throw new Error(`Found duplicate item names: ${duplicates.join(', ')}`);
    }
    expect(duplicates).toHaveLength(0);
  });
}); 