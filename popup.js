document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('savePreferences');
    const continueButton = document.getElementById('continuePreferences');
    const addButton = document.getElementById('addPreference');
    const preferencesInput = document.getElementById('preferences');
    const preferencesList = document.getElementById('preferencesList');

    // Load existing preferences from storage
    chrome.storage.local.get('preferences', function (data) {
        const preferences = data.preferences || [];
        preferencesInput.value = preferences.join(', ');
        displayPreferences(preferences);

        if (preferences.length > 0) {
            continueButton.classList.remove('hidden');
            saveButton.classList.add('hidden');
            addButton.classList.remove('hidden');
        } else {
            continueButton.classList.add('hidden');
            saveButton.classList.remove('hidden');
            addButton.classList.add('hidden');
        }
    });

    // Save preferences to storage
    saveButton.addEventListener('click', function () {
        const preferences = preferencesInput.value.split(',').map(pref => pref.trim()).filter(pref => pref.length > 0);
        chrome.storage.local.set({ preferences: preferences }, function () {
            alert('Preferences saved!');
            displayPreferences(preferences);
            continueButton.classList.remove('hidden');
            saveButton.classList.add('hidden');
            addButton.classList.remove('hidden');
            openRecommendationsTab(preferences);
        });
    });

    // Add new preferences to the list
    addButton.addEventListener('click', function () {
        const preferences = preferencesInput.value.split(',').map(pref => pref.trim()).filter(pref => pref.length > 0);
        preferences.push('');
        preferencesInput.value = preferences.join(', ');
        chrome.storage.local.set({ preferences: preferences });
        displayPreferences(preferences);
    });

    // Continue to recommendations page
    continueButton.addEventListener('click', function () {
        chrome.storage.local.get('preferences', function (data) {
            const preferences = data.preferences || [];
            openRecommendationsTab(preferences);
        });
    });

    // Function to display saved preferences
    function displayPreferences(preferences) {
        preferencesList.innerHTML = '';
        preferences.forEach(function (pref, index) {
            const div = document.createElement('div');
            div.classList.add('preference-item');
            div.innerHTML = `
                <span>${pref}</span>
                <button class="remove-preference" data-index="${index}">Remove</button>
            `;
            preferencesList.appendChild(div);
        });

        document.querySelectorAll('.remove-preference').forEach(function (button) {
            button.addEventListener('click', function (e) {
                const index = e.target.getAttribute('data-index');
                preferences.splice(index, 1);
                chrome.storage.local.set({ preferences: preferences }, function () {
                    displayPreferences(preferences);
                });
            });
        });
    }

    // Open the recommendations page
    function openRecommendationsTab(preferences) {
        chrome.tabs.create({ url: 'recommendations.html' });
    }
});
