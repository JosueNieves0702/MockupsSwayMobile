import { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radii, shadows } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';
import { sightingsList } from '../data/sightings';

const STATUS_CFG = {
  VERIFIED: {
    label: 'Verificado',
    color: colors.green,
    bg: colors.greenBg,
    dotColor: colors.green,
  },
  PENDING: {
    label: 'Pendiente',
    color: colors.amber,
    bg: colors.amberBg,
    dotColor: colors.amber,
  },
};

export default function SightingsScreen() {
  const [sightings, setSightings] = useState(sightingsList);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(null);
  const [detailSighting, setDetailSighting] = useState(null);
  const [newModal, setNewModal] = useState(false);

  const filtered = useMemo(() => {
    let result = sightings;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.species.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.reporter.toLowerCase().includes(q),
      );
    }
    if (filter) {
      result = result.filter((s) => s.status === filter);
    }
    return result;
  }, [sightings, search, filter]);

  const handleDelete = (item) => {
    Alert.alert(
      'Eliminar avistamiento',
      `¿Eliminar el avistamiento de "${item.species}" del ${item.date}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () =>
            setSightings((prev) => prev.filter((s) => s.id !== item.id)),
        },
      ],
    );
  };

  const handleResend = (id) => {
    setSightings((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'PENDING', notes: s.notes + ' (reenviado)' } : s,
      ),
    );
  };

  const renderTimelineItem = (item) => {
    const st = STATUS_CFG[item.status];
    const isPending = item.status === 'PENDING';

    return (
      <View key={item.id} style={styles.timelineItem}>
        <View style={[styles.timelineDot, { backgroundColor: st.dotColor }]} />
        <View
          style={[
            styles.timelineCard,
            isPending && { borderColor: colors.amber, borderWidth: 1.5 },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardIcon}>
                <Ionicons name="camera" size={16} color={colors.ocean} />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardSpecies}>{item.species}</Text>
                <Text style={styles.cardReporter}>por {item.reporter}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
              <View
                style={[styles.statusDot, { backgroundColor: st.color }]}
              />
              <Text style={[styles.statusText, { color: st.color }]}>
                {st.label}
              </Text>
            </View>
          </View>

          <View style={styles.cardMeta}>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={13} color={colors.text3} />
              <Text style={styles.metaText}>{item.date}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={13} color={colors.text3} />
              <Text style={styles.metaText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="people-outline" size={13} color={colors.text3} />
              <Text style={styles.metaText}>
                {item.individuals}{' '}
                {item.individuals === 1 ? 'individuo' : 'individuos'}
              </Text>
            </View>
            {item.hasPhoto && (
              <View style={styles.metaRow}>
                <Ionicons name="image-outline" size={13} color={colors.blue} />
                <Text style={[styles.metaText, { color: colors.blue }]}>
                  Con foto
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setDetailSighting(item)}
            >
              <Ionicons name="eye-outline" size={15} color={colors.blue} />
              <Text style={[styles.actionLabel, { color: colors.blue }]}>
                Ver
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons
                name="pencil-outline"
                size={15}
                color={colors.blue}
              />
              <Text style={[styles.actionLabel, { color: colors.blue }]}>
                Editar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons
                name="share-outline"
                size={15}
                color={colors.text2}
              />
              <Text style={[styles.actionLabel, { color: colors.text2 }]}>
                Compartir
              </Text>
            </TouchableOpacity>
            {isPending && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleResend(item.id)}
              >
                <Ionicons
                  name="refresh-outline"
                  size={15}
                  color={colors.amber}
                />
                <Text
                  style={[styles.actionLabel, { color: colors.amber }]}
                >
                  Enviar
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash-outline" size={15} color={colors.red} />
              <Text style={[styles.actionLabel, { color: colors.red }]}>
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
          title="Avistamientos"
          subtitle={`${sightings.length} registros • ${sightings.filter(s => s.status === 'VERIFIED').length} verificados`}
          hideLogo
        />

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={16}
            color={colors.text3}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por especie, ubicación o reportero..."
            placeholderTextColor={colors.text3}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
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
            style={[styles.filterChip, !filter && styles.filterChipActive]}
            onPress={() => setFilter(null)}
          >
            <Text
              style={[
                styles.filterChipText,
                !filter && styles.filterChipTextActive,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>
          {Object.entries(STATUS_CFG).map(([key, val]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterChip,
                filter === key && {
                  backgroundColor: val.bg,
                  borderColor: val.color,
                },
              ]}
              onPress={() => setFilter(filter === key ? null : key)}
            >
              <View
                style={[styles.filterDot, { backgroundColor: val.color }]}
              />
              <Text
                style={[
                  styles.filterChipText,
                  filter === key && { color: val.color, fontWeight: '600' },
                ]}
              >
                {val.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => setNewModal(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.blue} />
          <Text style={styles.newBtnText}>Nuevo avistamiento</Text>
        </TouchableOpacity>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="binoculars-outline"
              size={44}
              color={colors.text3}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.emptyTitle}>Sin avistamientos</Text>
            <Text style={styles.emptyDesc}>
              {search || filter
                ? 'No hay resultados con esos criterios.'
                : 'Sé el primero en reportar un avistamiento.'}
            </Text>
          </View>
        ) : (
          <View style={styles.timeline}>
            <View style={styles.timelineLine} />
            {filtered.map(renderTimelineItem)}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={!!detailSighting}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailSighting(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDrawer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle de avistamiento</Text>
              <TouchableOpacity
                onPress={() => setDetailSighting(null)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={18} color={colors.text3} />
              </TouchableOpacity>
            </View>
            {detailSighting && (
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.detailPhoto}>
                  <Ionicons name="camera" size={48} color={colors.oceanDark} />
                </View>
                <Text style={styles.detailSpecies}>
                  {detailSighting.species}
                </Text>
                <View
                  style={[
                    styles.detailBadge,
                    {
                      backgroundColor:
                        STATUS_CFG[detailSighting.status].bg,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.detailBadgeDot,
                      {
                        backgroundColor:
                          STATUS_CFG[detailSighting.status].color,
                      },
                    ]}
                  />
                  <Text
                    style={{
                      fontFamily: typography.display,
                      fontSize: 12,
                      fontWeight: '700',
                      color: STATUS_CFG[detailSighting.status].color,
                    }}
                  >
                    {STATUS_CFG[detailSighting.status].label}
                  </Text>
                </View>
                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={colors.text3}
                    />
                    <Text style={styles.detailLabel}>Fecha</Text>
                    <Text style={styles.detailValue}>
                      {detailSighting.date}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={colors.text3}
                    />
                    <Text style={styles.detailLabel}>Ubicación</Text>
                    <Text style={styles.detailValue}>
                      {detailSighting.location}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="people-outline"
                      size={14}
                      color={colors.text3}
                    />
                    <Text style={styles.detailLabel}>Individuos</Text>
                    <Text style={styles.detailValue}>
                      {detailSighting.individuals}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="person-outline"
                      size={14}
                      color={colors.text3}
                    />
                    <Text style={styles.detailLabel}>Reportó</Text>
                    <Text style={styles.detailValue}>
                      {detailSighting.reporter}
                    </Text>
                  </View>
                </View>
                {detailSighting.notes ? (
                  <>
                    <Text style={styles.detailSection}>Notas</Text>
                    <Text style={styles.detailNotes}>
                      {detailSighting.notes}
                    </Text>
                  </>
                ) : null}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={newModal}
        animationType="slide"
        transparent
        onRequestClose={() => setNewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDrawer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo avistamiento</Text>
              <TouchableOpacity
                onPress={() => setNewModal(false)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={18} color={colors.text3} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.newForm}>
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={colors.blue}
                />
                <Text style={styles.newFormText}>
                  Capturar foto de la especie
                </Text>
              </View>
              <View style={styles.newForm}>
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={colors.blue}
                />
                <Text style={styles.newFormText}>
                  Usar ubicación actual (GPS)
                </Text>
              </View>
              <View style={styles.newForm}>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={colors.text3}
                />
                <Text style={[styles.newFormText, { color: colors.text3 }]}>
                  Completar detalles del reporte
                </Text>
              </View>
            </View>
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
    paddingHorizontal: 20,
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
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text,
    height: 44,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14,
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
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    backgroundColor: colors.surface,
    borderRadius: radii.r12,
    borderWidth: 1,
    borderColor: colors.blue,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  newBtnText: {
    fontFamily: typography.display,
    fontSize: 13,
    fontWeight: typography.weight.semibold,
    color: colors.blue,
  },
  timeline: {
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 10,
    top: 14,
    bottom: 14,
    width: 2,
    backgroundColor: colors.ocean,
    opacity: 0.25,
    borderRadius: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    minWidth: 10,
    borderRadius: 5,
    marginTop: 18,
    zIndex: 1,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.r16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.xs,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    padding: 14,
    paddingBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.oceanLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardSpecies: {
    fontFamily: typography.display,
    fontSize: 14,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.2,
  },
  cardReporter: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.text3,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.r99,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: typography.display,
    fontSize: 10,
    fontWeight: typography.weight.bold,
  },
  cardMeta: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.text2,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    paddingHorizontal: 10,
    flex: 1,
    minWidth: 60,
  },
  actionLabel: {
    fontFamily: typography.display,
    fontSize: 11,
    fontWeight: typography.weight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 4,
  },
  emptyTitle: {
    fontFamily: typography.display,
    fontSize: 18,
    fontWeight: typography.weight.semibold,
    color: colors.text2,
  },
  emptyDesc: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.text3,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
    marginTop: 4,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontFamily: typography.display,
    fontSize: 16,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 20,
    paddingBottom: 40,
  },
  detailPhoto: {
    height: 140,
    backgroundColor: '#dceeff',
    borderRadius: radii.r16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  detailSpecies: {
    fontFamily: typography.display,
    fontSize: 20,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.r99,
    marginBottom: 16,
  },
  detailBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  detailItem: {
    width: '47%',
    backgroundColor: colors.bg,
    borderRadius: radii.r12,
    padding: 12,
    gap: 3,
  },
  detailLabel: {
    fontFamily: typography.display,
    fontSize: 10,
    fontWeight: typography.weight.semibold,
    color: colors.text3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.text,
    fontWeight: typography.weight.medium,
  },
  detailSection: {
    fontFamily: typography.display,
    fontSize: 12,
    fontWeight: typography.weight.semibold,
    color: colors.text2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  detailNotes: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
  newForm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  newFormText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text,
  },
});
