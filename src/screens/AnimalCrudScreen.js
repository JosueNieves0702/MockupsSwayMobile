import { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radii, shadows } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';
import { speciesList, conservationStatus } from '../data/species';

const STATUS_LABELS = {
  DRAFT: { label: 'Borrador', color: colors.amber, bg: colors.amberBg },
  PUBLISHED: { label: 'Publicada', color: colors.green, bg: colors.greenBg },
};

const initialForm = {
  commonName: '',
  scientificName: '',
  status: 'LEAST_CONCERN',
  description: '',
  habitat: '',
};

export default function AnimalCrudScreen() {
  const [animals, setAnimals] = useState(
    speciesList.slice(0, 5).map((s, i) => ({ ...s, pubStatus: i < 3 ? 'PUBLISHED' : 'DRAFT' })),
  );
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [detailAnimal, setDetailAnimal] = useState(null);

  const filtered = useMemo(() => {
    let result = animals;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.commonName.toLowerCase().includes(q) ||
          a.scientificName.toLowerCase().includes(q),
      );
    }
    if (filter) {
      result = result.filter((a) => a.pubStatus === filter);
    }
    return result;
  }, [animals, search, filter]);

  const openCreate = () => {
    setEditId(null);
    setForm(initialForm);
    setModalVisible(true);
  };

  const openEdit = (animal) => {
    setEditId(animal.id);
    setForm({
      commonName: animal.commonName,
      scientificName: animal.scientificName,
      status: animal.status,
      description: animal.description,
      habitat: animal.habitat,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!form.commonName.trim() || !form.scientificName.trim()) return;
    if (editId) {
      setAnimals((prev) =>
        prev.map((a) => (a.id === editId ? { ...a, ...form } : a)),
      );
    } else {
      const newAnimal = {
        ...form,
        id: String(Date.now()),
        pubStatus: 'DRAFT',
        population: '—',
        image: null,
      };
      setAnimals((prev) => [newAnimal, ...prev]);
    }
    setModalVisible(false);
  };

  const togglePublish = (id) => {
    setAnimals((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              pubStatus: a.pubStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
            }
          : a,
      ),
    );
  };

  const handleDelete = (animal) => {
    Alert.alert(
      'Eliminar especie',
      `¿Eliminar "${animal.commonName}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () =>
            setAnimals((prev) => prev.filter((a) => a.id !== animal.id)),
        },
      ],
    );
  };

  const renderCard = (animal) => {
    const cons = conservationStatus[animal.status];
    const pub = STATUS_LABELS[animal.pubStatus];
    return (
      <View key={animal.id} style={styles.card}>
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => setDetailAnimal(animal)}
          activeOpacity={0.7}
        >
          <View style={styles.cardPhoto}>
            {animal.image ? (
              <Image source={{ uri: animal.image }} style={styles.cardImage} resizeMode="cover" />
            ) : (
              <Ionicons name="image-outline" size={28} color={colors.text3} />
            )}
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardTop}>
              <Text style={styles.cardCommon} numberOfLines={1}>
                {animal.commonName}
              </Text>
              <View style={[styles.pubBadge, { backgroundColor: pub.bg }]}>
                <Text style={[styles.pubBadgeText, { color: pub.color }]}>
                  {pub.label}
                </Text>
              </View>
            </View>
            <Text style={styles.cardScientific} numberOfLines={1}>
              {animal.scientificName}
            </Text>
            <View style={styles.cardConsRow}>
              <View
                style={[styles.consDot, { backgroundColor: cons.color }]}
              />
              <Text style={styles.cardConsText}>{cons.label}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setDetailAnimal(animal)}
          >
            <Ionicons name="eye-outline" size={16} color={colors.blue} />
            <Text style={[styles.actionText, { color: colors.blue }]}>Ver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openEdit(animal)}
          >
            <Ionicons name="pencil-outline" size={16} color={colors.blue} />
            <Text style={[styles.actionText, { color: colors.blue }]}>
              Editar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => togglePublish(animal.id)}
          >
            <Ionicons
              name={
                animal.pubStatus === 'PUBLISHED'
                  ? 'copy-outline'
                  : 'cloud-upload-outline'
              }
              size={16}
              color={colors.amber}
            />
            <Text style={[styles.actionText, { color: colors.amber }]}>
              {animal.pubStatus === 'PUBLISHED' ? 'Duplicar' : 'Publicar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(animal)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.red} />
            <Text style={[styles.actionText, { color: colors.red }]}>
              Eliminar
            </Text>
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
          title="Animales"
          subtitle={`${animals.length} especies registradas`}
          hideLogo
        />

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={16}
            color={colors.text3}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar especies..."
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
              Todas
            </Text>
          </TouchableOpacity>
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
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

        <TouchableOpacity style={styles.newAnimalBtn} onPress={openCreate}>
          <Ionicons name="add-circle-outline" size={20} color={colors.blue} />
          <Text style={styles.newAnimalBtnText}>Nueva especie</Text>
        </TouchableOpacity>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="fish-outline"
              size={40}
              color={colors.text3}
              style={{ marginBottom: 8 }}
            />
            <Text style={styles.emptyTitle}>Sin especies</Text>
            <Text style={styles.emptyDesc}>
              {search || filter
                ? 'No hay resultados con esos filtros.'
                : 'Aún no hay especies registradas. Crea la primera.'}
            </Text>
          </View>
        ) : (
          filtered.map(renderCard)
        )}
      </ScrollView>

      <Modal
        visible={!!detailAnimal}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailAnimal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDrawer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Ficha de especie</Text>
              <TouchableOpacity
                onPress={() => setDetailAnimal(null)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={18} color={colors.text3} />
              </TouchableOpacity>
            </View>
            {detailAnimal && (
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.detailPhoto}>
                  <Ionicons
                    name={
                      ['Vaquita Marina', 'Delfín Nariz de Botella'].includes(
                        detailAnimal.commonName,
                      )
                        ? 'water'
                        : ['Tortuga Carey', 'Tortuga Laud'].includes(
                              detailAnimal.commonName,
                            )
                          ? 'shield'
                          : detailAnimal.commonName === 'Ballena Azul'
                            ? 'boat'
                            : ['Tiburón Blanco', 'Tiburón Ballena'].includes(
                                  detailAnimal.commonName,
                                )
                              ? 'skull'
                              : detailAnimal.commonName === 'Pez Payaso'
                                ? 'sparkles'
                                : detailAnimal.commonName === 'Mantarraya'
                                  ? 'airplane'
                                  : detailAnimal.commonName ===
                                      'Pingüino de Humboldt'
                                    ? 'snow'
                                    : detailAnimal.commonName ===
                                        'Coral Cuerno de Alce'
                                      ? 'rose'
                                      : detailAnimal.commonName ===
                                          'Lobo Marino de Galápagos'
                                        ? 'paw'
                                        : detailAnimal.commonName === 'Pez Luna'
                                          ? 'moon'
                                          : 'fish'
                    }
                    size={64}
                    color={colors.oceanDark}
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailCommon}>
                    {detailAnimal.commonName}
                  </Text>
                  <Text style={styles.detailScientific}>
                    {detailAnimal.scientificName}
                  </Text>
                  <Text style={styles.detailDesc}>
                    {detailAnimal.description}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDrawer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>
                {editId ? 'Editar especie' : 'Nueva especie'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={18} color={colors.text3} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.field}>
                <Text style={styles.label}>Nombre común</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Tortuga Carey"
                  placeholderTextColor={colors.text3}
                  value={form.commonName}
                  onChangeText={(v) => setForm({ ...form, commonName: v })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Nombre científico</Text>
                <TextInput
                  style={[styles.input, styles.italicInput]}
                  placeholder="Ej. Eretmochelys imbricata"
                  placeholderTextColor={colors.text3}
                  value={form.scientificName}
                  onChangeText={(v) =>
                    setForm({ ...form, scientificName: v })
                  }
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Estado de conservación</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.statusRow}
                >
                  {Object.entries(conservationStatus).map(([key, val]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.statusChip,
                        form.status === key && {
                          backgroundColor: val.bg,
                          borderColor: val.color,
                        },
                      ]}
                      onPress={() => setForm({ ...form, status: key })}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: val.color },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusChipText,
                          form.status === key && { color: val.color },
                        ]}
                      >
                        {val.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Hábitat</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Arrecifes tropicales"
                  placeholderTextColor={colors.text3}
                  value={form.habitat}
                  onChangeText={(v) => setForm({ ...form, habitat: v })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Describe la especie..."
                  placeholderTextColor={colors.text3}
                  value={form.description}
                  onChangeText={(v) =>
                    setForm({ ...form, description: v })
                  }
                  multiline
                  numberOfLines={4}
                />
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSave}
                >
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.saveText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  newAnimalBtn: {
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
  newAnimalBtnText: {
    fontFamily: typography.display,
    fontSize: 13,
    fontWeight: typography.weight.semibold,
    color: colors.blue,
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
    marginBottom: 14,
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
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: radii.r99,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.blueLight,
    borderColor: colors.blue,
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.r16,
    marginBottom: 14,
    ...shadows.xs,
    overflow: 'hidden',
  },
  cardTouchable: {
    flexDirection: 'row',
    padding: 14,
  },
  cardPhoto: {
    width: 52,
    height: 52,
    borderRadius: radii.r14,
    backgroundColor: '#e3eeff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardCommon: {
    fontFamily: typography.display,
    fontSize: 15,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.3,
    flex: 1,
  },
  pubBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: radii.r99,
  },
  pubBadgeText: {
    fontFamily: typography.display,
    fontSize: 10,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.2,
  },
  cardScientific: {
    fontFamily: typography.body,
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.text2,
  },
  cardConsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  consDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardConsText: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.text2,
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
    paddingVertical: 10,
  },
  actionText: {
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
  modalHeaderTitle: {
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
    paddingHorizontal: 20,
    paddingTop: 16,
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
  detailContent: {
    gap: 8,
  },
  detailCommon: {
    fontFamily: typography.display,
    fontSize: 22,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  detailScientific: {
    fontFamily: typography.body,
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.text2,
  },
  detailDesc: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginTop: 8,
  },
  field: {
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontFamily: typography.display,
    fontSize: 12,
    fontWeight: typography.weight.semibold,
    color: colors.text2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderMid,
    borderRadius: radii.r12,
    paddingHorizontal: 14,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  italicInput: {
    fontStyle: 'italic',
  },
  textarea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  statusChip: {
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
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusChipText: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.text2,
    fontWeight: typography.weight.medium,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 0.4,
    height: 44,
    borderRadius: radii.r12,
    borderWidth: 1,
    borderColor: colors.borderMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: typography.display,
    fontSize: 14,
    fontWeight: typography.weight.medium,
    color: colors.text2,
  },
  saveBtn: {
    flex: 1,
    height: 44,
    borderRadius: radii.r12,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveText: {
    fontFamily: typography.display,
    fontSize: 14,
    fontWeight: typography.weight.semibold,
    color: '#fff',
  },
});
