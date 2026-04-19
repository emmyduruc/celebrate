import { Component } from 'react';
import { View } from 'react-native';
import { Text } from '@ui/Text';
import { Button } from '@ui/Button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center px-8 bg-surface-secondary">
          <Text variant="subheading" weight="semibold" className="text-center mb-2">
            Something went wrong
          </Text>
          <Text variant="body" color="secondary" className="text-center mb-6">
            An unexpected error occurred. Please try again.
          </Text>
          <Button onPress={this.reset}>Try again</Button>
        </View>
      );
    }

    return this.props.children;
  }
}
