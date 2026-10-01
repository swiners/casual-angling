// Fishing spots data. Add new waters here — the map reads everything from this file.
//
// Coordinates are APPROXIMATE (placed by hand from the source PDFs' map screenshots).
// `drive` values are fallback ESTIMATES from HOME. drive-grid.js (OSRM, no traffic) overrides them when present.
// The Directions link gives the real figure with traffic.
// Always confirm access on MapShareVic (Public Land layer) before crossing anything.

// Suburb-level start point on purpose: this site is public, so no street address.
window.HOME = { name: 'Flemington', lat: -37.788, lng: 144.93 };

window.SOURCES = {
  local: 'Angler Access on our Local Rivers (club PDF)',
  steav: 'Steavenson addendum (MapShareVic notes)',
};

// type: 'trout' for now — later 'bay', 'surf', 'native', etc.
window.WATERS = [
  {
    id: 'goulburn', name: 'Goulburn River', region: 'Thornton / Eildon', type: 'trout', colour: '#1f7fd6',
    blurb: 'Big tailwater below Lake Eildon with brown and rainbow trout. It’s a big river for wading: at irrigation flows (high from late September to April) you’re mostly fishing the edges and runs from the bank, and the low-flow periods at either end of the season are the easiest on foot. Check releases before you drive (Goulburn-Murray Water, Lake Eildon page). In the river closed season, fishing gear is banned within 20 m of the river from Eildon to Trawool, tributaries included. About 2,000 big rainbows were stocked for the 2026 opening, shared with the Pondage. The Goulburn Valley Fly Fishing Centre at Thornton has current local info.',
    spots: [
      { id: 'breakaway', name: 'The Breakaway', lat: -37.2455, lng: 145.7115, drive: 125,
        tags: ['fly', 'bank'], note: 'Bank access beside the Breakaway Caravan Park, where the Acheron joins. The club rates the fly fishing here as excellent. Fish the edges from the bank; wade only when flows are low.', src: 'local' },
      { id: 'mcmartins', name: 'McMartins Rd / Walnut Island', lat: -37.2415, lng: 145.748, drive: 125,
        tags: ['fly', 'bank', 'day visits only'], note: 'Walnut Island. The club rates the trout fishing here as excellent. Bank access, day visits only.', src: 'local' },
      { id: 'gilmores', name: 'Gilmores Bridge', lat: -37.2525, lng: 145.7705, drive: 125,
        tags: ['fly', 'bank'], note: 'The club rates the fly fishing here as excellent. Park at the bridge and work along the bank.', src: 'local' },
      { id: 'thornton-beach', name: 'Thornton Beach', lat: -37.2625, lng: 145.7955, drive: 125,
        tags: ['fly', 'easy access'], note: 'Gravel beach off Back Eildon Rd with easy bank access, and fly water just downstream. GV Fly Fishing School is next door.', src: 'local' },
      { id: 'thoms-lane', name: 'River access off Back Eildon Rd', lat: -37.2555, lng: 145.828, drive: 128,
        tags: ['fly'], note: 'River access points between Thoms Lane and Emyoung Reserve.', src: 'local' },
      { id: 'blue-gums', name: 'Blue Gums Caravan Park', lat: -37.2415, lng: 145.8905, drive: 132,
        tags: ['fly', 'bank'], note: 'Bank access by Blue Gums Caravan Park on the Eildon Rd. Mick Hall’s Black Ridge Fly Fishing School is nearby.', src: 'local' },
      { id: 'walnuts', name: 'Walnuts River Reserve', lat: -37.2565, lng: 145.863, drive: 130,
        tags: ['bait', '4WD'], note: 'Good for bait in the evening. The track down to the river is 4WD only. No fishing along the fenced section of Snobs Creek.', src: 'local' },
    ],
  },
  {
    id: 'eildon-pondage', name: 'Eildon Pondage', region: 'Eildon', type: 'trout', colour: '#5b63c9',
    blurb: 'The still pondage between the dam wall and the Goulburn. Known for big trout. Wading is allowed, boating isn’t. The tailrace and dam-wall end are closed to fishing, and there’s no fishing for 200 m below the Pondage weir. VFA lists browns and rainbows to 3.5 kg.',
    spots: [
      { id: 'pondage-upper', name: 'Upper Point / Fishermans Pt', lat: -37.2275, lng: 145.9085, drive: 135,
        tags: ['fly', 'lure', 'bank'], note: 'Cast from the bank for big trout. Fly water along both banks, and the Cemetery bank is good for bait.', src: 'local' },
      { id: 'pondage-lower', name: 'Lower Pondage / Nursery Corner', lat: -37.2335, lng: 145.8985, drive: 134,
        tags: ['fly', 'wade', 'accessible'], note: 'Shallow water between the shore and the island. Wading is allowed on the Pondage (no boats). Disabled fishing platform, toilets and a BBQ.', src: 'local' },
    ],
  },
  {
    id: 'acheron', name: 'Acheron River', region: 'Buxton', type: 'trout', colour: '#23946a',
    blurb: 'A freestone river that meets the Steavenson at Buxton. Walk in from the road crossings.',
    spots: [
      { id: 'meeting-waters', name: 'Meeting of the Waters', lat: -37.4065, lng: 145.7135, drive: 95,
        tags: ['fly', 'walk upstream'], note: 'The Acheron and Steavenson join here, with about 500 m of public frontage. Park at the recreation reserve and walk up either river.', src: 'local' },
      { id: 'dyes-lane', name: 'Dyes Lane', lat: -37.4165, lng: 145.7035, drive: 97,
        tags: ['fly', 'walk upstream'], note: 'Road crossing near Buxton MTB Park, one of VFA’s named access points below Narbethong. Overhanging trees make casting tight.', src: 'local' },
      { id: 'passing-rd', name: 'Passing Road', lat: -37.4365, lng: 145.6985, drive: 100,
        tags: ['fly'], note: 'Road crossing south of Buxton, one of VFA’s named access points below Narbethong.', src: 'local' },
      { id: 'project-rd', name: 'Project Road', lat: -37.4575, lng: 145.6935, drive: 103,
        tags: ['fly'], note: 'The furthest-upstream crossing in the club notes.', src: 'local' },
    ],
  },
  {
    id: 'steavenson', name: 'Steavenson River', region: 'Buxton → Marysville', type: 'trout', colour: '#e8860f',
    blurb: 'Runs beside the Buxton–Marysville Rd. There is a Crown water frontage along much of it. On MapShareVic, olive green is Crown land and teal is a Water Frontage Licence.',
    spots: [
      { id: 'buxton-rec', name: 'Buxton Recreation Reserve', lat: -37.4215, lng: 145.7195, drive: 95,
        tags: ['fly', 'parking', 'walk upstream'], note: 'Easy parking. Walk upstream from here, or down to the Meeting of the Waters. Buxton Trout & Salmon Farm is next door.', src: 'local' },
      { id: 'little-steav', name: 'Little Steavenson, Buxton', lat: -37.4405, lng: 145.7285, drive: 97,
        tags: ['fly'], note: 'Little Steavenson River near the Buxton–Marysville Rd.', src: 'local' },
      { id: 'ackerman', name: 'Ackerman Bridge', lat: -37.4575, lng: 145.7355, drive: 98,
        tags: ['fly', 'walk up & down'], note: 'The Crown frontage looks like it runs both ways from this bridge, so you can walk down and back up.', src: 'steav' },
      { id: 'maryton', name: 'Maryton Lane', lat: -37.4655, lng: 145.7385, drive: 99,
        tags: ['fly', 'upstream only'], note: 'Park at the Maryton Ln crossing and fish towards Marysville. MapShareVic suggests walking UP only. Downstream is a licence parcel.', src: 'steav' },
      { id: 'elliot', name: 'Elliot Bridge', lat: -37.4805, lng: 145.7425, drive: 100,
        tags: ['fly'], note: 'The last bridge before Marysville. Park and walk under the bridge. The usual approach is to walk upstream first, then fish back to the bridge.', src: 'steav' },
    ],
  },
  {
    id: 'taggerty', name: 'Taggerty River', region: 'Marysville', type: 'trout', colour: '#d1477c',
    blurb: 'Small, pretty mountain stream along Lady Talbot Drive, above Marysville.',
    spots: [
      { id: 'taggerty-dickinsons', name: 'Dickinson’s Track', lat: -37.4985, lng: 145.7665, drive: 100,
        tags: ['fly', 'small stream'], note: 'Where the track meets the river (club access points 3–5). Small water, so keep casts short.', src: 'local' },
      { id: 'lady-talbot', name: 'Lady Talbot Drive', lat: -37.5035, lng: 145.7985, drive: 105,
        tags: ['fly', 'small stream'], note: 'Roadside access along the gravel drive (club points 5–6). Pull over and walk in.', src: 'local' },
    ],
  },
  {
    id: 'rubicon', name: 'Rubicon River', region: 'Thornton', type: 'trout', colour: '#d9542b',
    blurb: 'Fast, clear water that flows into the Goulburn near Thornton. There are angler stiles along Rubicon Rd.',
    spots: [
      { id: 'christies', name: 'Christies Road', lat: -37.2765, lng: 145.7615, drive: 125,
        tags: ['fly'], note: 'Frontage along Christies Rd, west of the Goulburn Valley Hwy.', src: 'local' },
      { id: 'tumbling', name: 'Tumbling Waters (Rubicon Bridge)', lat: -37.2955, lng: 145.7825, drive: 127,
        tags: ['fly'], note: 'Bridge on the Taggerty–Thornton Rd. Angler access stiles are just upstream.', src: 'local' },
      { id: 'lower-ps', name: 'Lower Power Station', lat: -37.3285, lng: 145.8375, drive: 135,
        tags: ['fly'], note: 'Near Camp Jungai, at the end of Rubicon Rd.', src: 'local' },
      { id: 'kendalls', name: 'Kendalls Campground', lat: -37.3435, lng: 145.8485, drive: 140,
        tags: ['fly', 'camping'], note: 'A campground on the upper river. Good for an overnighter.', src: 'local' },
    ],
  },
  {
    id: 'murrindindi', name: 'Murrindindi River', region: 'Yea / Glenburn', type: 'trout', colour: '#8a55d0',
    blurb: 'A small river that follows Murrindindi Rd. The highlighted frontage runs between the road bridges.',
    spots: [
      { id: 'cummins', name: 'Cummins Rd Bridge', lat: -37.3605, lng: 145.5515, drive: 95,
        tags: ['fly'], note: 'About 5 km from Myles Rd Bridge. Fish the frontage downstream towards Myles Rd.', src: 'local' },
      { id: 'myles', name: 'Myles Rd Bridge', lat: -37.3855, lng: 145.5705, drive: 97,
        tags: ['fly'], note: 'Bridge near Myles Bend Dr. The frontage runs both up and downstream.', src: 'local' },
      { id: 'murrindindi-scenic', name: 'Murrindindi Scenic Reserve', lat: -37.4585, lng: 145.5745, drive: 110,
        tags: ['fly', 'camping', 'forest'], note: 'A forest stretch next to the reserve and campground. Gravel roads.', src: 'local' },
    ],
  },
  {
    id: 'king-parrot', name: 'King Parrot Creek', region: 'Flowerdale', type: 'trout', colour: '#4d9b2f',
    blurb: 'The closest trout creek in the pack, about an hour from Flemington. It winds along the Whittlesea–Yea Rd.',
    spots: [
      { id: 'moores-rd', name: 'Moores Rd Reserve', lat: -37.3255, lng: 145.2855, drive: 65,
        tags: ['fly', 'close'], note: 'The reserve on Moores Rd, next to Kennys Rd. The Flowerdale Hotel is around the corner.', src: 'local' },
      { id: 'flowerdale-pub', name: 'Flowerdale pub — park here', lat: -37.3335, lng: 145.2935, drive: 65,
        tags: ['fly', 'parking', 'pub'], note: 'The doc marks two “park here” spots near the Flowerdale Hotel. Fish up, then have a pint.', src: 'local' },
      { id: 'hazeldene', name: 'Hazeldene Bike Path', lat: -37.3685, lng: 145.2785, drive: 62,
        tags: ['fly'], note: 'Access from the bike path south of Flowerdale.', src: 'local' },
    ],
  },
  {
    id: 'yarra', name: 'Upper Yarra River', region: 'Yarra Junction → Reefton', type: 'trout', colour: '#0f9bb0',
    blurb: 'Numbered access points 1 to 8 along the Warburton Hwy and Woods Point Rd. Easy day trip.',
    spots: [
      { id: 'y1', name: '1 · Doon Reserve, Yarra Junction', lat: -37.7765, lng: 145.5985, drive: 65, tags: ['fly', 'close'], note: 'Doon Bushland Reserve, next to the caravan park.', src: 'local' },
      { id: 'y2', name: '2 · Station Rd, Wesburn', lat: -37.7695, lng: 145.6355, drive: 68, tags: ['fly'], note: 'Near Gairns Rd.', src: 'local' },
      { id: 'y3', name: '3 · McKenzie King Dve, Millgrove', lat: -37.7555, lng: 145.6555, drive: 70, tags: ['fly'], note: 'Where the Warburton Hwy crosses near the rail trail.', src: 'local' },
      { id: 'y4', name: '4 · Dammans Rd (Football Ground)', lat: -37.7535, lng: 145.6905, drive: 73, tags: ['fly', 'town'], note: 'Warburton Recreation Reserve.', src: 'local' },
      { id: 'y5', name: '5 · Dammans Rd (Golf Course)', lat: -37.7515, lng: 145.6815, drive: 72, tags: ['fly', 'town'], note: 'The west end of Warburton.', src: 'local' },
      { id: 'y6', name: '6 · Woods Point Rd (Rail Trail)', lat: -37.7535, lng: 145.7005, drive: 74, tags: ['fly', 'town'], note: 'The end of the rail trail in Warburton.', src: 'local' },
      { id: 'y7', name: '7 · Woods Point Rd, East Warburton', lat: -37.7355, lng: 145.7255, drive: 78, tags: ['fly'], note: 'East Warburton.', src: 'local' },
      { id: 'y8', name: '8 · Upstream to Reefton', lat: -37.6805, lng: 145.8305, drive: 95, tags: ['fly', 'forest'], note: 'Roadside access along Woods Point Rd past McMahons Creek, up to Reefton.', src: 'local' },
    ],
  },
];
