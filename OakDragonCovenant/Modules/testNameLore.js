const NameLoreAgent = require('./nameLoreAgent');
const DomainError = require('./nameLoreAgent').DomainError;

describe('NameLoreAgent.checkAvailability', () => {
  it('returns availability on first attempt', async () => {
    const mockService = {
      checkAvailability: jest.fn().mockResolvedValue({
        domain: 'oakdragon.com',
        available: true,
        suggestions: ['oakdragon.net']
      })
    };
    const agent = new NameLoreAgent({ registryService: mockService });
    const result = await agent.checkAvailability('oakdragon.com');

    expect(mockService.checkAvailability)
      .toHaveBeenCalledWith('oakdragon.com', []);
    expect(result).toEqual({
      domain: 'oakdragon.com',
      available: true,
      suggestion: ['oakdragon.net']
    });
  });

  it('retries on network failure and then succeeds', async () => {
    const networkErr = new Error('timeout');
    networkErr.code = 'NetworkFailure';

    const mockService = {
      checkAvailability: jest
        .fn()
        .mockRejectedValueOnce(networkErr)
        .mockResolvedValue({
          domain: 'oakdragon.com',
          available: false,
          suggestions: ['oakdragon-covenant.com']
        })
    };

    const agent = new NameLoreAgent({ registryService: mockService });
    const result = await agent.checkAvailability('oakdragon.com', ['.com']);

    expect(mockService.checkAvailability).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      domain: 'oakdragon.com',
      available: false,
      suggestion: ['oakdragon-covenant.com']
    });
  });

  it('throws InvalidDomain on bad input', async () => {
    const agent = new NameLoreAgent({ registryService: {} });
    await expect(agent.checkAvailability('not a domain'))
      .rejects.toMatchObject({ code: 'InvalidDomain' });
  });

  it('throws RegistryUnavailable when service is down', async () => {
    const downErr = new Error('server error');
    downErr.code = 'RegistryUnavailable';

    const mockService = {
      checkAvailability: jest.fn().mockRejectedValue(downErr)
    };
    const agent = new NameLoreAgent({ registryService: mockService });

    await expect(agent.checkAvailability('oakdragon.com'))
      .rejects.toMatchObject({ code: 'RegistryUnavailable' });
  });
});