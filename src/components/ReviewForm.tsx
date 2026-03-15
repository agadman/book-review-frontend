import { useState } from "react";

interface ReviewFormProps {
    bookId: string;
}

const ReviewForm = ({bookId}: ReviewFormProps) => {
    const [text, setText] = useState("");
    const [rating, setRating] = useState(1);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRating(Number(event.target.value));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log({
            bookId,
            text,
            rating,
        });

        setText("");
        setRating(1);
    };

  return (
    <form onSubmit={handleSubmit}>
        <h2>Skriv en recension</h2>
        <label>
            recension:
            <textarea value={text} onChange={handleTextChange} />
        </label>
        <label>
            Betyg:
            <select value={rating} onChange={handleRatingChange}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
        </label>
        <button type="submit">Skicka recension</button>
    </form>
  )
}

export default ReviewForm