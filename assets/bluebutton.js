(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else {
        root['BlueButton'] = factory();
    }
}(this, function() {

/* BlueButton.js -- 0.4.2 */

/*
 * ...
 */

/* exported Core */
var Core = (function () {
  
  /*
   * ...
   */
  var parseData = function (source) {
    source = stripWhitespace(source);
    
    if (source.charAt(0) === '<') {
      try {
        return Core.XML.parse(source);
      } catch (e) {
        if (console.log) {
          console.log("File looked like it might be XML but couldn't be parsed.");
        }
      }
    }

    try {
      return JSON.parse(source);
    } catch (e) {
      if (console.error) {
        console.error("Error: Cannot parse this file. BB.js only accepts valid XML " +
          "(for parsing) or JSON (for generation). If you are attempting to provide " +
          "XML or JSON, please run your data through a validator to see if it is malformed.\n");
      }
      throw e;
    }
  };
  
  
  /*
   * Removes leading and trailing whitespace from a string
   */
  var stripWhitespace = function (str) {
    if (!str) { return str; }
    return str.replace(/^\s+|\s+$/g,'');
  };
  
  
  /*
   * A wrapper around JSON.stringify which allows us to produce customized JSON.
   *
   * See https://developer.mozilla.org/en-US/docs/Web/
   *        JavaScript/Guide/Using_native_JSON#The_replacer_parameter
   * for documentation on the replacerFn.
   */
  var json = function () {

    var datePad = function(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    };
    
    var replacerFn = function(key, value) {
      /* By default, Dates are output as ISO Strings like "2014-01-03T08:00:00.000Z." This is
       * tricky when all we have is a date (not a datetime); JS sadly ignores that distinction.
       *
       * To paper over this JS wart, we use two different JSON formats for dates and datetimes.
       * This is a little ugly but makes sure that the dates/datetimes mostly just parse
       * correclty for clients:
       *
       * 1. Datetimes are rendered as standard ISO strings, without the misleading millisecond
       *    precision (misleading because we don't have it): YYYY-MM-DDTHH:mm:ssZ
       * 2. Dates are rendered as MM/DD/YYYY. This ensures they are parsed as midnight local-time,
       *    no matter what local time is, and therefore ensures the date is always correct.
       *    Outputting "YYYY-MM-DD" would lead most browsers/node to assume midnight UTC, which
       *    means "2014-04-27" suddenly turns into "04/26/2014 at 5PM" or just "04/26/2014"
       *    if you format it as a date...
       *
       * See http://stackoverflow.com/questions/2587345/javascript-date-parse and
       *     http://blog.dygraphs.com/2012/03/javascript-and-dates-what-mess.html
       * for more on this issue.
       */
      var originalValue = this[key]; // a Date

      if ( value && (originalValue instanceof Date) && !isNaN(originalValue.getTime()) ) {

        // If while parsing we indicated that there was time-data specified, or if we see
        // non-zero values in the hour/minutes/seconds/millis fields, output a datetime.
        if (originalValue._parsedWithTimeData ||
            originalValue.getHours() || originalValue.getMinutes() ||
            originalValue.getSeconds() || originalValue.getMilliseconds()) {

          // Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/
          //    Reference/Global_Objects/Date/toISOString
          return originalValue.getUTCFullYear() +
            '-' + datePad( originalValue.getUTCMonth() + 1 ) +
            '-' + datePad( originalValue.getUTCDate() ) +
            'T' + datePad( originalValue.getUTCHours() ) +
            ':' + datePad( originalValue.getUTCMinutes() ) +
            ':' + datePad( originalValue.getUTCSeconds() ) +
            'Z';
        }
        
        // We just have a pure date
        return datePad( originalValue.getMonth() + 1 ) +
          '/' + datePad( originalValue.getDate() ) +
          '/' + originalValue.getFullYear();

      }

      return value;
    };
    
    return JSON.stringify(this, replacerFn, 2);
  };
  
  
  /*
   * Removes all `null` properties from an object.
   */
  var trim = function (o) {
    var y;
    for (var x in o) {
      if (o.hasOwnProperty(x)) {
        y = o[x];
        // if (y === null || (y instanceof Object && Object.keys(y).length == 0)) {
        if (y === null) {
          delete o[x];
        }
        if (y instanceof Object) y = trim(y);
      }
    }
    return o;
  };
  
  
  return {
    parseData: parseData,
    stripWhitespace: stripWhitespace,
    json: json,
    trim: trim
  };
  
})();
;

/*
 * ...
 */

Core.Codes = (function () {
  
  /*
   * Administrative Gender (HL7 V3)
   * http://phinvads.cdc.gov/vads/ViewValueSet.action?id=8DE75E17-176B-DE11-9B52-0015173D1785
   * OID: 2.16.840.1.113883.1.11.1
   */
  var GENDER_MAP = {
    'F': 'female',
    'M': 'male',
    'UN': 'undifferentiated'
  };
  
  /*
   * Marital Status (HL7)
   * http://phinvads.cdc.gov/vads/ViewValueSet.action?id=46D34BBC-617F-DD11-B38D-00188B398520
   * OID: 2.16.840.1.114222.4.11.809
   */
  var MARITAL_STATUS_MAP = {
    'N': 'annulled',
    'C': 'common law',
    'D': 'divorced',
    'P': 'domestic partner',
    'I': 'interlocutory',
    'E': 'legally separated',
    'G': 'living together',
    'M': 'married',
    'O': 'other',
    'R': 'registered domestic partner',
    'A': 'separated',
    'S': 'single',
    'U': 'unknown',
    'B': 'unmarried',
    'T': 'unreported',
    'W': 'widowed'
  };

  /*
   * Religious Affiliation (HL7 V3)
   * https://phinvads.cdc.gov/vads/ViewValueSet.action?id=6BFDBFB5-A277-DE11-9B52-0015173D1785
   * OID: 2.16.840.1.113883.5.1076
   */
  var RELIGION_MAP = {
    "1001": "adventist",
    "1002": "african religions",
    "1003": "afro-caribbean religions",
    "1004": "agnosticism",
    "1005": "anglican",
    "1006": "animism",
    "1061": "assembly of god",
    "1007": "atheism",
    "1008": "babi & baha'i faiths",
    "1009": "baptist",
    "1010": "bon",
    "1062": "brethren",
    "1011": "cao dai",
    "1012": "celticism",
    "1013": "christian (non-catholic, non-specific)",
    "1063": "christian scientist",
    "1064": "church of christ",
    "1065": "church of god",
    "1014": "confucianism",
    "1066": "congregational",
    "1015": "cyberculture religions",
    "1067": "disciples of christ",
    "1016": "divination",
    "1068": "eastern orthodox",
    "1069": "episcopalian",
    "1070": "evangelical covenant",
    "1017": "fourth way",
    "1018": "free daism",
    "1071": "friends",
    "1072": "full gospel",
    "1019": "gnosis",
    "1020": "hinduism",
    "1021": "humanism",
    "1022": "independent",
    "1023": "islam",
    "1024": "jainism",
    "1025": "jehovah's witnesses",
    "1026": "judaism",
    "1027": "latter day saints",
    "1028": "lutheran",
    "1029": "mahayana",
    "1030": "meditation",
    "1031": "messianic judaism",
    "1073": "methodist",
    "1032": "mitraism",
    "1074": "native american",
    "1075": "nazarene",
    "1033": "new age",
    "1034": "non-roman catholic",
    "1035": "occult",
    "1036": "orthodox",
    "1037": "paganism",
    "1038": "pentecostal",
    "1076": "presbyterian",
    "1039": "process, the",
    "1077": "protestant",
    "1078": "protestant, no denomination",
    "1079": "reformed",
    "1040": "reformed/presbyterian",
    "1041": "roman catholic church",
    "1080": "salvation army",
    "1042": "satanism",
    "1043": "scientology",
    "1044": "shamanism",
    "1045": "shiite (islam)",
    "1046": "shinto",
    "1047": "sikism",
    "1048": "spiritualism",
    "1049": "sunni (islam)",
    "1050": "taoism",
    "1051": "theravada",
    "1081": "unitarian universalist",
    "1052": "unitarian-universalism",
    "1082": "united church of christ",
    "1053": "universal life church",
    "1054": "vajrayana (tibetan)",
    "1055": "veda",
    "1056": "voodoo",
    "1057": "wicca",
    "1058": "yaohushua",
    "1059": "zen buddhism",
    "1060": "zoroastrianism"
  };

  /*
   * Race & Ethnicity (HL7 V3)
   * Full list at http://phinvads.cdc.gov/vads/ViewCodeSystem.action?id=2.16.840.1.113883.6.238
   * OID: 2.16.840.1.113883.6.238
   *
   * Abbreviated list closer to real usage at: (Race / Ethnicity)
   * https://phinvads.cdc.gov/vads/ViewValueSet.action?id=67D34BBC-617F-DD11-B38D-00188B398520
   * https://phinvads.cdc.gov/vads/ViewValueSet.action?id=35D34BBC-617F-DD11-B38D-00188B398520
   */
  var RACE_ETHNICITY_MAP = {
    '2028-9': 'asian',
    '2054-5': 'black or african american',
    '2135-2': 'hispanic or latino',
    '2076-8': 'native',
    '2186-5': 'not hispanic or latino',
    '2131-1': 'other',
    '2106-3': 'white'
  };

  /*
   * Role (HL7 V3)
   * https://phinvads.cdc.gov/vads/ViewCodeSystem.action?id=2.16.840.1.113883.5.111
   * OID: 2.16.840.1.113883.5.111
   */
  var ROLE_MAP = {
    "ACC": "accident site",
    "ACHFID":  "accreditation location identifier",
    "ACTMIL":  "active duty military",
    "ALL": "allergy clinic",
    "AMB": "ambulance",
    "AMPUT":   "amputee clinic",
    "ANTIBIOT":    "antibiotic",
    "ASSIST":  "assistive non-person living subject",
    "AUNT":    "aunt",
    "B":   "blind",
    "BF":  "beef",
    "BILL":    "billing contact",
    "BIOTH":   "biotherapeutic non-person living subject",
    "BL":  "broiler",
    "BMTC":    "bone marrow transplant clinic",
    "BMTU":    "bone marrow transplant unit",
    "BR":  "breeder",
    "BREAST":  "breast clinic",
    "BRO": "brother",
    "BROINLAW":    "brother-in-law",
    "C":   "calibrator",
    "CANC": "child and adolescent neurology clinic",
    "CAPC": "child and adolescent psychiatry clinic",
    "CARD": "ambulatory health care facilities; clinic/center; rehabilitation: cardiac facilities",
    "CAS": "asylum seeker",
    "CASM":    "single minor asylum seeker",
    "CATH":    "cardiac catheterization lab",
    "CCO": "clinical companion",
    "CCU": "coronary care unit",
    "CHEST":   "chest unit",
    "CHILD":   "child",
    "CHLDADOPT":   "adopted child",
    "CHLDFOST":    "foster child",
    "CHLDINLAW":   "child in-law",
    "CHR": "chronic care facility",
    "CLAIM":   "claimant",
    "CN":  "national",
    "CNRP":    "non-country member without residence permit",
    "CNRPM":   "non-country member minor without residence permit",
    "CO":  "companion",
    "COAG":    "coagulation clinic",
    "COCBEN":  "continuity of coverage beneficiary",
    "COMM":    "community location",
    "COMMUNITYLABORATORY": "community laboratory",
    "COUSN":   "cousin",
    "CPCA":    "permit card applicant",
    "CRIMEVIC":    "crime victim",
    "CRP": "non-country member with residence permit",
    "CRPM":    "non-country member minor with residence permit",
    "CRS": "colon and rectal surgery clinic",
    "CSC": "community service center",
    "CVDX":    "cardiovascular diagnostics or therapeutics unit",
    "DA":  "dairy",
    "DADDR":   "delivery address",
    "DAU": "natural daughter",
    "DAUADOPT":    "adopted daughter",
    "DAUC":    "daughter",
    "DAUFOST": "foster daughter",
    "DAUINLAW":    "daughter in-law",
    "DC":  "therapeutic class",
    "DEBR":    "debridement",
    "DERM":    "dermatology clinic",
    "DIFFABL": "differently abled",
    "DOMPART": "domestic partner",
    "DPOWATT": "durable power of attorney",
    "DR":  "draft",
    "DU":  "dual",
    "DX":  "diagnostics or therapeutics unit",
    "E":   "electronic qc",
    "ECHO":    "echocardiography lab",
    "ECON":    "emergency contact",
    "ENDO":    "endocrinology clinic",
    "ENDOS":   "endoscopy lab",
    "ENROLBKR":    "enrollment broker",
    "ENT": "otorhinolaryngology clinic",
    "EPIL":    "epilepsy unit",
    "ER":  "emergency room",
    "ERL": "enrollment",
    "ETU": "emergency trauma unit",
    "EXCEST":  "executor of estate",
    "EXT": "extended family member",
    "F":   "filler proficiency",
    "FAMDEP":  "family dependent",
    "FAMMEMB": "family member",
    "FI":  "fiber",
    "FMC": "family medicine clinic",
    "FRND":    "unrelated friend",
    "FSTUD":   "full-time student",
    "FTH": "father",
    "FTHINLAW":    "father-in-law",
    "FULLINS": "fully insured coverage sponsor",
    "G":   "group",
    "GACH":    "hospitals; general acute care hospital",
    "GD":  "generic drug",
    "GDF": "generic drug form",
    "GDS": "generic drug strength",
    "GDSF":    "generic drug strength form",
    "GGRFTH":  "great grandfather",
    "GGRMTH":  "great grandmother",
    "GGRPRN":  "great grandparent",
    "GI":  "gastroenterology clinic",
    "GIDX":    "gastroenterology diagnostics or therapeutics lab",
    "GIM": "general internal medicine clinic",
    "GRFTH":   "grandfather",
    "GRMTH":   "grandmother",
    "GRNDCHILD":   "grandchild",
    "GRNDDAU": "granddaughter",
    "GRNDSON": "grandson",
    "GRPRN":   "grandparent",
    "GT":  "guarantor",
    "GUADLTM": "guardian ad lidem",
    "GUARD":   "guardian",
    "GYN": "gynecology clinic",
    "HAND":    "hand clinic",
    "HANDIC":  "handicapped dependent",
    "HBRO":    "half-brother",
    "HD":  "hemodialysis unit",
    "HEM": "hematology clinic",
    "HLAB":    "hospital laboratory",
    "HOMEHEALTH":  "home health",
    "HOSP":    "hospital",
    "HPOWATT": "healthcare power of attorney",
    "HRAD":    "radiology unit",
    "HSIB":    "half-sibling",
    "HSIS":    "half-sister",
    "HTN": "hypertension clinic",
    "HU":  "hospital unit",
    "HUSB":    "husband",
    "HUSCS":   "specimen collection site",
    "ICU": "intensive care unit",
    "IEC": "impairment evaluation center",
    "INDIG":   "member of an indigenous people",
    "INFD":    "infectious disease clinic",
    "INJ": "injured plaintiff",
    "INJWKR":  "injured worker",
    "INLAB":   "inpatient laboratory",
    "INPHARM": "inpatient pharmacy",
    "INV": "infertility clinic",
    "JURID":   "jurisdiction location identifier",
    "L":   "pool",
    "LABORATORY":  "laboratory",
    "LOCHFID": "local location identifier",
    "LY":  "layer",
    "LYMPH":   "lympedema clinic",
    "MAUNT":   "maternalaunt",
    "MBL": "medical laboratory",
    "MCOUSN":  "maternalcousin",
    "MGDSF":   "manufactured drug strength form",
    "MGEN":    "medical genetics clinic",
    "MGGRFTH": "maternalgreatgrandfather",
    "MGGRMTH": "maternalgreatgrandmother",
    "MGGRPRN": "maternalgreatgrandparent",
    "MGRFTH":  "maternalgrandfather",
    "MGRMTH":  "maternalgrandmother",
    "MGRPRN":  "maternalgrandparent",
    "MHSP":    "military hospital",
    "MIL": "military",
    "MOBL":    "mobile unit",
    "MT":  "meat",
    "MTH": "mother",
    "MTHINLAW":    "mother-in-law",
    "MU":  "multiplier",
    "MUNCLE":  "maternaluncle",
    "NBOR":    "neighbor",
    "NBRO":    "natural brother",
    "NCCF":    "nursing or custodial care facility",
    "NCCS":    "neurology critical care and stroke unit",
    "NCHILD":  "natural child",
    "NEPH":    "nephrology clinic",
    "NEPHEW":  "nephew",
    "NEUR":    "neurology clinic",
    "NFTH":    "natural father",
    "NFTHF":   "natural father of fetus",
    "NIECE":   "niece",
    "NIENEPH": "niece/nephew",
    "NMTH":    "natural mother",
    "NOK": "next of kin",
    "NPRN":    "natural parent",
    "NS":  "neurosurgery unit",
    "NSIB":    "natural sibling",
    "NSIS":    "natural sister",
    "O":   "operator proficiency",
    "OB":  "obstetrics clinic",
    "OF":  "outpatient facility",
    "OMS": "oral and maxillofacial surgery clinic",
    "ONCL":    "medical oncology clinic",
    "OPH": "opthalmology clinic",
    "OPTC":    "optometry clinic",
    "ORG": "organizational contact",
    "ORTHO":   "orthopedics clinic",
    "OUTLAB":  "outpatient laboratory",
    "OUTPHARM":    "outpatient pharmacy",
    "P":   "patient",
    "PAINCL":  "pain clinic",
    "PATHOLOGIST": "pathologist",
    "PAUNT":   "paternalaunt",
    "PAYOR":   "payor contact",
    "PC":  "primary care clinic",
    "PCOUSN":  "paternalcousin",
    "PEDC":    "pediatrics clinic",
    "PEDCARD": "pediatric cardiology clinic",
    "PEDE":    "pediatric endocrinology clinic",
    "PEDGI":   "pediatric gastroenterology clinic",
    "PEDHEM":  "pediatric hematology clinic",
    "PEDHO":   "pediatric oncology clinic",
    "PEDICU":  "pediatric intensive care unit",
    "PEDID":   "pediatric infectious disease clinic",
    "PEDNEPH": "pediatric nephrology clinic",
    "PEDNICU": "pediatric neonatal intensive care unit",
    "PEDRHEUM":    "pediatric rheumatology clinic",
    "PEDU":    "pediatric unit",
    "PGGRFTH": "paternalgreatgrandfather",
    "PGGRMTH": "paternalgreatgrandmother",
    "PGGRPRN": "paternalgreatgrandparent",
    "PGRFTH":  "paternalgrandfather",
    "PGRMTH":  "paternalgrandmother",
    "PGRPRN":  "paternalgrandparent",
    "PH":  "policy holder",
    "PHARM":   "pharmacy",
    "PHLEBOTOMIST":    "phlebotomist",
    "PHU": "psychiatric hospital unit",
    "PL":  "pleasure",
    "PLS": "plastic surgery clinic",
    "POD": "podiatry clinic",
    "POWATT":  "power of attorney",
    "PRC": "pain rehabilitation center",
    "PREV":    "preventive medicine clinic",
    "PRN": "parent",
    "PRNINLAW":    "parent in-law",
    "PROCTO":  "proctology clinic",
    "PROFF":   "provider's office",
    "PROG":    "program eligible",
    "PROS":    "prosthodontics clinic",
    "PSI": "psychology clinic",
    "PSTUD":   "part-time student",
    "PSY": "psychiatry clinic",
    "PSYCHF":  "psychiatric care facility",
    "PT":  "patient",
    "PTRES":   "patient's residence",
    "PUNCLE":  "paternaluncle",
    "Q":   "quality control",
    "R":   "replicate",
    "RADDX":   "radiology diagnostics or therapeutics unit",
    "RADO":    "radiation oncology unit",
    "RC":  "racing",
    "RESPRSN": "responsible party",
    "RETIREE": "retiree",
    "RETMIL":  "retired military",
    "RH":  "rehabilitation hospital",
    "RHAT":    "addiction treatment center",
    "RHEUM":   "rheumatology clinic",
    "RHII":    "intellectual impairment center",
    "RHMAD":   "parents with adjustment difficulties center",
    "RHPI":    "physical impairment center",
    "RHPIH":   "physical impairment - hearing center",
    "RHPIMS":  "physical impairment - motor skills center",
    "RHPIVS":  "physical impairment - visual skills center",
    "RHU": "rehabilitation hospital unit",
    "RHYAD":   "youths with adjustment difficulties center",
    "RNEU":    "neuroradiology unit",
    "ROOM":    "roommate",
    "RTF": "residential treatment facility",
    "SCHOOL":  "school",
    "SCN": "screening",
    "SEE": "seeing",
    "SELF":    "self",
    "SELFINS": "self insured coverage sponsor",
    "SH":  "show",
    "SIB": "sibling",
    "SIBINLAW":    "sibling in-law",
    "SIGOTHR": "significant other",
    "SIS": "sister",
    "SISINLAW":    "sister-in-law",
    "SLEEP":   "sleep disorders unit",
    "SNF": "skilled nursing facility",
    "SNIFF":   "sniffing",
    "SON": "natural son",
    "SONADOPT":    "adopted son",
    "SONC":    "son",
    "SONFOST": "foster son",
    "SONINLAW":    "son in-law",
    "SPMED":   "sports medicine clinic",
    "SPON":    "sponsored dependent",
    "SPOWATT": "special power of attorney",
    "SPS": "spouse",
    "STPBRO":  "stepbrother",
    "STPCHLD": "step child",
    "STPDAU":  "stepdaughter",
    "STPFTH":  "stepfather",
    "STPMTH":  "stepmother",
    "STPPRN":  "step parent",
    "STPSIB":  "step sibling",
    "STPSIS":  "stepsister",
    "STPSON":  "stepson",
    "STUD":    "student",
    "SU":  "surgery clinic",
    "SUBJECT": "self",
    "SURF":    "substance use rehabilitation facility",
    "THIRDPARTY":  "third party",
    "TPA": "third party administrator",
    "TR":  "transplant clinic",
    "TRAVEL":  "travel and geographic medicine clinic",
    "TRB": "tribal member",
    "UMO": "utilization management organization",
    "UNCLE":   "uncle",
    "UPC": "underage protection center",
    "URO": "urology clinic",
    "V":   "verifying",
    "VET": "veteran",
    "VL":  "veal",
    "WARD":    "ward",
    "WIFE":    "wife",
    "WL":  "wool",
    "WND": "wound clinic",
    "WO":  "working",
    "WORK":    "work site",
  };

  var PROBLEM_STATUS_MAP = {
    "55561003": "active",
    "73425007": "inactive",
    "413322009": "resolved"
  };


  // copied from _.invert to avoid making browser users include all of underscore
  var invertKeys = function(obj) {
    var result = {};
    var keys = Object.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  var lookupFnGenerator = function(map) {
    return function(key) {
      return map[key] || null;
    };
  };
  var reverseLookupFnGenerator = function(map) {
    return function(key) {
      if (!key) { return null; }
      var invertedMap = invertKeys(map);
      key = key.toLowerCase();
      return invertedMap[key] || null;
    };
  };
  
  
  return {
    gender: lookupFnGenerator(GENDER_MAP),
    reverseGender: reverseLookupFnGenerator(GENDER_MAP),
    maritalStatus: lookupFnGenerator(MARITAL_STATUS_MAP),
    reverseMaritalStatus: reverseLookupFnGenerator(MARITAL_STATUS_MAP),
    religion: lookupFnGenerator(RELIGION_MAP),
    reverseReligion: reverseLookupFnGenerator(RELIGION_MAP),
    raceEthnicity: lookupFnGenerator(RACE_ETHNICITY_MAP),
    reverseRaceEthnicity: reverseLookupFnGenerator(RACE_ETHNICITY_MAP),
    role: lookupFnGenerator(ROLE_MAP),
    reverseRole: reverseLookupFnGenerator(ROLE_MAP),
    problemStatus: lookupFnGenerator(PROBLEM_STATUS_MAP),
    reverseProblemStatus: reverseLookupFnGenerator(PROBLEM_STATUS_MAP)
  };
  
})();
;

/*
 * ...
 */

Core.XML = (function () {
  
  /*
   * A function used to wrap DOM elements in an object so methods can be added
   * to the element object. IE8 does not allow methods to be added directly to
   * DOM objects.
   */
  var wrapElement = function (el) {
    function wrapElementHelper(currentEl) {
      return {
        el: currentEl,
        template: template,
        content: content,
        tag: tag,
        immediateChildTag: immediateChildTag,
        elsByTag: elsByTag,
        attr: attr,
        boolAttr: boolAttr,
        val: val,
        isEmpty: isEmpty
      };
    }
    
    // el is an array of elements
    if (el.length) {
      var els = [];
      for (var i = 0; i < el.length; i++) {
        els.push(wrapElementHelper(el[i]));
      }
      return els;
    
    // el is a single element
    } else {
      return wrapElementHelper(el);
    }
  };
  
  
  /*
   * Find element by tag name, then attribute value.
   */
  var tagAttrVal = function (el, tag, attr, value) {
    el = el.getElementsByTagName(tag);
    for (var i = 0; i < el.length; i++) {
      if (el[i].getAttribute(attr) === value) {
        return el[i];
      }
    }
  };
  
  
  /*
   * Search for a template ID, and return its parent element.
   * Example:
   *   <templateId root="2.16.840.1.113883.10.20.22.2.17"/>
   * Can be found using:
   *   el = dom.template('2.16.840.1.113883.10.20.22.2.17');
   */
  var template = function (templateId) {
    var el = tagAttrVal(this.el, 'templateId', 'root', templateId);
    if (!el) {
      return emptyEl();
    } else {
      return wrapElement(el.parentNode);
    }
  };

  /*
   * Search for a content tag by "ID", and return it as an element.
   * These are used in the unstructured versions of each section but
   * referenced from the structured version sometimes.
   * Example:
   *   <content ID="UniqueNameReferencedElsewhere"/>
   * Can be found using:
   *   el = dom.content('UniqueNameReferencedElsewhere');
   *
   * We can't use `getElementById` because `ID` (the standard attribute name
   * in this context) is not the same attribute as `id` in XML, so there are no matches
   */
  var content = function (contentId) {
      var el = tagAttrVal(this.el, 'content', 'ID', contentId);
      if (!el) {
        // check the <td> tag too, which isn't really correct but
        // will inevitably be used sometimes because it looks like very
        // normal HTML to put the data directly in a <td>
        el = tagAttrVal(this.el, 'td', 'ID', contentId);
      }
      if (!el) {
        // Ugh, Epic uses really non-standard locations.
        el = tagAttrVal(this.el, 'caption', 'ID', contentId) ||
             tagAttrVal(this.el, 'paragraph', 'ID', contentId) ||
             tagAttrVal(this.el, 'tr', 'ID', contentId) ||
             tagAttrVal(this.el, 'item', 'ID', contentId);
      }

      if (!el) {
        return emptyEl();
      } else {
        return wrapElement(el);
      }
    };
  
  
  /*
   * Search for the first occurrence of an element by tag name.
   */
  var tag = function (tag) {
    var el = this.el.getElementsByTagName(tag)[0];
    if (!el) {
      return emptyEl();
    } else {
      return wrapElement(el);
    }
  };

  /*
   * Like `tag`, except it will only count a tag that is an immediate child of `this`.
   * This is useful for tags like "text" which A. may not be present for a given location
   * in every document and B. have a very different meaning depending on their positioning
   *
   *   <parent>
   *     <target></target>
   *   </parent>
   * vs.
   *   <parent>
   *     <intermediate>
   *       <target></target>
   *     </intermediate>
   *   </parent>
   * parent.immediateChildTag('target') will have a result in the first case but not in the second.
   */
  var immediateChildTag = function (tag) {
    var els = this.el.getElementsByTagName(tag);
    if (!els) { return null; }
    for (var i = 0; i < els.length; i++) {
      if (els[i].parentNode === this.el) {
        return wrapElement(els[i]);
      }
    }
    return emptyEl();
  };
  
  
  /*
   * Search for all elements by tag name.
   */
  var elsByTag = function (tag) {
    return wrapElement(this.el.getElementsByTagName(tag));
  };


  var unescapeSpecialChars = function(s) {
    if (!s) { return s; }
    return s.replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
  };
  
  
  /*
   * Retrieve the element's attribute value. Example:
   *   value = el.attr('displayName');
   *
   * The browser and jsdom return "null" for empty attributes;
   * xmldom (which we now use because it's faster / can be explicitly
   * told to parse malformed XML as XML anyways), return the empty
   * string instead, so we fix that here.
   */
  var attr = function (attrName) {
    if (!this.el) { return null; }
    var attrVal = this.el.getAttribute(attrName);
    if (attrVal) {
      return unescapeSpecialChars(attrVal);
    }
    return null;
  };

  /*
   * Wrapper for attr() for retrieving boolean attributes;
   * a raw call attr() will return Strings, which can be unexpected,
   * since the string 'false' will by truthy
   */
  var boolAttr = function (attrName) {
    var rawAttr = this.attr(attrName);
    if (rawAttr === 'true' || rawAttr === '1') {
      return true;
    }
    return false;
  };

  
  /*
   * Retrieve the element's value. For example, if the element is:
   *   <city>Madison</city>
   * Use:
   *   value = el.tag('city').val();
   *
   * This function also knows how to retrieve the value of <reference> tags,
   * which can store their content in a <content> tag in a totally different
   * part of the document.
   */
  var val = function () {
    if (!this.el) { return null; }
    if (!this.el.childNodes || !this.el.childNodes.length) { return null; }
    var textContent = this.el.textContent;

    // if there's no text value here and the only thing inside is a
    // <reference> tag, see if there's a linked <content> tag we can
    // get something out of
    if (!Core.stripWhitespace(textContent)) {

      var contentId;
      // "no text value" might mean there's just a reference tag
      if (this.el.childNodes.length === 1 &&
          this.el.childNodes[0].tagName === 'reference') {
        contentId = this.el.childNodes[0].getAttribute('value');

      // or maybe a newlines on top/above the reference tag
      } else if (this.el.childNodes.length === 3 &&
          this.el.childNodes[1].tagName === 'reference') {
        contentId = this.el.childNodes[1].getAttribute('value');

      } else {
        return unescapeSpecialChars(textContent);
      }

      if (contentId && contentId[0] === '#') {
        contentId = contentId.slice(1); // get rid of the '#'
        var docRoot = wrapElement(this.el.ownerDocument);
        var contentTag = docRoot.content(contentId);
        return contentTag.val();
      }
    }

    return unescapeSpecialChars(textContent);
  };
  
  
  /*
   * Creates and returns an empty DOM element with tag name "empty":
   *   <empty></empty>
   */
  var emptyEl = function () {
    var el = doc.createElement('empty');
    return wrapElement(el);
  };
  
  
  /*
   * Determines if the element is empty, i.e.:
   *   <empty></empty>
   * This element is created by function `emptyEL`.
   */
  var isEmpty = function () {
    if (this.el.tagName.toLowerCase() === 'empty') {
      return true;
    } else {
      return false;
    }
  };
  
  
  /*
   * Cross-browser XML parsing supporting IE8+ and Node.js.
   */
  var parse = function (data) {
    // XML data must be a string
    if (!data || typeof data !== "string") {
      console.log("BB Error: XML data is not a string");
      return null;
    }
    
    var xml, parser;
    
    // Node
    if (isNode) {
      parser = new (xmldom.DOMParser)();
      xml = parser.parseFromString(data, "text/xml");
      
    // Browser
    } else {
      
      // Standard parser
      if (window.DOMParser) {
        parser = new DOMParser();
        xml = parser.parseFromString(data, "text/xml");
        
      // IE
      } else {
        try {
          xml = new ActiveXObject("Microsoft.XMLDOM");
          xml.async = "false";
          xml.loadXML(data);
        } catch (e) {
          console.log("BB ActiveX Exception: Could not parse XML");
        }
      }
    }
    
    if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
      console.log("BB Error: Could not parse XML");
      return null;
    }
    
    return wrapElement(xml);
  };
  
  
  // Establish the root object, `window` in the browser, or `global` in Node.
  var root = this,
      xmldom,
      isNode = false,
      doc = root.document; // Will be `undefined` if we're in Node

  // Check if we're in Node. If so, pull in `xmldom` so we can simulate the DOM.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      isNode = true;
      xmldom = require("xmldom");
      doc = new xmldom.DOMImplementation().createDocument();
    }
  }
  
  
  return {
    parse: parse
  };
  
})();
;

