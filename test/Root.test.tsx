import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { RemotionRoot } from '../src/Root';

describe('RemotionRoot', () => {
  it('renders without crashing', () => {
    const { container } = render(<RemotionRoot />);
    expect(container).toBeTruthy();
  });

  it('renders empty fragment (no compositions defined yet)', () => {
    const { container } = render(<RemotionRoot />);
    // Empty fragment should have no children
    expect(container.firstChild).toBeNull();
  });
});
