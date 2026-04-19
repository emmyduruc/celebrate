import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@ui/Text';

type DetailSectionProps = Readonly<{
  title: string;
  icon: string;
  children: ReactNode;
}>;

export function DetailSection({ title, icon, children }: DetailSectionProps) {
  return (
    <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <View className="flex-row items-center px-4 pt-4 pb-3 border-b border-slate-100">
        <View className="w-7 h-7 rounded-lg bg-primary-100 items-center justify-center mr-2.5">
          <Ionicons name={icon as never} size={15} color="#ea580c" />
        </View>
        <Text
          variant="caption"
          weight="semibold"
          className="text-slate-500 uppercase tracking-widest text-xs"
        >
          {title}
        </Text>
      </View>
      <View className="px-4 py-3 gap-y-3">{children}</View>
    </View>
  );
}
