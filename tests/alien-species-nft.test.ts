import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let lastTokenId = 0;
const tokenMetadata = new Map();
const tokenOwners = new Map();

// Simulated contract functions
function mint(name: string, description: string, speciesId: number, rarityScore: number, imageUrl: string, creator: string) {
  const tokenId = ++lastTokenId;
  tokenMetadata.set(tokenId, {
    name,
    description,
    creator,
    speciesId,
    rarityScore,
    imageUrl
  });
  tokenOwners.set(tokenId, creator);
  return tokenId;
}

function transfer(tokenId: number, sender: string, recipient: string) {
  if (tokenOwners.get(tokenId) !== sender) throw new Error('Not authorized');
  tokenOwners.set(tokenId, recipient);
  return true;
}

describe('Alien Species NFT Contract', () => {
  beforeEach(() => {
    lastTokenId = 0;
    tokenMetadata.clear();
    tokenOwners.clear();
  });
  
  it('should mint a new alien species NFT', () => {
    const tokenId = mint('Xenomorph Queen', 'The matriarch of the hive', 1, 95, 'https://example.com/xenomorph-queen.png', 'creator1');
    expect(tokenId).toBe(1);
    expect(tokenOwners.get(tokenId)).toBe('creator1');
    const metadata = tokenMetadata.get(tokenId);
    expect(metadata.name).toBe('Xenomorph Queen');
    expect(metadata.speciesId).toBe(1);
  });
  
  it('should transfer an NFT', () => {
    const tokenId = mint('Aquarius Elder', 'Wise leader of the water world', 2, 80, 'https://example.com/aquarius-elder.png', 'creator2');
    expect(transfer(tokenId, 'creator2', 'collector1')).toBe(true);
    expect(tokenOwners.get(tokenId)).toBe('collector1');
  });
  
  it('should not allow unauthorized transfer', () => {
    const tokenId = mint('Chronos Prime', 'Master of time manipulation', 3, 90, 'https://example.com/chronos-prime.png', 'creator3');
    expect(() => transfer(tokenId, 'unauthorized_user', 'collector2')).toThrow('Not authorized');
  });
  
  it('should store correct metadata', () => {
    const imageUrl = 'https://example.com/graviton-elder.png';
    const tokenId = mint('Graviton Elder', 'Ancient being of gravity manipulation', 4, 85, imageUrl, 'creator4');
    const metadata = tokenMetadata.get(tokenId);
    expect(metadata.imageUrl).toBe(imageUrl);
    expect(metadata.creator).toBe('creator4');
    expect(metadata.rarityScore).toBe(85);
  });
});
