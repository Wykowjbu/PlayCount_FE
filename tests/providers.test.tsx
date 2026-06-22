import React from 'react';
import { render, screen } from '@testing-library/react';
import { MotionProvider } from '@/providers/motion-provider';
import { QueryProvider } from '@/providers/query-provider';

describe('Providers Render Tests', () => {
  it('renders MotionProvider children correctly', () => {
    render(
      <MotionProvider>
        <div data-testid="motion-child">Motion Child</div>
      </MotionProvider>
    );
    expect(screen.getByTestId('motion-child')).toBeInTheDocument();
    expect(screen.getByText('Motion Child')).toBeInTheDocument();
  });

  it('renders QueryProvider children correctly', () => {
    render(
      <QueryProvider>
        <div data-testid="query-child">Query Child</div>
      </QueryProvider>
    );
    expect(screen.getByTestId('query-child')).toBeInTheDocument();
    expect(screen.getByText('Query Child')).toBeInTheDocument();
  });
});
