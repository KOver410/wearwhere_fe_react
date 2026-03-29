import { atom } from 'jotai';

export const onboardingStylesAtom = atom<string[]>([]);
export const onboardingBudgetAtom = atom<[number, number]>([50, 500]);
export const onboardingSizesAtom = atom<string[]>([]);
export const onboardingGenderAtom = atom<'MALE' | 'FEMALE' | 'UNISEX' | 'OTHER' | null>(null);