/*
 * ...
 */

/* exported Documents */
var Documents = (function () {
  
  /*
   * ...
   */
  var detect = function (data) {
    if (!data.template) {
      return 'json';
    }
    
    if (!data.template('2.16.840.1.113883.3.88.11.32.1').isEmpty()) {
      return 'c32';
    } else if(!data.template('2.16.840.1.113883.10.20.22.1.1').isEmpty()) {
      return 'ccda';
    }
  };
  
  
  /*
   * Get entries within an element (with tag name 'entry'), adds an `each` function
   */
  var entries = function () {
    var each = function (callback) {
      for (var i = 0; i < this.length; i++) {
        callback(this[i]);
      }
    };
    
    var els = this.elsByTag('entry');
    els.each = each;
    return els;
  };
  
  
  /*
   * Parses an HL7 date in String form and creates a new Date object.
   * 
   * TODO: CCDA dates can be in form:
   *   <effectiveTime value="20130703094812"/>
   * ...or:
   *   <effectiveTime>
   *     <low value="19630617120000"/>
   *     <high value="20110207100000"/>
   *   </effectiveTime>
   * For the latter, parseDate will not be given type `String`
   * and will return `null`.
   */
  var parseDate = function (str) {
    if (!str || typeof str !== 'string') {
      return null;
    }

    // Note: months start at 0 (so January is month 0)

    // e.g., value="1999" translates to Jan 1, 1999
    if (str.length === 4) {
      return new Date(str, 0, 1);
    }

    var year = str.substr(0, 4);
    // subtract 1 from the month since they're zero-indexed
    var month = parseInt(str.substr(4, 2), 10) - 1;
    // days are not zero-indexed. If we end up with the day 0 or '',
    // that will be equivalent to the last day of the previous month
    var day = str.substr(6, 2) || 1;

    // check for time info (the presence of at least hours and mins after the date)
    if (str.length >= 12) {
      var hour = str.substr(8, 2);
      var min = str.substr(10, 2);
      var secs = str.substr(12, 2);

      // check for timezone info (the presence of chars after the seconds place)
      if (str.length > 14) {
        // _utcOffsetFromString will return 0 if there's no utc offset found.
        var utcOffset = _utcOffsetFromString(str.substr(14));
        // We subtract that offset from the local time to get back to UTC
        // (e.g., if we're -480 mins behind UTC, we add 480 mins to get back to UTC)
        min = _toInt(min) - utcOffset;
      }

      var date = new Date(Date.UTC(year, month, day, hour, min, secs));
      // This flag lets us output datetime-precision in our JSON even if the time happens
      // to translate to midnight local time. If we clone the date object, it is not
      // guaranteed to survive.
      date._parsedWithTimeData = true;
      return date;
    }

    return new Date(year, month, day);
  };

  // These regexes and the two functions below are copied from moment.js
  // http://momentjs.com/
  // https://github.com/moment/moment/blob/develop/LICENSE
  var parseTimezoneChunker = /([\+\-]|\d\d)/gi;
  var parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
  function _utcOffsetFromString(string) {
      string = string || '';
      var possibleTzMatches = (string.match(parseTokenTimezone) || []),
          tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
          parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
          minutes = +(parts[1] * 60) + _toInt(parts[2]);

      return parts[0] === '+' ? minutes : -minutes;
  }
  function _toInt(argumentForCoercion) {
      var coercedNumber = +argumentForCoercion,
          value = 0;

      if (coercedNumber !== 0 && isFinite(coercedNumber)) {
          if (coercedNumber >= 0) {
              value = Math.floor(coercedNumber);
          } else {
              value = Math.ceil(coercedNumber);
          }
      }

      return value;
  }
  
  
  /*
   * Parses an HL7 name (prefix / given [] / family)
   */
  var parseName = function (nameEl) {
    var prefix = nameEl.tag('prefix').val();
    
    var els = nameEl.elsByTag('given');
    var given = [];
    for (var i = 0; i < els.length; i++) {
      var val = els[i].val();
      if (val) { given.push(val); }
    }
    
    var family = nameEl.tag('family').val();
    
    return {
      prefix: prefix,
      given: given,
      family: family
    };
  };
  
  
  /*
   * Parses an HL7 address (streetAddressLine [], city, state, postalCode, country)
   */
  var parseAddress = function (addrEl) {
    var els = addrEl.elsByTag('streetAddressLine');
    var street = [];
    
    for (var i = 0; i < els.length; i++) {
      var val = els[i].val();
      if (val) { street.push(val); }
    }
    
    var city = addrEl.tag('city').val(),
        state = addrEl.tag('state').val(),
        zip = addrEl.tag('postalCode').val(),
        country = addrEl.tag('country').val();
    
    return {
      street: street,
      city: city,
      state: state,
      zip: zip,
      country: country
    };
  };

  // Node-specific code for unit tests
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = {
        parseDate: parseDate
      };
    }
  }
  
  
  return {
    detect: detect,
    entries: entries,
    parseDate: parseDate,
    parseName: parseName,
    parseAddress: parseAddress
  };
  
})();
;

