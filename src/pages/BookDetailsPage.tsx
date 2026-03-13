import { useParams } from "react-router-dom";

const BookDetailsPage = () => {
  const { id } = useParams(); // Detta är id från URL

  return (
    <div>
      <h1>Book Details</h1>
      <p>Bokens ID: {id}</p>
    </div>
  );
};

export default BookDetailsPage;