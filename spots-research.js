// Generated from public-source research (VFA, Parks Victoria, Coliban Water, FlyLife, Visit Macedon Ranges …), checked Oct 2026.
// Pins come from OpenStreetMap; each spot carries a confidence. Loaded after spots.js: adds waters and extends existing ones.
(() => {
  window.SOURCES.research = 'Public sources (VFA, Parks Victoria, water authorities), checked Oct 2026';
  const byId = id => window.WATERS.find(w => w.id === id);
  const EXTEND = [
  {
    "id": "yarra",
    "spots": [
      {
        "id": "yarra-little-peninsula-tunnel-picnic-area-mcmahons-creek",
        "name": "Little Peninsula Tunnel picnic area, McMahons Creek",
        "lat": -37.71258,
        "lng": 145.809,
        "note": "Signed picnic area with upper and lower car parks off Woods Point Rd. Walk down to the river beside the old tunnel cut.",
        "tags": [
          "fly",
          "lure",
          "parking",
          "picnic"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "yarra-big-peninsula-tunnel-car-park-mcmahons-creek",
        "name": "Big Peninsula Tunnel car park, McMahons Creek",
        "lat": -37.70509,
        "lng": 145.82027,
        "note": "Small car park off Woods Point Rd near the Big Peninsula Tunnel. Tighter water upstream of Warburton.",
        "tags": [
          "fly",
          "parking"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "yarra-upper-yarra-reservoir-park-river-below-the-dam",
        "name": "Upper Yarra Reservoir Park (river below the dam)",
        "lat": -37.66944,
        "lng": 145.89028,
        "note": "Camping and day visitor area below the dam wall. Fishing is NOT allowed in the reservoir or aqueduct. VFA lists the river from the reservoir down to Warburton as open, but Parks Vic doesn't mention the river below the wall, so check the signs on site.",
        "tags": [
          "fly",
          "camping",
          "parking",
          "check-rules"
        ],
        "conf": "medium",
        "src": "research"
      }
    ],
    "sources": [
      "https://flylife.com.au/fly-fishing/australia/victoria/yarra-river-upper",
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/yarra/yarra-angling-waters",
      "https://www.parks.vic.gov.au/places-to-see/parks/upper-yarra-reservoir-park"
    ]
  },
  {
    "id": "steavenson",
    "spots": [
      {
        "id": "steavenson-vic-oak-picnic-area-taggerty-river-confluence",
        "name": "Vic Oak Picnic Area (Taggerty River confluence)",
        "lat": -37.48635,
        "lng": 145.75509,
        "note": "Riverside picnic area on Buxton–Marysville Rd, where the Taggerty River joins the Steavenson. Easy bank access. Vic Oak Bridge is right beside it.",
        "tags": [
          "picnic area",
          "bridge",
          "easy access",
          "fly"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "steavenson-yellow-dog-picnic-area-below-steavenson-falls",
        "name": "Yellow Dog Picnic Area (below Steavenson Falls)",
        "lat": -37.52248,
        "lng": 145.77425,
        "note": "VFA says there is good road access here, below the falls. Small, fast water through a fern gully. Suits short casts.",
        "tags": [
          "picnic area",
          "small stream",
          "fly"
        ],
        "conf": "high",
        "src": "research"
      }
    ],
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/goulburn/goulburn-angling-waters",
      "https://www.peppersmarysville.com.au/places/fishing-spots-around-marysville/",
      "https://flylife.com.au/fly-fishing/australia/victoria/steavenson-river",
      "https://en.wikipedia.org/wiki/Taggerty_River"
    ]
  },
  {
    "id": "acheron",
    "spots": [
      {
        "id": "acheron-nichols-road-bridge",
        "name": "Nichols Road bridge",
        "lat": -37.48508,
        "lng": 145.67831,
        "note": "Road crossing below Narbethong, named by VFA as an access point. Fish from the road reserve and respect the private land either side.",
        "tags": [
          "bridge",
          "roadside"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "acheron-glendale-lane-bridge-taggerty",
        "name": "Glendale Lane bridge, Taggerty",
        "lat": -37.35269,
        "lng": 145.7069,
        "note": "Peppers Marysville calls it a popular spot where the road crosses the river, with a small reserve next to it. VFA doesn't list it.",
        "tags": [
          "bridge",
          "reserve"
        ],
        "conf": "medium",
        "src": "research"
      }
    ],
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/goulburn/goulburn-angling-waters",
      "https://www.peppersmarysville.com.au/places/fishing-spots-around-marysville/"
    ]
  },
  {
    "id": "rubicon",
    "spots": [],
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/goulburn/goulburn-angling-waters",
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/northern-victoria-inland-fishing-maps/goulburn-river"
    ]
  },
  {
    "id": "goulburn",
    "spots": [
      {
        "id": "goulburn-alexandra-bridge-maroondah-hwy-boat-ramp",
        "name": "Alexandra Bridge",
        "lat": -37.19909,
        "lng": 145.6844,
        "note": "VFA access site: 2WD in any weather, picnic tables and good bank access.",
        "tags": [
          "2WD",
          "easy access"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "goulburn-brooks-brookes-river-reserve",
        "name": "Brooks (Brookes) River Reserve",
        "lat": -37.19063,
        "lng": 145.67107,
        "note": "VFA site via Swan Rd and Brooks Cutting Rd west of Alexandra, with camping, toilets and BBQs. The bank is moderate to steep, so pick your way down carefully.",
        "tags": [
          "camping",
          "2WD",
          "steep bank"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "goulburn-point-hill-reserve-boat-ramp",
        "name": "Point Hill Reserve",
        "lat": -37.25843,
        "lng": 145.85157,
        "note": "About 5.3 km along Back Eildon Rd. One of VFA’s recognised spots, with a moderate bank and no facilities.",
        "tags": [
          "2WD",
          "bank"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "goulburn-molesworth-gv-hwy-bridge-recreation-reserve",
        "name": "Molesworth (GV Hwy bridge)",
        "lat": -37.16437,
        "lng": 145.54426,
        "note": "VFA lists Molesworth among the downstream road crossings and reserves. Bank access by the bridge and recreation reserve.",
        "tags": [
          "bridge",
          "bank"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "goulburn-killingworth-rd-streamside-reserve",
        "name": "Killingworth Rd Streamside Reserve",
        "lat": -37.16456,
        "lng": 145.42495,
        "note": "About 6 km along Killingworth Rd. A streamside reserve with no facilities; the track in is dry-weather only. The pin is the reserve centre, not the car park.",
        "tags": [
          "reserve",
          "dry weather"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "goulburn-ghin-ghin-rd-bridge",
        "name": "Ghin Ghin Rd bridge",
        "lat": -37.18148,
        "lng": 145.36911,
        "note": "About 3.5 km along Ghin Ghin Rd. Moderate bank, 2WD in dry weather.",
        "tags": [
          "bridge",
          "2WD"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "goulburn-horseshoe-lagoon-camping-reserve-greenslopes-rd",
        "name": "Horseshoe Lagoon Camping Reserve (Greenslopes Rd)",
        "lat": -37.132,
        "lng": 145.23733,
        "note": "VFA site about 7.1 km along Greenslopes Rd, with camping, toilets and BBQs. The pin is the reserve centroid. The campground itself isn't in OSM.",
        "tags": [
          "camping",
          "toilets",
          "2WD"
        ],
        "conf": "low",
        "src": "research"
      },
      {
        "id": "goulburn-trawool-bridge-end-of-tailrace",
        "name": "Trawool Bridge (end of tailrace)",
        "lat": -37.09119,
        "lng": 145.20177,
        "note": "Downstream limit of the Goulburn tailrace regulations, which ban all hook-and-line fishing in the closed season. VFA says there is good access along Trawool–Tallarook Rd.",
        "tags": [
          "bridge",
          "regulation boundary"
        ],
        "conf": "medium",
        "src": "research"
      }
    ],
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/goulburn/goulburn-angling-waters",
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/northern-victoria-inland-fishing-maps/goulburn-river",
      "https://flylife.com.au/fly-fishing/australia/victoria/goulburn-river"
    ]
  },
  {
    "id": "eildon-pondage",
    "spots": [],
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/goulburn/goulburn-angling-waters",
      "https://www.visitvictoria.com/regions/high-country/see-and-do/outdoor-and-adventure/fishing"
    ]
  }
];
  const BLURB_ADD = {
  "_goulburn_old": "Irrigation flows run high from late September to April, so check releases first (Goulburn-Murray Water, Lake Eildon page). In the river closed season, fishing gear is banned within 20 m of the river from Eildon to Trawool, tributaries included. About 2,000 big rainbows were stocked for the 2026 opening, shared with the Pondage. The Goulburn Valley Fly Fishing Centre at Thornton is the place for current local info.",
  "_eildon_old": "VFA lists browns and rainbows to 3.5 kg. No fishing for 200 m below the Pondage weir.",
  "rubicon": "Special limits: 25 cm minimum and 3 trout a day.",
  "steavenson": "Unstocked, self-sustaining browns, mostly small (about 220 g on average), and heavily fished."
};
  const PATCH = {
  "tumbling": {
    "lat": -37.2797,
    "lng": 145.7998,
    "conf": "medium",
    "noteAdd": "Pin moved to the Taggerty–Thornton Rd bridge (OpenStreetMap), about 3 km from the highway, where VFA says the 4 km of improved Crown frontage starts."
  }
};
  for (const e of EXTEND) { const w = byId(e.id); if (!w) continue; w.spots.push(...e.spots); w.sources = [...(w.sources || []), ...(e.sources || [])]; }
  for (const [id, txt] of Object.entries(BLURB_ADD)) { const w = byId(id); if (w) w.blurb = `${w.blurb} ${txt}`; }
  for (const w of window.WATERS) for (const s of w.spots) { const p = PATCH[s.id]; if (p) { Object.assign(s, { lat: p.lat, lng: p.lng, conf: p.conf }); s.note = `${s.note} ${p.noteAdd}`; } }
  window.WATERS.push(...[
  {
    "id": "lerderderg-river",
    "name": "Lerderderg River",
    "region": "Blackwood",
    "type": "trout",
    "colour": "#2563eb",
    "blurb": "Self-sustaining wild browns, mostly small (10–25 cm), best around Blackwood and in the gorge upstream of the Goodmans Creek junction. Walk-in only through the gorge (no vehicle access, weir road locked); low summer flows make it patchy.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/werribee/werribee-angling-waters",
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/werribee",
      "https://fishingmad.com.au/location/lerderderg-river/"
    ],
    "spots": [
      {
        "id": "lerderderg-river-o-briens-crossing",
        "name": "O'Briens Crossing",
        "lat": -37.49615,
        "lng": 144.36097,
        "note": "Car park and picnic area at the crossing off O'Briens Road. Mid-gorge water; walk up or downstream from here.",
        "tags": [
          "walk-in",
          "picnic",
          "camping"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "lerderderg-river-blackwood-lerderderg-track-footbridge-mineral-springs",
        "name": "Blackwood – Lerderderg Track footbridge (Mineral Springs reserve)",
        "lat": -37.47053,
        "lng": 144.31329,
        "note": "Footbridge over the river on the Lerderderg Track just east of the Blackwood picnic/caravan park area. Park near the picnic ground off Byres Road. Small-brown water.",
        "tags": [
          "walk-in",
          "small stream",
          "fly"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "lerderderg-river-north-blackwood-road-bridge",
        "name": "North Blackwood Road bridge",
        "lat": -37.47308,
        "lng": 144.32174,
        "note": "Road bridge downstream of Blackwood township with a small parking spot nearby; start point for walking down toward O'Briens.",
        "tags": [
          "walk-in",
          "fly"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "lerderderg-river-mackenzies-flat",
        "name": "Mackenzies Flat",
        "lat": -37.61592,
        "lng": 144.42508,
        "note": "Picnic ground with car park and toilets at the lower (Bacchus Marsh) end of the gorge, off Lerderderg Gorge Road. Stepping stones and walking tracks to the river. Expect redfin as well as the odd trout.",
        "tags": [
          "picnic",
          "family",
          "walk-in"
        ],
        "conf": "high",
        "src": "research"
      }
    ]
  },
  {
    "id": "werribee-river",
    "name": "Werribee River",
    "region": "Ballan / Werribee Gorge",
    "type": "trout",
    "colour": "#0d9488",
    "blurb": "At Ballan the river is small (2–5 m) and shallow, with a few deep pools holding small browns, redfin and blackfish. Through Werribee Gorge browns run to 800 g (average about 300 g) alongside plenty of small redfin.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/werribee/werribee-angling-waters"
    ],
    "spots": [
      {
        "id": "werribee-river-ballan-mill-park-blackwood-street-bridge",
        "name": "Ballan – Mill Park (Blackwood Street bridge)",
        "lat": -37.59805,
        "lng": 144.23032,
        "note": "Town park with parking and toilets right on the river. Look for the deeper pools; much of the reach is skinny in summer.",
        "tags": [
          "easy access",
          "family",
          "small stream"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "werribee-river-ballan-spencer-road-bridge",
        "name": "Ballan – Spencer Road bridge",
        "lat": -37.59883,
        "lng": 144.22118,
        "note": "Upstream end of the town reach; roadside access at the bridge.",
        "tags": [
          "small stream"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "werribee-river-werribee-gorge-meikles-point-picnic-area",
        "name": "Werribee Gorge – Meikles Point Picnic Area",
        "lat": -37.67317,
        "lng": 144.36425,
        "note": "Car park at the lower end of the gorge; access to the deep gorge pools via the Werribee Gorge Circuit Walk.",
        "tags": [
          "walk-in",
          "picnic"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "werribee-river-werribee-gorge-quarry-picnic-area",
        "name": "Werribee Gorge – Quarry Picnic Area",
        "lat": -37.66392,
        "lng": 144.3635,
        "note": "Second gorge car park on the circuit walk, a short way upstream of Meikles Point.",
        "tags": [
          "walk-in",
          "picnic"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "campaspe-river",
    "name": "Campaspe River",
    "region": "Kyneton",
    "type": "trout",
    "colour": "#9333ea",
    "blurb": "A pleasant town stretch with a riverside walk, but VFA calls the Kyneton reach mostly unsuitable as trout water. A 2004 survey near Kyneton caught no trout and it's no longer stocked. Treat any trout as a bonus; tench and redfin dominate.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/campaspe/campaspe-angling-waters",
      "https://www.visitmacedonranges.com/see-do/fishing-swimming/"
    ],
    "spots": [
      {
        "id": "campaspe-river-end-of-mill-street-old-fishing-platform",
        "name": "End of Mill Street (old fishing platform)",
        "lat": -37.25024,
        "lng": 144.44148,
        "note": "Visit Macedon Ranges describes an old fishing platform at the end of Mill Street, with picnic tables. The platform itself isn't mapped in OSM, so the pin marks the street end at the river walk.",
        "tags": [
          "easy access",
          "family"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "upper-coliban-reservoir",
    "name": "Upper Coliban Reservoir",
    "region": "Kyneton",
    "type": "lake",
    "colour": "#c2410c",
    "blurb": "Deep Coliban Water storage stocked with brown trout, also holding redfin. Fished from the shore at two recreation areas.",
    "sources": [
      "https://www.coliban.com.au/about-us/our-reservoirs/upper-coliban-reservoir",
      "https://coliban.com.au/new-reservoir-access-point-win-victorian-anglers",
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/campaspe/campaspe-angling-waters"
    ],
    "spots": [
      {
        "id": "upper-coliban-reservoir-dam-wall-kayak-launch-kyneton-springhill-road",
        "name": "Dam wall recreation area (Kyneton–Springhill Rd)",
        "lat": -37.28738,
        "lng": 144.39741,
        "note": "Main shore access at the dam wall. Coliban Water closed this area while the reservoir was spilling, so check before you go.",
        "tags": [
          "bank",
          "car park"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "upper-coliban-reservoir-premier-mine-road-access",
        "name": "Premier Mine Road access",
        "lat": -37.2777,
        "lng": 144.41592,
        "note": "Second shore access point, opened in 2019 with VFA and the Kyneton Angling Club. The pin is the road end.",
        "tags": [
          "bank"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "lauriston-reservoir",
    "name": "Lauriston Reservoir",
    "region": "Kyneton",
    "type": "lake",
    "colour": "#15803d",
    "blurb": "Deep storage holding mostly redfin plus browns to 1.4 kg, stocked regularly with brown trout yearlings. Water levels swing a lot, so the margins are bare.",
    "sources": [
      "https://coliban.com.au/about-us/our-reservoirs/lauriston-reservoir",
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/campaspe/campaspe-angling-waters"
    ],
    "spots": [
      {
        "id": "lauriston-reservoir-loop-road-slipway",
        "name": "Loop Road recreation area",
        "lat": -37.2554,
        "lng": 144.3812,
        "note": "Recreation area with a car park, toilets and BBQ, per Coliban Water. Pin is approximate.",
        "tags": [
          "bank"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "lauriston-reservoir-shepherds-hill-road-car-park",
        "name": "Shepherds Hill Road car park",
        "lat": -37.25807,
        "lng": 144.37035,
        "note": "Car park near the western arm. VFA says you'll need to walk a fair way to reach most of the shore.",
        "tags": [
          "bank",
          "walk-in"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "malmsbury-reservoir",
    "name": "Malmsbury Reservoir",
    "region": "Malmsbury",
    "type": "lake",
    "colour": "#be185d",
    "blurb": "The shallowest and most productive of the three Coliban storages. Browns average about 1 kg, with occasional fish over 4 kg. Best when rising water floods grassy margins.",
    "sources": [
      "https://coliban.com.au/about-us/our-reservoirs/malmsbury-reservoir",
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/campaspe/campaspe-angling-waters"
    ],
    "spots": [
      {
        "id": "malmsbury-reservoir-dam-wall-picnic-area-sullivan-street-malmsbury",
        "name": "Dam wall picnic area (Sullivan Street, Malmsbury)",
        "lat": -37.19532,
        "lng": 144.37503,
        "note": "Picnic and BBQ area at the town end. VFA notes trout around the dam wall. Coliban Water closed the reservoir to on-water use after heavy rain in October 2026, so check shore access before you go.",
        "tags": [
          "bank",
          "picnic"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "hepburn-lagoon",
    "name": "Hepburn Lagoon",
    "region": "Daylesford",
    "type": "lake",
    "colour": "#0369a1",
    "blurb": "Shallow, weedy and fertile storage with browns and rainbows averaging around 1.6 kg. Trophy-water rules apply (45 cm minimum, 3 fish), and it's said to fish best in cold, wet weather.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/loddon-south/loddon-south-angling-waters",
      "https://vfa.vic.gov.au/recreational-fishing/recreational-fishing-guide/trout-and-salmon-regulations"
    ],
    "spots": [
      {
        "id": "hepburn-lagoon-daylesford-clunes-road-access-car-park",
        "name": "Daylesford–Clunes Road access car park",
        "lat": -37.36643,
        "lng": 143.99211,
        "note": "Matches VFA's walking access track off the Smeaton/Blampied (Clunes) Road. Access crosses private land on foot via stiles. The northern shore is good fly water.",
        "tags": [
          "fly",
          "walk-in",
          "bank only"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "newlyn-reservoir",
    "name": "Newlyn Reservoir",
    "region": "Daylesford",
    "type": "lake",
    "colour": "#a16207",
    "blurb": "Deep, open storage with browns averaging about 1.2 kg (up to 2.4 kg) and redfin. Easy to reach and suits most methods, with fly fishing popular in the north-east corner and the south.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/loddon-south/loddon-south-angling-waters"
    ],
    "spots": [
      {
        "id": "newlyn-reservoir-north-east-corner",
        "name": "North-east corner",
        "lat": -37.40323,
        "lng": 144.00852,
        "note": "VFA's preferred fly spot. Reached from the north (Newlyn Road / Midland Highway side). The pin is the shoreline, not a car park.",
        "tags": [
          "fly",
          "bank only"
        ],
        "conf": "low",
        "src": "research"
      },
      {
        "id": "newlyn-reservoir-south-end-sutton-park-road",
        "name": "South end – Sutton Park Road",
        "lat": -37.4169,
        "lng": 144.00157,
        "note": "VFA lists Sutton Park Road as the southern access. Walk to the south shore, which is also a fly spot.",
        "tags": [
          "fly",
          "bank only"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "wombat-reservoir",
    "name": "Wombat Reservoir",
    "region": "Daylesford",
    "type": "lake",
    "colour": "#4f46e5",
    "blurb": "Small, deep forest storage stocked regularly with browns and rainbows. Fish tend to be small, and trout are reported near the dam wall.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/loddon-south/loddon-south-angling-waters",
      "https://fishingmad.com.au/location/wombat-reservoir/"
    ],
    "spots": [
      {
        "id": "wombat-reservoir-wombat-dam-road-car-park-dam-wall",
        "name": "Wombat Dam Road car park (dam wall)",
        "lat": -37.39166,
        "lng": 144.17381,
        "note": "Car park at the north (dam wall) end. Wombat Creek Picnic Ground (way 862469220) is just below. No wading or boating.",
        "tags": [
          "bank only",
          "family"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "loddon-river",
    "name": "Loddon River",
    "region": "Guildford",
    "type": "trout",
    "colour": "#b91c1c",
    "blurb": "Self-sustaining browns averaging about 400 g, with fish running up from Cairn Curran to spawn in May. Good public access at a small reserve in Guildford. Downstream toward Newstead it runs through private land.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/loddon-south/loddon-south-angling-waters"
    ],
    "spots": [
      {
        "id": "loddon-river-guildford-midland-highway-bridge",
        "name": "Guildford – Midland Highway bridge",
        "lat": -37.14711,
        "lng": 144.16663,
        "note": "Bridge on the edge of town. VFA notes a small reserve with no facilities here; park in town.",
        "tags": [
          "easy access"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "loddon-river-guildford-fryers-street-car-park-john-powell-reserve",
        "name": "Guildford – Fryers Street car park / John Powell Reserve",
        "lat": -37.14927,
        "lng": 144.16701,
        "note": "Town parking and toilets close to the river. Not confirmed that this is the exact reserve VFA means.",
        "tags": [
          "easy access",
          "toilets"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "watts-river",
    "name": "Watts River",
    "region": "Healesville",
    "type": "trout",
    "colour": "#047857",
    "blurb": "Only the stretch below Maroondah Reservoir is open. VFA lists brown trout to about 1.2 kg in the lower reaches, plus blackfish, redfin and eels. Everything upstream of the reservoir, including Fernshaw, is closed Melbourne Water catchment.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/yarra/yarra-angling-waters",
      "https://fishinginsoutheastaustralia.wordpress.com/2011/12/15/melbournes-trout-streams-a-rough-guide/"
    ],
    "spots": [
      {
        "id": "watts-river-maroondah-reservoir-park-picnic-area-below-the-dam",
        "name": "Maroondah Reservoir Park picnic area (below the dam)",
        "lat": -37.64363,
        "lng": 145.54577,
        "note": "VFA says a section below the reservoir can be reached from the picnic area. No fishing in the reservoir itself.",
        "tags": [
          "lure",
          "fly",
          "picnic",
          "parking"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "watts-river-glenfern-road-bridge-healesville",
        "name": "Glenfern Road bridge, Healesville",
        "lat": -37.6528,
        "lng": 145.51134,
        "note": "Town-edge bridge crossing. Stick to public land and road reserve.",
        "tags": [
          "lure",
          "bait"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "watts-river-healesville-kinglake-road-bridge",
        "name": "Healesville-Kinglake Road bridge",
        "lat": -37.65309,
        "lng": 145.50181,
        "note": "Main road bridge on the west side of Healesville with a bike path bridge next to it. Park off the road.",
        "tags": [
          "lure",
          "bait"
        ],
        "conf": "high",
        "src": "research"
      }
    ]
  },
  {
    "id": "grace-burn",
    "name": "Grace Burn",
    "region": "Healesville",
    "type": "trout",
    "colour": "#7c2d12",
    "blurb": "Small gravel-bottomed creek that meets the Watts at Healesville. VFA lists small brown trout to about 350 g. The upper valley above Graceburn Weir is water-supply catchment.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/yarra/yarra-angling-waters",
      "https://www.parks.vic.gov.au/places-to-see/sites/graceburn-weir"
    ],
    "spots": [
      {
        "id": "grace-burn-queens-park-don-road-bridge-healesville",
        "name": "Queens Park / Don Road bridge, Healesville",
        "lat": -37.65214,
        "lng": 145.52398,
        "note": "In-town access from Queens Park. Small water, so fish light.",
        "tags": [
          "fly",
          "kids",
          "parking"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "grace-burn-wallace-parade-crossing-healesville",
        "name": "Wallace Parade crossing, Healesville",
        "lat": -37.65284,
        "lng": 145.53916,
        "note": "Quiet residential crossing on the east side of town. Upstream tracks are signed no public access.",
        "tags": [
          "fly"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "badger-creek",
    "name": "Badger Creek",
    "region": "Healesville",
    "type": "trout",
    "colour": "#6d28d9",
    "blurb": "Small forest creek that flows on through Healesville Sanctuary. VFA records small brown trout alongside blackfish and roach, and bans fishing upstream of the diversion dam.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/yarra/yarra-angling-waters"
    ],
    "spots": [
      {
        "id": "badger-creek-badger-creek-road-bridge",
        "name": "Badger Creek Road bridge",
        "lat": -37.68212,
        "lng": 145.53559,
        "note": "Road crossing near Healesville Sanctuary. You can't fish inside the sanctuary grounds, and it's unclear how much public bank there is, so check before you fish. Low confidence that this is a practical spot.",
        "tags": [
          "fly",
          "check-access"
        ],
        "conf": "low",
        "src": "research"
      }
    ]
  },
  {
    "id": "toorongo-river",
    "name": "Toorongo River",
    "region": "Noojee",
    "type": "trout",
    "colour": "#0e7490",
    "blurb": "Clear, small mountain stream near Noojee with good numbers of brown and rainbow trout, mostly 25-35 cm. Easy public access at the bridges along Toorongo Valley Road and at the campground below Toorongo Falls.",
    "sources": [
      "https://flylife.com.au/fly-fishing/australia/victoria/toorongo-river",
      "https://www.flyfishingvictoria.com/toorongo-river/",
      "https://www.exploreoutdoors.vic.gov.au/activities/camping/toorongo-falls"
    ],
    "spots": [
      {
        "id": "toorongo-river-toorongo-falls-campground",
        "name": "Toorongo Falls Campground",
        "lat": -37.85303,
        "lng": 146.04267,
        "note": "2WD-accessible campground with toilets and picnic areas. River is a short walk away, and you can wade upstream.",
        "tags": [
          "fly",
          "camping",
          "parking"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "toorongo-river-toorongo-valley-road-bridge-middle",
        "name": "Toorongo Valley Road bridge (middle)",
        "lat": -37.86756,
        "lng": 146.03797,
        "note": "One of several road bridges on Toorongo Valley Rd. Some banks are private, so stay on the road reserve and public land.",
        "tags": [
          "fly",
          "lure"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "toorongo-river-toorongo-valley-road-bridge-lower",
        "name": "Toorongo Valley Road bridge (lower)",
        "lat": -37.88057,
        "lng": 146.0397,
        "note": "Lower bridge closer to Noojee. Watch for private property.",
        "tags": [
          "fly",
          "lure"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "toorongo-river-mount-baw-baw-tourist-road-bridge-noojee",
        "name": "Mount Baw Baw Tourist Road bridge, Noojee",
        "lat": -37.90231,
        "lng": 146.02319,
        "note": "Main road crossing just above where the river joins the Latrobe at Noojee.",
        "tags": [
          "lure",
          "bait"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "loch-river",
    "name": "Loch River",
    "region": "Noojee",
    "type": "trout",
    "colour": "#65a30d",
    "blurb": "Small, tight stream with plenty of small brown trout. VFA notes some fish to 600 g, and FlyLife reports rainbows too. Loch Valley Road runs beside it, with campgrounds along the way, and it fishes from the Latrobe junction right up to the headwaters.",
    "sources": [
      "https://flylife.com.au/fly-fishing/australia/victoria/loch-river",
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/la-trobe2/la-trobe-angling-waters"
    ],
    "spots": [
      {
        "id": "loch-river-loch-valley-campground",
        "name": "Loch Valley Campground",
        "lat": -37.81889,
        "lng": 145.99389,
        "note": "Campground beside the river off Loch Valley Rd. Short rod, 3-weight.",
        "tags": [
          "fly",
          "camping"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "loch-river-the-poplars-camping-ground",
        "name": "The Poplars Camping Ground",
        "lat": -37.82024,
        "lng": 145.99367,
        "note": "A second campground just downstream of Loch Valley Campground.",
        "tags": [
          "fly",
          "camping"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "loch-river-gunns-road-bridge",
        "name": "Gunns Road bridge",
        "lat": -37.84475,
        "lng": 145.992,
        "note": "Road crossing midway down the valley.",
        "tags": [
          "fly"
        ],
        "conf": "high",
        "src": "research"
      }
    ]
  },
  {
    "id": "latrobe-river",
    "name": "Latrobe River",
    "region": "Noojee",
    "type": "trout",
    "colour": "#db2777",
    "blurb": "VFA rates the river above Noojee as the best stretch, with brown trout to 1.1 kg and an average of around 400 g. Forest camping areas and road bridges upstream of town give public access.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/la-trobe2/la-trobe-angling-waters"
    ],
    "spots": [
      {
        "id": "latrobe-river-latrobe-river-camping-area",
        "name": "Latrobe River Camping Area",
        "lat": -37.88283,
        "lng": 145.89095,
        "note": "Forest campground well upstream of Noojee, near Ada River Rd.",
        "tags": [
          "fly",
          "camping"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "latrobe-river-boys-camp-road-bridge",
        "name": "Boys Camp Road bridge",
        "lat": -37.89571,
        "lng": 145.96148,
        "note": "Road crossing a few kilometres above Noojee, in the stretch VFA rates best.",
        "tags": [
          "fly",
          "lure"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "latrobe-river-noojee-mount-baw-baw-tourist-road-bridge",
        "name": "Noojee - Mount Baw Baw Tourist Road bridge",
        "lat": -37.90691,
        "lng": 146.023,
        "note": "In-town bridge at Noojee. Easy stop, with the Trestle Bridge reserve close by.",
        "tags": [
          "lure",
          "bait",
          "parking"
        ],
        "conf": "high",
        "src": "research"
      }
    ]
  },
  {
    "id": "tanjil-river",
    "name": "Tanjil River",
    "region": "Baw Baw",
    "type": "trout",
    "colour": "#1d4ed8",
    "blurb": "Two branches holding wild brown and rainbow trout, about 2 h from Melbourne. Forestry tracks cross both branches. Some crossings are 2WD, but a 4WD helps and there are few walking tracks, so wade upstream.",
    "sources": [
      "https://fishingmad.com.au/location/tanjil-river/",
      "https://www.theultralighthiker.com/2017/02/11/tanjil-river-east-branch/",
      "http://fishingmonthly.net.au/Articles/Display/3979-Tanjil-River-The-Pick"
    ],
    "spots": [
      {
        "id": "tanjil-river-west-branch-costins-road-bridge",
        "name": "West Branch - Costins Road bridge",
        "lat": -37.93529,
        "lng": 146.13911,
        "note": "Forestry road crossing with informal camp spots nearby. Check track conditions.",
        "tags": [
          "fly",
          "camping",
          "4wd-helps"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "tanjil-river-east-branch-webbs-track-crossing",
        "name": "East Branch - Webbs Track crossing",
        "lat": -37.91065,
        "lng": 146.19742,
        "note": "UltralightHiker calls Webbs Track 2WD, but OSM tags it 4WD. Expect a rough track.",
        "tags": [
          "fly",
          "4wd-helps"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "tanjil-river-tanjil-junction",
        "name": "Tanjil Junction",
        "lat": -37.97837,
        "lng": 146.19199,
        "note": "Camp spot near where the two branches join. Remote forestry access.",
        "tags": [
          "fly",
          "camping",
          "4wd-helps"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "tanjil-river-west-branch-mount-baw-baw-road-tanjil-bren",
        "name": "West Branch - Mount Baw Baw Road, Tanjil Bren",
        "lat": -37.8306,
        "lng": 146.19443,
        "note": "Sealed-road headwater crossing. Small water, and OSM didn't confirm exactly which branch it crosses.",
        "tags": [
          "fly"
        ],
        "conf": "low",
        "src": "research"
      }
    ]
  },
  {
    "id": "delatite-river",
    "name": "Delatite River",
    "region": "Merrijig",
    "type": "trout",
    "colour": "#ca8a04",
    "blurb": "Flows off Mt Buller through Merrijig into Lake Eildon. VFA says it is 'very accessible from public roads', with abundant trout above Merrijig. Browns to 1.4 kg (most ~500 g). No longer stocked.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/goulburn/goulburn-angling-waters",
      "https://vfa.vic.gov.au/recreational-fishing/victorias-top-fishing-destinations/high-country/where-to-fish-high-country/mansfield"
    ],
    "spots": [
      {
        "id": "delatite-river-mount-buller-rd-bridge-merrijig",
        "name": "Mount Buller Rd bridge, Merrijig",
        "lat": -37.10629,
        "lng": 146.26412,
        "note": "Main road crossing at Merrijig, in the riffle-and-pool water. Fish upstream for the forest reach.",
        "tags": [
          "bridge",
          "roadside"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "delatite-river-delatite-lane-bridge",
        "name": "Delatite Lane bridge",
        "lat": -37.13885,
        "lng": 146.16908,
        "note": "Lower-reach crossing nearer Mansfield. VFA says these reaches have had low flows in dry years.",
        "tags": [
          "bridge",
          "roadside"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "howqua-river",
    "name": "Howqua River",
    "region": "Merrijig",
    "type": "trout",
    "colour": "#2563eb",
    "blurb": "Self-sustaining browns and rainbows (most under 350 g, to 1.8 kg). Camping and fishing access from Merrijig to Sheepyard Flat via Grammar School Rd. An angler walking track runs from Running Creek to Tobacco Flat, with unbridged crossings.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/goulburn/goulburn-angling-waters",
      "https://vfa.vic.gov.au/recreational-fishing/victorias-top-fishing-destinations/high-country/where-to-fish-high-country/mansfield"
    ],
    "spots": [
      {
        "id": "howqua-river-sheepyard-flat-campground",
        "name": "Sheepyard Flat campground",
        "lat": -37.19493,
        "lng": 146.34685,
        "note": "Main free campground, reached from Merrijig via Grammar School Rd and Brocks Rd. Good base for walking up and down the river.",
        "tags": [
          "camping",
          "bridge"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "howqua-river-frys-flat-campground",
        "name": "Frys Flat campground",
        "lat": -37.1959,
        "lng": 146.33053,
        "note": "Riverside campground just upstream of Sheepyard Flat. Fry's Hut is here.",
        "tags": [
          "camping"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "howqua-river-tobacco-flat-camping-area",
        "name": "Tobacco Flat camping area",
        "lat": -37.21708,
        "lng": 146.31533,
        "note": "Upstream end of the Running Creek–Tobacco Flat angler track. River crossings have no bridges, so avoid it in high flows.",
        "tags": [
          "camping",
          "walk-in"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "howqua-river-running-creek-campsite",
        "name": "Running Creek campsite",
        "lat": -37.23632,
        "lng": 146.23143,
        "note": "Downstream end of the angler walking track that VFA describes.",
        "tags": [
          "camping",
          "walk-in"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "howqua-river-mansfield-woods-point-rd-bridge-lower-howqua",
        "name": "Mansfield–Woods Point Rd bridge (lower Howqua)",
        "lat": -37.2215,
        "lng": 146.16667,
        "note": "Lower river near the lake. VFA mentions vehicle access for about 6 km upstream from Lake Eildon via Howqua River Rd.",
        "tags": [
          "bridge",
          "roadside"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "jamieson-river",
    "name": "Jamieson River",
    "region": "Jamieson",
    "type": "trout",
    "colour": "#0d9488",
    "blurb": "Mountain stream with browns and rainbows (av. 200 g, some larger). Only the lower 16 km through farmland is easily accessible. Upstream access is by a few tracks.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/goulburn/goulburn-angling-waters"
    ],
    "spots": [
      {
        "id": "jamieson-river-brewery-bridge-jamieson",
        "name": "Brewery Bridge, Jamieson",
        "lat": -37.3025,
        "lng": 146.14188,
        "note": "In Jamieson township, near where the river joins the Goulburn. Easy town access. Jamieson Caravan Park (private) is nearby.",
        "tags": [
          "bridge",
          "town"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "big-river",
    "name": "Big River",
    "region": "Eildon – Enoch Point",
    "type": "trout",
    "colour": "#9333ea",
    "blurb": "Excellent trout habitat with browns to 2.2 kg. Not stocked. VFA notes access via Enoch Point Rd (a camping ground at Enoch Point) and easy road access in the lower reaches. Mercury advisory: eat larger fish in moderation.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/goulburn/goulburn-angling-waters"
    ],
    "spots": [
      {
        "id": "big-river-eildon-jamieson-rd-bridge-lower-big-river",
        "name": "Eildon–Jamieson Rd bridge (lower Big River)",
        "lat": -37.36739,
        "lng": 146.05663,
        "note": "Easiest 2WD access, just above the Lake Eildon inlet.",
        "tags": [
          "bridge",
          "2WD"
        ],
        "conf": "high",
        "src": "research"
      },
      {
        "id": "big-river-enoch-point-picnic-area",
        "name": "Enoch Point Picnic Area",
        "lat": -37.42242,
        "lng": 146.09889,
        "note": "VFA mentions a camping ground at Enoch Point. Gravel forest roads, and 4WD tracks further up in dry weather only.",
        "tags": [
          "picnic area",
          "camping",
          "gravel road"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  },
  {
    "id": "upper-goulburn-river",
    "name": "Upper Goulburn River",
    "region": "Jamieson – Knockwood",
    "type": "trout",
    "colour": "#c2410c",
    "blurb": "Fast mountain river with abundant browns to 1.8 kg (av. 220 g) and some rainbows. Road access for 26 km from the Jamieson–Woods Point Rd up to Knockwood. Mercury advisory applies.",
    "sources": [
      "https://vfa.vic.gov.au/recreational-fishing/victorias-top-fishing-destinations/high-country/where-to-fish-high-country/mansfield",
      "https://vfa.vic.gov.au/recreational-fishing/fishing-locations/inland-angling-guide/areas/goulburn/goulburn-angling-waters"
    ],
    "spots": [
      {
        "id": "upper-goulburn-river-eildon-jamieson-rd-bridge-jamieson",
        "name": "Eildon–Jamieson Rd bridge, Jamieson",
        "lat": -37.28651,
        "lng": 146.13799,
        "note": "Bottom of the upper river at Jamieson.",
        "tags": [
          "bridge",
          "town"
        ],
        "conf": "medium",
        "src": "research"
      },
      {
        "id": "upper-goulburn-river-mansfield-woods-point-rd-bridge-south-of-jamieson",
        "name": "Mansfield–Woods Point Rd bridge south of Jamieson",
        "lat": -37.33826,
        "lng": 146.13528,
        "note": "Start of the roadside reach heading up toward Knockwood.",
        "tags": [
          "bridge",
          "roadside"
        ],
        "conf": "medium",
        "src": "research"
      }
    ]
  }
]);
})();
