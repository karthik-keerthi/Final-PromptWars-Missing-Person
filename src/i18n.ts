import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_title": "Delhi Missing Persons Portal",
      "home": "Home",
      "search_identify": "Search / Identify",
      "register_missing": "Register Missing Person",
      "login": "Login",
      "logout": "Logout",
      "recent_reports": "Recent Missing Reports",
      "stats_title": "Key Findings (Early 2026)",
      "stats_1": "54 people reported missing per day in Delhi.",
      "stats_2": "Over 800 people reported missing in the first two weeks of Jan 2026.",
      "stats_3": "77% recovery rate since 2016.",
      "search_title": "Live Identification",
      "search_desc": "Upload a photo or use your camera to identify a missing person.",
      "capture_photo": "Capture Photo",
      "upload_photo": "Upload Photo",
      "analyzing": "Analyzing image...",
      "match_found": "Potential Match Found!",
      "no_match": "No match found in the database. Please register this person.",
      "register_title": "Register a Missing Person",
      "name": "Name",
      "age": "Age",
      "relation": "Relation (S/o, D/o, W/o)",
      "date_missing": "Date Missing From",
      "last_seen": "Last Seen Location",
      "mobile": "Contact Mobile Numbers",
      "languages": "Languages Known",
      "district": "District",
      "police_station": "Police Station Area",
      "case_registered": "Case Registered (FIR No.)",
      "mental_health": "Mental Health Status",
      "image_url": "Person Image Web Link",
      "submit": "Submit Registration",
      "submitting": "Submitting...",
      "success": "Registration successful!",
      "error": "An error occurred. Please try again."
    }
  },
  hi: {
    translation: {
      "app_title": "दिल्ली लापता व्यक्ति पोर्टल",
      "home": "मुख्य पृष्ठ",
      "search_identify": "खोजें / पहचानें",
      "register_missing": "लापता व्यक्ति दर्ज करें",
      "login": "लॉग इन",
      "logout": "लॉग आउट",
      "recent_reports": "हाल की लापता रिपोर्टें",
      "stats_title": "मुख्य निष्कर्ष (प्रारंभिक 2026)",
      "stats_1": "दिल्ली में प्रतिदिन 54 लोग लापता हो रहे हैं।",
      "stats_2": "जनवरी 2026 के पहले दो हफ्तों में 800 से अधिक लोग लापता।",
      "stats_3": "2016 से 77% रिकवरी दर।",
      "search_title": "लाइव पहचान",
      "search_desc": "लापता व्यक्ति की पहचान करने के लिए फोटो अपलोड करें या कैमरे का उपयोग करें।",
      "capture_photo": "फोटो खींचें",
      "upload_photo": "फोटो अपलोड करें",
      "analyzing": "छवि का विश्लेषण हो रहा है...",
      "match_found": "संभावित मिलान मिला!",
      "no_match": "डेटाबेस में कोई मिलान नहीं मिला। कृपया इस व्यक्ति को पंजीकृत करें।",
      "register_title": "लापता व्यक्ति को पंजीकृत करें",
      "name": "नाम",
      "age": "आयु",
      "relation": "संबंध (पुत्र/पुत्री/पत्नी)",
      "date_missing": "लापता होने की तिथि",
      "last_seen": "अंतिम बार देखा गया स्थान",
      "mobile": "संपर्क मोबाइल नंबर",
      "languages": "ज्ञात भाषाएँ",
      "district": "ज़िला",
      "police_station": "पुलिस स्टेशन क्षेत्र",
      "case_registered": "दर्ज मामला (FIR नंबर)",
      "mental_health": "मानसिक स्वास्थ्य स्थिति",
      "image_url": "व्यक्ति की छवि का वेब लिंक",
      "submit": "पंजीकरण जमा करें",
      "submitting": "जमा हो रहा है...",
      "success": "पंजीकरण सफल रहा!",
      "error": "एक त्रुटि हुई। कृपया पुनः प्रयास करें।"
    }
  },
  te: {
    translation: {
      "app_title": "ఢిల్లీ తప్పిపోయిన వ్యక్తుల పోర్టల్",
      "home": "హోమ్",
      "search_identify": "శోధించండి / గుర్తించండి",
      "register_missing": "తప్పిపోయిన వ్యక్తిని నమోదు చేయండి",
      "login": "లాగిన్",
      "logout": "లాగౌట్",
      "recent_reports": "ఇటీవలి తప్పిపోయిన నివేదికలు",
      "stats_title": "ముఖ్య అన్వేషణలు (2026 ప్రారంభంలో)",
      "stats_1": "ఢిల్లీలో రోజుకు 54 మంది తప్పిపోతున్నారు.",
      "stats_2": "జనవరి 2026 మొదటి రెండు వారాల్లో 800 మందికి పైగా తప్పిపోయారు.",
      "stats_3": "2016 నుండి 77% రికవరీ రేటు.",
      "search_title": "ప్రత్యక్ష గుర్తింపు",
      "search_desc": "తప్పిపోయిన వ్యక్తిని గుర్తించడానికి ఫోటోను అప్‌లోడ్ చేయండి లేదా మీ కెమెరాను ఉపయోగించండి.",
      "capture_photo": "ఫోటో తీయండి",
      "upload_photo": "ఫోటో అప్‌లోడ్ చేయండి",
      "analyzing": "చిత్రాన్ని విశ్లేషిస్తోంది...",
      "match_found": "సంభావ్య సరిపోలిక కనుగొనబడింది!",
      "no_match": "డేటాబేస్‌లో సరిపోలిక కనుగొనబడలేదు. దయచేసి ఈ వ్యక్తిని నమోదు చేయండి.",
      "register_title": "తప్పిపోయిన వ్యక్తిని నమోదు చేయండి",
      "name": "పేరు",
      "age": "వయస్సు",
      "relation": "సంబంధం (కుమారుడు/కుమార్తె/భార్య)",
      "date_missing": "తప్పిపోయిన తేదీ",
      "last_seen": "చివరిగా చూసిన ప్రదేశం",
      "mobile": "సంప్రదింపు మొబైల్ నంబర్లు",
      "languages": "తెలిసిన భాషలు",
      "district": "జిల్లా",
      "police_station": "పోలీస్ స్టేషన్ ప్రాంతం",
      "case_registered": "నమోదైన కేసు (FIR నంబర్)",
      "mental_health": "మానసిక ఆరోగ్య స్థితి",
      "image_url": "వ్యక్తి చిత్రం వెబ్ లింక్",
      "submit": "నమోదు సమర్పించండి",
      "submitting": "సమర్పిస్తోంది...",
      "success": "నమోదు విజయవంతమైంది!",
      "error": "ఒక లోపం ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
