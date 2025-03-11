import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { produce } from 'immer';
import { create } from 'zustand';

import { removeToken, setToken } from '@/lib/cookies';

import { UserInterface, withToken } from '@/types/entities/user.types';

type AuthStoreType = {
  user: UserInterface | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UserInterface & withToken) => void;
  logout: () => void;
  stopLoading: () => void;
  setUser: (user: UserInterface) => void;
};

const useAuthStoreBase = create<AuthStoreType>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user) => {
    setToken(user.token);
    set(
      produce<AuthStoreType>((state) => {
        state.isAuthenticated = true;
        state.user = user;
      })
    );
  },
  logout: () => {
    removeToken();
    set(
      produce<AuthStoreType>((state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
    );
  },
  stopLoading: () => {
    set(
      produce<AuthStoreType>((state) => {
        state.isLoading = false;
      })
    );
  },
  setUser: (user) => {
    set(
      produce<AuthStoreType>((state) => {
        state.user = user;
      })
    );
  },
}));

const useAuthStore = createSelectorHooks(useAuthStoreBase);

export default useAuthStore;