/*
 * ...
 */

Documents.C32 = (function () {
  
  /*
   * Preprocesses the C32 document
   */
  var process = function (c32) {
    c32.section = section;
    return c32;
  };
  
  
  /*
   * Finds the section of a C32 document
   *
   * Usually we check first for the HITSP section ID and then for the HL7-CCD ID.
   */
  var section = function (name) {
    var el, entries = Documents.entries;
    
    switch (name) {
      case 'document':
        return this.template('2.16.840.1.113883.3.88.11.32.1');
      case 'allergies':
        el = this.template('2.16.840.1.113883.3.88.11.83.102');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.2');
        }
        el.entries = entries;
        return el;
      case 'demographics':
        return this.template('2.16.840.1.113883.3.88.11.32.1');
      case 'encounters':
        el = this.template('2.16.840.1.113883.3.88.11.83.127');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.3');
        }
        el.entries = entries;
        return el;
      case 'immunizations':
        el = this.template('2.16.840.1.113883.3.88.11.83.117');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.6');
        }
        el.entries = entries;
        return el;
      case 'results':
        el = this.template('2.16.840.1.113883.3.88.11.83.122');
        el.entries = entries;
        return el;
      case 'medications':
        el = this.template('2.16.840.1.113883.3.88.11.83.112');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.8');
        }
        el.entries = entries;
        return el;
      case 'problems':
        el = this.template('2.16.840.1.113883.3.88.11.83.103');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.11');
        }
        el.entries = entries;
        return el;
      case 'procedures':
        el = this.template('2.16.840.1.113883.3.88.11.83.108');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.12');
        }
        el.entries = entries;
        return el;
      case 'vitals':
        el = this.template('2.16.840.1.113883.3.88.11.83.119');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.1.16');
        }
        el.entries = entries;
        return el;
    }
    
    return null;
  };
  
  
  return {
    process: process,
    section: section
  };
  
})();
;

