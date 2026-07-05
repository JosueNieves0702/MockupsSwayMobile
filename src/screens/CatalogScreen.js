import { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radii, shadows } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';
import {
  speciesList,
  conservationStatus,
} from '../data/species';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 14;
const CARD_WIDTH = (SCREEN_WIDTH - 24 * 2 - CARD_GAP) / 2;

const statusKeys = Object.keys(conservationStatus);

export default function CatalogScreen() {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  const filtered = useMemo(() => {
    let result = speciesList;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.commonName.toLowerCase().includes(q) ||
          s.scientificName.toLowerCase().includes(q),
      );
    }
    if (selectedFilter) {
      result = result.filter((s) => s.status === selectedFilter);
    }
    return result;
  }, [search, selectedFilter]);

  const renderCard = ({ item }) => {
    const status = conservationStatus[item.status];
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => setSelectedSpecies(item)}
      >
        <View style={styles.cardPhoto}>
          <View style={styles.cardPhotoInner}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
            ) : (
              <Ionicons name="image-outline" size={36} color={colors.text3} />
            )}
          </View>
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <View style={[styles.badgeDot, { backgroundColor: status.color }]} />
            <Text style={[styles.badgeText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardCommon} numberOfLines={1}>
            {item.commonName}
          </Text>
          <Text style={styles.cardScientific} numberOfLines={1}>
            {item.scientificName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Catálogo"
          subtitle={`${speciesList.length} especies marinas registradas`}
          hideLogo
        />

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color={colors.text3} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre común o científico..."
            placeholderTextColor={colors.text3}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.text3} />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              !selectedFilter && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(null)}
          >
            <Text
              style={[
                styles.filterChipText,
                !selectedFilter && styles.filterChipTextActive,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>
          {statusKeys.map((key) => {
            const s = conservationStatus[key];
            const isActive = selectedFilter === key;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterChip,
                  isActive && { backgroundColor: s.bg, borderColor: s.color },
                ]}
                onPress={() =>
                  setSelectedFilter(isActive ? null : key)
                }
              >
                <View
                  style={[styles.filterDot, { backgroundColor: s.color }]}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && { color: s.color, fontWeight: '600' },
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color={colors.text3} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptyDesc}>
              No encontramos especies con esos criterios. Intenta con otros
              filtros.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
          />
        )}
      </ScrollView>

      <Modal
        visible={!!selectedSpecies}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedSpecies(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDrawer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setSelectedSpecies(null)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={18} color={colors.text3} />
              </TouchableOpacity>
            </View>

            {selectedSpecies && (
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalPhoto}>
                  {selectedSpecies.image ? (
                    <Image source={{ uri: selectedSpecies.image }} style={styles.modalImage} resizeMode="cover" />
                  ) : (
                    <Ionicons name="image-outline" size={72} color={colors.text3} />
                  )}
                </View>

                <View style={styles.modalContent}>
                  <View style={styles.modalTitleRow}>
                    <Text style={styles.modalCommon}>
                      {selectedSpecies.commonName}
                    </Text>
                    <View
                      style={[
                        styles.modalBadge,
                        {
                          backgroundColor:
                            conservationStatus[selectedSpecies.status].bg,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.modalBadgeDot,
                          {
                            backgroundColor:
                              conservationStatus[selectedSpecies.status]
                                .color,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.modalBadgeText,
                          {
                            color:
                              conservationStatus[selectedSpecies.status]
                                .color,
                          },
                        ]}
                      >
                        {conservationStatus[selectedSpecies.status].label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modalScientific}>
                    {selectedSpecies.scientificName}
                  </Text>

                  <View style={styles.modalDivider} />

                  <Text style={styles.modalSection}>Descripción</Text>
                  <Text style={styles.modalDesc}>
                    {selectedSpecies.description}
                  </Text>

                  <View style={styles.modalMetaGrid}>
                    <View style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>Hábitat</Text>
                      <Text style={styles.modalMetaValue}>
                        {selectedSpecies.habitat}
                      </Text>
                    </View>
                    <View style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>Población</Text>
                      <Text style={styles.modalMetaValue}>
                        {selectedSpecies.population}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.r12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text,
    height: 44,
  },
  clearBtn: {
    fontSize: 14,
    color: colors.text3,
    paddingLeft: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.r99,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.blueLight,
    borderColor: colors.blue,
  },
  filterDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  filterChipText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.text2,
    fontWeight: typography.weight.medium,
  },
  filterChipTextActive: {
    color: colors.blue,
    fontWeight: typography.weight.semibold,
  },
  row: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radii.r20,
    overflow: 'hidden',
    ...shadows.xs,
  },
  cardPhoto: {
    height: 120,
    backgroundColor: '#e3eeff',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPhotoInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  cardPhotoEmoji: {
    fontSize: 40,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.r99,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontFamily: typography.display,
    fontSize: 9,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.2,
  },
  cardBody: {
    padding: 12,
    gap: 2,
  },
  cardCommon: {
    fontFamily: typography.display,
    fontSize: 14,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  cardScientific: {
    fontFamily: typography.body,
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.text2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyEmoji: {
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: typography.display,
    fontSize: 18,
    fontWeight: typography.weight.semibold,
    color: colors.text2,
  },
  emptyDesc: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text3,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.24)',
    justifyContent: 'flex-end',
  },
  modalDrawer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.r24,
    borderTopRightRadius: radii.r24,
    maxHeight: '85%',
    ...shadows.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 0,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    color: colors.text3,
    fontWeight: typography.weight.semibold,
  },
  modalBody: {
    paddingBottom: 40,
  },
  modalPhoto: {
    height: 180,
    backgroundColor: '#dceeff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderRadius: radii.r20,
    marginTop: 16,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },

  modalContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCommon: {
    fontFamily: typography.display,
    fontSize: 22,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.4,
    flex: 1,
  },
  modalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.r99,
  },
  modalBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  modalBadgeText: {
    fontFamily: typography.display,
    fontSize: 11,
    fontWeight: typography.weight.bold,
  },
  modalScientific: {
    fontFamily: typography.body,
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.text2,
    marginTop: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  modalSection: {
    fontFamily: typography.display,
    fontSize: 14,
    fontWeight: typography.weight.semibold,
    color: colors.text2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  modalDesc: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  modalMetaGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalMetaItem: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: radii.r12,
    padding: 14,
  },
  modalMetaLabel: {
    fontFamily: typography.display,
    fontSize: 11,
    fontWeight: typography.weight.semibold,
    color: colors.text3,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  modalMetaValue: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.text,
    fontWeight: typography.weight.medium,
  },
});
