import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Split } from "../../types/split";
import {
  loadSplits,
  saveSplits,
  getActiveSplit,
  getTodaysWorkout,
  formatDate,
  advanceToNextDay,
  goToPreviousDay,
  resetSplit,
  updateSplit,
  autoAdvanceSplitIfNeeded,
} from "../../utils/splitUtils";
import {
  Colors,
  Typography,
  FontWeight,
  FontFamily,
  Spacing,
  BorderRadius,
} from "../../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export function Home() {
  const navigation = useNavigation();
  const [activeSplit, setActiveSplit] = useState<Split | null>(null);
  const [todaysWorkout, setTodaysWorkout] = useState<{
    muscleGroups: string;
    dayNumber: number;
  } | null>(null);
  const [isHoliday, setIsHoliday] = useState(false);

  const loadData = async () => {
    const splits = await loadSplits();
    let active = getActiveSplit(splits);

    // Auto-advance split if days have passed since last access
    if (active) {
      const updatedSplit = await autoAdvanceSplitIfNeeded(active);

      // If split was advanced, save it
      if (updatedSplit.currentDayIndex !== active.currentDayIndex) {
        const updatedSplits = updateSplit(splits, updatedSplit);
        await saveSplits(updatedSplits);
        active = updatedSplit;
      }
    }

    setActiveSplit(active);

    if (active) {
      const today = new Date().getDay();
      const isHolidayDay = active.weeklyHolidays.includes(today);
      setIsHoliday(isHolidayDay);

      const workout = getTodaysWorkout(active);
      setTodaysWorkout(workout);
    } else {
      setTodaysWorkout(null);
      setIsHoliday(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleNextDay = async () => {
    if (!activeSplit) return;

    const splits = await loadSplits();
    const updatedSplit = advanceToNextDay(activeSplit);
    const newSplits = updateSplit(splits, updatedSplit);
    await saveSplits(newSplits);
    await loadData();
  };

  const handlePreviousDay = async () => {
    if (!activeSplit) return;

    const splits = await loadSplits();
    const updatedSplit = goToPreviousDay(activeSplit);
    const newSplits = updateSplit(splits, updatedSplit);
    await saveSplits(newSplits);
    await loadData();
  };

  const handleReset = async () => {
    if (!activeSplit) return;

    const splits = await loadSplits();
    const updatedSplit = resetSplit(activeSplit);
    const newSplits = updateSplit(splits, updatedSplit);
    await saveSplits(newSplits);
    await loadData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>SPLIT SMART</Text>
          <Text style={styles.dateText}>{formatDate(new Date())}</Text>
        </View>

        {/* Today's Workout Card */}
        {activeSplit ? (
          <>
            <View style={styles.workoutCard}>
              {isHoliday ? (
                <>
                  <Text style={styles.label}>TODAY IS</Text>
                  <Text style={styles.holidayText}>REST DAY</Text>
                  <Text style={styles.holidaySubtext}>
                    Enjoy your day off! 💪
                  </Text>
                </>
              ) : todaysWorkout ? (
                <>
                  <Text style={styles.label}>TODAY'S WORKOUT</Text>
                  <Text style={styles.workoutTitle}>
                    {todaysWorkout.muscleGroups.toUpperCase()}
                  </Text>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>
                      DAY {todaysWorkout.dayNumber}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.label}>NO WORKOUT</Text>
                  <Text style={styles.holidayText}>REST DAY</Text>
                </>
              )}
            </View>

            {/* Active Split Info */}
            <View style={styles.splitInfoCard}>
              <Text style={styles.splitInfoLabel}>ACTIVE SPLIT</Text>
              <Text style={styles.splitInfoName}>{activeSplit.name}</Text>
              <Text style={styles.splitInfoDetails}>
                {activeSplit.days.length} Day Program
              </Text>
            </View>

            {/* Quick Controls */}
            <View style={styles.controlsCard}>
              <Text style={styles.controlsTitle}>QUICK ADJUST</Text>
              <Text style={styles.controlsSubtitle}>
                Missed gym? Adjust your split
              </Text>

              <View style={styles.controlsRow}>
                <TouchableOpacity
                  style={[styles.controlButton, styles.controlButtonSecondary]}
                  onPress={handlePreviousDay}
                >
                  <Text style={styles.controlButtonText}>← BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlButton, styles.controlButtonPrimary]}
                  onPress={handleNextDay}
                >
                  <Text style={styles.controlButtonText}>NEXT →</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.controlButton, styles.controlButtonReset]}
                onPress={handleReset}
              >
                <Text style={styles.controlButtonText}>↻ RESET TO DAY 1</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>NO ACTIVE SPLIT</Text>
            <Text style={styles.emptyText}>
              Create a split to start tracking your workouts
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => (navigation as any).navigate("Splits")}
            >
              <Text style={styles.primaryButtonText}>MANAGE SPLITS</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Manage Splits Button */}
        {activeSplit && (
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => (navigation as any).navigate("Splits")}
          >
            <Text style={styles.manageButtonText}>MANAGE SPLITS</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: Spacing.xl,
  },
  appTitle: {
    fontSize: Typography.xl,
    fontFamily: FontFamily.heading,
    color: Colors.primary,
    letterSpacing: 3,
    marginBottom: Spacing.sm,
  },
  dateText: {
    fontSize: Typography.regular,
    fontFamily: FontFamily.bodyMedium,
    color: Colors.textSecondary,
  },
  workoutCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderLeftWidth: 6,
    borderLeftColor: Colors.primary,
  },
  label: {
    fontSize: Typography.small,
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  workoutTitle: {
    fontSize: Typography.xxxl,
    fontFamily: FontFamily.heading,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: 2,
  },
  holidayText: {
    fontSize: Typography.xxl,
    fontFamily: FontFamily.heading,
    color: Colors.secondary,
    marginBottom: Spacing.sm,
    letterSpacing: 2,
  },
  holidaySubtext: {
    fontSize: Typography.medium,
    fontFamily: FontFamily.body,
    color: Colors.textSecondary,
  },
  dayBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
  dayBadgeText: {
    fontSize: Typography.small,
    fontFamily: FontFamily.heading,
    color: Colors.background,
    letterSpacing: 1.5,
  },
  splitInfoCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  splitInfoLabel: {
    fontSize: Typography.tiny,
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  splitInfoName: {
    fontSize: Typography.large,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  splitInfoDetails: {
    fontSize: Typography.regular,
    fontFamily: FontFamily.body,
    color: Colors.textSecondary,
  },
  controlsCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  controlsTitle: {
    fontSize: Typography.medium,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  controlsSubtitle: {
    fontSize: Typography.small,
    fontFamily: FontFamily.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  controlsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  controlButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  controlButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  controlButtonSecondary: {
    backgroundColor: Colors.secondary,
  },
  controlButtonReset: {
    backgroundColor: Colors.tertiary,
  },
  controlButtonText: {
    fontSize: Typography.regular,
    fontFamily: FontFamily.bodyBold,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  emptyCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontFamily: FontFamily.heading,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    letterSpacing: 2,
  },
  emptyText: {
    fontSize: Typography.regular,
    fontFamily: FontFamily.body,
    color: Colors.textTertiary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  primaryButtonText: {
    fontSize: Typography.medium,
    fontFamily: FontFamily.bodyBold,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  manageButton: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  manageButtonText: {
    fontSize: Typography.medium,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
});