/*
 * ...
 */

Documents.CCDA = (function () {
  
  /*
   * Preprocesses the CCDA document
   */
  var process = function (ccda) {
    ccda.section = section;
    return ccda;
  };
  
  
  /*
   * Finds the section of a CCDA document
   */
  var section = function (name) {
    var el, entries = Documents.entries;
    
    switch (name) {
      case 'document':
        return this.template('2.16.840.1.113883.10.20.22.1.1');
      case 'allergies':
        el = this.template('2.16.840.1.113883.10.20.22.2.6.1');
        el.entries = entries;
        return el;
      case 'care_plan':
        el = this.template('2.16.840.1.113883.10.20.22.2.10');
        el.entries = entries;
        return el;
      case 'chief_complaint':
        el = this.template('2.16.840.1.113883.10.20.22.2.13');
        if (el.isEmpty()) {
          el = this.template('1.3.6.1.4.1.19376.1.5.3.1.1.13.2.1');
        }
        // no entries in Chief Complaint
        return el;
      case 'demographics':
        return this.template('2.16.840.1.113883.10.20.22.1.1');
      case 'encounters':
        el = this.template('2.16.840.1.113883.10.20.22.2.22');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.22.1');
        }
        el.entries = entries;
        return el;
      case 'functional_statuses':
        el = this.template('2.16.840.1.113883.10.20.22.2.14');
        el.entries = entries;
        return el;
      case 'immunizations':
        el = this.template('2.16.840.1.113883.10.20.22.2.2.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.2');
        }
        el.entries = entries;
        return el;
      case 'instructions':
        el = this.template('2.16.840.1.113883.10.20.22.2.45');
        el.entries = entries;
        return el;
      case 'results':
        el = this.template('2.16.840.1.113883.10.20.22.2.3.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.3');
        }
        el.entries = entries;
        return el;
      case 'medications':
        el = this.template('2.16.840.1.113883.10.20.22.2.1.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.1');
        }
        el.entries = entries;
        return el;
      case 'problems':
        el = this.template('2.16.840.1.113883.10.20.22.2.5.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.5');
        }
        el.entries = entries;
        return el;
      case 'procedures':
        el = this.template('2.16.840.1.113883.10.20.22.2.7.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.7');
        }
        el.entries = entries;
        return el;
      case 'social_history':
        el = this.template('2.16.840.1.113883.10.20.22.2.17');
        el.entries = entries;
        return el;
      case 'vitals':
        el = this.template('2.16.840.1.113883.10.20.22.2.4.1');
        if (el.isEmpty()) {
          el = this.template('2.16.840.1.113883.10.20.22.2.4');
        }
        el.entries = entries;
        return el;
    }
    
    return null;
  };
  
  
  return {
    process: process,
    section: section
  };
  
})();
;

/*
 * ...
 */

/* exported Generators */
var Generators = (function () {
  
  var method = function () {};

  /* Import ejs if we're in Node. Then setup custom formatting filters
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      ejs = require("ejs");
    }
  }

  if (typeof ejs !== 'undefined') {
    /* Filters are automatically available to ejs to be used like "... | hl7Date"
     * Helpers are functions that we'll manually pass in to ejs.
     * The intended distinction is that a helper gets called with regular function-call syntax
     */
    var pad = function(number) {
      if (number < 10) {
        return '0' + number;
      }
      return String(number);
    };

    ejs.filters.hl7Date = function(obj) {
      try {
          if (obj === null || obj === undefined) { return 'nullFlavor="UNK"'; }
          var date = new Date(obj);
          if (isNaN(date.getTime())) { return obj; }

          var dateStr = null;
          if (date.getHours() || date.getMinutes() || date.getSeconds()) {
            // If there's a meaningful time, output a UTC datetime
            dateStr = date.getUTCFullYear() +
              pad( date.getUTCMonth() + 1 ) +
              pad( date.getUTCDate() );
            var timeStr = pad( date.getUTCHours() ) +
              pad( date.getUTCMinutes() ) +
              pad ( date.getUTCSeconds() ) +
              "+0000";
            return 'value="' + dateStr + timeStr + '"';
           
          } else {
            // If there's no time, don't apply timezone tranformations: just output a date
            dateStr = String(date.getFullYear()) +
              pad( date.getMonth() + 1 ) +
              pad( date.getDate() );
            return 'value="' + dateStr + '"';
          }

      } catch (e) {
          return obj;
      }
    };

    var escapeSpecialChars = function(s) {
      return s.replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/&/g, '&amp;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
    };

    ejs.filters.hl7Code = function(obj) {
      if (!obj) { return ''; }

      var tag = '';
      var name = obj.name || '';
      if (obj.name) { tag += 'displayName="'+escapeSpecialChars(name)+'"'; }

      if (obj.code) {
        tag += ' code="'+obj.code+'"';
        if (obj.code_system) { tag += ' codeSystem="'+escapeSpecialChars(obj.code_system)+'"'; }
        if (obj.code_system_name) { tag += ' codeSystemName="' +
                                        escapeSpecialChars(obj.code_system_name)+'"'; }
      } else {
        tag += ' nullFlavor="UNK"';
      }

      if (!obj.name && ! obj.code) {
        return 'nullFlavor="UNK"';
      }
      
      return tag;
    };

    ejs.filters.emptyStringIfFalsy = function(obj) {
      if (!obj) { return ''; }
      return obj;
    };

    if (!ejs.helpers) ejs.helpers = {};
    ejs.helpers.simpleTag = function(tagName, value) {
      if (value) {
        return "<"+tagName+">"+value+"</"+tagName+">";
      } else {
        return "<"+tagName+" nullFlavor=\"UNK\" />";
      }
    };

    ejs.helpers.addressTags = function(addressDict) {
      if (!addressDict) {
        return '<streetAddressLine nullFlavor="NI" />\n' +
                '<city nullFlavor="NI" />\n' +
                '<state nullFlavor="NI" />\n' +
                '<postalCode nullFlavor="NI" />\n' +
                '<country nullFlavor="NI" />\n';
      }
      
      var tags = '';
      if (!addressDict.street.length) {
        tags += ejs.helpers.simpleTag('streetAddressLine', null) + '\n';
      } else {
        for (var i=0; i<addressDict.street.length; i++) {
          tags += ejs.helpers.simpleTag('streetAddressLine', addressDict.street[i]) + '\n';
        }
      }
      tags += ejs.helpers.simpleTag('city', addressDict.city) + '\n';
      tags += ejs.helpers.simpleTag('state', addressDict.state) + '\n';
      tags += ejs.helpers.simpleTag('postalCode', addressDict.zip) + '\n';
      tags += ejs.helpers.simpleTag('country', addressDict.country) + '\n';
      return tags;
    };

    ejs.helpers.nameTags = function(nameDict) {
      if (!nameDict) {
        return '<given nullFlavor="NI" />\n' +
                '<family nullFlavor="NI" />\n';
      }

      var tags = '';
      if (nameDict.prefix) {
        tags += ejs.helpers.simpleTag('prefix', nameDict.prefix) + '\n';
      }
      if (!nameDict.given.length) {
        tags += ejs.helpers.simpleTag('given', null) + '\n';
      } else {
        for (var i=0; i<nameDict.given.length; i++) {
          tags += ejs.helpers.simpleTag('given', nameDict.given[i]) + '\n';
        }
      }
      tags += ejs.helpers.simpleTag('family', nameDict.family) + '\n';
      if (nameDict.suffix) {
        tags += ejs.helpers.simpleTag('suffix', nameDict.suffix) + '\n';
      }
      return tags;
    };

  }
  
  return {
    method: method
  };
  
})();
;

/*
 * ...
 */

Generators.C32 = (function () {
  
  /*
   * Generates a C32 document
   */
  var run = function (json, template, testingMode) {
    /* jshint unused: false */ // only until this stub is actually implemented
    console.log("C32 generation is not implemented yet");
    return null;
  };
  
  return {
    run: run
  };
  
})();
;

/*
 * ...
 */

Generators.CCDA = (function () {
  
  /*
   * Generates a CCDA document
   * A lot of the EJS setup happens in generators.js
   *
   * If `testingMode` is true, we'll set the "now" variable to a specific,
   * fixed time, so that the expected XML doesn't change across runs
   */
  var run = function (json, template, testingMode) {
    if (!ejs) {
      console.log("The BB.js Generator (JSON->XML) requires the EJS template package. " +
                  "Install it in Node or include it before this package in the browser.");
      return null;
    }
    if (!template) {
      console.log("Please provide a template EJS file for the Generator to use. " +
                  "Load it via fs.readFileSync in Node or XHR in the browser.");
      return null;
    }

    // `now` is actually now, unless we're running this for a test,
    // in which case it's always Jan 1, 2000 at 12PM UTC
    var now = (testingMode) ?
      new Date('2000-01-01T12:00:00Z') : new Date();

    var ccda = ejs.render(template, {
      filename: 'ccda.xml',
      bb: json,
      now: now,
      tagHelpers: ejs.helpers,
      codes: Core.Codes
    });
    return ccda;
  };
  
  return {
    run: run
  };
  
})();
;

/*
 * ...
 */

/* exported Parsers */
var Parsers = (function () {
  
  var method = function () {};
  
  return {
    method: method
  };
  
})();
;

/*
 * Parser for the C32 document
 */

Parsers.C32 = (function () {
  
  var run = function (c32) {
    var data = {};
    
    data.document              = Parsers.C32.document(c32);
    data.allergies             = Parsers.C32.allergies(c32);
    data.demographics          = Parsers.C32.demographics(c32);
    data.encounters            = Parsers.C32.encounters(c32);
    data.immunizations         = Parsers.C32.immunizations(c32).administered;
    data.immunization_declines = Parsers.C32.immunizations(c32).declined;
    data.results               = Parsers.C32.results(c32);
    data.medications           = Parsers.C32.medications(c32);
    data.problems              = Parsers.C32.problems(c32);
    data.procedures            = Parsers.C32.procedures(c32);
    data.vitals                = Parsers.C32.vitals(c32);
    
    data.json                       = Core.json;
    data.document.json              = Core.json;
    data.allergies.json             = Core.json;
    data.demographics.json          = Core.json;
    data.encounters.json            = Core.json;
    data.immunizations.json         = Core.json;
    data.immunization_declines.json = Core.json;
    data.results.json               = Core.json;
    data.medications.json           = Core.json;
    data.problems.json              = Core.json;
    data.procedures.json            = Core.json;
    data.vitals.json                = Core.json;

    // Sections that are in CCDA but not C32... we want to keep the API
    // consistent, even if the entries are always null
    data.smoking_status = {
      date: null,
      name: null,
      code: null,
      code_system: null,
      code_system_name: null
    };
    data.smoking_status.json = Core.json;
    
    data.chief_complaint = {
      text: null
    };
    data.chief_complaint.json = Core.json;

    data.care_plan = [];
    data.care_plan.json = Core.json;

    data.instructions = [];
    data.instructions.json = Core.json;

    data.functional_statuses = [];
    data.functional_statuses.json = Core.json;
    
    return data;
  };

  return {
    run: run
  };
  
})();
;

/*
 * Parser for the C32 document section
 */

Parsers.C32.document = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = {}, el;
  
  var doc = c32.section('document');

  var date = parseDate(doc.tag('effectiveTime').attr('value'));
  var title = Core.stripWhitespace(doc.tag('title').val());
  
  var author = doc.tag('author');
  el = author.tag('assignedPerson').tag('name');
  var name_dict = parseName(el);
  // Sometimes C32s include names that are just like <name>String</name>
  // and we still want to get something out in that case
  if (!name_dict.prefix && !name_dict.given.length && !name_dict.family) {
   name_dict.family = el.val();
  }
  
  el = author.tag('addr');
  var address_dict = parseAddress(el);
  
  el = author.tag('telecom');
  var work_phone = el.attr('value');

  var documentation_of_list = [];
  var performers = doc.tag('documentationOf').elsByTag('performer');
  for (var i = 0; i < performers.length; i++) {
    el = performers[i].tag('assignedPerson').tag('name');
    var performer_name_dict = parseName(el);
    var performer_phone = performers[i].tag('telecom').attr('value');
    var performer_addr = parseAddress(el.tag('addr'));
    documentation_of_list.push({
      name: performer_name_dict,
      phone: {
        work: performer_phone
      },
      address: performer_addr
    });
  }

  el = doc.tag('encompassingEncounter');
  var location_name = Core.stripWhitespace(el.tag('name').val());
  var location_addr_dict = parseAddress(el.tag('addr'));
  
  var encounter_date = null;
  el = el.tag('effectiveTime');
  if (!el.isEmpty()) {
    encounter_date = parseDate(el.attr('value'));
  }
  
  data = {
    date: date,
    title: title,
    author: {
      name: name_dict,
      address: address_dict,
      phone: {
        work: work_phone
      }
    },
    documentation_of: documentation_of_list,
    location: {
      name: location_name,
      address: location_addr_dict,
      encounter_date: encounter_date
    }
  };
  
  return data;
};
;

