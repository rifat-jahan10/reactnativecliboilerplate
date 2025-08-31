import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '@hooks/useI18n';

const backIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const BioScreen = () => {
  const { t } = useI18n();
  const navigation = useNavigation();
  
  const [bio, setBio] = useState('');
  const [displayName, setDisplayName] = useState('Kullanıcı');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Colors - mevcut proje renklerini kullan
  const ourColors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
    surface: '#F8F9FA',
    border: '#E0E0E0',
    cardBorder: '#E0E0E0',
    card: '#F8F9FA',
  };

  const handleImagePicker = async () => {
    setIsUploadingImage(true);
    // Mock image picker - 2 saniye sonra biter
    setTimeout(() => {
      setIsUploadingImage(false);
      Alert.alert(t('bio.photo_upload_success'), t('bio.photo_upload_success_message'));
    }, 2000);
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert(t('bio.error'), t('bio.username_required'));
      return;
    }

    setIsLoading(true);
    
    // Mock save - 1 saniye sonra başarılı
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(t('bio.success'), t('bio.profile_updated'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() }
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: ourColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={ourColors.background} />
      
      <View style={[styles.header, { 
        backgroundColor: ourColors.background,
        borderBottomColor: ourColors.cardBorder,
        borderBottomWidth: 1,
      }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <SvgXml 
            xml={backIcon.replace(/currentColor/g, ourColors.text)} 
            width={24} 
            height={24} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: ourColors.text }]}>{t('bio.title')}</Text>
        <TouchableOpacity 
          style={[styles.saveButton, { opacity: isLoading ? 0.5 : 1 }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={[styles.saveButtonText, { color: ourColors.primary }]}>
            {t('bio.save')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.photoSection, { backgroundColor: ourColors.background }]}>
          <View style={[styles.profileImageContainer, {
            backgroundColor: ourColors.card,
            borderColor: ourColors.border,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
              },
              android: {
                elevation: 4,
              },
            }),
          }]}>
            <Image
              source={profileImage ? { uri: profileImage } : require('@assets/pp.png')}
              style={[styles.profileImage]}
            />
            {isUploadingImage && (
              <View style={[styles.uploadingOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <ActivityIndicator size="large" color={ourColors.primary} />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.addPhotoButton, {
              backgroundColor: ourColors.primary,
              opacity: isUploadingImage ? 0.5 : 1,
              ...Platform.select({
                ios: {
                  shadowColor: ourColors.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            }]}
            onPress={handleImagePicker}
            disabled={isUploadingImage}
          >
            <Text style={styles.addPhotoText}>
              {isUploadingImage ? t('bio.loading_photo') : t('bio.add_photo')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { 
          backgroundColor: ourColors.card,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 2,
            },
          }),
        }]}>
          <Text style={[styles.sectionTitle, { color: ourColors.text }]}>{t('bio.username_section')}</Text>
          <TextInput
            style={[styles.socialInput, { 
              color: ourColors.text,
              backgroundColor: ourColors.surface,
              borderColor: ourColors.cardBorder
            }]}
            placeholder={t('bio.username_placeholder')}
            placeholderTextColor={ourColors.textSecondary}
            value={displayName}
            onChangeText={setDisplayName}
            maxLength={30}
          />
          <Text style={[styles.charCount, { color: ourColors.textSecondary }]}>
            {displayName.length}/30
          </Text>
        </View>

        <View style={[styles.section, { 
          backgroundColor: ourColors.card,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 2,
            },
          }),
        }]}>
          <Text style={[styles.sectionTitle, { color: ourColors.text }]}>{t('bio.about_section')}</Text>
          <TextInput
            style={[styles.bioInput, { 
              color: ourColors.text,
              backgroundColor: ourColors.surface,
              borderColor: ourColors.cardBorder
            }]}
            placeholder={t('bio.bio_placeholder')}
            placeholderTextColor={ourColors.textSecondary}
            value={bio}
            onChangeText={setBio}
            multiline
            maxLength={500}
          />
          <Text style={[styles.charCount, { color: ourColors.textSecondary }]}>
            {bio.length}/500
          </Text>
        </View>

        <View style={[styles.section, {
          backgroundColor: ourColors.card,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 2,
            },
          }),
        }]}>
          <Text style={[styles.sectionTitle, { color: ourColors.text }]}>{t('bio.social_media_section')}</Text>
          
          <View style={styles.socialInputContainer}>
            <Text style={[styles.socialLabel, { color: ourColors.textSecondary }]}>{t('bio.instagram_label')}</Text>
            <TextInput
              style={[styles.socialInput, {
                color: ourColors.text,
                backgroundColor: ourColors.surface,
                borderColor: ourColors.cardBorder
              }]}
              placeholder={t('bio.instagram_placeholder')}
              placeholderTextColor={ourColors.textSecondary}
              value={instagram}
              onChangeText={setInstagram}
            />
          </View>

          <View style={styles.socialInputContainer}>
            <Text style={[styles.socialLabel, { color: ourColors.textSecondary }]}>{t('bio.twitter_label')}</Text>
            <TextInput
              style={[styles.socialInput, {
                color: ourColors.text,
                backgroundColor: ourColors.surface,
                borderColor: ourColors.cardBorder
              }]}
              placeholder={t('bio.twitter_placeholder')}
              placeholderTextColor={ourColors.textSecondary}
              value={twitter}
              onChangeText={setTwitter}
            />
          </View>

          <View style={styles.socialInputContainer}>
            <Text style={[styles.socialLabel, { color: ourColors.textSecondary }]}>{t('bio.linkedin_label')}</Text>
            <TextInput
              style={[styles.socialInput, {
                color: ourColors.text,
                backgroundColor: ourColors.surface,
                borderColor: ourColors.cardBorder
              }]}
              placeholder={t('bio.linkedin_placeholder')}
              placeholderTextColor={ourColors.textSecondary}
              value={linkedin}
              onChangeText={setLinkedin}
            />
          </View>

          <View style={styles.socialInputContainer}>
            <Text style={[styles.socialLabel, { color: ourColors.textSecondary }]}>{t('bio.website_label')}</Text>
            <TextInput
              style={[styles.socialInput, {
                color: ourColors.text,
                backgroundColor: ourColors.surface,
                borderColor: ourColors.cardBorder
              }]}
              placeholder={t('bio.website_placeholder')}
              placeholderTextColor={ourColors.textSecondary}
              value={website}
              onChangeText={setWebsite}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  addPhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addPhotoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'System',
  },
  bioInput: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    fontFamily: 'System',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'System',
  },
  socialInputContainer: {
    marginBottom: 16,
  },
  socialLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'System',
  },
  socialInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BioScreen;
