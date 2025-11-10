import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Split, SplitDay, DAYS_OF_WEEK } from "../../types/split";
import {
  loadSplits,
  saveSplits,
  createSplit,
  updateSplit,
} from "../../utils/splitUtils";
import {
  Colors,
  Typography,
  FontWeight,
  FontFamily,
  Spacing,
  BorderRadius,
} from "../../constants/theme";

export function AddEditSplit() {
  const navigation = useNavigation();
  const route = useRoute();
  const isEdit = !!(route.params as any)?.split;
  const existingSplit: Split | undefined = (route.params as any)?.split;

  const [name, setName] = useState(existingSplit?.name || "");
  const [days, setDays] = useState<SplitDay[]>(
    existingSplit?.days || [{ dayNumber: 1, muscleGroups: "" }]
  );
  const [weeklyHolidays, setWeeklyHolidays] = useState<number[]>(
    existingSplit?.weeklyHolidays || []
  );

  const handleAddDay = () => {
    setDays([...days, { dayNumber: days.length + 1, muscleGroups: "" }]);
  };

  const handleRemoveDay = (index: number) => {
    if (days.length === 1) {
      Alert.alert("Error", "You must have at least one day in your split");
      return;
    }
    const newDays = days.filter((_, i) => i !== index);
    // Renumber days
    const renumbered = newDays.map((day, i) => ({
      ...day,
      dayNumber: i + 1,
    }));
    setDays(renumbered);
  };

  const handleDayChange = (index: number, value: string) => {
    const newDays = [...days];
    newDays[index].muscleGroups = value;
    setDays(newDays);
  };

  const toggleHoliday = (dayIndex: number) => {
    if (weeklyHolidays.includes(dayIndex)) {
      setWeeklyHolidays(weeklyHolidays.filter((d) => d !== dayIndex));
    } else {
      setWeeklyHolidays([...weeklyHolidays, dayIndex]);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a split name");
      return;
    }

    const emptyDays = days.filter((d) => !d.muscleGroups.trim());
    if (emptyDays.length > 0) {
      Alert.alert("Error", "Please fill in all muscle group fields");
      return;
    }

    try {
      const splits = await loadSplits();

      if (isEdit && existingSplit) {
        // Update existing split
        const updatedSplit: Split = {
          ...existingSplit,
          name: name.trim(),
          days,
          weeklyHolidays,
          lastUpdated: new Date().toISOString(),
        };
        const newSplits = updateSplit(splits, updatedSplit);
        await saveSplits(newSplits);
      } else {
        // Create new split
        const newSplit = createSplit(name.trim(), days, weeklyHolidays);
        await saveSplits([...splits, newSplit]);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving split:", error);
      Alert.alert(
        "Error",
        `Failed to save split: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEdit ? "EDIT SPLIT" : "NEW SPLIT"}
          </Text>
        </View>

        {/* Split Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SPLIT NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Push Pull Legs"
            placeholderTextColor={Colors.textTertiary}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Days */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WORKOUT DAYS</Text>
          {days.map((day, index) => (
            <View key={index} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayNumber}>DAY {day.dayNumber}</Text>
                {days.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveDay(index)}>
                    <Text style={styles.removeButton}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g., Chest and Shoulders"
                placeholderTextColor={Colors.textTertiary}
                value={day.muscleGroups}
                onChangeText={(value) => handleDayChange(index, value)}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addDayButton} onPress={handleAddDay}>
            <Text style={styles.addDayButtonText}>+ ADD DAY</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Holidays */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WEEKLY REST DAYS</Text>
          <Text style={styles.sectionSubtext}>
            Select days you don't go to the gym
          </Text>
          <View style={styles.daysGrid}>
            {DAYS_OF_WEEK.map((dayName, index) => {
              const isSelected = weeklyHolidays.includes(index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                  onPress={() => toggleHoliday(index)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      isSelected && styles.dayChipTextSelected,
                    ]}
                  >
                    {dayName.substring(0, 3).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEdit ? "SAVE CHANGES" : "CREATE SPLIT"}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.xl,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.small,
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  sectionSubtext: {
    fontSize: Typography.small,
    fontFamily: FontFamily.body,
    color: Colors.textTertiary,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.regular,
    fontFamily: FontFamily.body,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  dayCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  dayNumber: {
    fontSize: Typography.small,
    fontFamily: FontFamily.heading,
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  removeButton: {
    fontSize: Typography.large,
    color: Colors.tertiary,
    fontFamily: FontFamily.bodyBold,
  },
  addDayButton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  addDayButtonText: {
    fontSize: Typography.regular,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  dayChip: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  dayChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayChipText: {
    fontSize: Typography.small,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textSecondary,
  },
  dayChipTextSelected: {
    color: Colors.background,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  saveButtonText: {
    fontSize: Typography.medium,
    fontFamily: FontFamily.bodyBold,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: Typography.medium,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
});
