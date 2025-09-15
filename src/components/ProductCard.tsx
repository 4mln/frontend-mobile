import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ProductCardProps = {
  id: string | number;
  name: string;
  price: number;
  discountedPrice?: number;
  image?: string;
  rating?: number;
  onPress: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  discountedPrice,
  image,
  rating = 0,
  onPress,
}) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: image || "https://via.placeholder.com/150" }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${discountedPrice || price}</Text>
          {discountedPrice && (
            <Text style={styles.oldPrice}>${price}</Text>
          )}
        </View>

        <View style={styles.ratingContainer}>
          {stars.map((filled, index) => (
            <FontAwesome
              key={index}
              name={filled ? "star" : "star-o"}
              size={14}
              color="#FFD700"
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.favorite}>
        <FontAwesome name="heart-o" size={20} color="#FF4D4D" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    marginRight: 16,
    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 120,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  favorite: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
  },
});

export default ProductCard;
