import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import type { Product } from '../src/menu/menu.types';

describe('GET /menu', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  async function getMenu(): Promise<Product[]> {
    const response = await request(app.getHttpServer())
      .get('/menu')
      .expect(200);
    return response.body as Product[];
  }

  it('serves every product on the menu', async () => {
    const products = await getMenu();

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('gives each product an id, a name and its modifiers', async () => {
    const products = await getMenu();

    for (const product of products) {
      expect(typeof product.id).toBe('string');
      expect(product.id).not.toHaveLength(0);
      expect(typeof product.name).toBe('string');
      expect(product.name).not.toHaveLength(0);
      expect(Array.isArray(product.modifiers)).toBe(true);
    }
  });

  it('prices everything in integer cents', async () => {
    const products = await getMenu();

    for (const product of products) {
      // Floats here would mean money is being rounded somewhere. See ADR-0002.
      expect(Number.isInteger(product.basePrice)).toBe(true);
      expect(product.basePrice).toBeGreaterThan(0);

      for (const modifier of product.modifiers) {
        expect(typeof modifier.id).toBe('string');
        expect(typeof modifier.label).toBe('string');
        expect(Number.isInteger(modifier.priceDelta)).toBe(true);
      }
    }
  });

  it('identifies every product and modifier uniquely, so an order line can reference one', async () => {
    const products = await getMenu();

    const productIds = products.map((product) => product.id);
    expect(new Set(productIds).size).toBe(productIds.length);

    for (const product of products) {
      const modifierIds = product.modifiers.map((modifier) => modifier.id);
      expect(new Set(modifierIds).size).toBe(modifierIds.length);
    }
  });
});
