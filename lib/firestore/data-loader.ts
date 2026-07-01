import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Product, Service, Category, Business } from "./types";
import {
  mockProducts,
  mockServices,
  mockCategories,
  mockBusinesses
} from "./mock-data";

// Helper to check if Firebase is configured
const isFirebaseConfigured = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !!apiKey && apiKey !== "your-api-key-here" && apiKey.trim() !== "";
};

export async function getBusinesses(): Promise<Business[]> {
  if (!isFirebaseConfigured()) {
    return mockBusinesses;
  }
  try {
    const querySnapshot = await getDocs(collection(db, "toko"));
    if (querySnapshot.empty) return mockBusinesses;
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Business[];
  } catch (error) {
    console.warn("Firebase query failed, falling back to mock data:", error);
    return mockBusinesses;
  }
}

export async function getBusinessById(id: string): Promise<Business | null> {
  if (!isFirebaseConfigured()) {
    return mockBusinesses.find(b => b.id === id) || null;
  }
  try {
    const docRef = doc(db, "toko", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return mockBusinesses.find(b => b.id === id) || null;
    }
    return { id: docSnap.id, ...docSnap.data() } as Business;
  } catch (error) {
    console.warn("Firebase get failed, falling back to mock data:", error);
    return mockBusinesses.find(b => b.id === id) || null;
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured()) {
    return mockProducts;
  }
  try {
    const querySnapshot = await getDocs(collection(db, "produk"));
    if (querySnapshot.empty) return mockProducts;
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.warn("Firebase query failed, falling back to mock data:", error);
    return mockProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured()) {
    return mockProducts.find(p => p.id === id) || null;
  }
  try {
    const docRef = doc(db, "produk", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return mockProducts.find(p => p.id === id) || null;
    }
    return { id: docSnap.id, ...docSnap.data() } as Product;
  } catch (error) {
    console.warn("Firebase get failed, falling back to mock data:", error);
    return mockProducts.find(p => p.id === id) || null;
  }
}

export async function getServices(): Promise<Service[]> {
  if (!isFirebaseConfigured()) {
    return mockServices;
  }
  try {
    const querySnapshot = await getDocs(collection(db, "jasa"));
    if (querySnapshot.empty) return mockServices;
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
  } catch (error) {
    console.warn("Firebase query failed, falling back to mock data:", error);
    return mockServices;
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  if (!isFirebaseConfigured()) {
    return mockServices.find(s => s.id === id) || null;
  }
  try {
    const docRef = doc(db, "jasa", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return mockServices.find(s => s.id === id) || null;
    }
    return { id: docSnap.id, ...docSnap.data() } as Service;
  } catch (error) {
    console.warn("Firebase get failed, falling back to mock data:", error);
    return mockServices.find(s => s.id === id) || null;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isFirebaseConfigured()) {
    return mockCategories;
  }
  try {
    const querySnapshot = await getDocs(collection(db, "kategori"));
    if (querySnapshot.empty) return mockCategories;
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  } catch (error) {
    console.warn("Firebase query failed, falling back to mock data:", error);
    return mockCategories;
  }
}
