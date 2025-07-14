const NameLoreAgent = require('../OakDragonCovenant/Modules/nameLoreAgent');
const DomainError = require('../OakDragonCovenant/Modules/nameLoreAgent').DomainError;

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
    expect(result).toEqual({
      domain: 'oakdragon.com',
      available: true,
      suggestion: ['oakdragon.net']
    });
  });

  // add other tests here...
});
