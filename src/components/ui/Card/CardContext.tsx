'use client';

import { createContext, useContext, type ReactNode } from 'react';

type SwipeDirection = 'horizontal' | 'vertical';

interface CardContextValue {
  swipeDirection: SwipeDirection;
}

const CardContext = createContext<CardContextValue>({ swipeDirection: 'horizontal' });

export function CardProvider({ swipeDirection, children }: { swipeDirection: SwipeDirection; children: ReactNode }) {
  return <CardContext.Provider value={{ swipeDirection }}>{children}</CardContext.Provider>;
}

export function useCardContext(): CardContextValue {
  return useContext(CardContext);
}
