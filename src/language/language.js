import {Strings as Strings_de_DE} from "./language_de_DE";
import {Strings as Strings_en_EN} from "./language_en_EN";
import {Strings as Strings_fr_FR} from "./language_fr_FR";

/**
 * @enum
 * Enumeration of languages of the application.
 */
export const Language = {
    /** Case for the english language. */
    English: 'en_EN',
    /** Case for the german language. */
    German: 'de_DE',
    /** Case for the french language. */
    French: 'fr_FR'
};

// set default language
Language.language = Language.English;
Language.strings = Strings_en_EN;

/**
 * Sets the language of the application to the given one.
 * @param language The language to set.
 */
Language.setLanguage = function (language) {
    switch (language) {
        case Language.English:
            Language.strings = Strings_en_EN;
            break;
        case Language.German:
            Language.strings = Strings_de_DE;
            break;
        case Language.French:
            Language.strings = Strings_fr_FR;
            break;
        default:
            break;
    }
    Language.language = language;
};

/**
 * Returns the translated version of the given string.
 * @param string The string to be translated.
 */
Language.translate = function (string) {
    if (Language.language === Language.English) {
        return Language.strings[string] || string;
    } else {
        return Language.strings[string] || ('='.repeat(string.length));
    }
};
