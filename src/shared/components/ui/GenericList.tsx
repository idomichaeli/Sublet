import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ViewStyle,
  ListRenderItem,
} from "react-native";
import { colors, spacing, textStyles } from "../../../shared/constants/tokens";

export interface GenericListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;

  // Header
  title?: string;
  subtitle?: string;
  showCount?: boolean;
  countLabel?: string;

  // Layout
  horizontal?: boolean;
  numColumns?: number;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;

  // Styling
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  headerStyle?: ViewStyle;

  // Empty state
  emptyStateIcon?: string;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateActionLabel?: string;
  onEmptyStateActionPress?: () => void;

  // Loading
  loading?: boolean;
  loadingText?: string;

  // Pagination
  onEndReached?: () => void;
  onEndReachedThreshold?: number;

  // Refresh
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function GenericList<T>({
  data,
  renderItem,
  keyExtractor,
  title,
  subtitle,
  showCount = true,
  countLabel,
  horizontal = false,
  numColumns,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  contentContainerStyle,
  style,
  headerStyle,
  emptyStateIcon = "📭",
  emptyStateTitle = "No items found",
  emptyStateSubtitle = "There are no items to display at the moment.",
  emptyStateActionLabel,
  onEmptyStateActionPress,
  loading = false,
  loadingText = "Loading...",
  onEndReached,
  onEndReachedThreshold = 0.1,
  refreshing = false,
  onRefresh,
}: GenericListProps<T>) {
  const renderHeader = () => {
    if (!title && !subtitle && !showCount) return null;

    return (
      <View style={[styles.header, headerStyle]}>
        <View style={styles.headerTop}>
          {title && <Text style={styles.title}>{title}</Text>}
          {showCount && (
            <Text style={styles.count}>
              {countLabel || `${data.length} items`}
            </Text>
          )}
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>⏳</Text>
          <Text style={styles.emptyStateTitle}>{loadingText}</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>{emptyStateIcon}</Text>
        <Text style={styles.emptyStateTitle}>{emptyStateTitle}</Text>
        <Text style={styles.emptyStateSubtitle}>{emptyStateSubtitle}</Text>
        {emptyStateActionLabel && onEmptyStateActionPress && (
          <Text
            style={styles.emptyStateAction}
            onPress={onEmptyStateActionPress}
          >
            {emptyStateActionLabel}
          </Text>
        )}
      </View>
    );
  };

  const renderList = () => {
    if (data.length === 0 && !loading) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal={horizontal}
        numColumns={numColumns}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        contentContainerStyle={[styles.listContent, contentContainerStyle]}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={loading ? renderEmptyState() : null}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}
      {renderList()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.md,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  title: {
    ...textStyles.h3,
    fontWeight: "600",
    color: colors.neutral[800],
  },
  subtitle: {
    ...textStyles.body,
    color: colors.neutral[600],
  },
  count: {
    ...textStyles.caption,
    color: colors.neutral[500],
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["2xl"],
    paddingHorizontal: spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    ...textStyles.h3,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    ...textStyles.body,
    color: colors.neutral[500],
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  emptyStateAction: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
