// src/firebase-config.ts

import { 
  initializeApp, 
} from "firebase/app";

import type {
  FirebaseApp 
} from "firebase/app";

import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
} from "firebase/auth";

import type {
  Auth, 
  User, 
  UserCredential, 
  AuthError 
} from "firebase/auth";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import type {
  FirebaseStorage,
  StorageReference,
  UploadResult,
} from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDPO-w9kD0xAmXjAyZMzxsRAS1yiIHyxIA",
  authDomain: "theta-lounge.firebaseapp.com",
  projectId: "theta-lounge",
  storageBucket: "theta-lounge.firebasestorage.app",
  messagingSenderId: "909725090196",
  appId: "1:909725090196:web:957ceb62cd20839fcecf81"
};


const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

// 3. Google Auth Provider Instance
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();


// --- 4. Google Sign-In Function ---
// Returns a Promise that resolves to the authenticated Firebase User object.
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result: UserCredential = await signInWithPopup(auth, googleProvider);
    
    // The signed-in user info (type: User)
    const user: User = result.user;
    
    // Optional: Get token/credential info if needed for backend or accessing Google APIs
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token: string | undefined = credential?.accessToken; // token is either string or undefined

    console.log("Google Sign-In Successful:", user.displayName, user.email);
    
    return user; 
  } catch (error) {
    // Type assertion to handle specific Firebase Auth errors
    const authError = error as AuthError;
    
    // Handle the case where the user closes the popup
    if (authError.code === 'auth/popup-closed-by-user') {
      console.warn("Sign-in popup closed by user.");
    } else {
      console.error("Google Sign-In Error:", authError.code, authError.message);
    }
    
    throw authError; // Re-throw the error for component-level error handling
  }
};


// --- 5. Sign Out Function ---
// Returns a Promise that resolves when the user is signed out.
export const logout = (): Promise<void> => {
  return signOut(auth);
};

// --- 6. Firebase Storage Functions ---

/**
 * Upload an image to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'blogs/image-name.jpg')
 * @returns Promise with the download URL
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef: StorageReference = ref(storage, path);
    const uploadResult: UploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    console.log('✅ Image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage
 * @param path - The storage path of the image to delete
 */
export const deleteImage = async (path: string): Promise<void> => {
  try {
    const storageRef: StorageReference = ref(storage, path);
    await deleteObject(storageRef);
    console.log('✅ Image deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    throw error;
  }
};