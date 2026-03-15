
const ReviewForm = () => {
  return (
    <form>
        <h2>Skriv en recension</h2>
        <label>
            recension:
            <textarea />
        </label>
        <label>
            Betyg:
            <select>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
        </label>
    </form>
  )
}

export default ReviewForm