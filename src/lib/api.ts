import { db } from "@/lib/firebase";
import { runTransaction, doc, collection, serverTimestamp } from "firebase/firestore";

/**
 * Submits a form response with a guaranteed unique, auto-incrementing ID.
 * The ID will be in the format "REQ-{number}" (e.g., REQ-1001).
 * 
 * @param formId - The ID of the form being submitted
 * @param formTitle - The title of the form
 * @param user - The user object (must contain uid and email)
 * @param answers - The map of answers associated with the form questions
 * @returns boolean - Returns true if the transaction completes successfully
 * @throws Error - Throws an error if the transaction fails
 */
export async function submitFormResponse(formId: string, formTitle: string, user: any, answers: any) {
    let requestId = "";
    try {
        await runTransaction(db, async (transaction) => {
            // 1. Reference the counter document
            const counterRef = doc(db, "counters", "responses");
            const counterDoc = await transaction.get(counterRef);

            let newCount = 1000; // Default start value

            if (counterDoc.exists()) {
                const data = counterDoc.data();
                newCount = (data.currentCount || 1000) + 1;
                transaction.update(counterRef, { currentCount: newCount });
            } else {
                // Initialize the counter if it doesn't exist
                transaction.set(counterRef, { currentCount: newCount });
            }

            // 2. Format the Request ID
            requestId = `REQ-${newCount}`;

            // 3. Create the new response document
            const newResponseRef = doc(collection(db, "responses"));
            transaction.set(newResponseRef, {
                requestId, // Store the custom ID
                formId,
                formTitle,
                userId: user.uid,
                submittedBy: user.email,
                answers,
                status: "Processing",
                createdAt: serverTimestamp(),
            });
        });
        return requestId;
    } catch (error) {
        console.error("Transaction failed: ", error);
        throw error;
    }
}
