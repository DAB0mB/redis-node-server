import { describe, expect, test } from '@jest/globals';
import docsResp from './docs';
import * as RESP from '.';

describe('resp', () => {
  test('parse followed by stringify yields the original value', () => {
    const docs = RESP.parse(docsResp);
    expect(RESP.stringify(docs)).toEqual(docsResp.toString());
  });
});
