import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp, onSnapshot, deleteDoc } from "firebase/firestore";

export function subscribeToRecipes(callback) {
    const unsubscribe = onSnapshot(collection(db, "recipes"), (snapshot) => {
        const recipes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        callback(recipes);
    });

    return unsubscribe;
}

export async function addRecipe(recipe) {
    const docRef = await addDoc(collection(db, "recipes"), {
        title: recipe.title,
        tags: recipe.tags || [],
        //ingredients: recipe.ingredients || [],
        //instructions: recipe.instructions || "",
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}

export async function deleteRecipe(id) {
    await deleteDoc(doc(db, "recipes", id));
}

export async function editRecipe(id, newTitle, newTags) {
    const docRef = doc(db, "recipes", id);
    await updateDoc(docRef, {
        title: newTitle,
        tags: newTags
    });
}
