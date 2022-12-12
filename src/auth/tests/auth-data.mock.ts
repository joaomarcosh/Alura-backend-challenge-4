export const mockUser = {
  id: 1,
  username: 'test',
  password: 'pass',
};

export const mockUserWithConfirmation = {
  id: 1,
  username: 'test',
  password: 'pass',
  passwordConfirmation: 'pass',
};

export const mockUserNoPassword = {
  id: 1,
  username: 'test',
};

export const mockRequest = {
  user: mockUser,
};

export const mockAccessToken = {
  access_token: 'test token',
};

export const mockResponse = {
  setCookie: jest.fn(),
};
