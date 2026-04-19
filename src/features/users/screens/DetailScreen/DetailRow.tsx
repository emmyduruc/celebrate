import { View } from 'react-native';

import { Text } from '@ui/Text';

type DetailRowProps = Readonly<{
  label: string;
  value: string;
}>;

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View className="flex-row justify-between items-start gap-x-6">
      <Text variant="caption" color="secondary" className="shrink-0 w-24">
        {label}
      </Text>
      <Text
        variant="caption"
        weight="medium"
        className="flex-1 text-right text-slate-700"
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}
