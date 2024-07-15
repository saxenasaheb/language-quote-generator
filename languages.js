const languageData = {
    availableLanguages: [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "it", name: "Italian" },
        { code: "ja", name: "Japanese" },
        { code: "ru", name: "Russian" },
        { code: "ar", name: "Arabic" },
        { code: "hi", name: "Hindi" },
        { code: "kn", name: "Kannada" },
        { code: "zh", name: "Mandarin" },
        { code: "bpy", name: "Bishnupriya Manipuri" }
        


    ],
    getLanguageCode: function(languageName) {
        const language = this.availableLanguages.find(lang => lang.name === languageName);
        return language ? language.code : 'en'; // Default to English if not found
    },
    getLanguageName: function(languageCode) {
        const language = this.availableLanguages.find(lang => lang.code === languageCode);
        return language ? language.name : 'English'; // Default to English if not found
    }
};