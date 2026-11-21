import { describe, expect, it } from 'vitest';

import { isPointInSector2d } from '../src';

describe('isPointInSector2d', () => {
  it('Возвращает true, если точка в направлении сектора', () => {
    const sector = {
      origin: {
        x: 0,
        y: 0,
      },
      angle: 0,
      fovDeg: 90,
    };

    expect(
      isPointInSector2d(sector, {
        x: 0,
        y: 10,
      })
    ).toBe(true);
  });

  it('Возвращает false, если точка в противоположном сектору направлении', () => {
    const sector = {
      origin: {
        x: 0,
        y: 0,
      },
      angle: 0,
      fovDeg: 90,
    };

    expect(
      isPointInSector2d(sector, {
        x: 0,
        y: -10,
      })
    ).toBe(false);
  });

  it('Возвращает true, если точка ровно на крайнем угле сектора', () => {
    const sector = {
      origin: {
        x: 0,
        y: 0,
      },
      angle: 0,
      fovDeg: 90,
    };

    expect(
      isPointInSector2d(sector, {
        x: -10,
        y: 10,
      })
    ).toBe(true); // 45°
    expect(
      isPointInSector2d(sector, {
        x: 10,
        y: 10,
      })
    ).toBe(true); // 315°
  });

  it('Возвращает false, если точка за крайними углами сектора', () => {
    const sector = {
      origin: {
        x: 0,
        y: 0,
      },
      angle: 0,
      fovDeg: 60,
    };

    expect(
      isPointInSector2d(sector, {
        x: -10,
        y: 10,
      })
    ).toBe(false); // 45° > 30°
  });

  it('Возвращает true для точки в любом направлении, если угловой размер 360°', () => {
    const sector = {
      origin: {
        x: 0,
        y: 0,
      },
      angle: 0,
      fovDeg: 360,
    };

    expect(
      isPointInSector2d(sector, {
        x: 0,
        y: -10,
      })
    ).toBe(true);
    expect(
      isPointInSector2d(sector, {
        x: 10,
        y: 0,
      })
    ).toBe(true);
  });

  it('Возвращает true для крайних углов сектора, пересекающего границу 0° и 360°', () => {
    const sector = {
      origin: {
        x: 0,
        y: 0,
      },
      angle: 315,
      fovDeg: 90,
    };

    expect(
      isPointInSector2d(sector, {
        x: 0,
        y: 10,
      })
    ).toBe(true); // 0°
    expect(
      isPointInSector2d(sector, {
        x: 10,
        y: 0,
      })
    ).toBe(true); // 270°
  });

  it('Возвращает false для точки вне сектора, пересекающего границу 0° и 360°', () => {
    const sector = {
      origin: {
        x: 0,
        y: 0,
      },
      angle: 315,
      fovDeg: 90,
    };

    expect(
      isPointInSector2d(sector, {
        x: 10,
        y: -10,
      })
    ).toBe(false); // 225°
  });

  it('Возвращает true, если точка в вершине сектора', () => {
    const sector = {
      origin: {
        x: 100,
        y: 200,
      },
      angle: 0,
      fovDeg: 90,
    };

    expect(
      isPointInSector2d(sector, {
        x: 100,
        y: 200,
      })
    ).toBe(true);
  });

  it('Считает направление от вершины сектора, а не от начала координат', () => {
    const sector = {
      origin: {
        x: 100,
        y: 200,
      },
      angle: 0,
      fovDeg: 90,
    };

    expect(
      isPointInSector2d(sector, {
        x: 100,
        y: 210,
      })
    ).toBe(true);
    expect(
      isPointInSector2d(sector, {
        x: 100,
        y: 190,
      })
    ).toBe(false);
  });

  it('Возвращает true для точки на любом расстоянии, потому что радиус не проверяется', () => {
    const sector = {
      origin: {
        x: 0,
        y: 0,
      },
      angle: 0,
      fovDeg: 90,
    };

    expect(
      isPointInSector2d(sector, {
        x: 0,
        y: 100000,
      })
    ).toBe(true);
  });

  it('Приводит отрицательный угол сектора к диапазону [0, 360)', () => {
    const sector = {
      origin: {
        x: 0,
        y: 0,
      },
      angle: -10,
      fovDeg: 30,
    };

    expect(
      isPointInSector2d(sector, {
        x: 0,
        y: 10,
      })
    ).toBe(true); // 0° внутри −10° ± 15°
  });

  it('Возвращает true только для точки ровно в направлении сектора при угловом размере 0°', () => {
    const sector = {
      origin: {
        x: 0,
        y: 0,
      },
      angle: 90,
      fovDeg: 0,
    };

    expect(
      isPointInSector2d(sector, {
        x: -10,
        y: 0,
      })
    ).toBe(true); // ровно 90°
    expect(
      isPointInSector2d(sector, {
        x: 0,
        y: 10,
      })
    ).toBe(false); // 0°
  });
});
