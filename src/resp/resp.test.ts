import { describe, expect, test } from '@jest/globals';
import docsResp from './docs';
import { parseMessage, stringifyMessage } from '.';

describe('resp', () => {
  test('parse followed by stringify yields the original value', () => {
    const docs = parseMessage(docsResp);
    expect(stringifyMessage(docs)).toEqual(docsResp.toString());
  });
});
