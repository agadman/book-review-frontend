import { useState } from "react";
import type { CreateReviewData, Review } from "../types/review";
import { createReview } from "../services/reviewService";
import { useAuthStore } from "../store/authStore";
import "./ReviewForm.css";

interface ReviewFormProps {
    bookId: string;
    onReviewCreated?: (review: Review) => void;
}

const ReviewForm = ({ bookId, onReviewCreated }: ReviewFormProps) => {
    const [text, setText] = useState("");
    const [rating, setRating] = useState(1);

    const token = useAuthStore((state) => state.token);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRating(Number(event.target.value));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!token) return;

        const review: CreateReviewData = {
            bookId,
            text,
            rating
        };

        try {
            // skapar recensionen via API
            const createdReview = await createReview(review, token);

            setText("");
            setRating(1);

            // Här anropar callback för o uppdatera listan i parent componenten (BookDetailsPage)
            if (onReviewCreated) {
                onReviewCreated(createdReview);
            }

        } catch (error) {
            console.error("Det gick inte att lämna en recension nu. Försök igen senare.", error);
        }
        };

  return (
    <form onSubmit={handleSubmit} className="review-form">
        <h2>Skriv en recension</h2>
        <label>
            Recension
            <textarea value={text} onChange={handleTextChange} placeholder="Vad tyckte du om boken?" />
        </label>
        <label>
            Betyg:
            <select value={rating} onChange={handleRatingChange}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
            </select>
        </label>
        <button type="submit">Skicka recension</button>
    </form>
  )
}

export default ReviewForm