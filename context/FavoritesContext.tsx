'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getFavoriteProductIds,
  getFavoriteServiceIds,
  toggleProductFavoriteInFirestore,
  toggleServiceFavoriteInFirestore,
} from '@/lib/firestore/favorites';

interface FavoritesContextType {
  favProductIds: Set<string>;
  favServiceIds: Set<string>;
  likeCounts: Record<string, number>;
  isProductFavorited: (id: string) => boolean;
  isServiceFavorited: (id: string) => boolean;
  getLikes: (id: string, defaultLikes?: number) => number;
  toggleProductFav: (id: string, currentLikes?: number) => Promise<void>;
  toggleServiceFav: (id: string, currentLikes?: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favProductIds, setFavProductIds] = useState<Set<string>>(new Set());
  const [favServiceIds, setFavServiceIds] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setFavProductIds(new Set(getFavoriteProductIds()));
    setFavServiceIds(new Set(getFavoriteServiceIds()));
  }, []);

  const isProductFavorited = useCallback(
    (id: string) => favProductIds.has(id),
    [favProductIds]
  );

  const isServiceFavorited = useCallback(
    (id: string) => favServiceIds.has(id),
    [favServiceIds]
  );

  const getLikes = useCallback(
    (id: string, defaultLikes: number = 0) => {
      if (typeof likeCounts[id] === 'number') {
        return likeCounts[id];
      }
      return defaultLikes;
    },
    [likeCounts]
  );

  const toggleProductFav = async (id: string, currentLikes: number = 0) => {
    const isCurrentlyFav = favProductIds.has(id);
    const delta = isCurrentlyFav ? -1 : 1;

    // Optimistic UI update
    setFavProductIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyFav) next.delete(id);
      else next.add(id);
      return next;
    });

    setLikeCounts((prev) => {
      const base = typeof prev[id] === 'number' ? prev[id] : currentLikes;
      return { ...prev, [id]: Math.max(0, base + delta) };
    });

    await toggleProductFavoriteInFirestore(id);
  };

  const toggleServiceFav = async (id: string, currentLikes: number = 0) => {
    const isCurrentlyFav = favServiceIds.has(id);
    const delta = isCurrentlyFav ? -1 : 1;

    // Optimistic UI update
    setFavServiceIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyFav) next.delete(id);
      else next.add(id);
      return next;
    });

    setLikeCounts((prev) => {
      const base = typeof prev[id] === 'number' ? prev[id] : currentLikes;
      return { ...prev, [id]: Math.max(0, base + delta) };
    });

    await toggleServiceFavoriteInFirestore(id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favProductIds,
        favServiceIds,
        likeCounts,
        isProductFavorited,
        isServiceFavorited,
        getLikes,
        toggleProductFav,
        toggleServiceFav,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
