import { db } from "../firebase";
import { onSnapshot } from "firebase/firestore";

export function subscribeToTags(callback) {
    const unsubscribe = onSnapshot(collection(db, "tags"), (snapshot) => {
        const tags = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        callback(tags);
    });

    return unsubscribe;
}

