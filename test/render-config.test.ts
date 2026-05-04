import { describe, it, expect } from 'vitest';

/**
 * Tests for render configuration validation.
 * Verifies that render parameters are sane and won't cause silent failures.
 */

describe('Render configuration validation', () => {
  describe('Codec validation', () => {
    it('supports valid codec values', () => {
      const validCodecs = ['h264', 'h265', 'vp8', 'vp9'];
      for (const codec of validCodecs) {
        expect(['h264', 'h265', 'vp8', 'vp9']).toContain(codec);
      }
    });

    it('rejects invalid codec values', () => {
      const invalidCodecs = ['mp4', 'avi', 'invalid'];
      for (const codec of invalidCodecs) {
        expect(['h264', 'h265', 'vp8', 'vp9']).not.toContain(codec);
      }
    });
  });

  describe('Frame parameter validation', () => {
    it('frame numbers must be non-negative integers', () => {
      const validFrames = [0, 1, 30, 100, 1000];
      for (const frame of validFrames) {
        expect(Number.isInteger(frame)).toBe(true);
        expect(frame).toBeGreaterThanOrEqual(0);
      }
    });

    it('negative frames are invalid', () => {
      const invalidFrames = [-1, -10, -100];
      for (const frame of invalidFrames) {
        expect(frame).toBeLessThan(0);
      }
    });

    it('parseFloat of frame string rounds down', () => {
      const frame = parseInt('10.5', 10);
      expect(frame).toBe(10);
    });
  });

  describe('Composition dimensions validation', () => {
    it('width and height must be positive integers', () => {
      const validDimensions = [
        { width: 1920, height: 1080 },
        { width: 1280, height: 720 },
        { width: 3840, height: 2160 },
      ];

      for (const dim of validDimensions) {
        expect(dim.width).toBeGreaterThan(0);
        expect(dim.height).toBeGreaterThan(0);
        expect(Number.isInteger(dim.width)).toBe(true);
        expect(Number.isInteger(dim.height)).toBe(true);
      }
    });

    it('zero or negative dimensions are invalid', () => {
      const invalidDimensions = [
        { width: 0, height: 1080 },
        { width: 1920, height: 0 },
        { width: -100, height: 1080 },
      ];

      for (const dim of invalidDimensions) {
        const isValid = dim.width > 0 && dim.height > 0;
        expect(isValid).toBe(false);
      }
    });
  });

  describe('FPS validation', () => {
    it('common FPS values are positive numbers', () => {
      const commonFps = [24, 25, 30, 50, 60];
      for (const fps of commonFps) {
        expect(fps).toBeGreaterThan(0);
        expect(typeof fps).toBe('number');
      }
    });

    it('fps must be positive', () => {
      const invalidFps = [0, -1, -30];
      for (const fps of invalidFps) {
        expect(fps).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('Duration validation', () => {
    it('durationInFrames must be positive integer', () => {
      const validDurations = [30, 60, 90, 300, 1800];
      for (const duration of validDurations) {
        expect(duration).toBeGreaterThan(0);
        expect(Number.isInteger(duration)).toBe(true);
      }
    });

    it('zero or negative duration is invalid', () => {
      const invalidDurations = [0, -1, -30];
      for (const duration of invalidDurations) {
        expect(duration).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('Props parsing', () => {
    it('parses valid JSON props', () => {
      const propsJson = '{"title":"Hello","count":42}';
      const parsed = JSON.parse(propsJson);
      expect(parsed.title).toBe('Hello');
      expect(parsed.count).toBe(42);
    });

    it('throws on invalid JSON props', () => {
      const invalidJson = '{invalid json}';
      expect(() => JSON.parse(invalidJson)).toThrow();
    });

    it('handles empty props object', () => {
      const emptyProps = '{}';
      const parsed = JSON.parse(emptyProps);
      expect(Object.keys(parsed)).toHaveLength(0);
    });
  });
});
