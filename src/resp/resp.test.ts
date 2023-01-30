import { describe, expect, test } from '@jest/globals';
import docsResp from './docs';
import { parseMessage, stringifyMessage } from '.';

describe('resp', () => {
  test('parse followed by stringify yields the original value', () => {
    const docs = parseMessage(docsResp);
    expect(stringifyMessage(docs)).toEqual(docsResp.toString());
  });

  test('hash stringify yields a flat array of entries', () => {
    const hash = {
      a: 'a',
      b: 'b',
      c: {
        d: 'd',
        e: 'e',
      },
    };
    const flatHash = [
      'a', 'a',
      'b', 'b',
      'c', [
        'd', 'd',
        'e', 'e',
      ],
    ];
    expect(stringifyMessage(hash)).toEqual(stringifyMessage(flatHash));
  });
});