/*
 * Parser for the C32 allergies section
 */

Parsers.C32.allergies = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var allergies = c32.section('allergies');
  
  allergies.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var start_date = parseDate(el.tag('low').attr('value')),
        end_date = parseDate(el.tag('high').attr('value'));
    
    el = entry.template('2.16.840.1.113883.3.88.11.83.6').tag('code');
    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem'),
        code_system_name = el.attr('codeSystemName');
    
    // value => reaction_type
    el = entry.template('2.16.840.1.113883.3.88.11.83.6').tag('value');
    var reaction_type_name = el.attr('displayName'),
        reaction_type_code = el.attr('code'),
        reaction_type_code_system = el.attr('codeSystem'),
        reaction_type_code_system_name = el.attr('codeSystemName');
    
    // reaction
    el = entry.template('2.16.840.1.113883.10.20.1.54').tag('value');
    var reaction_name = el.attr('displayName'),
        reaction_code = el.attr('code'),
        reaction_code_system = el.attr('codeSystem');
    
    // an irregularity seen in some c32s
    if (!reaction_name) {
      el = entry.template('2.16.840.1.113883.10.20.1.54').tag('text');
      if (!el.isEmpty()) {
        reaction_name = Core.stripWhitespace(el.val());
      }
    }

    // severity
    el = entry.template('2.16.840.1.113883.10.20.1.55').tag('value');
    var severity = el.attr('displayName');
    
    // participant => allergen
    el = entry.tag('participant').tag('code');
    var allergen_name = el.attr('displayName'),
        allergen_code = el.attr('code'),
        allergen_code_system = el.attr('codeSystem'),
        allergen_code_system_name = el.attr('codeSystemName');

    // another irregularity seen in some c32s
    if (!allergen_name) {
      el = entry.tag('participant').tag('name');
      if (!el.isEmpty()) {
        allergen_name = el.val();
      }
    }
    if (!allergen_name) {
      el = entry.template('2.16.840.1.113883.3.88.11.83.6').tag('originalText');
      if (!el.isEmpty()) {
        allergen_name = Core.stripWhitespace(el.val());
      }
    }
    
    // status
    el = entry.template('2.16.840.1.113883.10.20.1.39').tag('value');
    var status = el.attr('displayName');
    
    data.push({
      date_range: {
        start: start_date,
        end: end_date
      },
      name: name,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name,
      status: status,
      severity: severity,
      reaction: {
        name: reaction_name,
        code: reaction_code,
        code_system: reaction_code_system
      },
      reaction_type: {
        name: reaction_type_name,
        code: reaction_type_code,
        code_system: reaction_type_code_system,
        code_system_name: reaction_type_code_system_name
      },
      allergen: {
        name: allergen_name,
        code: allergen_code,
        code_system: allergen_code_system,
        code_system_name: allergen_code_system_name
      }
    });
  });
  
  return data;
};
;

/*
 * Parser for the C32 demographics section
 */

Parsers.C32.demographics = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = {}, el;
  
  var demographics = c32.section('demographics');
  
  var patient = demographics.tag('patientRole');
  el = patient.tag('patient').tag('name');
  var patient_name_dict = parseName(el);
  
  el = patient.tag('patient');
  var dob = parseDate(el.tag('birthTime').attr('value')),
      gender = Core.Codes.gender(el.tag('administrativeGenderCode').attr('code')),
      marital_status = Core.Codes.maritalStatus(el.tag('maritalStatusCode').attr('code'));
  
  el = patient.tag('addr');
  var patient_address_dict = parseAddress(el);
  
  el = patient.tag('telecom');
  var home = el.attr('value'),
      work = null,
      mobile = null;
  
  var email = null;
  
  var language = patient.tag('languageCommunication').tag('languageCode').attr('code'),
      race = patient.tag('raceCode').attr('displayName'),
      ethnicity = patient.tag('ethnicGroupCode').attr('displayName'),
      religion = patient.tag('religiousAffiliationCode').attr('displayName');
  
  el = patient.tag('birthplace');
  var birthplace_dict = parseAddress(el);
  
  el = patient.tag('guardian');
  var guardian_relationship = el.tag('code').attr('displayName'),
    guardian_relationship_code = el.tag('code').attr('code'),
      guardian_home = el.tag('telecom').attr('value');
  
  el = el.tag('guardianPerson').tag('name');
  var guardian_name_dict = parseName(el);
  
  el = patient.tag('guardian').tag('addr');
  var guardian_address_dict = parseAddress(el);
  
  el = patient.tag('providerOrganization');
  var provider_organization = el.tag('name').val(),
      provider_phone = el.tag('telecom').attr('value'),
      provider_address_dict = parseAddress(el.tag('addr'));
  
  data = {
    name: patient_name_dict,
    dob: dob,
    gender: gender,
    marital_status: marital_status,
    address: patient_address_dict,
    phone: {
      home: home,
      work: work,
      mobile: mobile
    },
    email: email,
    language: language,
    race: race,
    ethnicity: ethnicity,
    religion: religion,
    birthplace: {
      state: birthplace_dict.state,
      zip: birthplace_dict.zip,
      country: birthplace_dict.country
    },
    guardian: {
      name: {
        given: guardian_name_dict.given,
        family: guardian_name_dict.family
      },
      relationship: guardian_relationship,
      relationship_code: guardian_relationship_code,
      address: guardian_address_dict,
      phone: {
        home: guardian_home
      }
    },
    provider: {
      organization: provider_organization,
      phone: provider_phone,
      address: provider_address_dict
    }
  };
  
  return data;
};
;

/*
 * Parser for the C32 encounters section
 */

Parsers.C32.encounters = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var encounters = c32.section('encounters');
  
  encounters.entries().each(function(entry) {
    
    var date = parseDate(entry.tag('effectiveTime').attr('value'));
    if (!date) {
      date = parseDate(entry.tag('effectiveTime').tag('low').attr('value'));
    }
    
    el = entry.tag('code');
    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem'),
        code_system_name = el.attr('codeSystemName'),
        code_system_version = el.attr('codeSystemVersion');
    
    // translation
    el = entry.tag('translation');
    var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');
    
    // performer
    el = entry.tag('performer');
    var performer_name = el.tag('name').val(),
        performer_code = el.attr('code'),
        performer_code_system = el.attr('codeSystem'),
        performer_code_system_name = el.attr('codeSystemName');
    
    // participant => location
    el = entry.tag('participant');
    var organization = el.tag('name').val(),
        location_dict = parseAddress(el);
    location_dict.organization = organization;

    // findings
    var findings = [];
    var findingEls = entry.elsByTag('entryRelationship');
    for (var i = 0; i < findingEls.length; i++) {
      el = findingEls[i].tag('value');
      findings.push({
        name: el.attr('displayName'),
        code: el.attr('code'),
        code_system: el.attr('codeSystem')
      });
    }
    
    data.push({
      date: date,
      name: name,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name,
      code_system_version: code_system_version,
      findings: findings,
      translation: {
        name: translation_name,
        code: translation_code,
        code_system: translation_code_system,
        code_system_name: translation_code_system_name
      },
      performer: {
        name: performer_name,
        code: performer_code,
        code_system: performer_code_system,
        code_system_name: performer_code_system_name
      },
      location: location_dict
    });
  });
  
  return data;
};
;

/*
 * Parser for the C32 immunizations section
 */

Parsers.C32.immunizations = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var administeredData = [], declinedData = [], el, product;
  
  var immunizations = c32.section('immunizations');
  
  immunizations.entries().each(function(entry) {
    
    // date
    el = entry.tag('effectiveTime');
    var date = parseDate(el.attr('value'));
    if (!date) {
      date = parseDate(el.tag('low').attr('value'));
    }

    // if 'declined' is true, this is a record that this vaccine WASN'T administered
    el = entry.tag('substanceAdministration');
    var declined = el.boolAttr('negationInd');

    // product
    product = entry.template('2.16.840.1.113883.10.20.1.53');
    el = product.tag('code');
    var product_name = el.attr('displayName'),
        product_code = el.attr('code'),
        product_code_system = el.attr('codeSystem'),
        product_code_system_name = el.attr('codeSystemName');

    // translation
    el = product.tag('translation');
    var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');

    // misc product details
    el = product.tag('lotNumberText');
    var lot_number = el.val();

    el = product.tag('manufacturerOrganization');
    var manufacturer_name = el.tag('name').val();
    
    // route
    el = entry.tag('routeCode');
    var route_name = el.attr('displayName'),
        route_code = el.attr('code'),
        route_code_system = el.attr('codeSystem'),
        route_code_system_name = el.attr('codeSystemName');
    
    // instructions
    el = entry.template('2.16.840.1.113883.10.20.1.49');
    var instructions_text = Core.stripWhitespace(el.tag('text').val());
    el = el.tag('code');
    var education_name = el.attr('displayName'),
        education_code = el.attr('code'),
        education_code_system = el.attr('codeSystem');

    // dose
    el = entry.tag('doseQuantity');
    var dose_value = el.attr('value'),
        dose_unit = el.attr('unit');
    
    var data = (declined) ? declinedData : administeredData;
    data.push({
      date: date,
      product: {
        name: product_name,
        code: product_code,
        code_system: product_code_system,
        code_system_name: product_code_system_name,
        translation: {
          name: translation_name,
          code: translation_code,
          code_system: translation_code_system,
          code_system_name: translation_code_system_name
        },
        lot_number: lot_number,
        manufacturer_name: manufacturer_name
      },
      dose_quantity: {
        value: dose_value,
        unit: dose_unit
      },
      route: {
        name: route_name,
        code: route_code,
        code_system: route_code_system,
        code_system_name: route_code_system_name
      },
      instructions: instructions_text,
      education_type: {
        name: education_name,
        code: education_code,
        code_system: education_code_system
      }
    });
  });
  
  return {
    administered: administeredData,
    declined: declinedData
  };
};
;

/*
 * Parser for the C32 results (labs) section
 */

Parsers.C32.results = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var results = c32.section('results');
  
  results.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var panel_date = parseDate(entry.tag('effectiveTime').attr('value'));
    if (!panel_date) {
      panel_date = parseDate(entry.tag('effectiveTime').tag('low').attr('value'));
    }
    
    // panel
    el = entry.tag('code');
    var panel_name = el.attr('displayName'),
        panel_code = el.attr('code'),
        panel_code_system = el.attr('codeSystem'),
        panel_code_system_name = el.attr('codeSystemName');
    
    var observation;
    var tests = entry.elsByTag('observation');
    var tests_data = [];
    
    for (var i = 0; i < tests.length; i++) {
      observation = tests[i];
      
      // sometimes results organizers contain non-results. we only want tests
      if (observation.template('2.16.840.1.113883.10.20.1.31').val()) {
        var date = parseDate(observation.tag('effectiveTime').attr('value'));
        
        el = observation.tag('code');
        var name = el.attr('displayName'),
            code = el.attr('code'),
            code_system = el.attr('codeSystem'),
            code_system_name = el.attr('codeSystemName');

        if (!name) {
          name = Core.stripWhitespace(observation.tag('text').val());
        }
    
        el = observation.tag('translation');
        var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');
    
        el = observation.tag('value');
        var value = el.attr('value'),
            unit = el.attr('unit');
        // We could look for xsi:type="PQ" (physical quantity) but it seems better
        // not to trust that that field has been used correctly...
        if (value && !isNaN(parseFloat(value))) {
          value = parseFloat(value);
        }
        if (!value) {
          value = el.val(); // look for free-text values
        }
    
        el = observation.tag('referenceRange');
        var reference_range_text = Core.stripWhitespace(el.tag('observationRange').tag('text').val()),
            reference_range_low_unit = el.tag('observationRange').tag('low').attr('unit'),
            reference_range_low_value = el.tag('observationRange').tag('low').attr('value'),
            reference_range_high_unit = el.tag('observationRange').tag('high').attr('unit'),
            reference_range_high_value = el.tag('observationRange').tag('high').attr('value');
        
        tests_data.push({
          date: date,
          name: name,
          value: value,
          unit: unit,
          code: code,
          code_system: code_system,
          code_system_name: code_system_name,
          translation: {
            name: translation_name,
            code: translation_code,
            code_system: translation_code_system,
            code_system_name: translation_code_system_name
          },
          reference_range: {
            text: reference_range_text,
            low_unit: reference_range_low_unit,
            low_value: reference_range_low_value,
            high_unit: reference_range_high_unit,
            high_value: reference_range_high_value,
          }
        });
      }
    }
    
    data.push({
      name: panel_name,
      code: panel_code,
      code_system: panel_code_system,
      code_system_name: panel_code_system_name,
      date: panel_date,
      tests: tests_data
    });
  });
  
  return data;
};
;

