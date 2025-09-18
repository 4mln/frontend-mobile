import { useColorScheme } from "@/hooks/use-color-scheme";
import apiClient from "@/services/api";
import { colors } from "@/theme/colors";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Banner from "../src/components/Banner";
import ProductCard from "../src/components/ProductCard";
import SellerCard from "../src/components/SellerCard";
import { SPACING } from "../src/theme/theme";
// Avoid SSR crash on web due to reanimated in skeleton-content
const isWeb = typeof window !== "undefined" && !('__EXPO_E2E__' in (globalThis as any));

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
};
type Seller = { id: number; name: string; rating?: number; image?: string };
type BannerData = { id: number; title: string; subtitle?: string; image?: string };
type Category = { id: string; name: string };

export default function ExploreScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("default");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const bannerListRef = useRef<FlatList>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const safeData = <T,>(res: any, fallback: T): T => {
    if (!res) return fallback;
    const data = res?.data;
    if (Array.isArray(data)) return data as T;
    return fallback;
  };

  // Ensure we don't try to iterate over undefined values
  const ensureArray = <T,>(data: T[] | undefined | null): T[] => {
    return Array.isArray(data) ? data : [];
  };

  const fetchData = async () => {
    try {
      const [productsRes, sellersRes, bannersRes, categoriesRes] = await Promise.all([
        apiClient.get("/products").catch(() => ({ data: [] })),
        apiClient.get("/sellers").catch(() => ({ data: [] })),
        apiClient.get("/banners").catch(() => ({ data: [] })),
        apiClient.get("/categories").catch(() => ({ data: [] })),
      ]);
      
      // Define variables with proper fallbacks to prevent undefined values
      const productData = safeData<Product[]>(productsRes, []);
      const sellerData = safeData<Seller[]>(sellersRes, []);
      const bannerData = safeData<BannerData[]>(bannersRes, []);
      const categoryData = safeData<Category[]>(categoriesRes, []);
      
      // Ensure we're setting arrays, not undefined values
      setProducts(ensureArray(productData));
      setSellers(ensureArray(sellerData));
      setBanners(ensureArray(bannerData));
      setCategories([{ id: "all", name: "All" }, ...ensureArray(categoryData)]);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Ensure state is at least empty arrays
      setProducts([]);
      setSellers([]);
      setBanners([]);
      setCategories([{ id: "all", name: "All" }]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Auto-scroll banners
  useEffect(() => {
    if (!banners.length) return;
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % banners.length;
      bannerListRef.current?.scrollToIndex({ index: currentIndex, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [banners]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  // Filter & sort products
  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "all" || p.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOption === "priceLow") return a.price - b.price;
      if (sortOption === "priceHigh") return b.price - a.price;
      if (sortOption === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  if (loading) {
    return (
      <View style={{ flex: 1, padding: SPACING.base }}>
        <View style={{ width: "100%", height: 50, backgroundColor: "#eee", borderRadius: 12, marginBottom: SPACING.base }} />
        <View style={{ width: "100%", height: 50, backgroundColor: "#eee", borderRadius: 12, marginBottom: SPACING.base }} />
        <View style={{ width: "100%", height: 45, backgroundColor: "#eee", borderRadius: 12, marginBottom: SPACING.base }} />
        <View style={{ width: "100%", height: 150, backgroundColor: "#eee", borderRadius: 12, marginBottom: SPACING.base }} />
        <View style={{ flexDirection: "row", marginBottom: SPACING.base }}>
          <View style={{ width: 80, height: 80, backgroundColor: "#eee", borderRadius: 40, marginRight: 12 }} />
          <View style={{ width: 80, height: 80, backgroundColor: "#eee", borderRadius: 40, marginRight: 12 }} />
          <View style={{ width: 80, height: 80, backgroundColor: "#eee", borderRadius: 40 }} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "48%", height: 220, backgroundColor: "#eee", borderRadius: 12 }} />
          <View style={{ width: "48%", height: 220, backgroundColor: "#eee", borderRadius: 12 }} />
        </View>
      </View>
    );
  }

  // 2-column product layout
  const numColumns = 2;
  const productItemWidth = (SCREEN_WIDTH - SPACING.base * 3) / numColumns;

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={() => (
        <View>
          {/* Search + Filter */}
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { color: isDark ? colors.text.primary : colors.text.primary }]}
              placeholder="Search products..."
              placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => console.log("Open filter modal")}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Category Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.base }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === cat.id && { color: "#fff", fontWeight: "bold" },
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sorting */}
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortModalVisible(true)}
          >
            <Text style={{ fontWeight: "bold" }}>
              Sort: {sortOption === "default" ? "Default" : sortOption === "priceLow" ? "Price Low→High" : sortOption === "priceHigh" ? "Price High→Low" : "Rating"}
            </Text>
          </TouchableOpacity>

          <Modal visible={sortModalVisible} transparent animationType="fade">
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setSortModalVisible(false)}
            />
            <View style={styles.modalContent}>
              {[
                { id: "default", label: "Default" },
                { id: "priceLow", label: "Price: Low → High" },
                { id: "priceHigh", label: "Price: High → Low" },
                { id: "rating", label: "Rating" },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={styles.sortOption}
                  onPress={() => { setSortOption(opt.id); setSortModalVisible(false); }}
                >
                  <Text>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Modal>

          {/* Banners */}
          {Array.isArray(banners) && banners.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Promotions</Text>
                <TouchableOpacity onPress={() => console.log("See All Banners")}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                ref={bannerListRef}
                data={banners}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: SPACING.base }}
                ItemSeparatorComponent={() => <View style={{ width: SPACING.small }} />}
                renderItem={({ item }) => (
                  <Banner
                    title={item.title}
                    subtitle={item.subtitle}
                    image={item.image || "https://via.placeholder.com/300x150"}
                    onPress={() => console.log("Banner clicked", item.id)}
                  />
                )}
              />
            </>
          )}

          {/* Sellers */}
          {Array.isArray(sellers) && sellers.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Sellers</Text>
                <TouchableOpacity onPress={() => console.log("See All Sellers")}>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={sellers}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: SPACING.base }}
                ItemSeparatorComponent={() => <View style={{ width: SPACING.small }} />}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <SellerCard
                    name={item.name}
                    rating={item.rating}
                    image={item.image || "https://via.placeholder.com/60"}
                    onPress={() => console.log("Seller clicked", item.id)}
                  />
                )}
              />
            </>
          )}

          {/* Products Header */}
          <View style={[styles.sectionHeader, { marginTop: SPACING.base }]}>
            <Text style={styles.sectionTitle}>Products</Text>
          </View>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={{ width: productItemWidth }}>
          <ProductCard
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.image || "https://via.placeholder.com/150"}
            rating={item.rating}
            onPress={() => console.log("Clicked product", item.id)}
          />
        </View>
      )}
      contentContainerStyle={{ padding: SPACING.base }}
    />
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    marginBottom: SPACING.base,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: SPACING.base,
    marginRight: SPACING.small,
  },
  filterButton: {
    height: 45,
    paddingHorizontal: SPACING.base,
    borderRadius: 12,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: SPACING.small,
  },
  categoryChipActive: {
    backgroundColor: "#007BFF",
  },
  sortButton: {
    height: 40,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.base,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: SPACING.base,
  },
  sortOption: {
    paddingVertical: 12,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.small,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeAll: { color: "#007BFF" },
  categoryText: { color: "#000" },
});
