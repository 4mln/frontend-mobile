import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { useExploreHooks } from './exploreHooks';
import { exploreStyles } from './exploreStyles';
import { Product, SearchFilters } from './types';

/**
 * Explore Screen Component
 * Main explore interface for searching products and sellers
 * Aligns with backend /products/search endpoints
 */
interface ExploreScreenProps {
  onBack?: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const {
    products,
    categories,
    sellers,
    loading,
    error,
    searchProducts,
    searchSellers,
    getCategories,
    refreshResults,
    clearError,
  } = useExploreHooks();

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchProducts(query, { ...filters, category: selectedCategory });
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (searchQuery.trim()) {
      searchProducts(searchQuery, { ...filters, category });
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (searchQuery.trim()) {
      searchProducts(searchQuery, { ...newFilters, category: selectedCategory });
    }
  };

  // Render product item
  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={exploreStyles.productItem}>
      <View style={exploreStyles.productImageContainer}>
        {item.image ? (
          <Text style={exploreStyles.productImagePlaceholder}>📦</Text>
        ) : (
          <Text style={exploreStyles.productImagePlaceholder}>📦</Text>
        )}
      </View>
      <View style={exploreStyles.productInfo}>
        <Text style={exploreStyles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={exploreStyles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={exploreStyles.productMeta}>
          <Text style={exploreStyles.productPrice}>
            ${item.price?.toFixed(2) || 'Price on request'}
          </Text>
          <Text style={exploreStyles.productCategory}>
            {item.category}
          </Text>
        </View>
        <View style={exploreStyles.productFooter}>
          <Text style={exploreStyles.productSeller}>
            by {item.sellerName}
          </Text>
          <View style={exploreStyles.productRating}>
            <Text style={exploreStyles.productRatingText}>⭐ {item.rating || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render seller item
  const renderSeller = ({ item }: { item: any }) => (
    <TouchableOpacity style={exploreStyles.sellerItem}>
      <View style={exploreStyles.sellerAvatar}>
        <Text style={exploreStyles.sellerAvatarText}>
          {item.name?.charAt(0) || 'S'}
        </Text>
      </View>
      <View style={exploreStyles.sellerInfo}>
        <Text style={exploreStyles.sellerName}>{item.name}</Text>
        <Text style={exploreStyles.sellerBusiness}>{item.businessName}</Text>
        <Text style={exploreStyles.sellerIndustry}>{item.industry}</Text>
        <View style={exploreStyles.sellerMeta}>
          <Text style={exploreStyles.sellerRating}>
            ⭐ {item.rating || 'N/A'}
          </Text>
          <Text style={exploreStyles.sellerProducts}>
            {item.productCount || 0} products
          </Text>
        </View>
      </View>
      <View style={exploreStyles.sellerActions}>
        <TouchableOpacity style={exploreStyles.sellerActionButton}>
          <Text style={exploreStyles.sellerActionText}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Render category item
  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        exploreStyles.categoryItem,
        selectedCategory === item && exploreStyles.categoryItemSelected
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text style={[
        exploreStyles.categoryText,
        selectedCategory === item && exploreStyles.categoryTextSelected
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !products.length) {
    return (
      <View style={exploreStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={exploreStyles.loadingText}>Searching...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={exploreStyles.errorContainer}>
        <Text style={exploreStyles.errorText}>{error}</Text>
        <TouchableOpacity style={exploreStyles.retryButton} onPress={refreshResults}>
          <Text style={exploreStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={exploreStyles.container}>
      {/* Header */}
      <View style={exploreStyles.header}>
        <TouchableOpacity onPress={onBack} style={exploreStyles.backButton}>
          <Text style={exploreStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={exploreStyles.headerTitle}>Explore</Text>
        <TouchableOpacity 
          style={exploreStyles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={exploreStyles.filterButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={exploreStyles.searchContainer}>
        <TextInput
          style={exploreStyles.searchInput}
          placeholder="Search products, sellers..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Categories */}
      <View style={exploreStyles.categoriesSection}>
        <FlatList
          data={['all', ...categories]}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={exploreStyles.categoriesList}
        />
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={exploreStyles.filtersContainer}>
          <Text style={exploreStyles.filtersTitle}>Filters</Text>
          <ScrollView style={exploreStyles.filtersContent}>
            <View style={exploreStyles.filterGroup}>
              <Text style={exploreStyles.filterLabel}>Price Range</Text>
              <View style={exploreStyles.filterInputs}>
                <TextInput
                  style={exploreStyles.filterInput}
                  placeholder="Min"
                  keyboardType="numeric"
                />
                <TextInput
                  style={exploreStyles.filterInput}
                  placeholder="Max"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={exploreStyles.filterGroup}>
              <Text style={exploreStyles.filterLabel}>Rating</Text>
              <View style={exploreStyles.filterOptions}>
                {[5, 4, 3, 2, 1].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={exploreStyles.filterOption}
                  >
                    <Text style={exploreStyles.filterOptionText}>
                      {rating}+ ⭐
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={exploreStyles.filterGroup}>
              <Text style={exploreStyles.filterLabel}>Availability</Text>
              <View style={exploreStyles.filterOptions}>
                <TouchableOpacity style={exploreStyles.filterOption}>
                  <Text style={exploreStyles.filterOptionText}>In Stock</Text>
                </TouchableOpacity>
                <TouchableOpacity style={exploreStyles.filterOption}>
                  <Text style={exploreStyles.filterOptionText}>On Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <View style={exploreStyles.filterActions}>
            <TouchableOpacity
              style={[exploreStyles.filterActionButton, exploreStyles.clearButton]}
              onPress={() => setFilters({})}
            >
              <Text style={exploreStyles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[exploreStyles.filterActionButton, exploreStyles.applyButton]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={exploreStyles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results */}
      <View style={exploreStyles.resultsSection}>
        <View style={exploreStyles.resultsHeader}>
          <Text style={exploreStyles.resultsTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : 'Popular Products'}
          </Text>
          <Text style={exploreStyles.resultsCount}>
            {products.length} products
          </Text>
        </View>
        
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          style={exploreStyles.resultsList}
          refreshing={loading}
          onRefresh={refreshResults}
          ListEmptyComponent={
            <View style={exploreStyles.emptyState}>
              <Text style={exploreStyles.emptyStateText}>
                {searchQuery ? 'No products found' : 'Start searching to find products'}
              </Text>
            </View>
          }
        />
      </View>

      {/* Quick Actions */}
      <View style={exploreStyles.quickActions}>
        <TouchableOpacity style={exploreStyles.quickActionButton}>
          <Text style={exploreStyles.quickActionIcon}>🔍</Text>
          <Text style={exploreStyles.quickActionText}>Advanced Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={exploreStyles.quickActionButton}>
          <Text style={exploreStyles.quickActionIcon}>🏪</Text>
          <Text style={exploreStyles.quickActionText}>Browse Sellers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={exploreStyles.quickActionButton}>
          <Text style={exploreStyles.quickActionIcon}>📊</Text>
          <Text style={exploreStyles.quickActionText}>Trending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={exploreStyles.quickActionButton}>
          <Text style={exploreStyles.quickActionIcon}>⭐</Text>
          <Text style={exploreStyles.quickActionText}>Top Rated</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExploreScreen;