/*
 * Parser for the C32 medications section
 */

Parsers.C32.medications = function (c32) {
  
  var parseDate = Documents.parseDate;
  var data = [], el;
  
  var medications = c32.section('medications');
  
  medications.entries().each(function(entry) {

    var text = null;
    el = entry.tag('substanceAdministration').immediateChildTag('text');
    if (!el.isEmpty()) {
      // technically C32s don't use this, but C83s (another CCD) do,
      // and CCDAs do, so we may see it anyways
      text = Core.stripWhitespace(el.val());
    }

    var effectiveTimes = entry.elsByTag('effectiveTime');

    el = effectiveTimes[0]; // the first effectiveTime is the med start date
    var start_date = null, end_date = null;
    if (el) {
      start_date = parseDate(el.tag('low').attr('value'));
      end_date = parseDate(el.tag('high').attr('value'));
    }

    // the second effectiveTime might the schedule period or it might just
    // be a random effectiveTime from further in the entry... xsi:type should tell us
    el = effectiveTimes[1];
    var schedule_type = null, schedule_period_value = null, schedule_period_unit = null;
    if (el && el.attr('xsi:type') === 'PIVL_TS') {
      var institutionSpecified = el.attr('institutionSpecified');
      if (institutionSpecified === 'true') {
        schedule_type= 'frequency';
      } else if (institutionSpecified === 'false') {
        schedule_type = 'interval';
      }

      el = el.tag('period');
      schedule_period_value = el.attr('value');
      schedule_period_unit = el.attr('unit');
    }
    
    el = entry.tag('manufacturedProduct').tag('code');
    var product_name = el.attr('displayName'),
        product_code = el.attr('code'),
        product_code_system = el.attr('codeSystem');

    var product_original_text = null;
    el = entry.tag('manufacturedProduct').tag('originalText');
    if (!el.isEmpty()) {
      product_original_text = Core.stripWhitespace(el.val());
    }
    // if we don't have a product name yet, try the originalText version
    if (!product_name && product_original_text) {
      product_name = product_original_text;
    }

    // irregularity in some c32s
    if (!product_name) {
      el = entry.tag('manufacturedProduct').tag('name');
      if (!el.isEmpty()) {
        product_name = Core.stripWhitespace(el.val());
      }
    }
    
    el = entry.tag('manufacturedProduct').tag('translation');
    var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');
    
    el = entry.tag('doseQuantity');
    var dose_value = el.attr('value'),
        dose_unit = el.attr('unit');
    
    el = entry.tag('rateQuantity');
    var rate_quantity_value = el.attr('value'),
        rate_quantity_unit = el.attr('unit');
    
    el = entry.tag('precondition').tag('value');
    var precondition_name = el.attr('displayName'),
        precondition_code = el.attr('code'),
        precondition_code_system = el.attr('codeSystem');
    
    el = entry.template('2.16.840.1.113883.10.20.1.28').tag('value');
    var reason_name = el.attr('displayName'),
        reason_code = el.attr('code'),
        reason_code_system = el.attr('codeSystem');
    
    el = entry.tag('routeCode');
    var route_name = el.attr('displayName'),
        route_code = el.attr('code'),
        route_code_system = el.attr('codeSystem'),
        route_code_system_name = el.attr('codeSystemName');
    
    // participant/playingEntity => vehicle
    el = entry.tag('participant').tag('playingEntity');
    var vehicle_name = el.tag('name').val();

    el = el.tag('code');
    // prefer the code vehicle_name but fall back to the non-coded one
    // (which for C32s is in fact the primary field for this info)
    vehicle_name = el.attr('displayName') || vehicle_name;
    var vehicle_code = el.attr('code'),
        vehicle_code_system = el.attr('codeSystem'),
        vehicle_code_system_name = el.attr('codeSystemName');
    
    el = entry.tag('administrationUnitCode');
    var administration_name = el.attr('displayName'),
        administration_code = el.attr('code'),
        administration_code_system = el.attr('codeSystem'),
        administration_code_system_name = el.attr('codeSystemName');
    
    // performer => prescriber
    el = entry.tag('performer');
    var prescriber_organization = el.tag('name').val(),
        prescriber_person = null;
    
    data.push({
      date_range: {
        start: start_date,
        end: end_date
      },
      text: text,
      product: {
        name: product_name,
        text: product_original_text,
        code: product_code,
        code_system: product_code_system,
        translation: {
          name: translation_name,
          code: translation_code,
          code_system: translation_code_system,
          code_system_name: translation_code_system_name
        }
      },
      dose_quantity: {
        value: dose_value,
        unit: dose_unit
      },
      rate_quantity: {
        value: rate_quantity_value,
        unit: rate_quantity_unit
      },
      precondition: {
        name: precondition_name,
        code: precondition_code,
        code_system: precondition_code_system
      },
      reason: {
        name: reason_name,
        code: reason_code,
        code_system: reason_code_system
      },
      route: {
        name: route_name,
        code: route_code,
        code_system: route_code_system,
        code_system_name: route_code_system_name
      },
      schedule: {
        type: schedule_type,
        period_value: schedule_period_value,
        period_unit: schedule_period_unit
      },
      vehicle: {
        name: vehicle_name,
        code: vehicle_code,
        code_system: vehicle_code_system,
        code_system_name: vehicle_code_system_name
      },
      administration: {
        name: administration_name,
        code: administration_code,
        code_system: administration_code_system,
        code_system_name: administration_code_system_name
      },
      prescriber: {
        organization: prescriber_organization,
        person: prescriber_person
      }
    });
  });
  
  return data;
};
;

/*
 * Parser for the C32 problems section
 */

Parsers.C32.problems = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var problems = c32.section('problems');
  
  problems.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var start_date = parseDate(el.tag('low').attr('value')),
        end_date = parseDate(el.tag('high').attr('value'));
    
    el = entry.template('2.16.840.1.113883.10.20.1.28').tag('value');
    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem'),
        code_system_name = el.attr('codeSystemName');

    // Pre-C32 CCDs put the problem name in this "originalText" field, and some vendors
    // continue doing this with their C32, even though it's not technically correct
    if (!name) {
      el = entry.template('2.16.840.1.113883.10.20.1.28').tag('originalText');
      if (!el.isEmpty()) {
        name = Core.stripWhitespace(el.val());
      }
    }

    el = entry.template('2.16.840.1.113883.10.20.1.28').tag('translation');
    var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');
    
    el = entry.template('2.16.840.1.113883.10.20.1.50');
    var status = el.tag('value').attr('displayName');
    
    var age = null;
    el = entry.template('2.16.840.1.113883.10.20.1.38');
    if (!el.isEmpty()) {
      age = parseFloat(el.tag('value').attr('value'));
    }
    
    data.push({
      date_range: {
        start: start_date,
        end: end_date
      },
      name: name,
      status: status,
      age: age,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name,
      translation: {
        name: translation_name,
        code: translation_code,
        code_system: translation_code_system,
        code_system_name: translation_code_system_name
      },
      comment: null // not part of C32
    });
  });
  
  return data;
};
;

/*
 * Parser for the C32 procedures section
 */

Parsers.C32.procedures = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var procedures = c32.section('procedures');
  
  procedures.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var date = parseDate(el.attr('value'));
    
    el = entry.tag('code');
    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem');

    if (!name) {
      name = Core.stripWhitespace(entry.tag('originalText').val());
    }
    
    // 'specimen' tag not always present
    el = entry.tag('specimen').tag('code');
    var specimen_name = el.attr('displayName'),
        specimen_code = el.attr('code'),
        specimen_code_system = el.attr('codeSystem');
    
    el = entry.tag('performer').tag('addr');
    var organization = el.tag('name').val(),
        phone = el.tag('telecom').attr('value');
    
    var performer_dict = parseAddress(el);
    performer_dict.organization = organization;
    performer_dict.phone = phone;
    
    // participant => device
    el = entry.tag('participant').tag('code');
    var device_name = el.attr('displayName'),
        device_code = el.attr('code'),
        device_code_system = el.attr('codeSystem');
    
    data.push({
      date: date,
      name: name,
      code: code,
      code_system: code_system,
      specimen: {
        name: specimen_name,
        code: specimen_code,
        code_system: specimen_code_system
      },
      performer: performer_dict,
      device: {
        name: device_name,
        code: device_code,
        code_system: device_code_system
      }
    });
  });
  
  return data;
};
;

/*
 * Parser for the C32 vitals section
 */

Parsers.C32.vitals = function (c32) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var vitals = c32.section('vitals');
  
  vitals.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var entry_date = parseDate(el.attr('value'));
    
    var result;
    var results = entry.elsByTag('component');
    var results_data = [];
    
    for (var j = 0; j < results.length; j++) {
      result = results[j];
      
      // Results
      
      el = result.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      el = result.tag('value');
      var value = parseFloat(el.attr('value')),
          unit = el.attr('unit');
      
      results_data.push({
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        value: value,
        unit: unit
      });
    }
    
    data.push({
      date: entry_date,
      results: results_data
    });
  });
  
  return data;
};
;

/*
 * Parser for the CCDA document
 */

Parsers.CCDA = (function () {
  
  var run = function (ccda) {
    var data = {};
    
    data.document              = Parsers.CCDA.document(ccda);
    data.allergies             = Parsers.CCDA.allergies(ccda);
    data.care_plan             = Parsers.CCDA.care_plan(ccda);
    data.chief_complaint       = Parsers.CCDA.free_text(ccda, 'chief_complaint');
    data.demographics          = Parsers.CCDA.demographics(ccda);
    data.encounters            = Parsers.CCDA.encounters(ccda);
    data.functional_statuses   = Parsers.CCDA.functional_statuses(ccda);
    data.immunizations         = Parsers.CCDA.immunizations(ccda).administered;
    data.immunization_declines = Parsers.CCDA.immunizations(ccda).declined;
    data.instructions          = Parsers.CCDA.instructions(ccda);
    data.results               = Parsers.CCDA.results(ccda);
    data.medications           = Parsers.CCDA.medications(ccda);
    data.problems              = Parsers.CCDA.problems(ccda);
    data.procedures            = Parsers.CCDA.procedures(ccda);
    data.smoking_status        = Parsers.CCDA.smoking_status(ccda);
    data.vitals                = Parsers.CCDA.vitals(ccda);
    
    data.json                        = Core.json;
    data.document.json               = Core.json;
    data.allergies.json              = Core.json;
    data.care_plan.json              = Core.json;
    data.chief_complaint.json        = Core.json;
    data.demographics.json           = Core.json;
    data.encounters.json             = Core.json;
    data.functional_statuses.json    = Core.json;
    data.immunizations.json          = Core.json;
    data.immunization_declines.json  = Core.json;
    data.instructions.json           = Core.json;
    data.results.json                = Core.json;
    data.medications.json            = Core.json;
    data.problems.json               = Core.json;
    data.procedures.json             = Core.json;
    data.smoking_status.json         = Core.json;
    data.vitals.json                 = Core.json;
    
    return data;
  };

  return {
    run: run
  };
  
})();
;

/*
 * Parser for the CCDA document section
 */

Parsers.CCDA.document = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = {}, el;
  
  var doc = ccda.section('document');

  var date = parseDate(doc.tag('effectiveTime').attr('value'));
  var title = Core.stripWhitespace(doc.tag('title').val());
  
  var author = doc.tag('author');
  el = author.tag('assignedPerson').tag('name');
  var name_dict = parseName(el);
  
  el = author.tag('addr');
  var address_dict = parseAddress(el);
  
  el = author.tag('telecom');
  var work_phone = el.attr('value');

  var documentation_of_list = [];
  var performers = doc.tag('documentationOf').elsByTag('performer');
  for (var i = 0; i < performers.length; i++) {
    el = performers[i];
    var performer_name_dict = parseName(el);
    var performer_phone = el.tag('telecom').attr('value');
    var performer_addr = parseAddress(el.tag('addr'));
    documentation_of_list.push({
      name: performer_name_dict,
      phone: {
        work: performer_phone
      },
      address: performer_addr
    });
  }

  el = doc.tag('encompassingEncounter').tag('location');
  var location_name = Core.stripWhitespace(el.tag('name').val());
  var location_addr_dict = parseAddress(el.tag('addr'));
  
  var encounter_date = null;
  el = el.tag('effectiveTime');
  if (!el.isEmpty()) {
    encounter_date = parseDate(el.attr('value'));
  }
  
  data = {
    date: date,
    title: title,
    author: {
      name: name_dict,
      address: address_dict,
      phone: {
        work: work_phone
      }
    },
    documentation_of: documentation_of_list,
    location: {
      name: location_name,
      address: location_addr_dict,
      encounter_date: encounter_date
    }
  };
  
  return data;
};
;

/*
 * Parser for the CCDA allergies section
 */

