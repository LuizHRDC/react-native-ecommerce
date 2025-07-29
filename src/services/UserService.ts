import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const USERS_KEY = "@users";

export const UserService = {
  getAll: async (): Promise<StoredUser[]> => {
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  save: async (user: StoredUser): Promise<void> => {
    const users = await UserService.getAll();
    users.push(user);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  findByEmail: async (email: string): Promise<StoredUser | undefined> => {
    const users = await UserService.getAll();
    return users.find((u) => u.email === email);
  },

  validateLogin: async (
    email: string,
    password: string
  ): Promise<StoredUser | null> => {
    const users = await UserService.getAll();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    return user ?? null;
  },
};
