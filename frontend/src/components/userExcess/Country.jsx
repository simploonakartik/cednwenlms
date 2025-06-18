import { useState, useRef, useEffect } from "react";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. Swaziland)",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
export default function CountrySelect() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [country, setCountry] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      setCountry(""); // Reset the selected country when typing

      const filtered = countries.filter((country) =>
          country.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);
      setDropdownOpen(true); // Open dropdown when searching
  };

  const handleSelect = (selectedCountry) => {
      setCountry(selectedCountry);
      setSearchTerm(selectedCountry); // Display the selected country
      setDropdownOpen(false); // Close the dropdown
      setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
      if (!dropdownOpen) return;

      if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedIndex((prevIndex) =>
              prevIndex < filteredCountries.length - 1 ? prevIndex + 1 : 0
          );
      } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedIndex((prevIndex) =>
              prevIndex > 0 ? prevIndex - 1 : filteredCountries.length - 1
          );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
          e.preventDefault();
          handleSelect(filteredCountries[highlightedIndex]);
      }
  };

  const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
      }
  };

  useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

  return (
      <div ref={dropdownRef}>
          <label className="font-medium">Country</label>
          <div className="relative">
              <input
                  type="text"
                  className="border px-3 py-1.5 mt-1 w-full rounded-md border-[#aaaaaa] focus:outline-none focus:ring-1 focus:ring-[#E84000]"
                  placeholder="Search or select a country"
                  value={searchTerm} // Display the current search term or selected country
                  onChange={handleSearch}
                  onFocus={() => setDropdownOpen(true)} // Open dropdown on focus
                  onKeyDown={handleKeyDown} // Handle keyboard navigation
              />
              {dropdownOpen && filteredCountries.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto">
                      {filteredCountries.map((country, index) => (
                          <div
                              key={index}
                              className={`px-3 py-2 cursor-pointer ${
                                  highlightedIndex === index
                                      ? "bg-[#E84000] text-white"
                                      : "hover:bg-[#f5f5f5]"
                              }`}
                              onClick={() => handleSelect(country)}
                          >
                              {country}
                          </div>
                      ))}
                  </div>
              )}
              {dropdownOpen && filteredCountries.length === 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                      <div className="px-3 py-2 text-gray-500">No countries found</div>
                  </div>
              )}
          </div>
      </div>
  );
}