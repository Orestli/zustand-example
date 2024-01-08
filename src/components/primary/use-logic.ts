import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useMutation } from "react-query";
import { createSelectors } from "../../utils/zustand.ts";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

type State = {
  firstName: string;
  lastName: string;
  selectedUser: User | null;
  users: User[];
  isLoading: boolean;
  error: string;
};

type Actions = {
  updateFirstName: (firstName: State["firstName"]) => void;
  updateLastName: (lastName: State["lastName"]) => void;
};

const initialState: State = {
  firstName: "Orest",
  lastName: "Lite",
  isLoading: false,
  error: "",
  selectedUser: null,
  users: [],
};

export interface FormikValues {
  id: number;
}

export const initialFormikValues: FormikValues = {
  id: 0,
};

const usePersonStoreBase = create(
  persist<State & Actions>(
    (set) => ({
      ...initialState,
      updateFirstName: (newValue: State["firstName"]) =>
        set(() => ({ firstName: newValue })),
      updateLastName: (newValue: State["lastName"]) =>
        set(() => ({ lastName: newValue })),
    }),
    {
      name: "person-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

const usePersonStore = createSelectors(usePersonStoreBase);

const useLogic = () => {
  const { mutate: fetchUserById } = useMutation({
    mutationKey: ["fetch-user-by-id"],
    mutationFn: async (id: number = 1) => {
      usePersonStoreBase.setState(() => ({ isLoading: true }));

      const response = await (
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      )?.json();

      usePersonStoreBase.setState((state) => ({
        ...state,
        selectedUser: response,
      }));
    },
    onError: (error) =>
      usePersonStoreBase.setState(() => ({ error: String(error) })),
    onSettled: () => usePersonStoreBase.setState(() => ({ isLoading: false })),
  });

  return { fetchUserById };
};

export { usePersonStore, usePersonStoreBase, useLogic };
