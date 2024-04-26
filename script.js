document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchInput = document.querySelector('input[type="search"]');
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        const searchUrl = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
        window.location.href = searchUrl;
      }
    });
  });
  