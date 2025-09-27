import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useProductsHooks } from './productsHooks';
import { productsStyles } from './productsStyles';
import { Product } from './types';

/**
 * Products Screen Component
 * Main products listing interface
 * Aligns with backend /products endpoints
 */
interface ProductsScreenProps {
  onProductSelect?: (product: Product) => void;
  onBack?: () => void;
}

export const ProductsScreen: React.FC<ProductsScreenProps> = ({ 
  onProductSelect,
  onBack 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const {
    products,
    categories,
    loading,
    error,
    searchProducts,
    refreshProducts,
    loadMoreProducts,
    hasMore,
  } = useProductsHooks();

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchProducts(query);
  };

  // Handle category filter
  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    // Filter products by category
  };

  // Render product item
  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={productsStyles.productItem}
      onPress={() => handleProductSelect(item)}
    >
      <View style={productsStyles.productImage}>
        <Text style={productsStyles.productImagePlaceholder}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={productsStyles.productInfo}>
        <Text style={productsStyles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={productsStyles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={productsStyles.productMeta}>
          <Text style={productsStyles.productPrice}>
            ${item.price.toFixed(2)}
          </Text>
          <Text style={productsStyles.productCategory}>
            {item.category}
          </Text>
        </View>
        <View style={productsStyles.productActions}>
          <TouchableOpacity style={productsStyles.actionButton}>
            <Text style={productsStyles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={productsStyles.actionButton}>
            <Text style={productsStyles.actionButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render category filter
  const renderCategoryFilter = () => (
    <View style={productsStyles.categoryFilter}>
      <TouchableOpacity
        style={[
          productsStyles.categoryButton,
          !selectedCategory && productsStyles.categoryButtonActive
        ]}
        onPress={() => handleCategoryFilter(null)}
      >
        <Text style={[
          productsStyles.categoryButtonText,
          !selectedCategory && productsStyles.categoryButtonTextActive
        ]}>
          All
        </Text>
      </TouchableOpacity>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            productsStyles.categoryButton,
            selectedCategory === category && productsStyles.categoryButtonActive
          ]}
          onPress={() => handleCategoryFilter(category)}
        >
          <Text style={[
            productsStyles.categoryButtonText,
            selectedCategory === category && productsStyles.categoryButtonTextActive
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading && !products.length) {
    return (
      <View style={productsStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={productsStyles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={productsStyles.errorContainer}>
        <Text style={productsStyles.errorText}>{error}</Text>
        <TouchableOpacity style={productsStyles.retryButton} onPress={refreshProducts}>
          <Text style={productsStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={productsStyles.container}>
      {/* Header */}
      <View style={productsStyles.header}>
        <TouchableOpacity onPress={onBack} style={productsStyles.backButton}>
          <Text style={productsStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={productsStyles.headerTitle}>Products</Text>
        <TouchableOpacity style={productsStyles.searchButton}>
          <Text style={productsStyles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      {renderCategoryFilter()}

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        style={productsStyles.productsList}
        refreshing={loading}
        onRefresh={refreshProducts}
        onEndReached={hasMore ? loadMoreProducts : undefined}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={productsStyles.emptyState}>
            <Text style={productsStyles.emptyStateText}>
              No products found
            </Text>
            <TouchableOpacity style={productsStyles.emptyStateButton} onPress={refreshProducts}>
              <Text style={productsStyles.emptyStateButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default ProductsScreen;
