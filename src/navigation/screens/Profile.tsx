import { Text } from "@react-navigation/elements";
import { StaticScreenProps } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = StaticScreenProps<{
  user: string;
}>;

export function Profile({ route }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>{route.params.user}'s Profile</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
