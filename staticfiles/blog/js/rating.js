document.addEventListener('DOMContentLoaded', function() {
    const ratingForm = document.querySelector('.rating');
    if (!ratingForm) return;

    const averageRatingSpan = document.querySelector('.average-rating');
    const ratingStars = document.querySelectorAll('.rating label');
    const ratingCount = document.querySelector('.rating-count');

    // Highlight stars on hover
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = this.previousElementSibling.value;
            highlightStars(rating);
        });

        star.addEventListener('mouseout', function() {
            const checkedInput = ratingForm.querySelector('input:checked');
            const rating = checkedInput ? checkedInput.value : 0;
            highlightStars(rating);
        });
    });

    // Handle rating submission
    ratingForm.addEventListener('change', function(e) {
        if (e.target.name === 'rating') {
            const blogId = this.dataset.blogId;
            const rating = e.target.value;
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            // Show loading state
            ratingStars.forEach(star => star.style.pointerEvents = 'none');

            fetch(`/blog/${blogId}/rate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken
                },
                body: `rating=${rating}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update average rating display
                    averageRatingSpan.textContent = data.average;
                    
                    // Update rating count if available
                    if (data.count && ratingCount) {
                        ratingCount.textContent = `(${data.count} ratings)`;
                    }

                    // Show success feedback
                    showFeedback('Rating submitted successfully!', 'success');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showFeedback('Failed to submit rating. Please try again.', 'error');
            })
            .finally(() => {
                // Re-enable stars
                ratingStars.forEach(star => star.style.pointerEvents = '');
            });
        }
    });

    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const starValue = star.previousElementSibling.value;
            star.style.color = starValue <= rating ? '#ffd700' : '#ddd';
        });
    }

    function showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `rating-feedback ${type}`;
        feedback.textContent = message;
        ratingForm.parentNode.insertBefore(feedback, ratingForm.nextSibling);

        setTimeout(() => feedback.remove(), 3000);
    }
});
