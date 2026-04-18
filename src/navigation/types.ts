import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  UserDetail: { userId: number };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type UserDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'UserDetail'>;
