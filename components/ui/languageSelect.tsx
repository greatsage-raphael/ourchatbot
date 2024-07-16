import type { FC } from 'react';

interface Props {
  language: string;
  onChange: (language: string) => void;
}

export const LanguageSelect: FC<Props> = ({ language, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      value={language}
      onChange={handleChange}
    >
      {languages
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
    </select>
  );
};

const languages = [
    { label: "Afrikaans (South Africa)", value: "af-ZA" },
    { label: "Arabic", value: "ar-XA" },
    { label: "Basque (Spain)", value: "eu-ES" },
    { label: "Bengali (India)", value: "bn-IN" },
    { label: "Bulgarian (Bulgaria)", value: "bg-BG" },
    { label: "Catalan (Spain)", value: "ca-ES" },
    { label: "Chinese (Hong Kong)", value: "yue-HK" },
    { label: "Czech (Czech Republic)", value: "cs-CZ" },
    { label: "Danish (Denmark)", value: "da-DK" },
    { label: "Dutch (Belgium)", value: "nl-BE" },
    { label: "Dutch (Netherlands)", value: "nl-NL" },
    { label: "English (Australia)", value: "en-AU" },
    { label: "English (India)", value: "en-IN" },
    { label: "English (UK)", value: "en-GB" },
    { label: "English (US)", value: "en-US" },
    { label: "Filipino (Philippines)", value: "fil-PH" },
    { label: "Finnish (Finland)", value: "fi-FI" },
    { label: "French (Canada)", value: "fr-CA" },
    { label: "French (France)", value: "fr-FR" },
    { label: "Galician (Spain)", value: "gl-ES" },
    { label: "German (Germany)", value: "de-DE" },
    { label: "Greek (Greece)", value: "el-GR" },
    { label: "Gujarati (India)", value: "gu-IN" },
    { label: "Hebrew (Israel)", value: "he-IL" },
    { label: "Hindi (India)", value: "hi-IN" },
    { label: "Hungarian (Hungary)", value: "hu-HU" },
    { label: "Icelandic (Iceland)", value: "is-IS" },
    { label: "Indonesian (Indonesia)", value: "id-ID" },
    { label: "Italian (Italy)", value: "it-IT" },
  ];