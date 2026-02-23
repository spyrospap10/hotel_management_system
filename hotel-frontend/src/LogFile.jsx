function LogFile() {

    {/* Το Dropdown του Φίλτρου */}
    <div className="filter-container">
        <span className="filter-label">Προβολή:</span>
        <select
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
        >
            <option value="ALL">Όλα τα δωμάτια</option>
            <option value="AVAILABLE">Διαθέσιμα</option>
            <option value="NOT_AVAILABLE">Μη Διαθέσιμα</option>
            <option value="CLEANING">Σε καθαρισμό</option>
            <option value="seaView">Με θέα στην θάλασσα</option>
        </select>
    </div>
}