Parsers.CCDA.allergies = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var allergies = ccda.section('allergies');
  
  allergies.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var start_date = parseDate(el.tag('low').attr('value')),
        end_date = parseDate(el.tag('high').attr('value'));
    
    el = entry.template('2.16.840.1.113883.10.20.22.4.7').tag('code');
    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem'),
        code_system_name = el.attr('codeSystemName');
    
    // value => reaction_type
    el = entry.template('2.16.840.1.113883.10.20.22.4.7').tag('value');
    var reaction_type_name = el.attr('displayName'),
        reaction_type_code = el.attr('code'),
        reaction_type_code_system = el.attr('codeSystem'),
        reaction_type_code_system_name = el.attr('codeSystemName');
    
    // reaction
    el = entry.template('2.16.840.1.113883.10.20.22.4.9').tag('value');
    var reaction_name = el.attr('displayName'),
        reaction_code = el.attr('code'),
        reaction_code_system = el.attr('codeSystem');
    
    // severity
    el = entry.template('2.16.840.1.113883.10.20.22.4.8').tag('value');
    var severity = el.attr('displayName');
    
    // participant => allergen
    el = entry.tag('participant').tag('code');
    var allergen_name = el.attr('displayName'),
        allergen_code = el.attr('code'),
        allergen_code_system = el.attr('codeSystem'),
        allergen_code_system_name = el.attr('codeSystemName');

    // this is not a valid place to store the allergen name but some vendors use it
    if (!allergen_name) {
      el = entry.tag('participant').tag('name');
      if (!el.isEmpty()) {
        allergen_name = el.val();
      }
    }
    if (!allergen_name) {
      el = entry.template('2.16.840.1.113883.10.20.22.4.7').tag('originalText');
      if (!el.isEmpty()) {
        allergen_name = Core.stripWhitespace(el.val());
      }
    }
    
    // status
    el = entry.template('2.16.840.1.113883.10.20.22.4.28').tag('value');
    var status = el.attr('displayName');
    
    data.push({
      date_range: {
        start: start_date,
        end: end_date
      },
      name: name,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name,
      status: status,
      severity: severity,
      reaction: {
        name: reaction_name,
        code: reaction_code,
        code_system: reaction_code_system
      },
      reaction_type: {
        name: reaction_type_name,
        code: reaction_type_code,
        code_system: reaction_type_code_system,
        code_system_name: reaction_type_code_system_name
      },
      allergen: {
        name: allergen_name,
        code: allergen_code,
        code_system: allergen_code_system,
        code_system_name: allergen_code_system_name
      }
    });
  });
  
  return data;
};
;

/*
 * Parser for the CCDA "plan of care" section
 */

Parsers.CCDA.care_plan = function (ccda) {
  
  var data = [], el;
  
  var care_plan = ccda.section('care_plan');
  
  care_plan.entries().each(function(entry) {
    
    var name = null,
        code = null,
        code_system = null,
        code_system_name = null;

    // Plan of care encounters, which have no other details
    el = entry.template('2.16.840.1.113883.10.20.22.4.40');
    if (!el.isEmpty()) {
      name = 'encounter';
    } else {
      el = entry.tag('code');
      
      name = el.attr('displayName');
      code = el.attr('code');
      code_system = el.attr('codeSystem');
      code_system_name = el.attr('codeSystemName');
    }

    var text = Core.stripWhitespace(entry.tag('text').val());
    
    data.push({
      text: text,
      name: name,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name,
    });
  });
  
  return data;
};
;

/*
 * Parser for the CCDA demographics section
 */

Parsers.CCDA.demographics = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = {}, el;
  
  var demographics = ccda.section('demographics');
  
  var patient = demographics.tag('patientRole');
  el = patient.tag('patient').tag('name');
  var patient_name_dict = parseName(el);
  
  el = patient.tag('patient');
  var dob = parseDate(el.tag('birthTime').attr('value')),
      gender = Core.Codes.gender(el.tag('administrativeGenderCode').attr('code')),
      marital_status = Core.Codes.maritalStatus(el.tag('maritalStatusCode').attr('code'));
  
  el = patient.tag('addr');
  var patient_address_dict = parseAddress(el);
  
  el = patient.tag('telecom');
  var home = el.attr('value'),
      work = null,
      mobile = null;
  
  var email = null;
  
  var language = patient.tag('languageCommunication').tag('languageCode').attr('code'),
      race = patient.tag('raceCode').attr('displayName'),
      ethnicity = patient.tag('ethnicGroupCode').attr('displayName'),
      religion = patient.tag('religiousAffiliationCode').attr('displayName');
  
  el = patient.tag('birthplace');
  var birthplace_dict = parseAddress(el);
  
  el = patient.tag('guardian');
  var guardian_relationship = el.tag('code').attr('displayName'),
      guardian_relationship_code = el.tag('code').attr('code'),
      guardian_home = el.tag('telecom').attr('value');
  
  el = el.tag('guardianPerson').tag('name');
  var guardian_name_dict = parseName(el);
  
  el = patient.tag('guardian').tag('addr');
  var guardian_address_dict = parseAddress(el);
  
  el = patient.tag('providerOrganization');
  var provider_organization = el.tag('name').val(),
      provider_phone = el.tag('telecom').attr('value');
  
  var provider_address_dict = parseAddress(el.tag('addr'));
  
  data = {
    name: patient_name_dict,
    dob: dob,
    gender: gender,
    marital_status: marital_status,
    address: patient_address_dict,
    phone: {
      home: home,
      work: work,
      mobile: mobile
    },
    email: email,
    language: language,
    race: race,
    ethnicity: ethnicity,
    religion: religion,
    birthplace: {
      state: birthplace_dict.state,
      zip: birthplace_dict.zip,
      country: birthplace_dict.country
    },
    guardian: {
      name: {
        given: guardian_name_dict.given,
        family: guardian_name_dict.family
      },
      relationship: guardian_relationship,
      relationship_code: guardian_relationship_code,
      address: guardian_address_dict,
      phone: {
        home: guardian_home
      }
    },
    provider: {
      organization: provider_organization,
      phone: provider_phone,
      address: provider_address_dict
    }
  };
  
  return data;
};
;

/*
 * Parser for the CCDA encounters section
 */

Parsers.CCDA.encounters = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var encounters = ccda.section('encounters');
  
  encounters.entries().each(function(entry) {
    
    var date = parseDate(entry.tag('effectiveTime').attr('value'));
    
    el = entry.tag('code');
    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem'),
        code_system_name = el.attr('codeSystemName'),
        code_system_version = el.attr('codeSystemVersion');
    
    // translation
    el = entry.tag('translation');
    var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');
    
    // performer
    el = entry.tag('performer').tag('code');
    var performer_name = el.attr('displayName'),
        performer_code = el.attr('code'),
        performer_code_system = el.attr('codeSystem'),
        performer_code_system_name = el.attr('codeSystemName');
  
    // participant => location
    el = entry.tag('participant');
    var organization = el.tag('code').attr('displayName');
    
    var location_dict = parseAddress(el);
    location_dict.organization = organization;

    // findings
    var findings = [];
    var findingEls = entry.elsByTag('entryRelationship');
    for (var i = 0; i < findingEls.length; i++) {
      el = findingEls[i].tag('value');
      findings.push({
        name: el.attr('displayName'),
        code: el.attr('code'),
        code_system: el.attr('codeSystem')
      });
    }
    
    data.push({
      date: date,
      name: name,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name,
      code_system_version: code_system_version,
      findings: findings,
      translation: {
        name: translation_name,
        code: translation_code,
        code_system: translation_code_system,
        code_system_name: translation_code_system_name
      },
      performer: {
        name: performer_name,
        code: performer_code,
        code_system: performer_code_system,
        code_system_name: performer_code_system_name
      },
      location: location_dict
    });
  });
  
  return data;
};
;

/*
 * Parser for any freetext section (i.e., contains just a single <text> element)
 */

Parsers.CCDA.free_text = function (ccda, sectionName) {

  var data = {};
  
  var doc = ccda.section(sectionName);
  var text = Core.stripWhitespace(doc.tag('text').val());
  
  data = {
    text: text
  };

  return data;
};
;

/*
 * Parser for the CCDA functional & cognitive status
 */

Parsers.CCDA.functional_statuses = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var data = [], el;

  var statuses = ccda.section('functional_statuses');

  statuses.entries().each(function(entry) {

    var date = parseDate(entry.tag('effectiveTime').attr('value'));
    if (!date) {
      date = parseDate(entry.tag('effectiveTime').tag('low').attr('value'));
    }

    el = entry.tag('value');

    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem'),
        code_system_name = el.attr('codeSystemName');

    data.push({
      date: date,
      name: name,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name
    });
  
  });
  
  return data;
};
;

/*
 * Parser for the CCDA immunizations section
 */

Parsers.CCDA.immunizations = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var administeredData = [], declinedData = [], el, product;
  
  var immunizations = ccda.section('immunizations');
  
  immunizations.entries().each(function(entry) {
    
    // date
    el = entry.tag('effectiveTime');
    var date = parseDate(el.attr('value'));
    if (!date) {
      date = parseDate(el.tag('low').attr('value'));
    }

    // if 'declined' is true, this is a record that this vaccine WASN'T administered
    el = entry.tag('substanceAdministration');
    var declined = el.boolAttr('negationInd');

    // product
    product = entry.template('2.16.840.1.113883.10.20.22.4.54');
    el = product.tag('code');
    var product_name = el.attr('displayName'),
        product_code = el.attr('code'),
        product_code_system = el.attr('codeSystem'),
        product_code_system_name = el.attr('codeSystemName');

    // translation
    el = product.tag('translation');
    var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');

    // misc product details
    el = product.tag('lotNumberText');
    var lot_number = el.val();

    el = product.tag('manufacturerOrganization');
    var manufacturer_name = el.tag('name').val();
    
    // route
    el = entry.tag('routeCode');
    var route_name = el.attr('displayName'),
        route_code = el.attr('code'),
        route_code_system = el.attr('codeSystem'),
        route_code_system_name = el.attr('codeSystemName');
    
    // instructions
    el = entry.template('2.16.840.1.113883.10.20.22.4.20');
    var instructions_text = Core.stripWhitespace(el.tag('text').val());
    el = el.tag('code');
    var education_name = el.attr('displayName'),
        education_code = el.attr('code'),
        education_code_system = el.attr('codeSystem');

    // dose
    el = entry.tag('doseQuantity');
    var dose_value = el.attr('value'),
        dose_unit = el.attr('unit');
    
    var data = (declined) ? declinedData : administeredData;
    data.push({
      date: date,
      product: {
        name: product_name,
        code: product_code,
        code_system: product_code_system,
        code_system_name: product_code_system_name,
        translation: {
          name: translation_name,
          code: translation_code,
          code_system: translation_code_system,
          code_system_name: translation_code_system_name
        },
        lot_number: lot_number,
        manufacturer_name: manufacturer_name
      },
      dose_quantity: {
        value: dose_value,
        unit: dose_unit
      },
      route: {
        name: route_name,
        code: route_code,
        code_system: route_code_system,
        code_system_name: route_code_system_name
      },
      instructions: instructions_text,
      education_type: {
        name: education_name,
        code: education_code,
        code_system: education_code_system
      }
    });
  });
  
  return {
    administered: administeredData,
    declined: declinedData
  };
};
;

/*
 * Parser for the CCDA "plan of care" section
 */

Parsers.CCDA.instructions = function (ccda) {
  
  var data = [], el;
  
  var instructions = ccda.section('instructions');
  
  instructions.entries().each(function(entry) {

    el = entry.tag('code');
    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem'),
        code_system_name = el.attr('codeSystemName');

    var text = Core.stripWhitespace(entry.tag('text').val());
    
    data.push({
      text: text,
      name: name,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name
    });
  });
  
  return data;
};
;

/*
 * Parser for the CCDA results (labs) section
 */

Parsers.CCDA.results = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var results = ccda.section('results');
  
  results.entries().each(function(entry) {
    
    // panel
    el = entry.tag('code');
    var panel_name = el.attr('displayName'),
        panel_code = el.attr('code'),
        panel_code_system = el.attr('codeSystem'),
        panel_code_system_name = el.attr('codeSystemName');
    
    var observation;
    var tests = entry.elsByTag('observation');
    var tests_data = [];
    
    for (var i = 0; i < tests.length; i++) {
      observation = tests[i];
      
      var date = parseDate(observation.tag('effectiveTime').attr('value'));
      
      el = observation.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');

      if (!name) {
        name = Core.stripWhitespace(observation.tag('text').val());
      }
      
      el = observation.tag('translation');
      var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');
    
      el = observation.tag('value');
      var value = el.attr('value'),
          unit = el.attr('unit');
      // We could look for xsi:type="PQ" (physical quantity) but it seems better
      // not to trust that that field has been used correctly...
      if (value && !isNaN(parseFloat(value))) {
        value = parseFloat(value);
      }
      if (!value) {
        value = el.val(); // look for free-text values
      }
      
      el = observation.tag('referenceRange');
      var reference_range_text = Core.stripWhitespace(el.tag('observationRange').tag('text').val()),
          reference_range_low_unit = el.tag('observationRange').tag('low').attr('unit'),
          reference_range_low_value = el.tag('observationRange').tag('low').attr('value'),
          reference_range_high_unit = el.tag('observationRange').tag('high').attr('unit'),
          reference_range_high_value = el.tag('observationRange').tag('high').attr('value');
      
      tests_data.push({
        date: date,
        name: name,
        value: value,
        unit: unit,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        translation: {
          name: translation_name,
          code: translation_code,
          code_system: translation_code_system,
          code_system_name: translation_code_system_name
        },
        reference_range: {
          text: reference_range_text,
          low_unit: reference_range_low_unit,
          low_value: reference_range_low_value,
          high_unit: reference_range_high_unit,
          high_value: reference_range_high_value,
        }
      });
    }
    
    data.push({
      name: panel_name,
      code: panel_code,
      code_system: panel_code_system,
      code_system_name: panel_code_system_name,
      tests: tests_data
    });
  });
  
  return data;
};
;

