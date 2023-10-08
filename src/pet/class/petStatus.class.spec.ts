import { PetAttributes } from './petAttributes.class';
import { PetStatus } from './petStatus.class';

describe('PetStatus test', () => {
  it('deve calcular os status corretamente', () => {
    const attributes = new PetAttributes();
    attributes.vitality = 10;
    attributes.dexterity = 5;
    const status = new PetStatus(attributes);
    expect(status.health).toBe(72);
  });
});
