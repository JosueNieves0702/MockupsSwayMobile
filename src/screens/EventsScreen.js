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
import { eventsList } from '../data/events';

const STATUS_CFG = {
  UPCOMING: { label: 'Próximo', color: colors.blue, bg: colors.blueLight },
  PAST: { label: 'Pasado', color: colors.text3, bg: colors.bg },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return { day: d.getDate(), month: months[d.getMonth()] };
}

export default function EventsScreen() {
  const [events, setEvents] = useState(eventsList);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);

  const filtered = useMemo(() => {
    let result = events;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q),
      );
    }
    if (filter) {
      result = result.filter((e) => e.status === filter);
    }
    return result;
  }, [events, search, filter]);

  const handleDelete = (item) => {
    Alert.alert(
      'Eliminar evento',
      `¿Eliminar "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setEvents((prev) => prev.filter((e) => e.id !== item.id)),
        },
      ],
    );
  };

  const handleDuplicate = (item) => {
    const newEvent = {
      ...item,
      id: String(Date.now()),
      name: `${item.name} (copia)`,
      date: '2026-08-01',
      status: 'UPCOMING',
      participants: 0,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const renderCard = (item) => {
    const { day, month } = formatDate(item.date);
    const st = STATUS_CFG[item.status];
    const isUpcoming = item.status === 'UPCOMING';
    const isFull = item.participants >= item.maxParticipants;

    return (
      <View key={item.id} style={[styles.card, !isUpcoming && styles.cardPast]}>
        <View style={styles.cardRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateMonth}>{month}</Text>
            <Text style={styles.dateDay}>{day}</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardName} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                <Text style={[styles.statusText, { color: st.color }]}>
                  {st.label}
                </Text>
              </View>
            </View>
            <View style={styles.cardMeta}>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={12} color={colors.text3} />
                <Text style={styles.metaText} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={12} color={colors.text3} />
                <Text style={styles.metaText}>{item.time}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="people-outline" size={12} color={colors.text3} />
                <Text style={styles.metaText}>
                  {item.participants}/{item.maxParticipants}
                  {isFull ? ' (completo)' : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setDetailEvent(item)}
          >
            <Ionicons name="eye-outline" size={14} color={colors.blue} />
            <Text style={[styles.actionLabel, { color: colors.blue }]}>Ver</Text>
          </TouchableOpacity>
          {isUpcoming ? (
            <>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="pencil-outline" size={14} color={colors.blue} />
                <Text style={[styles.actionLabel, { color: colors.blue }]}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="share-outline" size={14} color={colors.text2} />
                <Text style={[styles.actionLabel, { color: colors.text2 }]}>Compartir</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleDuplicate(item)}
            >
              <Ionicons name="copy-outline" size={14} color={colors.amber} />
              <Text style={[styles.actionLabel, { color: colors.amber }]}>Duplicar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={14} color={colors.red} />
            <Text style={[styles.actionLabel, { color: colors.red }]}>Eliminar</Text>
          </TouchableOpacity>
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
          title="Eventos"
          subtitle={`${events.filter(e => e.status === 'UPCOMING').length} próximos`}
          hideLogo
        />

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color={colors.text3} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar eventos..."
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
            <Text style={[styles.filterChipText, !filter && styles.filterChipTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          {Object.entries(STATUS_CFG).map(([key, val]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterChip,
                filter === key && { backgroundColor: val.bg, borderColor: val.color },
              ]}
              onPress={() => setFilter(filter === key ? null : key)}
            >
              <View style={[styles.filterDot, { backgroundColor: val.color }]} />
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

        <TouchableOpacity style={styles.newBtn}>
          <Ionicons name="add-circle-outline" size={20} color={colors.blue} />
          <Text style={styles.newBtnText}>Crear evento</Text>
        </TouchableOpacity>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={44} color={colors.text3} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>Sin eventos</Text>
            <Text style={styles.emptyDesc}>
              {search || filter ? 'No hay resultados.' : 'No hay eventos registrados.'}
            </Text>
          </View>
        ) : (
          filtered.map(renderCard)
        )}
      </ScrollView>

      <Modal
        visible={!!detailEvent}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailEvent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDrawer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle del evento</Text>
              <TouchableOpacity onPress={() => setDetailEvent(null)} style={styles.modalClose}>
                <Ionicons name="close" size={18} color={colors.text3} />
              </TouchableOpacity>
            </View>
            {detailEvent && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.detailDateBlock}>
                  <Text style={styles.detailDateMonth}>
                    {formatDate(detailEvent.date).month}
                  </Text>
                  <Text style={styles.detailDateDay}>
                    {formatDate(detailEvent.date).day}
                  </Text>
                </View>
                <Text style={styles.detailName}>{detailEvent.name}</Text>
                <View style={[styles.detailBadge, { backgroundColor: STATUS_CFG[detailEvent.status].bg }]}>
                  <Text style={{ fontFamily: typography.display, fontSize: 12, fontWeight: '700', color: STATUS_CFG[detailEvent.status].color }}>
                    {STATUS_CFG[detailEvent.status].label}
                  </Text>
                </View>
                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={14} color={colors.text3} />
                    <Text style={styles.detailLabel}>Ubicación</Text>
                    <Text style={styles.detailValue}>{detailEvent.location}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={14} color={colors.text3} />
                    <Text style={styles.detailLabel}>Horario</Text>
                    <Text style={styles.detailValue}>{detailEvent.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={14} color={colors.text3} />
                    <Text style={styles.detailLabel}>Participantes</Text>
                    <Text style={styles.detailValue}>
                      {detailEvent.participants}/{detailEvent.maxParticipants}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="person-outline" size={14} color={colors.text3} />
                    <Text style={styles.detailLabel}>Organiza</Text>
                    <Text style={styles.detailValue}>{detailEvent.organizer}</Text>
                  </View>
                </View>
                <Text style={styles.detailSection}>Descripción</Text>
                <Text style={styles.detailDesc}>{detailEvent.description}</Text>
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
  scroll: { flex: 1 },
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
  filterDot: { width: 7, height: 7, borderRadius: 4 },
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.r16,
    marginBottom: 14,
    ...shadows.xs,
    overflow: 'hidden',
  },
  cardPast: {
    opacity: 0.7,
  },
  cardRow: {
    flexDirection: 'row',
    padding: 14,
    gap: 14,
  },
  dateBlock: {
    width: 52,
    height: 60,
    backgroundColor: colors.oceanLight,
    borderRadius: radii.r12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    fontFamily: typography.display,
    fontSize: 11,
    fontWeight: typography.weight.bold,
    color: colors.ocean,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dateDay: {
    fontFamily: typography.display,
    fontSize: 20,
    fontWeight: typography.weight.extrabold,
    color: colors.oceanDark,
    lineHeight: 22,
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardName: {
    fontFamily: typography.display,
    fontSize: 14,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.2,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: radii.r99,
  },
  statusText: {
    fontFamily: typography.display,
    fontSize: 10,
    fontWeight: typography.weight.bold,
  },
  cardMeta: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.text2,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
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
  detailDateBlock: {
    width: 64,
    height: 72,
    backgroundColor: colors.oceanLight,
    borderRadius: radii.r14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  detailDateMonth: {
    fontFamily: typography.display,
    fontSize: 13,
    fontWeight: typography.weight.bold,
    color: colors.ocean,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailDateDay: {
    fontFamily: typography.display,
    fontSize: 26,
    fontWeight: typography.weight.extrabold,
    color: colors.oceanDark,
    lineHeight: 28,
  },
  detailName: {
    fontFamily: typography.display,
    fontSize: 20,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  detailBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.r99,
    marginBottom: 16,
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
  detailDesc: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
});