/*
 * Parser for the CCDA medications section
 */

Parsers.CCDA.medications = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var data = [], el;
  
  var medications = ccda.section('medications');
  
  medications.entries().each(function(entry) {
    
    el = entry.tag('text');
    var sig = Core.stripWhitespace(el.val());

    var effectiveTimes = entry.elsByTag('effectiveTime');

    el = effectiveTimes[0]; // the first effectiveTime is the med start date
    var start_date = null, end_date = null;
    if (el) {
      start_date = parseDate(el.tag('low').attr('value'));
      end_date = parseDate(el.tag('high').attr('value'));
    }

    // the second effectiveTime might the schedule period or it might just
    // be a random effectiveTime from further in the entry... xsi:type should tell us
    el = effectiveTimes[1];
    var schedule_type = null, schedule_period_value = null, schedule_period_unit = null;
    if (el && el.attr('xsi:type') === 'PIVL_TS') {
      var institutionSpecified = el.attr('institutionSpecified');
      if (institutionSpecified === 'true') {
        schedule_type= 'frequency';
      } else if (institutionSpecified === 'false') {
        schedule_type = 'interval';
      }

      el = el.tag('period');
      schedule_period_value = el.attr('value');
      schedule_period_unit = el.attr('unit');
    }
    
    el = entry.tag('manufacturedProduct').tag('code');
    var product_name = el.attr('displayName'),
        product_code = el.attr('code'),
        product_code_system = el.attr('codeSystem');

    var product_original_text = null;
    el = entry.tag('manufacturedProduct').tag('originalText');
    if (!el.isEmpty()) {
      product_original_text = Core.stripWhitespace(el.val());
    }
    // if we don't have a product name yet, try the originalText version
    if (!product_name && product_original_text) {
      product_name = product_original_text;
    }
    
    el = entry.tag('manufacturedProduct').tag('translation');
    var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');
    
    el = entry.tag('doseQuantity');
    var dose_value = el.attr('value'),
        dose_unit = el.attr('unit');
    
    el = entry.tag('rateQuantity');
    var rate_quantity_value = el.attr('value'),
        rate_quantity_unit = el.attr('unit');
    
    el = entry.tag('precondition').tag('value');
    var precondition_name = el.attr('displayName'),
        precondition_code = el.attr('code'),
        precondition_code_system = el.attr('codeSystem');
    
    el = entry.template('2.16.840.1.113883.10.20.22.4.19').tag('value');
    var reason_name = el.attr('displayName'),
        reason_code = el.attr('code'),
        reason_code_system = el.attr('codeSystem');
    
    el = entry.tag('routeCode');
    var route_name = el.attr('displayName'),
        route_code = el.attr('code'),
        route_code_system = el.attr('codeSystem'),
        route_code_system_name = el.attr('codeSystemName');
    
    // participant/playingEntity => vehicle
    el = entry.tag('participant').tag('playingEntity');
    var vehicle_name = el.tag('name').val();

    el = el.tag('code');
    // prefer the code vehicle_name but fall back to the non-coded one
    vehicle_name = el.attr('displayName') || vehicle_name;
    var vehicle_code = el.attr('code'),
        vehicle_code_system = el.attr('codeSystem'),
        vehicle_code_system_name = el.attr('codeSystemName');
    
    el = entry.tag('administrationUnitCode');
    var administration_name = el.attr('displayName'),
        administration_code = el.attr('code'),
        administration_code_system = el.attr('codeSystem'),
        administration_code_system_name = el.attr('codeSystemName');
    
    // performer => prescriber
    el = entry.tag('performer');
    var prescriber_organization = el.tag('name').val(),
        prescriber_person = null;
    
    data.push({
      date_range: {
        start: start_date,
        end: end_date
      },
      text: sig,
      product: {
        name: product_name,
        code: product_code,
        code_system: product_code_system,
        text: product_original_text,
        translation: {
          name: translation_name,
          code: translation_code,
          code_system: translation_code_system,
          code_system_name: translation_code_system_name
        }
      },
      dose_quantity: {
        value: dose_value,
        unit: dose_unit
      },
      rate_quantity: {
        value: rate_quantity_value,
        unit: rate_quantity_unit
      },
      precondition: {
        name: precondition_name,
        code: precondition_code,
        code_system: precondition_code_system
      },
      reason: {
        name: reason_name,
        code: reason_code,
        code_system: reason_code_system
      },
      route: {
        name: route_name,
        code: route_code,
        code_system: route_code_system,
        code_system_name: route_code_system_name
      },
      schedule: {
        type: schedule_type,
        period_value: schedule_period_value,
        period_unit: schedule_period_unit
      },
      vehicle: {
        name: vehicle_name,
        code: vehicle_code,
        code_system: vehicle_code_system,
        code_system_name: vehicle_code_system_name
      },
      administration: {
        name: administration_name,
        code: administration_code,
        code_system: administration_code_system,
        code_system_name: administration_code_system_name
      },
      prescriber: {
        organization: prescriber_organization,
        person: prescriber_person
      }
    });
  });
  
  return data;
};
;

/*
 * Parser for the CCDA problems section
 */

Parsers.CCDA.problems = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var problems = ccda.section('problems');
  
  problems.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var start_date = parseDate(el.tag('low').attr('value')),
        end_date = parseDate(el.tag('high').attr('value'));
    
    el = entry.template('2.16.840.1.113883.10.20.22.4.4').tag('value');
    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem'),
        code_system_name = el.attr('codeSystemName');
    
    el = entry.template('2.16.840.1.113883.10.20.22.4.4').tag('translation');
    var translation_name = el.attr('displayName'),
      translation_code = el.attr('code'),
      translation_code_system = el.attr('codeSystem'),
      translation_code_system_name = el.attr('codeSystemName');
    
    el = entry.template('2.16.840.1.113883.10.20.22.4.6');
    var status = el.tag('value').attr('displayName');
    
    var age = null;
    el = entry.template('2.16.840.1.113883.10.20.22.4.31');
    if (!el.isEmpty()) {
      age = parseFloat(el.tag('value').attr('value'));
    }

    el = entry.template('2.16.840.1.113883.10.20.22.4.64');
    var comment = Core.stripWhitespace(el.tag('text').val());
    
    data.push({
      date_range: {
        start: start_date,
        end: end_date
      },
      name: name,
      status: status,
      age: age,
      code: code,
      code_system: code_system,
      code_system_name: code_system_name,
      translation: {
        name: translation_name,
        code: translation_code,
        code_system: translation_code_system,
        code_system_name: translation_code_system_name
      },
      comment: comment
    });
  });
  
  return data;
};
;

/*
 * Parser for the CCDA procedures section
 */

Parsers.CCDA.procedures = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var procedures = ccda.section('procedures');
  
  procedures.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var date = parseDate(el.attr('value'));
    
    el = entry.tag('code');
    var name = el.attr('displayName'),
        code = el.attr('code'),
        code_system = el.attr('codeSystem');

    if (!name) {
      name = Core.stripWhitespace(entry.tag('originalText').val());
    }
    
    // 'specimen' tag not always present
    el = entry.tag('specimen').tag('code');
    var specimen_name = el.attr('displayName'),
        specimen_code = el.attr('code'),
        specimen_code_system = el.attr('codeSystem');
    
    el = entry.tag('performer').tag('addr');
    var organization = el.tag('name').val(),
        phone = el.tag('telecom').attr('value');
    
    var performer_dict = parseAddress(el);
    performer_dict.organization = organization;
    performer_dict.phone = phone;
    
    // participant => device
    el = entry.template('2.16.840.1.113883.10.20.22.4.37').tag('code');
    var device_name = el.attr('displayName'),
        device_code = el.attr('code'),
        device_code_system = el.attr('codeSystem');
    
    data.push({
      date: date,
      name: name,
      code: code,
      code_system: code_system,
      specimen: {
        name: specimen_name,
        code: specimen_code,
        code_system: specimen_code_system
      },
      performer: performer_dict,
      device: {
        name: device_name,
        code: device_code,
        code_system: device_code_system
      }
    });
  });
  
  return data;
};
;

/*
 * Parser for the CCDA smoking status in social history section
 */

Parsers.CCDA.smoking_status = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data, el;

  var name = null,
      code = null,
      code_system = null,
      code_system_name = null,
      entry_date = null;

  // We can parse all of the social_history sections,
  // but in practice, this section seems to be used for
  // smoking status, so we're just going to break that out.
  // And we're just looking for the first non-empty one.
  var social_history = ccda.section('social_history');
  var entries = social_history.entries();
  for (var i=0; i < entries.length; i++) {
    var entry = entries[i];

    var smoking_status = entry.template('2.16.840.1.113883.10.20.22.4.78');
    if (smoking_status.isEmpty()) {
      smoking_status = entry.template('2.16.840.1.113883.10.22.4.78');
    }
    if (smoking_status.isEmpty()) {
      continue;
    }

    el = smoking_status.tag('effectiveTime');
    entry_date = parseDate(el.attr('value'));

    el = smoking_status.tag('value');
    name = el.attr('displayName');
    code = el.attr('code');
    code_system = el.attr('codeSystem');
    code_system_name = el.attr('codeSystemName');

    if (name) {
      break;
    }
  }

  data = {
    date: entry_date,
    name: name,
    code: code,
    code_system: code_system,
    code_system_name: code_system_name
  };
  
  return data;
};
;

/*
 * Parser for the CCDA vitals section
 */

Parsers.CCDA.vitals = function (ccda) {
  
  var parseDate = Documents.parseDate;
  var parseName = Documents.parseName;
  var parseAddress = Documents.parseAddress;
  var data = [], el;
  
  var vitals = ccda.section('vitals');
  
  vitals.entries().each(function(entry) {
    
    el = entry.tag('effectiveTime');
    var entry_date = parseDate(el.attr('value'));
    
    var result;
    var results = entry.elsByTag('component');
    var results_data = [];
    
    for (var i = 0; i < results.length; i++) {
      result = results[i];
      
      el = result.tag('code');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      el = result.tag('value');
      var value = parseFloat(el.attr('value')),
          unit = el.attr('unit');
      
      results_data.push({
        name: name,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        value: value,
        unit: unit
      });
    }
    
    data.push({
      date: entry_date,
      results: results_data
    });
  });
  
  return data;
};
;

/*
 * ...
 */

/* exported Renderers */
var Renderers = (function () {
  
  var method = function () {};
  
  return {
    method: method
  };
  
})();
;

/*
 * ...
 */

/* exported BlueButton */
var BlueButton = function (source, opts) {
  var type, parsedData, parsedDocument;
  
  // Look for options
  if (!opts) opts = {};
  
  // Detect and parse the source data
  parsedData = Core.parseData(source);
  
  // Detect and parse the document
  if (opts.parser) {
    
    // TODO: parse the document with provided custom parser
    parsedDocument = opts.parser();
    
  } else {
    type = Documents.detect(parsedData);
    switch (type) {
      case 'c32':
        parsedData = Documents.C32.process(parsedData);
        parsedDocument = Parsers.C32.run(parsedData);
        break;
      case 'ccda':
        parsedData = Documents.CCDA.process(parsedData);
        parsedDocument = Parsers.CCDA.run(parsedData);
        break;
      case 'json':
        /* Expects a call like:
         * BlueButton(json string, {
         *   generatorType: 'ccda',
         *   template: < EJS file contents >
         * })
         * The returned "type" will be the requested type (not "json")
         * and the XML will be turned as a string in the 'data' key
         */
        switch (opts.generatorType) {
          // only the unit tests ever need to worry about this testingMode argument
          case 'c32':
            type = 'c32';
            parsedDocument = Generators.C32.run(parsedData, opts.template, opts.testingMode);
            break;
          case 'ccda':
            type = 'ccda';
            parsedDocument = Generators.CCDA.run(parsedData, opts.template, opts.testingMode);
            break;
        }
    }
  }
  
  return {
    type: type,
    data: parsedDocument,
    source: parsedData
  };

};


return BlueButton;

}));
