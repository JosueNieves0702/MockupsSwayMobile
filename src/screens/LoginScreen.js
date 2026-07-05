import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { radii, shadows } from '../theme/spacing';

export default function LoginScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (onLogin) onLogin();
      setLoading(false);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.panel}>
          <View style={styles.centerBrand}>
            <Image
              source={require('../../assets/SwayLogo.jpeg')}
              style={styles.centerLogo}
              resizeMode="contain"
            />
            <Text style={styles.centerName}>SWAY</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.title}>
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Accede como colaborador científico'
                : 'Regístrate para colaborar'}
            </Text>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              {!isLogin && (
                <View style={styles.field}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tu nombre"
                    placeholderTextColor={colors.text3}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="colaborador@ejemplo.com"
                  placeholderTextColor={colors.text3}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.text3}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {!isLogin && (
                <View style={styles.field}>
                  <Text style={styles.label}>Confirmar contraseña</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={colors.text3}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              )}

              {isLogin && (
                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitText}>
                    {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              <Text style={styles.switchText}>
                {isLogin
                  ? '¿No tienes cuenta? Regístrate'
                  : '¿Ya tienes cuenta? Inicia sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  panel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  formCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radii.r20,
    padding: 28,
    ...shadows.md,
  },
  title: {
    fontFamily: typography.display,
    fontSize: 24,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.text2,
    marginBottom: 24,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.redBg,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.2)',
    borderRadius: radii.r8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.red,
    flex: 1,
  },
  form: {
    gap: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    fontFamily: typography.display,
    fontSize: 12,
    fontWeight: typography.weight.semibold,
    color: colors.text2,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderMid,
    borderRadius: radii.r12,
    paddingHorizontal: 16,
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.blue,
    fontWeight: typography.weight.medium,
  },
  submitBtn: {
    height: 46,
    backgroundColor: colors.blue,
    borderRadius: radii.r12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    ...shadows.sm,
    shadowColor: colors.blue,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  submitDisabled: {
    opacity: 0.55,
  },
  submitText: {
    fontFamily: typography.display,
    fontSize: 16,
    fontWeight: typography.weight.semibold,
    color: '#fff',
    letterSpacing: -0.16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.text3,
  },
  switchBtn: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.blue,
    fontWeight: typography.weight.medium,
  },
  centerBrand: {
    alignItems: 'center',
    marginBottom: 28,
    gap: 6,
  },
  centerLogo: {
    width: 64,
    height: 64,
    borderRadius: 18,
  },
  centerName: {
    fontFamily: typography.display,
    fontSize: 26,
    fontWeight: typography.weight.extrabold,
    color: colors.oceanDark,
    letterSpacing: -1,
  },
});
