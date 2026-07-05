import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radii, shadows } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';

const TABS = [
  { key: 'info', label: 'Información' },
  { key: 'security', label: 'Seguridad' },
  { key: 'activity', label: 'Actividad' },
];

const stats = [
  { label: 'Avistamientos', value: '12', icon: 'binoculars-outline', color: colors.blue },
  { label: 'Especies', value: '8', icon: 'leaf-outline', color: colors.ocean },
  { label: 'Eventos', value: '4', icon: 'calendar-outline', color: colors.amber },
];

const badges = [
  { label: 'Explorador inicial', icon: 'compass-outline', unlocked: true },
  { label: 'Guardián del océano', icon: 'water-outline', unlocked: true },
  { label: 'Coleccionista de especies', icon: 'flower-outline', unlocked: false },
  { label: 'Fotógrafo marino', icon: 'camera-outline', unlocked: false },
];

export default function ProfileScreen() {
  const { setIsLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: 'Joaquín Moreno',
    email: 'joaquin.moreno@ejemplo.com',
    institution: 'UPQ',
    bio: 'Colaborador científico apasionado por la conservación marina.',
  });

  const [notifPrefs, setNotifPrefs] = useState({
    sighting: true,
    event: true,
    badge: true,
    system: true,
  });

  const NOTIF_PREFS = [
    { key: 'sighting', label: 'Avistamientos', desc: 'Cuando un avistamiento sea verificado o requiera cambios' },
    { key: 'event', label: 'Eventos', desc: 'Recordatorios de eventos próximos y cambios de última hora' },
    { key: 'badge', label: 'Logros', desc: 'Al desbloquear nuevas insignias y metas cumplidas' },
    { key: 'system', label: 'Sistema', desc: 'Actualizaciones de la plataforma y mensajes del equipo' },
  ];

  const handleSave = () => {
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => setIsLoggedIn(false),
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Perfil" subtitle="Colaborador científico" hideLogo />

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>
          <Text style={styles.profileName}>{form.name}</Text>
          <Text style={styles.profileEmail}>{form.email}</Text>
          <View style={styles.statsRow}>
            {stats.map((s) => (
              <View key={s.label} style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
                  <Ionicons name={s.icon} size={18} color={s.color} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tabsRow}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, activeTab === t.key && styles.tabActive]}
              onPress={() => setActiveTab(t.key)}
            >
              <Text
                style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'info' && (
          <View style={styles.section}>
            {editing ? (
              <>
                {[
                  { key: 'name', label: 'Nombre completo' },
                  { key: 'email', label: 'Correo electrónico' },
                  { key: 'institution', label: 'Institución' },
                ].map((field) => (
                  <View key={field.key} style={styles.field}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <TextInput
                      style={styles.fieldInput}
                      value={form[field.key]}
                      onChangeText={(v) => setForm({ ...form, [field.key]: v })}
                      placeholderTextColor={colors.text3}
                    />
                  </View>
                ))}
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Biografía</Text>
                  <TextInput
                    style={[styles.fieldInput, styles.fieldTextarea]}
                    value={form.bio}
                    onChangeText={(v) => setForm({ ...form, bio: v })}
                    multiline
                    numberOfLines={3}
                    placeholderTextColor={colors.text3}
                  />
                </View>
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEditing(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={styles.saveBtnText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {[
                  { label: 'Nombre', value: form.name },
                  { label: 'Correo', value: form.email },
                  { label: 'Institución', value: form.institution },
                ].map((item) => (
                  <View key={item.label} style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                ))}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Biografía</Text>
                  <Text style={styles.infoValue}>{form.bio}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => setEditing(true)}
                >
                  <Ionicons name="pencil-outline" size={16} color={colors.blue} />
                  <Text style={styles.editBtnText}>Editar perfil</Text>
                </TouchableOpacity>
              </>
            )}

            <Text style={styles.notifSectionTitle}>Preferencias de notificaciones</Text>
            {NOTIF_PREFS.map((p) => (
              <View key={p.key} style={styles.notifPrefRow}>
                <View style={styles.notifPrefInfo}>
                  <Text style={styles.notifPrefLabel}>{p.label}</Text>
                  <Text style={styles.notifPrefDesc}>{p.desc}</Text>
                </View>
                <Switch
                  value={notifPrefs[p.key]}
                  onValueChange={(v) =>
                    setNotifPrefs((prev) => ({ ...prev, [p.key]: v }))
                  }
                  trackColor={{ false: colors.borderMid, true: colors.blueLight }}
                  thumbColor={notifPrefs[p.key] ? colors.blue : colors.text3}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color={colors.red} />
              <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'security' && (
          <View style={styles.section}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Contraseña actual</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="••••••••"
                placeholderTextColor={colors.text3}
                secureTextEntry
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nueva contraseña</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="••••••••"
                placeholderTextColor={colors.text3}
                secureTextEntry
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Confirmar contraseña</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="••••••••"
                placeholderTextColor={colors.text3}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Actualizar contraseña</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'activity' && (
          <View style={styles.section}>
            <Text style={styles.badgeSectionTitle}>Logros</Text>
            <View style={styles.badgesGrid}>
              {badges.map((b) => (
                <View
                  key={b.label}
                  style={[styles.badgeCard, !b.unlocked && styles.badgeLocked]}
                >
                  <Ionicons
                    name={b.icon}
                    size={22}
                    color={b.unlocked ? colors.blue : colors.text3}
                  />
                  <Text
                    style={[
                      styles.badgeLabel,
                      !b.unlocked && { color: colors.text3 },
                    ]}
                  >
                    {b.label}
                  </Text>
                  {!b.unlocked && (
                    <Ionicons
                      name="lock-closed-outline"
                      size={12}
                      color={colors.text3}
                    />
                  )}
                </View>
              ))}
            </View>

            <Text style={[styles.badgeSectionTitle, { marginTop: 20 }]}>
              Actividad reciente
            </Text>
            {['Avistamiento de Ballena Azul en Loreto', 'Registró Tortuga Carey', 'Asistió a Limpieza de Playa'].map(
              (act, i) => (
                <View key={i} style={styles.activityRow}>
                  <View style={styles.activityDot} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>{act}</Text>
                    <Text style={styles.activityDate}>
                      hace {i + 1} {i === 0 ? 'semana' : 'semanas'}
                    </Text>
                  </View>
                </View>
              ),
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.r20,
    padding: 24,
    marginBottom: 20,
    ...shadows.xs,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.oceanDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontFamily: typography.display,
    fontSize: 18,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.text2,
    marginTop: 2,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: typography.display,
    fontSize: 18,
    fontWeight: typography.weight.extrabold,
    color: colors.text,
  },
  statLabel: {
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.text3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.blue,
  },
  tabText: {
    fontFamily: typography.display,
    fontSize: 13,
    fontWeight: typography.weight.medium,
    color: colors.text2,
  },
  tabTextActive: {
    color: colors.blue,
    fontWeight: typography.weight.semibold,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radii.r16,
    padding: 20,
    ...shadows.xs,
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontFamily: typography.display,
    fontSize: 11,
    fontWeight: typography.weight.semibold,
    color: colors.text3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoValue: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: colors.blueLight,
    borderRadius: radii.r10,
  },
  editBtnText: {
    fontFamily: typography.display,
    fontSize: 13,
    fontWeight: typography.weight.semibold,
    color: colors.blue,
  },
  field: {
    marginBottom: 14,
    gap: 6,
  },
  fieldLabel: {
    fontFamily: typography.display,
    fontSize: 12,
    fontWeight: typography.weight.semibold,
    color: colors.text2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderMid,
    borderRadius: radii.r10,
    paddingHorizontal: 14,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  fieldTextarea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 0.4,
    height: 42,
    borderRadius: radii.r10,
    borderWidth: 1,
    borderColor: colors.borderMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: typography.display,
    fontSize: 13,
    fontWeight: typography.weight.medium,
    color: colors.text2,
  },
  saveBtn: {
    flex: 1,
    height: 42,
    borderRadius: radii.r10,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    fontFamily: typography.display,
    fontSize: 13,
    fontWeight: typography.weight.semibold,
    color: '#fff',
  },
  notifSectionTitle: {
    fontFamily: typography.display,
    fontSize: 13,
    fontWeight: typography.weight.semibold,
    color: colors.text2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 12,
  },
  notifPrefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notifPrefInfo: {
    flex: 1,
    gap: 2,
  },
  notifPrefLabel: {
    fontFamily: typography.display,
    fontSize: 13,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  notifPrefDesc: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.text2,
    lineHeight: 15,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: radii.r12,
    backgroundColor: colors.redBg,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.2)',
  },
  logoutBtnText: {
    fontFamily: typography.display,
    fontSize: 14,
    fontWeight: typography.weight.semibold,
    color: colors.red,
  },
  badgeSectionTitle: {
    fontFamily: typography.display,
    fontSize: 14,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: colors.bg,
    borderRadius: radii.r12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    flexDirection: 'row',
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeLabel: {
    fontFamily: typography.body,
    fontSize: 12,
    fontWeight: typography.weight.medium,
    color: colors.text,
    flex: 1,
  },
  activityRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ocean,
    marginTop: 5,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.text,
    fontWeight: typography.weight.medium,
  },
  activityDate: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.text3,
    marginTop: 2,
  },
});
