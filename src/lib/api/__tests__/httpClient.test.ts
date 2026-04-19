import { ApiError, httpClient } from '../httpClient';

describe('ApiError', () => {
  it('stores status, statusText, message and sets name', () => {
    const err = new ApiError(404, 'Not Found', 'Resource not found');
    expect(err.status).toBe(404);
    expect(err.statusText).toBe('Not Found');
    expect(err.message).toBe('Resource not found');
    expect(err.name).toBe('ApiError');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('httpClient.get', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns parsed JSON when response is ok', async () => {
    const data = { id: 1, name: 'Test' };
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    });
    const result = await httpClient.get<typeof data>('/test');
    expect(result).toEqual(data);
  });

  it('throws ApiError when response is not ok', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });
    await expect(httpClient.get('/test')).rejects.toBeInstanceOf(ApiError);
  });

  it('ApiError includes status and statusText from the response', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    let caught: ApiError | undefined;
    try {
      await httpClient.get('/test');
    } catch (e) {
      caught = e as ApiError;
    }
    expect(caught?.status).toBe(500);
    expect(caught?.statusText).toBe('Internal Server Error');
  });
});
