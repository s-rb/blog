document.querySelector('.timeline-toggle-button').addEventListener('click', function () {
    const items = document.querySelectorAll('.not-relevant');
    const sumItems = document.querySelectorAll('.not-relevant-sum');

    // Check if not-relevant items are currently visible
    const areNotRelevantVisible = Array.from(items).some(item => item.style.display === 'flex');

    // Toggle visibility based on current state
    if (areNotRelevantVisible) {
        // Hide not-relevant items and show not-relevant-sum items
        items.forEach(item => {
            item.style.display = 'none';
        });
        sumItems.forEach(item => {
            item.style.display = 'flex';
        });
        this.textContent = 'SHOW DETAILS';
    } else {
        // Show not-relevant items and hide not-relevant-sum items
        items.forEach(item => {
            item.style.display = 'flex';
        });
        sumItems.forEach(item => {
            item.style.display = 'none';
        });
        this.textContent = 'HIDE DETAILS';
    }
});