import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { useProfileHooks } from './profileHooks';
import { profileStyles } from './profileStyles';
import { UserProfile, ProfileUpdate } from './types';

/**
 * Profile Screen Component
 * Main profile interface for viewing and editing user profile
 * Aligns with backend /auth endpoints
 */
interface ProfileScreenProps {
  onBack?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileUpdate>({});
  
  const {
    profile,
    loading,
    error,
    updateProfile,
    uploadPhoto,
    refreshProfile,
    clearError,
  } = useProfileHooks();

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      await updateProfile(editData);
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
      setEditData({});
      refreshProfile();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  // Handle photo upload
  const handlePhotoUpload = async () => {
    try {
      // In a real app, this would open image picker
      Alert.alert('Photo Upload', 'Photo upload functionality would be implemented here');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload photo');
    }
  };

  // Handle input change
  const handleInputChange = (field: keyof ProfileUpdate, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading && !profile) {
    return (
      <View style={profileStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={profileStyles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={profileStyles.errorContainer}>
        <Text style={profileStyles.errorText}>{error}</Text>
        <TouchableOpacity style={profileStyles.retryButton} onPress={refreshProfile}>
          <Text style={profileStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={profileStyles.errorContainer}>
        <Text style={profileStyles.errorText}>Profile not found</Text>
        <TouchableOpacity style={profileStyles.retryButton} onPress={refreshProfile}>
          <Text style={profileStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={profileStyles.container}>
      {/* Header */}
      <View style={profileStyles.header}>
        <TouchableOpacity onPress={onBack} style={profileStyles.backButton}>
          <Text style={profileStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={profileStyles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={profileStyles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={profileStyles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Photo Section */}
      <View style={profileStyles.photoSection}>
        <View style={profileStyles.photoContainer}>
          {profile.photo ? (
            <Image source={{ uri: profile.photo }} style={profileStyles.photo} />
          ) : (
            <View style={profileStyles.photoPlaceholder}>
              <Text style={profileStyles.photoPlaceholderText}>
                {profile.fullName?.charAt(0) || 'U'}
              </Text>
            </View>
          )}
          {isEditing && (
            <TouchableOpacity 
              style={profileStyles.photoEditButton}
              onPress={handlePhotoUpload}
            >
              <Text style={profileStyles.photoEditButtonText}>📷</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={profileStyles.userName}>
          {profile.fullName || 'User Name'}
        </Text>
        <Text style={profileStyles.userEmail}>
          {profile.email}
        </Text>
      </View>

      {/* Profile Information */}
      <View style={profileStyles.infoSection}>
        <Text style={profileStyles.sectionTitle}>Personal Information</Text>
        
        {/* Full Name */}
        <View style={profileStyles.fieldContainer}>
          <Text style={profileStyles.fieldLabel}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={profileStyles.fieldInput}
              value={editData.fullName || profile.fullName || ''}
              onChangeText={(value) => handleInputChange('fullName', value)}
              placeholder="Enter your full name"
            />
          ) : (
            <Text style={profileStyles.fieldValue}>
              {profile.fullName || 'Not provided'}
            </Text>
          )}
        </View>

        {/* Email */}
        <View style={profileStyles.fieldContainer}>
          <Text style={profileStyles.fieldLabel}>Email</Text>
          <Text style={profileStyles.fieldValue}>
            {profile.email}
          </Text>
        </View>

        {/* Phone */}
        <View style={profileStyles.fieldContainer}>
          <Text style={profileStyles.fieldLabel}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={profileStyles.fieldInput}
              value={editData.phone || profile.phone || ''}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={profileStyles.fieldValue}>
              {profile.phone || 'Not provided'}
            </Text>
          )}
        </View>

        {/* Role */}
        <View style={profileStyles.fieldContainer}>
          <Text style={profileStyles.fieldLabel}>Role</Text>
          <Text style={profileStyles.fieldValue}>
            {profile.role || 'User'}
          </Text>
        </View>
      </View>

      {/* Business Information */}
      {profile.businessName && (
        <View style={profileStyles.infoSection}>
          <Text style={profileStyles.sectionTitle}>Business Information</Text>
          
          {/* Business Name */}
          <View style={profileStyles.fieldContainer}>
            <Text style={profileStyles.fieldLabel}>Business Name</Text>
            {isEditing ? (
              <TextInput
                style={profileStyles.fieldInput}
                value={editData.businessName || profile.businessName || ''}
                onChangeText={(value) => handleInputChange('businessName', value)}
                placeholder="Enter your business name"
              />
            ) : (
              <Text style={profileStyles.fieldValue}>
                {profile.businessName}
              </Text>
            )}
          </View>

          {/* Business Industry */}
          {profile.businessIndustry && (
            <View style={profileStyles.fieldContainer}>
              <Text style={profileStyles.fieldLabel}>Industry</Text>
              {isEditing ? (
                <TextInput
                  style={profileStyles.fieldInput}
                  value={editData.businessIndustry || profile.businessIndustry || ''}
                  onChangeText={(value) => handleInputChange('businessIndustry', value)}
                  placeholder="Enter your business industry"
                />
              ) : (
                <Text style={profileStyles.fieldValue}>
                  {profile.businessIndustry}
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* KYC Status */}
      <View style={profileStyles.infoSection}>
        <Text style={profileStyles.sectionTitle}>Verification Status</Text>
        
        <View style={profileStyles.fieldContainer}>
          <Text style={profileStyles.fieldLabel}>KYC Status</Text>
          <View style={[
            profileStyles.statusBadge,
            profileStyles.statusBadgeVerified
          ]}>
            <Text style={profileStyles.statusText}>
              {profile.kycStatus || 'Not verified'}
            </Text>
          </View>
        </View>

        {profile.isVerified && (
          <View style={profileStyles.fieldContainer}>
            <Text style={profileStyles.fieldLabel}>Verification</Text>
            <View style={[
              profileStyles.statusBadge,
              profileStyles.statusBadgeVerified
            ]}>
              <Text style={profileStyles.statusText}>Verified ✓</Text>
            </View>
          </View>
        )}
      </View>

      {/* Privacy Settings */}
      <View style={profileStyles.infoSection}>
        <Text style={profileStyles.sectionTitle}>Privacy Settings</Text>
        
        <View style={profileStyles.fieldContainer}>
          <Text style={profileStyles.fieldLabel}>Profile Visibility</Text>
          <Text style={profileStyles.fieldValue}>
            {profile.isPublic ? 'Public' : 'Private'}
          </Text>
        </View>

        <View style={profileStyles.fieldContainer}>
          <Text style={profileStyles.fieldLabel}>Email Notifications</Text>
          <Text style={profileStyles.fieldValue}>
            {profile.emailNotifications ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      {isEditing && (
        <View style={profileStyles.actionButtons}>
          <TouchableOpacity
            style={[profileStyles.actionButton, profileStyles.cancelButton]}
            onPress={() => {
              setIsEditing(false);
              setEditData({});
            }}
          >
            <Text style={profileStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[profileStyles.actionButton, profileStyles.saveButton]}
            onPress={handleUpdateProfile}
          >
            <Text style={profileStyles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Additional Actions */}
      <View style={profileStyles.additionalActions}>
        <TouchableOpacity style={profileStyles.additionalActionButton}>
          <Text style={profileStyles.additionalActionIcon}>🔒</Text>
          <Text style={profileStyles.additionalActionText}>Change Password</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={profileStyles.additionalActionButton}>
          <Text style={profileStyles.additionalActionIcon}>🔔</Text>
          <Text style={profileStyles.additionalActionText}>Notification Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={profileStyles.additionalActionButton}>
          <Text style={profileStyles.additionalActionIcon}>📊</Text>
          <Text style={profileStyles.additionalActionText}>Account Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={profileStyles.additionalActionButton}>
          <Text style={profileStyles.additionalActionIcon}>❌</Text>
          <Text style={profileStyles.additionalActionText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
