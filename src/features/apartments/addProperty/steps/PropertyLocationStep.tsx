import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import {
  colors,
  spacing,
  textStyles,
  borderRadius,
  shadows,
} from "../../../../shared/constants/tokens";
import { PropertyLocationObject } from "../../../../core/types/propertyObjects";
import {
  TelAvivLocation,
  TEL_AVIV_LOCATIONS,
} from "../../../../shared/constants/locations";
import * as Location from "expo-location";

interface StepProps {
  data: PropertyLocationObject;
  onUpdate: (updates: Partial<PropertyLocationObject>) => void;
}

export default function LocationStep({ data, onUpdate }: StepProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showShelterOptions, setShowShelterOptions] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [streetSuggestions, setStreetSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Local state for form inputs
  const [localStreet, setLocalStreet] = useState(data.street);
  const [localStreetNumber, setLocalStreetNumber] = useState(data.streetNumber);
  const [localFloor, setLocalFloor] = useState(data.floor);
  const [localApartmentNumber, setLocalApartmentNumber] = useState(
    data.apartmentNumber
  );
  const [localPostcode, setLocalPostcode] = useState(data.postcode);
  const [localHasShelter, setLocalHasShelter] = useState(data.hasShelter);
  const [localShelterLocation, setLocalShelterLocation] = useState(
    data.shelterLocation
  );
  const [localShelterDistance, setLocalShelterDistance] = useState(
    data.shelterDistance?.toString() || ""
  );

  // Common Tel Aviv street names for autocomplete
  const TEL_AVIV_STREETS = [
    "Dizengoff",
    "Rothschild",
    "Ben Yehuda",
    "Allenby",
    "King George",
    "Bialik",
    "Nahalat Binyamin",
    "Shenkin",
    "Frishman",
    "Gordon",
    "Ben Gurion",
    "Herzl",
    "Jabotinsky",
    "Weizmann",
    "Begin",
    "Rabin",
    "Peres",
    "Sharon",
    "Barak",
    "Ariel",
    "Ben Ari",
    "Ben Zvi",
    "HaHashmonaim",
    "HaMelacha",
    "HaAliya",
    "HaShalom",
    "HaMasger",
    "HaKovshim",
    "HaTzofim",
    "HaShomer",
    "HaPalmach",
    "HaEtzel",
    "HaLehi",
    "HaShomer HaTzair",
    "HaNoar HaOved",
    "HaMizrachi",
    "HaPoel",
    "HaMaccabi",
    "HaKibbutz",
    "HaMoshav",
    "HaKfar",
    "HaIr",
    "HaShuk",
    "HaBima",
    "HaOpera",
    "HaSymphony",
    "HaCinema",
    "HaTheater",
    "HaMuseum",
    "HaLibrary",
    "HaUniversity",
    "HaTechnion",
    "HaCollege",
    "HaSchool",
    "HaKindergarten",
    "HaHospital",
    "HaClinic",
    "HaPharmacy",
    "HaBank",
    "HaPost",
    "HaPolice",
    "HaFire",
    "HaAmbulance",
    "HaTaxi",
    "HaBus",
    "HaTrain",
    "HaAirport",
    "HaPort",
    "HaBeach",
    "HaPark",
    "HaGarden",
    "HaForest",
    "HaMountain",
    "HaValley",
    "HaRiver",
    "HaLake",
    "HaSea",
    "HaOcean",
    "HaDesert",
    "HaField",
    "HaFarm",
    "HaVineyard",
    "HaOrchard",
    "HaGreenhouse",
    "HaBarn",
    "HaStable",
    "HaChicken",
    "HaCow",
    "HaSheep",
    "HaGoat",
    "HaPig",
    "HaHorse",
    "HaDonkey",
    "HaCamel",
    "HaElephant",
    "HaLion",
    "HaTiger",
    "HaBear",
    "HaWolf",
    "HaFox",
    "HaRabbit",
    "HaSquirrel",
    "HaMouse",
    "HaRat",
    "HaCat",
    "HaDog",
    "HaBird",
    "HaFish",
    "HaSnake",
    "HaLizard",
    "HaFrog",
    "HaTurtle",
    "HaButterfly",
    "HaBee",
    "HaAnt",
    "HaSpider",
    "HaFly",
    "HaMosquito",
    "HaWorm",
    "HaSnail",
    "HaCrab",
    "HaLobster",
    "HaShrimp",
    "HaOctopus",
    "HaSquid",
    "HaJellyfish",
    "HaStarfish",
    "HaCoral",
    "HaSeaweed",
    "HaAlgae",
    "HaMoss",
    "HaFern",
    "HaFlower",
    "HaTree",
    "HaBush",
    "HaGrass",
    "HaLeaf",
    "HaBranch",
    "HaRoot",
    "HaSeed",
    "HaFruit",
    "HaVegetable",
    "HaGrain",
    "HaNut",
    "HaBerry",
    "HaHerb",
    "HaSpice",
    "HaSalt",
    "HaSugar",
    "HaHoney",
    "HaOil",
    "HaVinegar",
    "HaWine",
    "HaBeer",
    "HaWhiskey",
    "HaVodka",
    "HaRum",
    "HaGin",
    "HaTequila",
    "HaBrandy",
    "HaCognac",
    "HaChampagne",
    "HaCoffee",
    "HaTea",
    "HaMilk",
    "HaWater",
    "HaJuice",
    "HaSoda",
    "HaLemonade",
    "HaIce",
    "HaCream",
    "HaButter",
    "HaCheese",
    "HaYogurt",
    "HaBread",
    "HaCake",
    "HaCookie",
    "HaCandy",
    "HaChocolate",
    "HaIce Cream",
    "HaPudding",
    "HaJelly",
    "HaJam",
    "HaMarmalade",
    "HaSyrup",
    "HaSauce",
    "HaKetchup",
    "HaMustard",
    "HaMayonnaise",
    "HaSalad",
    "HaSoup",
    "HaStew",
    "HaRoast",
    "HaGrill",
    "HaFry",
    "HaBake",
    "HaBoil",
    "HaSteam",
    "HaSmoke",
    "HaPickle",
    "HaPreserve",
    "HaCan",
    "HaFreeze",
    "HaDry",
    "HaFresh",
    "HaFrozen",
    "HaCanned",
    "HaDried",
    "HaSmoked",
    "HaPickled",
    "HaPreserved",
    "HaOrganic",
    "HaNatural",
    "HaHealthy",
    "HaDiet",
    "HaLow",
    "HaHigh",
    "HaMedium",
    "HaSmall",
    "HaLarge",
    "HaBig",
    "HaLittle",
    "HaTiny",
    "HaHuge",
    "HaGiant",
    "HaMassive",
    "HaEnormous",
    "HaColossal",
    "HaMicroscopic",
    "HaInvisible",
    "HaTransparent",
    "HaOpaque",
    "HaClear",
    "HaCloudy",
    "HaFoggy",
    "HaMisty",
    "HaRainy",
    "HaSnowy",
    "HaSunny",
    "HaWindy",
    "HaStormy",
    "HaCalm",
    "HaQuiet",
    "HaLoud",
    "HaNoisy",
    "HaSilent",
    "HaPeaceful",
    "HaChaotic",
    "HaOrderly",
    "HaMessy",
    "HaClean",
    "HaDirty",
    "HaNew",
    "HaOld",
    "HaYoung",
    "HaAncient",
    "HaModern",
    "HaTraditional",
    "HaClassic",
    "HaContemporary",
    "HaFuturistic",
    "HaVintage",
    "HaAntique",
    "HaRare",
    "HaCommon",
    "HaPopular",
    "HaUnpopular",
    "HaFamous",
    "HaUnknown",
    "HaPublic",
    "HaPrivate",
    "HaPersonal",
    "HaProfessional",
    "HaBusiness",
    "HaCommercial",
    "HaIndustrial",
    "HaResidential",
    "HaUrban",
    "HaRural",
    "HaSuburban",
    "HaMetropolitan",
    "HaCosmopolitan",
    "HaInternational",
    "HaNational",
    "HaLocal",
    "HaRegional",
    "HaGlobal",
    "HaWorldwide",
    "HaUniversal",
  ];

  // Animation for loading state
  React.useEffect(() => {
    if (isGeocoding) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isGeocoding]);

  // Function to validate if address is in Tel Aviv
  const validateTelAvivAddress = async (
    street: string,
    number: string
  ): Promise<{
    isValid: boolean;
    coordinates?: { lat: number; lng: number };
  }> => {
    if (!street || !number) return { isValid: false };

    try {
      const fullAddress = `${street} ${number}, Tel Aviv, Israel`;
      const geocodeResult = await Location.geocodeAsync(fullAddress);

      if (geocodeResult.length > 0) {
        const { latitude, longitude } = geocodeResult[0];

        // Check if coordinates are within Tel Aviv bounds
        const telAvivBounds = {
          north: 32.15,
          south: 32.05,
          east: 34.85,
          west: 34.75,
        };

        const isInTelAviv =
          latitude >= telAvivBounds.south &&
          latitude <= telAvivBounds.north &&
          longitude >= telAvivBounds.west &&
          longitude <= telAvivBounds.east;

        return {
          isValid: isInTelAviv,
          coordinates: isInTelAviv
            ? { lat: latitude, lng: longitude }
            : undefined,
        };
      }
    } catch (error) {
      console.log("Address validation error:", error);
    }

    return { isValid: false };
  };

  // Function to detect neighborhood from address
  const detectNeighborhoodFromAddress = (address: string): string | null => {
    if (!address) return null;

    const addressLower = address.toLowerCase();

    // Check each neighborhood name in the address
    for (const neighborhood of TEL_AVIV_LOCATIONS) {
      const neighborhoodLower = neighborhood.toLowerCase();

      // Direct match
      if (addressLower.includes(neighborhoodLower)) {
        return neighborhood;
      }

      // Handle common variations and abbreviations
      const variations = getNeighborhoodVariations(neighborhood);
      for (const variation of variations) {
        if (addressLower.includes(variation.toLowerCase())) {
          return neighborhood;
        }
      }
    }

    return null;
  };

  // Function to get common variations of neighborhood names
  const getNeighborhoodVariations = (neighborhood: string): string[] => {
    const variations: { [key: string]: string[] } = {
      "Ramat Aviv Aleph": ["ramat aviv a", "ramat aviv 1", "ramat aviv alef"],
      "Ramat Aviv Gimmel": ["ramat aviv g", "ramat aviv 3", "ramat aviv gimel"],
      "Ramat Aviv HaHadasha": [
        "ramat aviv hadasha",
        "ramat aviv new",
        "ramat aviv ha-hadasha",
      ],
      "HaTzafon HaYashan (Old North)": [
        "old north",
        "hatzafon hayashan",
        "north",
        "tzafon",
      ],
      "Neve Tzedek": ["neve tzadek", "neve tzadik"],
      "Kerem HaTeimanim": ["kerem hateimanim", "kerem", "teimanim"],
      "American–German Colony": [
        "american german",
        "german colony",
        "american colony",
      ],
      "Nahalat Yitzhak": ["nahalat yitzchak", "nahalat"],
      "Ramat HaTayasim": ["ramat hatayasim", "tayasim"],
      "Kfar Shalem": ["kfar shalom", "shalem"],
      "Giv'at Aliyah": ["givat aliyah", "aliyah"],
    };

    return variations[neighborhood] || [];
  };

  // Function to find the closest neighborhood based on coordinates
  const findNeighborhoodFromCoordinates = (
    latitude: number,
    longitude: number
  ): typeof TelAvivLocation | null => {
    // Define approximate neighborhood boundaries (simplified for demo)
    const neighborhoodBoundaries: {
      [key: string]: {
        north: number;
        south: number;
        east: number;
        west: number;
      };
    } = {
      "Neve Avivim": { north: 32.12, south: 32.1, east: 34.8, west: 34.78 },
      "Azorei Hen": { north: 32.13, south: 32.11, east: 34.82, west: 34.8 },
      "Kokhav HaTzafon": {
        north: 32.14,
        south: 32.12,
        east: 34.84,
        west: 34.82,
      },
      "Ramat Aviv Aleph": {
        north: 32.13,
        south: 32.11,
        east: 34.81,
        west: 34.79,
      },
      "Ramat Aviv Gimmel": {
        north: 32.12,
        south: 32.1,
        east: 34.8,
        west: 34.78,
      },
      "Ramat Aviv HaHadasha": {
        north: 32.11,
        south: 32.09,
        east: 34.79,
        west: 34.77,
      },
      "Ne'ot Afeka": { north: 32.1, south: 32.08, east: 34.78, west: 34.76 },
      "Ma'oz Aviv": { north: 32.09, south: 32.07, east: 34.77, west: 34.75 },
      "Hadar Yosef": { north: 32.08, south: 32.06, east: 34.76, west: 34.74 },
      Tzahala: { north: 32.07, south: 32.05, east: 34.75, west: 34.73 },
      Revivim: { north: 32.06, south: 32.04, east: 34.74, west: 34.72 },
      "Tel Baruch": { north: 32.05, south: 32.03, east: 34.73, west: 34.71 },
      "HaTzafon HaYashan (Old North)": {
        north: 32.08,
        south: 32.06,
        east: 34.78,
        west: 34.76,
      },
      "Lev HaIr": { north: 32.07, south: 32.05, east: 34.77, west: 34.75 },
      Montefiori: { north: 32.06, south: 32.04, east: 34.76, west: 34.74 },
      "Yehuda HaMaccabi": {
        north: 32.05,
        south: 32.03,
        east: 34.75,
        west: 34.73,
      },
      Bavli: { north: 32.04, south: 32.02, east: 34.74, west: 34.72 },
      "Tzamarot Ayalon": {
        north: 32.03,
        south: 32.01,
        east: 34.73,
        west: 34.71,
      },
      "Giv'at Amal Bet": { north: 32.02, south: 32.0, east: 34.72, west: 34.7 },
      "Kerem HaTeimanim": {
        north: 32.08,
        south: 32.06,
        east: 34.79,
        west: 34.77,
      },
      "Neve Tzedek": { north: 32.07, south: 32.05, east: 34.78, west: 34.76 },
      Shabazi: { north: 32.06, south: 32.04, east: 34.77, west: 34.75 },
      Florentin: { north: 32.05, south: 32.03, east: 34.76, west: 34.74 },
      "Neve Sha'anan": { north: 32.04, south: 32.02, east: 34.75, west: 34.73 },
      "Neve Ofer": { north: 32.03, south: 32.01, east: 34.74, west: 34.72 },
      "Kiryat Shalom": { north: 32.02, south: 32.0, east: 34.73, west: 34.71 },
      Shapira: { north: 32.01, south: 31.99, east: 34.72, west: 34.7 },
      HaTikva: { north: 32.0, south: 31.98, east: 34.71, west: 34.69 },
      "Giv'at Herzl": { north: 31.99, south: 31.97, east: 34.7, west: 34.68 },
      "Abu Kabir": { north: 31.98, south: 31.96, east: 34.69, west: 34.67 },
      "American–German Colony": {
        north: 32.07,
        south: 32.05,
        east: 34.79,
        west: 34.77,
      },
      "Nahalat Yitzhak": {
        north: 32.06,
        south: 32.04,
        east: 34.78,
        west: 34.76,
      },
      Bitzaron: { north: 32.05, south: 32.03, east: 34.77, west: 34.75 },
      "Ramat Yisrael": { north: 32.04, south: 32.02, east: 34.76, west: 34.74 },
      "Tel Haim": { north: 32.03, south: 32.01, east: 34.75, west: 34.73 },
      "Ramat HaTayasim": {
        north: 32.02,
        south: 32.0,
        east: 34.74,
        west: 34.72,
      },
      "Neve Tzahal": { north: 32.01, south: 31.99, east: 34.73, west: 34.71 },
      "Kfar Shalem": { north: 32.0, south: 31.98, east: 34.72, west: 34.7 },
      HaArgazim: { north: 31.99, south: 31.97, east: 34.71, west: 34.69 },
      Ezra: { north: 31.98, south: 31.96, east: 34.7, west: 34.68 },
      "Yad Eliyahu": { north: 31.97, south: 31.95, east: 34.69, west: 34.67 },
      "Old Jaffa": { north: 32.05, south: 32.03, east: 34.75, west: 34.73 },
      Ajami: { north: 32.04, south: 32.02, east: 34.74, west: 34.72 },
      Menashiya: { north: 32.03, south: 32.01, east: 34.73, west: 34.71 },
      "Giv'at Aliyah": { north: 32.02, south: 32.0, east: 34.72, west: 34.7 },
      Tzahalon: { north: 32.01, south: 31.99, east: 34.71, west: 34.69 },
    };

    // Check which neighborhood the coordinates fall into
    for (const [neighborhoodName, bounds] of Object.entries(
      neighborhoodBoundaries
    )) {
      if (
        latitude >= bounds.south &&
        latitude <= bounds.north &&
        longitude >= bounds.west &&
        longitude <= bounds.east
      ) {
        const neighborhoodIndex = TEL_AVIV_LOCATIONS.indexOf(neighborhoodName);
        return {
          id: `neighborhood-${neighborhoodIndex}`,
          name: neighborhoodName,
          coordinates: { lat: latitude, lng: longitude },
          areas: [
            {
              id: `neighborhood-${neighborhoodIndex}`,
              name: neighborhoodName,
              city: "Tel Aviv",
              apartments: 0,
            },
          ],
        };
      }
    }

    // Fallback: return a default neighborhood from TEL_AVIV_LOCATIONS
    const defaultNeighborhood = "Lev HaIr"; // Central Tel Aviv as default
    const defaultIndex = TEL_AVIV_LOCATIONS.indexOf(defaultNeighborhood);

    return {
      id: `neighborhood-${defaultIndex}`,
      name: defaultNeighborhood,
      coordinates: { lat: latitude, lng: longitude },
      areas: [
        {
          id: `neighborhood-${defaultIndex}`,
          name: defaultNeighborhood,
          city: "Tel Aviv",
          apartments: 0,
        },
      ],
    };
  };

  // Function to detect area from address
  const detectAreaFromAddress = async (street: string, number: string) => {
    if (!street || !number) return;

    setIsGeocoding(true);

    try {
      const fullAddress = `${street} ${number}, Tel Aviv, Israel`;

      // First validate if the address is real and in Tel Aviv
      const validation = await validateTelAvivAddress(street, number);

      if (!validation.isValid) {
        Alert.alert(
          "Invalid Address",
          "The address you entered is not valid or not located in Tel Aviv. Please check and try again.",
          [{ text: "OK" }]
        );
        setIsGeocoding(false);
        return;
      }

      // First try to detect neighborhood from address text
      const detectedNeighborhood = detectNeighborhoodFromAddress(fullAddress);

      if (detectedNeighborhood) {
        // Find the index of the detected neighborhood
        const neighborhoodIndex =
          TEL_AVIV_LOCATIONS.indexOf(detectedNeighborhood);

        onUpdate({
          area: {
            id: `neighborhood-${neighborhoodIndex}`,
            name: detectedNeighborhood,
            coordinates: validation.coordinates || {
              lat: 32.0853,
              lng: 34.7818,
            },
            areas: [
              {
                id: `neighborhood-${neighborhoodIndex}`,
                name: detectedNeighborhood,
                city: "Tel Aviv",
                apartments: 0,
              },
            ],
          },
          location: validation.coordinates
            ? {
                latitude: validation.coordinates.lat,
                longitude: validation.coordinates.lng,
                address: fullAddress,
              }
            : undefined,
        });
      } else {
        // Fallback to geocoding if neighborhood not detected from text
        const geocodeResult = await Location.geocodeAsync(fullAddress);

        if (geocodeResult.length > 0) {
          const { latitude, longitude } = geocodeResult[0];

          // Find the closest neighborhood using coordinate-based detection
          const detectedArea = findNeighborhoodFromCoordinates(
            latitude,
            longitude
          );

          if (detectedArea) {
            onUpdate({ area: detectedArea });
            onUpdate({
              location: {
                latitude,
                longitude,
                address: fullAddress,
              },
            });
          }
        }
      }
    } catch (error) {
      console.log("Geocoding error:", error);
      Alert.alert(
        "Error",
        "There was an error detecting the neighborhood. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleStreetChange = (street: string) => {
    setLocalStreet(street);
    onUpdate({ street }); // Update immediately for validation

    // Generate suggestions based on input
    if (street.length > 1) {
      const suggestions = TEL_AVIV_STREETS.filter((streetName) =>
        streetName.toLowerCase().includes(street.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions

      setStreetSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setStreetSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleStreetNumberChange = (number: string) => {
    setLocalStreetNumber(number);
    onUpdate({ streetNumber: number }); // Update immediately for validation
  };

  const handleStreetBlur = () => {
    setShowSuggestions(false);
    // Trigger area detection when user finishes typing
    if (localStreet && localStreetNumber) {
      detectAreaFromAddress(localStreet, localStreetNumber);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setLocalStreet(suggestion);
    onUpdate({ street: suggestion });
    setShowSuggestions(false);
    setStreetSuggestions([]);
  };

  const handleStreetNumberBlur = () => {
    // Trigger area detection when user finishes typing
    if (localStreet && localStreetNumber) {
      detectAreaFromAddress(localStreet, localStreetNumber);
    }
  };

  const handleShelterChange = (hasShelter: boolean) => {
    setLocalHasShelter(hasShelter);
    onUpdate({ hasShelter });
    setShowShelterOptions(hasShelter);

    if (!hasShelter) {
      setLocalShelterLocation(undefined);
      setLocalShelterDistance("");
      onUpdate({
        shelterLocation: undefined,
        shelterDistance: undefined,
      });
    }
  };

  const handleShelterLocationChange = (
    location: "in_apartment" | "in_floor" | "in_building" | "other"
  ) => {
    setLocalShelterLocation(location);
    onUpdate({ shelterLocation: location });

    if (location !== "other") {
      setLocalShelterDistance("");
      onUpdate({ shelterDistance: undefined });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Confirm Your Address</Text>
        </View>

        {/* Address Form */}
        <View style={styles.addressForm}>
          {/* Street Input Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Street Name</Text>
              <View style={styles.suggestionContainer}>
                <TextInput
                  style={styles.textInput}
                  value={localStreet}
                  onChangeText={handleStreetChange}
                  onFocus={() => setFocusedInput("street")}
                  onBlur={() => {
                    setFocusedInput(null);
                    handleStreetBlur();
                  }}
                  placeholder="Enter street name"
                  placeholderTextColor={colors.neutral[400]}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {showSuggestions && streetSuggestions.length > 0 && (
                  <View style={styles.suggestionsList}>
                    {streetSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => handleSuggestionSelect(suggestion)}
                      >
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Number</Text>
              <TextInput
                style={styles.textInput}
                value={localStreetNumber}
                onChangeText={handleStreetNumberChange}
                onFocus={() => setFocusedInput("number")}
                onBlur={() => {
                  setFocusedInput(null);
                  handleStreetNumberBlur();
                }}
                placeholder="Number"
                placeholderTextColor={colors.neutral[400]}
                keyboardType="numeric"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Floor and Apartment Row */}
          <View style={styles.inputRow}>
            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Floor</Text>
              <TextInput
                style={styles.textInput}
                value={localFloor}
                onChangeText={(floor) => {
                  setLocalFloor(floor);
                  onUpdate({ floor }); // Update immediately for validation
                }}
                onFocus={() => setFocusedInput("floor")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Floor number"
                placeholderTextColor={colors.neutral[400]}
                keyboardType="numeric"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputField}>
              <Text style={styles.fieldLabel}>Apartment</Text>
              <TextInput
                style={styles.textInput}
                value={localApartmentNumber}
                onChangeText={(apartmentNumber) => {
                  setLocalApartmentNumber(apartmentNumber);
                  onUpdate({ apartmentNumber }); // Update immediately for validation
                }}
                onFocus={() => setFocusedInput("apartment")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Apartment number"
                placeholderTextColor={colors.neutral[400]}
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Neighborhood */}
          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>Neighborhood</Text>
            <TextInput
              style={styles.textInput}
              value={data.area?.name || ""}
              placeholder="Neighborhood will be detected from address"
              placeholderTextColor={colors.neutral[400]}
              editable={false}
            />
          </View>

          {/* City */}
          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>City/Municipality</Text>
            <TextInput
              style={styles.textInput}
              value="Tel Aviv"
              placeholder="City"
              placeholderTextColor={colors.neutral[400]}
              editable={false}
            />
          </View>

          {/* Postcode */}
          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>Postal Code</Text>
            <TextInput
              style={styles.textInput}
              value={localPostcode}
              onChangeText={(postcode) => {
                setLocalPostcode(postcode);
                onUpdate({ postcode }); // Update immediately for validation
              }}
              onFocus={() => setFocusedInput("postcode")}
              onBlur={() => setFocusedInput(null)}
              placeholder="Enter postal code"
              placeholderTextColor={colors.neutral[400]}
              keyboardType="numeric"
              autoCorrect={false}
            />
          </View>

          {isGeocoding && (
            <Animated.View
              style={[
                styles.loadingContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.loadingText}>Detecting neighborhood...</Text>
            </Animated.View>
          )}
        </View>

        {/* Shelter Section */}
        <View style={styles.shelterSection}>
          <Text style={styles.shelterTitle}>Shelter Information</Text>
          <Text style={styles.shelterQuestion}>Is there a shelter?</Text>

          <View style={styles.shelterOptions}>
            <TouchableOpacity
              style={[
                styles.shelterOption,
                localHasShelter === true && styles.shelterOptionSelected,
              ]}
              onPress={() => handleShelterChange(true)}
            >
              <Text
                style={[
                  styles.shelterOptionText,
                  localHasShelter === true && styles.shelterOptionTextSelected,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.shelterOption,
                localHasShelter === false && styles.shelterOptionSelected,
              ]}
              onPress={() => handleShelterChange(false)}
            >
              <Text
                style={[
                  styles.shelterOptionText,
                  localHasShelter === false && styles.shelterOptionTextSelected,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          {/* Shelter Location Options */}
          {showShelterOptions && (
            <View style={styles.shelterLocationContainer}>
              <Text style={styles.shelterQuestion}>
                Where is the shelter located?
              </Text>

              <TouchableOpacity
                style={[
                  styles.shelterLocationOption,
                  localShelterLocation === "in_apartment" &&
                    styles.shelterLocationOptionSelected,
                ]}
                onPress={() => handleShelterLocationChange("in_apartment")}
              >
                <Text
                  style={[
                    styles.shelterLocationText,
                    localShelterLocation === "in_apartment" &&
                      styles.shelterLocationTextSelected,
                  ]}
                >
                  In the apartment
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shelterLocationOption,
                  localShelterLocation === "in_floor" &&
                    styles.shelterLocationOptionSelected,
                ]}
                onPress={() => handleShelterLocationChange("in_floor")}
              >
                <Text
                  style={[
                    styles.shelterLocationText,
                    localShelterLocation === "in_floor" &&
                      styles.shelterLocationTextSelected,
                  ]}
                >
                  In the floor
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shelterLocationOption,
                  localShelterLocation === "in_building" &&
                    styles.shelterLocationOptionSelected,
                ]}
                onPress={() => handleShelterLocationChange("in_building")}
              >
                <Text
                  style={[
                    styles.shelterLocationText,
                    localShelterLocation === "in_building" &&
                      styles.shelterLocationTextSelected,
                  ]}
                >
                  In the building
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shelterLocationOption,
                  localShelterLocation === "other" &&
                    styles.shelterLocationOptionSelected,
                ]}
                onPress={() => handleShelterLocationChange("other")}
              >
                <Text
                  style={[
                    styles.shelterLocationText,
                    localShelterLocation === "other" &&
                      styles.shelterLocationTextSelected,
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>

              {/* Distance Input for "Other" option */}
              {localShelterLocation === "other" && (
                <View style={styles.distanceInputContainer}>
                  <Text style={styles.fieldLabel}>
                    How far is the closest shelter? (in meters)
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    value={localShelterDistance}
                    onChangeText={(distance) => {
                      setLocalShelterDistance(distance);
                      onUpdate({
                        shelterDistance: distance
                          ? parseInt(distance)
                          : undefined,
                      }); // Update immediately for validation
                    }}
                    onFocus={() => setFocusedInput("distance")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Enter distance in meters"
                    placeholderTextColor={colors.neutral[400]}
                    keyboardType="numeric"
                    autoCorrect={false}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  content: {
    padding: spacing.lg,
  },

  // Header Section
  headerSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    ...textStyles.h1,
    color: colors.neutral[900],
    textAlign: "center",
    fontWeight: "700",
  },

  // Address Form
  addressForm: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },

  // Input Layout
  inputRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  inputField: {
    flex: 1,
  },
  fieldLabel: {
    ...textStyles.caption,
    color: colors.neutral[600],
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  textInput: {
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.neutral[50],
    color: colors.neutral[900],
    fontSize: 16,
  },

  // Area Display
  areaDisplay: {
    backgroundColor: colors.success[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.success[200],
  },
  areaText: {
    ...textStyles.caption,
    color: colors.success[700],
    fontWeight: "600",
  },

  // Loading State
  loadingContainer: {
    backgroundColor: colors.warning[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.warning[200],
  },
  loadingText: {
    ...textStyles.caption,
    color: colors.warning[700],
    fontWeight: "500",
  },

  // Privacy Section
  privacySection: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  privacyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  privacyTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
    flex: 1,
  },
  toggleSwitch: {
    marginLeft: spacing.md,
  },
  toggleTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.neutral[300],
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.neutral[0],
    ...shadows.sm,
  },
  privacyDescription: {
    ...textStyles.caption,
    color: colors.neutral[600],
    lineHeight: 20,
  },
  learnMoreLink: {
    color: colors.primary[600],
    textDecorationLine: "underline",
  },

  // Map Preview
  mapPreview: {
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  mapText: {
    ...textStyles.caption,
    color: colors.neutral[600],
    textAlign: "center",
  },

  // Shelter Section
  shelterSection: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  shelterTitle: {
    ...textStyles.h3,
    color: colors.neutral[900],
    fontWeight: "600",
    marginBottom: spacing.lg,
  },
  shelterQuestion: {
    ...textStyles.body,
    color: colors.neutral[700],
    marginBottom: spacing.md,
    fontWeight: "500",
  },
  shelterOptions: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  shelterOption: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[50],
    alignItems: "center",
  },
  shelterOptionSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  shelterOptionText: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  shelterOptionTextSelected: {
    color: colors.neutral[0],
  },

  // Shelter Location Options
  shelterLocationContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  shelterLocationOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[50],
    marginBottom: spacing.sm,
  },
  shelterLocationOptionSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  shelterLocationText: {
    ...textStyles.body,
    color: colors.neutral[700],
    fontWeight: "500",
  },
  shelterLocationTextSelected: {
    color: colors.neutral[0],
  },

  // Distance Input
  distanceInputContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },

  // Street Suggestions
  suggestionContainer: {
    position: "relative",
    zIndex: 1,
  },
  suggestionsList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    maxHeight: 200,
    zIndex: 10,
    ...shadows.md,
  },
  suggestionItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  suggestionText: {
    ...textStyles.body,
    color: colors.neutral[700],
  },
});
