import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Split } from '../../types/split';
import {
  loadSplits,
  saveSplits,
  setActiveSplit,
  deleteSplit,
} from '../../utils/splitUtils';
import { Colors, Typography, FontWeight, FontFamily, Spacing, BorderRadius } from '../../constants/theme';

export function Splits() {
  const navigation = useNavigation();
  const [splits, setSplits] = useState<Split[]>([]);

  const loadData = async () => {
    const loadedSplits = await loadSplits();
    setSplits(loadedSplits);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleActivateSplit = async (splitId: string) => {
    const updatedSplits = setActiveSplit(splits, splitId);
    await saveSplits(updatedSplits);
    setSplits(updatedSplits);
  };

  const handleDeleteSplit = async (split: Split) => {
    Alert.alert(
      'Delete Split',
      `Are you sure you want to delete "${split.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedSplits = deleteSplit(splits, split.id);
            await saveSplits(updatedSplits);
            setSplits(updatedSplits);
          },
        },
      ]
    );
  };

  const handleEditSplit = (split: Split) => {
    (navigation as any).navigate('EditSplit', { split });
  };

  const handleAddSplit = () => {
    (navigation as any).navigate('AddSplit');
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
          <Text style={styles.title}>YOUR SPLITS</Text>
          <Text style={styles.subtitle}>
            Manage your workout programs
          </Text>
        </View>

        {/* Add New Split Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddSplit}>
          <Text style={styles.addButtonText}>+ ADD NEW SPLIT</Text>
        </TouchableOpacity>

        {/* Splits List */}
        {splits.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>NO SPLITS YET</Text>
            <Text style={styles.emptyText}>
              Create your first workout split to get started
            </Text>
          </View>
        ) : (
          splits.map((split) => (
            <View
              key={split.id}
              style={[
                styles.splitCard,
                split.isActive && styles.splitCardActive,
              ]}
            >
              {/* Active Badge */}
              {split.isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              )}

              {/* Split Info */}
              <View style={styles.splitInfo}>
                <Text style={styles.splitName}>{split.name}</Text>
                <Text style={styles.splitDetails}>
                  {split.days.length} Day Program
                </Text>
                <Text style={styles.splitDays}>
                  {split.days.map((d) => d.muscleGroups).join(' • ')}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                {!split.isActive && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleActivateSplit(split.id)}
                  >
                    <Text style={styles.actionButtonText}>ACTIVATE</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                  onPress={() => handleEditSplit(split)}
                >
                  <Text style={styles.actionButtonText}>EDIT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonDanger]}
                  onPress={() => handleDeleteSplit(split)}
                >
                  <Text style={styles.actionButtonText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.regular,
    fontFamily: FontFamily.body,
    color: Colors.textSecondary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  addButtonText: {
    fontSize: Typography.medium,
    fontFamily: FontFamily.bodyBold,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  emptyCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: Typography.large,
    fontFamily: FontFamily.heading,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    letterSpacing: 1.5,
  },
  emptyText: {
    fontSize: Typography.regular,
    fontFamily: FontFamily.body,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  splitCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  splitCardActive: {
    borderColor: Colors.primary,
    borderLeftWidth: 6,
  },
  activeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  activeBadgeText: {
    fontSize: Typography.tiny,
    fontFamily: FontFamily.heading,
    color: Colors.background,
    letterSpacing: 1.5,
  },
  splitInfo: {
    marginBottom: Spacing.md,
  },
  splitName: {
    fontSize: Typography.large,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  splitDetails: {
    fontSize: Typography.regular,
    fontFamily: FontFamily.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  splitDays: {
    fontSize: Typography.small,
    fontFamily: FontFamily.body,
    color: Colors.textTertiary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: Colors.secondary,
  },
  actionButtonDanger: {
    backgroundColor: Colors.tertiary,
  },
  actionButtonText: {
    fontSize: Typography.small,
    fontFamily: FontFamily.bodyBold,
    color: Colors.background,
    letterSpacing: 0.5,
  },
});
