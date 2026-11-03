import type { Faq } from './services';

export interface Location {
  slug: string; // e.g. "london" -> /locations/removals-london/
  name: string;
  region: string;
  nation: 'England' | 'Scotland' | 'Wales';
  title: string;
  description: string;
  h1: string;
  intro: string[];
  areas: string[];
  postcodes: string;
  /** Short, factual, city-specific things that affect a move. */
  localNotes: { title: string; text: string }[];
  peakTimes: string;
  routes: string[]; // route slugs
  faqs: Faq[];
}

export const locations: Location[] = [
  {
    slug: 'london',
    name: 'London',
    region: 'Greater London',
    nation: 'England',
    title: 'Removals London | Local & Long-Distance House Movers',
    description:
      'London removals planned around permits, ULEZ, stairs and tight streets. House, flat and office moves across all boroughs. Free fixed-price quote.',
    h1: 'Removals in London',
    intro: [
      'London moves are won or lost on logistics. Narrow Victorian streets, red routes, parking suspensions, mansion-block lifts and third-floor walk-ups all affect how long a move takes and what vehicle can be used. A van that works in Surrey will not always work in Camden.',
      'We plan London moves around the detail: which borough you are in, whether you need a parking suspension, how far the carry is, and whether a smaller vehicle with a shuttle is better than one large lorry that cannot get near your door. We move people within the capital, out to the rest of the country, and in from other cities.',
    ],
    areas: ['Clapham', 'Islington', 'Hackney', 'Greenwich', 'Richmond', 'Croydon', 'Walthamstow', 'Canary Wharf'],
    postcodes: 'E, EC, N, NW, SE, SW, W, WC and outer London (BR, CR, EN, HA, IG, KT, RM, SM, TW, UB)',
    localNotes: [
      { title: 'Property types', text: 'Victorian and Edwardian terraces, period conversions, mansion blocks and high-rise new builds. Many have steep or narrow stairs, so large furniture may need dismantling or hoisting.' },
      { title: 'Parking and access', text: 'Most boroughs allow parking bay suspensions, applied for with the council, usually with several working days notice. Red routes and loading restrictions can rule out the nearest kerb.' },
      { title: 'Low Emission Zone', text: 'ULEZ covers all London boroughs, and Central London has the Congestion Charge. Vehicles that do not meet emissions standards may be charged. Ask us how this is handled in your quote.' },
      { title: 'Lift and building rules', text: 'Managed buildings often require lift booking, deposits and set moving hours. Tell us early so we plan around them.' },
    ],
    peakTimes: 'Friday and month-end are the busiest. Summer and the September rental cycle book out quickly, so reserve early.',
    routes: ['london-to-manchester-removals', 'london-to-birmingham-removals', 'london-to-bristol-removals', 'london-to-leeds-removals', 'london-to-edinburgh-removals', 'london-to-cardiff-removals'],
    faqs: [
      { q: 'Do I need a parking permit for a removal van in London?', a: 'Often yes. Most boroughs let you apply for a temporary parking suspension, typically online with several working days notice. Rules and costs vary by borough, so check with your council as soon as your date is fixed.' },
      { q: 'Do you charge extra for ULEZ or the Congestion Charge?', a: 'Any charge that applies to the vehicle on the day will be set out in your quote, so you know the total before you book.' },
      { q: 'Can you handle a move from a flat with no lift?', a: 'Yes. Walk-ups are routine for London moves. We plan crew size and time for the number of floors and will tell you if anything needs dismantling.' },
    ],
  },
  {
    slug: 'manchester',
    name: 'Manchester',
    region: 'Greater Manchester',
    nation: 'England',
    title: 'Removals Manchester | House, Flat & Office Movers',
    description:
      'Manchester removals for houses, flats and offices. Experienced crews who know Didsbury, Salford Quays and the city centre. Get a fast, fixed-price quote.',
    h1: 'Removals in Manchester',
    intro: [
      'Manchester is a city of contrasts for movers. In one day you might go from a Victorian terrace in Chorlton with a front step and a back-alley, to a 20th-floor apartment in the city centre with a booked lift slot and a loading bay.',
      'We cover Manchester and Greater Manchester, from Stockport to Salford, Altrincham to Oldham. Whether you are moving within the city, to a quieter suburb, or heading to London or Leeds, we plan the day around your access and your timings.',
    ],
    areas: ['Didsbury', 'Chorlton', 'Salford Quays', 'Northern Quarter', 'Ancoats', 'Altrincham', 'Sale', 'Stockport'],
    postcodes: 'M, SK, WA14 to WA15, OL, BL and surrounding Greater Manchester areas',
    localNotes: [
      { title: 'Property types', text: 'Victorian terraces, Edwardian semis, 1930s suburban houses, plus a large stock of new-build apartments in the city centre, Ancoats, NOMA and Salford Quays.' },
      { title: 'City-centre apartments', text: 'Most blocks have managed lifts, loading bays and booking systems. We plan for lift slots, trolleys and corridor protection.' },
      { title: 'Student moves', text: 'Fallowfield, Withington and Rusholme see heavy student traffic in late June and September. Book ahead for those weeks.' },
      { title: 'Trams and bus lanes', text: 'The Metrolink and bus lanes restrict where a van can stop in the centre. We scout the nearest legal loading point.' },
    ],
    peakTimes: 'Late June and September for students, plus Fridays and month-end for general moves.',
    routes: ['london-to-manchester-removals', 'manchester-to-leeds-removals', 'birmingham-to-manchester-removals', 'manchester-to-glasgow-removals'],
    faqs: [
      { q: 'Do you cover all of Greater Manchester?', a: 'Yes, including Salford, Stockport, Trafford, Bolton, Bury, Oldham, Rochdale, Tameside and Wigan. Tell us your postcode in the quote form and we will confirm.' },
      { q: 'How do you handle city-centre apartment moves?', a: 'We ask for the building name, floor and lift details, plan the right vehicle size, and advise on booking the lift with your managing agent.' },
    ],
  },
  {
    slug: 'birmingham',
    name: 'Birmingham',
    region: 'West Midlands',
    nation: 'England',
    title: 'Removals Birmingham | Local & Long-Distance Movers',
    description:
      'Birmingham removals covering the city, Solihull and Sutton Coldfield. Careful crews, fair fixed prices and easy routes to London, Manchester and Bristol.',
    h1: 'Removals in Birmingham',
    intro: [
      'Birmingham sits at the centre of the UK road network, which makes it one of the easiest cities to move out of and into. The M6, M5, M42 and M40 put London, Manchester, Bristol and Leeds within a few hours.',
      'Inside the city the picture is varied. Jewellery Quarter factory conversions, Edgbaston villas, Moseley and Kings Heath terraces, and 1930s semis in Sutton Coldfield all need different handling. We tailor the crew and vehicle to the property.',
    ],
    areas: ['Edgbaston', 'Jewellery Quarter', 'Moseley', 'Harborne', 'Kings Heath', 'Sutton Coldfield', 'Solihull', 'Digbeth'],
    postcodes: 'B, DY, WS, WV, CV (parts) and surrounding West Midlands areas',
    localNotes: [
      { title: 'Property types', text: 'Victorian terraces, large Edgbaston villas, 1930s semis, post-war estates and converted industrial lofts in the Jewellery Quarter and Digbeth.' },
      { title: 'Clean Air Zone', text: 'Birmingham has a Clean Air Zone covering the central ring road area. Older vans that do not meet emissions standards may be charged, and any charge will be in your quote.' },
      { title: 'Motorway access', text: 'Direct links to the M6, M5, M42 and M40 make long-distance moves efficient from most postcodes.' },
      { title: 'Student and hospital moves', text: 'Selly Oak and Edgbaston see heavy student and NHS staff moves in summer and September.' },
    ],
    peakTimes: 'July to September and month-end Fridays.',
    routes: ['london-to-birmingham-removals', 'birmingham-to-manchester-removals'],
    faqs: [
      { q: 'Do you move people from Birmingham to London?', a: 'Yes, it is one of our most common routes. The distance is around 120 miles, so most moves load and unload on the same day.' },
      { q: 'Do you cover Solihull and Sutton Coldfield?', a: 'Yes, and the wider West Midlands. Enter your postcode in the quote form and we will confirm.' },
    ],
  },
  {
    slug: 'leeds',
    name: 'Leeds',
    region: 'West Yorkshire',
    nation: 'England',
    title: 'Removals Leeds | House, Student & Office Movers',
    description:
      'Leeds removals for houses, student homes and offices. Hilly streets, back-to-back terraces and city-centre flats handled by experienced crews. Free quote.',
    h1: 'Removals in Leeds',
    intro: [
      'Leeds is a university city, a financial centre and a collection of distinct neighbourhoods, and the moves reflect that. A Headingley student house in June, a Roundhay family home in August and a city-centre flat on a Friday afternoon all need different planning.',
      'We cover Leeds and the surrounding West Yorkshire area, with regular moves to and from Manchester, London and Newcastle. Local crews know the one-way streets, hills and parking limits that can slow a van.',
    ],
    areas: ['Headingley', 'Chapel Allerton', 'Roundhay', 'Horsforth', 'Armley', 'Leeds Dock', 'Hyde Park', 'Otley'],
    postcodes: 'LS, BD (parts), WF (parts), HG and surrounding West Yorkshire areas',
    localNotes: [
      { title: 'Property types', text: 'Back-to-back and through terraces in Hyde Park and Headingley, Victorian villas in Roundhay and Chapel Allerton, and city-centre apartments along the river and canal.' },
      { title: 'Hills and narrow streets', text: 'Many terraced streets are steep with parking on both sides. Short shuttles with a smaller vehicle can be safer and quicker than one large van.' },
      { title: 'Student moves', text: 'Leeds has a very large student population, so late June and September are extremely busy.' },
      { title: 'City-centre loading', text: 'Pedestrianised streets and bus gates restrict loading in the centre. We plan the nearest legal stop.' },
    ],
    peakTimes: 'Late June, July and September for students; Fridays and month-end for general moves.',
    routes: ['london-to-leeds-removals', 'manchester-to-leeds-removals', 'leeds-to-newcastle-removals'],
    faqs: [
      { q: 'Can you move a Headingley student house?', a: 'Yes. Student and shared-house moves are a speciality, and we offer man and van or a full crew depending on the contents.' },
      { q: 'Do you move from Leeds to Manchester?', a: 'Yes. It is about 45 miles over the M62, so we usually load and unload on the same day.' },
    ],
  },
  {
    slug: 'liverpool',
    name: 'Liverpool',
    region: 'Merseyside',
    nation: 'England',
    title: 'Removals Liverpool | Merseyside House & Flat Movers',
    description:
      'Liverpool and Merseyside removals for Georgian townhouses, terraces and waterfront flats. Careful crews, tunnels and tolls handled. Free fixed-price quote.',
    h1: 'Removals in Liverpool',
    intro: [
      'Liverpool has some of the UK’s most striking housing stock: Georgian townhouses around the Georgian Quarter, solid Victorian terraces, red-brick suburban semis and a growing number of waterfront and Baltic Triangle apartments.',
      'We cover Liverpool, Merseyside and the Wirral. Moves across the Mersey and to Manchester are common, and we plan for tolls, tunnels and rush-hour timing so your day runs to schedule.',
    ],
    areas: ['Allerton', 'Aigburth', 'Woolton', 'Waterloo', 'Crosby', 'Baltic Triangle', 'Wavertree', 'Birkenhead'],
    postcodes: 'L, CH, WA (parts), PR8 to PR9 and surrounding Merseyside areas',
    localNotes: [
      { title: 'Property types', text: 'Georgian townhouses with several floors and steep stairs, Victorian terraces, and 1930s semis. Furniture often needs dismantling for upper floors.' },
      { title: 'Mersey tunnels', text: 'The Queensway and Kingsway tunnels carry tolls. If your move crosses to the Wirral, we build this into the plan and the quote.' },
      { title: 'Waterfront apartments', text: 'Docklands and Baltic blocks often have booked lifts and loading bays.' },
      { title: 'Match days', text: 'Home match days at Anfield and Goodison affect traffic and parking. Tell us your date and we advise.' },
    ],
    peakTimes: 'July to September and month-end. Avoid major event days if you can.',
    routes: ['london-to-liverpool-removals', 'london-to-manchester-removals'],
    faqs: [
      { q: 'Do you cover the Wirral?', a: 'Yes. Tunnel or bridge crossings are planned in advance and any toll is made clear in your quote.' },
      { q: 'Can you move from Liverpool to London?', a: 'Yes. It is a long-distance move of around 200 miles, normally planned as a dedicated or shared load. Ask for both prices.' },
    ],
  },
  {
    slug: 'bristol',
    name: 'Bristol',
    region: 'South West England',
    nation: 'England',
    title: 'Removals Bristol | Local & Long-Distance Movers',
    description:
      'Bristol removals for hilly streets, Georgian terraces and city-centre flats. Experienced crews, clear fixed quotes and links to London, Cardiff and Birmingham.',
    h1: 'Removals in Bristol',
    intro: [
      'Bristol’s hills are part of its character and a real challenge for removals. Clifton’s Georgian terraces, Totterdown’s steep colourful streets and Bedminster’s narrow lanes mean the biggest vehicle is rarely the best choice.',
      'We plan Bristol moves around the street: how far we can park, how many steps there are, and whether the best approach is a smaller van and shuttle. We also run frequent routes to London, Cardiff and Birmingham via the M4 and M5.',
    ],
    areas: ['Clifton', 'Redland', 'Bedminster', 'Southville', 'Montpelier', 'Stokes Croft', 'Bishopston', 'Totterdown'],
    postcodes: 'BS and surrounding areas including Bath, Weston-super-Mare and parts of South Gloucestershire',
    localNotes: [
      { title: 'Property types', text: 'Tall Georgian and Victorian terraces with multiple floors, plus converted warehouses and harbourside apartments.' },
      { title: 'Hills and narrow streets', text: 'Steep, narrow roads often mean smaller vehicles and a short shuttle. We check access ahead of time.' },
      { title: 'Clean Air Zone', text: 'Bristol has a Clean Air Zone in the centre. Vehicles that do not meet emissions standards may be charged.' },
      { title: 'Student moves', text: 'Two universities create busy periods in late June and September around Clifton, Redland and Cotham.' },
    ],
    peakTimes: 'Summer and September; Fridays and month-end.',
    routes: ['london-to-bristol-removals', 'bristol-to-cardiff-removals'],
    faqs: [
      { q: 'Can you move us into a Clifton Georgian house?', a: 'Yes. We routinely handle multi-floor townhouses, and will plan for dismantling large pieces and for protecting stairs and banisters.' },
      { q: 'Do you cross the Severn to Cardiff?', a: 'Yes. The Prince of Wales Bridge has been toll-free since 2018, and Bristol to Cardiff is usually a same-day move.' },
    ],
  },
  {
    slug: 'sheffield',
    name: 'Sheffield',
    region: 'South Yorkshire',
    nation: 'England',
    title: 'Removals Sheffield | Hilly-Street House Movers',
    description:
      'Sheffield removals for stone terraces, hilly streets and student homes. Experienced crews across Nether Edge, Crookes, Ecclesall Road and beyond. Free quote.',
    h1: 'Removals in Sheffield',
    intro: [
      'Sheffield is built on seven hills, and anyone who has moved house there knows it. Steep gradients, tight terraced streets and parking pressure around Ecclesall Road and Crookes make local knowledge valuable.',
      'We handle moves across Sheffield and South Yorkshire, from stone terraces in Walkley and Hillsborough to larger family homes in Dore and Nether Edge, and flats in Kelham Island and the city centre.',
    ],
    areas: ['Ecclesall Road', 'Nether Edge', 'Crookes', 'Walkley', 'Hillsborough', 'Kelham Island', 'Dore', 'Broomhill'],
    postcodes: 'S and surrounding South Yorkshire areas',
    localNotes: [
      { title: 'Property types', text: 'Stone-built terraces, Victorian villas, post-war council-built homes, and loft-style apartments in the former industrial areas.' },
      { title: 'Steep gradients', text: 'On steep streets, vehicles may need to park lower down and shuttle items up. We scout this when planning.' },
      { title: 'Student areas', text: 'Broomhill, Crookesmoor and Ecclesall Road are busy with student lets, particularly in late June and September.' },
      { title: 'Peak District escapes', text: 'Many customers move out to Hathersage, Bakewell and nearby villages. Rural lanes may need a smaller vehicle.' },
    ],
    peakTimes: 'Late June and September; Fridays and month-end.',
    routes: ['london-to-sheffield-removals', 'london-to-leeds-removals'],
    faqs: [
      { q: 'Can you move us up a steep street?', a: 'Yes. We plan the vehicle, the parking spot and the carry distance before the day, and recommend a shuttle when it is safer.' },
      { q: 'Do you move students in Sheffield?', a: 'Yes. Man and van and shared-house moves are available, with flexible slots around tenancy end dates.' },
    ],
  },
  {
    slug: 'newcastle',
    name: 'Newcastle',
    region: 'Tyne and Wear',
    nation: 'England',
    title: 'Removals Newcastle | Tyneside House & Flat Movers',
    description:
      'Newcastle removals for Tyneside flats, Jesmond terraces and Quayside apartments. Tyne Tunnel and bridge crossings planned for you. Free fixed-price quote.',
    h1: 'Removals in Newcastle',
    intro: [
      'Newcastle has a housing type found almost nowhere else: the Tyneside flat, two self-contained flats in a single terrace with separate front doors. Combined with Jesmond’s Victorian terraces and the Quayside’s modern apartments, there is a lot of variety.',
      'We cover Newcastle, Gateshead, North and South Tyneside and further into Northumberland and County Durham. Crossing the Tyne is part of daily life here, and we plan around bridge and tunnel traffic as well as tolls.',
    ],
    areas: ['Jesmond', 'Gosforth', 'Heaton', 'Ouseburn', 'Quayside', 'Whitley Bay', 'Gateshead', 'Tynemouth'],
    postcodes: 'NE and surrounding Tyne and Wear, Durham and Northumberland areas',
    localNotes: [
      { title: 'Tyneside flats', text: 'Upstairs Tyneside flats often have steep internal stairs, so bulky furniture may need to be dismantled or lifted externally.' },
      { title: 'Tyne crossings', text: 'The Tyne Tunnel carries a toll. Peak times on the Tyne Bridge and A1 can add significant time, so we plan departures to avoid them.' },
      { title: 'Student areas', text: 'Heaton, Jesmond and Sandyford are popular with students from two universities, with busy periods in summer.' },
      { title: 'Coastal moves', text: 'Whitley Bay and Tynemouth homes often have tight streets and seaside parking restrictions.' },
    ],
    peakTimes: 'Summer, plus the weeks before the new school year.',
    routes: ['leeds-to-newcastle-removals', 'newcastle-to-edinburgh-removals'],
    faqs: [
      { q: 'Do you move from upstairs Tyneside flats?', a: 'Yes. We plan for the stairs, dismantle bulky items if required, and send an appropriately sized crew.' },
      { q: 'How far is Newcastle to Edinburgh?', a: 'Around 105 miles on the A1, normally two hours of driving, which makes it a same-day move.' },
    ],
  },
  {
    slug: 'nottingham',
    name: 'Nottingham',
    region: 'East Midlands',
    nation: 'England',
    title: 'Removals Nottingham | House, Student & Flat Movers',
    description:
      'Nottingham removals covering West Bridgford, The Park and Lenton. House, student and flat moves with fixed-price quotes and flexible dates.',
    h1: 'Removals in Nottingham',
    intro: [
      'Nottingham is a compact city with two large universities, a strong rental market and popular suburbs such as West Bridgford, Beeston and Sherwood. That means a steady mix of student moves, young professional flat moves and family moves.',
      'We cover Nottingham and Nottinghamshire, with regular routes to Leicester, Derby, Sheffield and London. We know the tram routes, Victorian terraces and the tight car-lined streets of Lenton and Sherwood.',
    ],
    areas: ['West Bridgford', 'The Park Estate', 'Lenton', 'Beeston', 'Sherwood', 'Hockley', 'Carlton', 'Arnold'],
    postcodes: 'NG and surrounding Nottinghamshire areas',
    localNotes: [
      { title: 'Property types', text: 'Victorian terraces, The Park Estate’s large period homes, 1930s semis and the Lace Market’s converted warehouse flats.' },
      { title: 'Trams', text: 'The NET tram network affects road layouts in the centre and along some arterial routes. We plan the loading point accordingly.' },
      { title: 'Student moves', text: 'Lenton, Dunkirk and Beeston are densely student-occupied, with extremely busy changeover periods in summer.' },
      { title: 'Access', text: 'Many roads in older neighbourhoods are lined with parked cars. A smaller vehicle often works better than a large lorry.' },
    ],
    peakTimes: 'Late June to September; month-end Fridays.',
    routes: ['london-to-nottingham-removals', 'london-to-birmingham-removals'],
    faqs: [
      { q: 'Do you cover Beeston and West Bridgford?', a: 'Yes, and all of Nottinghamshire. Enter your postcode in the quote form and we will confirm.' },
      { q: 'Can I get a cheaper move if I am flexible on the date?', a: 'Often yes. Midweek dates are generally easier to schedule than Fridays and month-end.' },
    ],
  },
  {
    slug: 'glasgow',
    name: 'Glasgow',
    region: 'Glasgow City',
    nation: 'Scotland',
    title: 'Removals Glasgow | Tenement & House Movers',
    description:
      'Glasgow removals, with experience of tenement stairs, the Low Emission Zone and West End parking. House and flat moves across Scotland and to England.',
    h1: 'Removals in Glasgow',
    intro: [
      'Glasgow moves are shaped by the tenement. Sandstone tenement flats, often on the third or fourth floor with no lift and a shared stair (the “close”), are the most common home type in the West End, Southside and Finnieston. Furniture often has to be dismantled, carried and rebuilt.',
      'We plan crew size and time around the stair, and carry out Glasgow moves across the city and into Lanarkshire, Renfrewshire, Ayrshire and beyond. We also run England-to-Scotland routes, including Manchester to Glasgow.',
    ],
    areas: ['West End', 'Hyndland', 'Finnieston', 'Merchant City', 'Shawlands', 'Pollokshields', 'Bearsden', 'Partick'],
    postcodes: 'G, PA, ML, KA (parts) and surrounding Central Scotland areas',
    localNotes: [
      { title: 'Tenement flats', text: 'High, narrow, shared stairs are the norm. We plan extra crew, dismantling, and sometimes use a window lift for large items.' },
      { title: 'Low Emission Zone', text: 'Glasgow’s LEZ covers the city centre. Vehicles not meeting standards may be fined, so we use compliant vehicles for city moves.' },
      { title: 'West End parking', text: 'Permit parking and narrow streets are common. Apply for a suspension via the council if needed, and tell us early.' },
      { title: 'Scottish moving practice', text: 'Moves can happen on any day, but legal completion arrangements in Scotland differ from England. Your solicitor will confirm your “date of entry”.' },
    ],
    peakTimes: 'Summer and the weeks around the start of university terms.',
    routes: ['manchester-to-glasgow-removals', 'newcastle-to-edinburgh-removals'],
    faqs: [
      { q: 'Do you handle tenement stair moves?', a: 'Yes. Tell us the floor, stair width and whether the building has a rear access. We plan crew size accordingly.' },
      { q: 'Do you move to and from England?', a: 'Yes. Manchester to Glasgow is about 215 miles, and from London it may need an overnight stop depending on timings.' },
    ],
  },
  {
    slug: 'edinburgh',
    name: 'Edinburgh',
    region: 'City of Edinburgh',
    nation: 'Scotland',
    title: 'Removals Edinburgh | New Town, Tenement & House Movers',
    description:
      'Edinburgh removals for Georgian New Town flats, tenements and suburban homes. Cobbles, permits, the LEZ and festival traffic planned for. Free quote.',
    h1: 'Removals in Edinburgh',
    intro: [
      'Edinburgh is a World Heritage city, which means cobbled streets, controlled parking, listed buildings and steep closes. Moving in the New Town or Old Town takes planning and care, particularly where stairs are narrow or the street is closed to larger vehicles.',
      'We cover Edinburgh, the Lothians and Fife. We also run frequent England-to-Edinburgh routes, including Newcastle and London, and plan Edinburgh moves around the August festival, when traffic and accommodation are at their peak.',
    ],
    areas: ['New Town', 'Old Town', 'Marchmont', 'Leith', 'Stockbridge', 'Morningside', 'Portobello', 'Corstorphine'],
    postcodes: 'EH and surrounding Lothians and Fife areas',
    localNotes: [
      { title: 'Property types', text: 'Georgian New Town flats, sandstone tenements, Victorian villas in Morningside, and modern developments around Leith.' },
      { title: 'Controlled parking', text: 'Edinburgh has extensive controlled parking zones. Temporary suspensions are arranged through the council, usually with notice.' },
      { title: 'Low Emission Zone', text: 'Edinburgh’s LEZ is enforced in the city centre. We use compliant vehicles for city-centre moves.' },
      { title: 'Festival season', text: 'August brings heavy traffic and road closures in the centre. If you can, avoid moving into or out of the Old and New Town at that time.' },
    ],
    peakTimes: 'Summer. Avoid August in the centre if you can.',
    routes: ['london-to-edinburgh-removals', 'newcastle-to-edinburgh-removals'],
    faqs: [
      { q: 'Can you move into a New Town flat with cobbled streets?', a: 'Yes. We check access in advance and advise on the best vehicle, parking suspension and carry distance.' },
      { q: 'Is it cheaper to avoid moving in August?', a: 'Often it is easier and cheaper. Festival traffic and parking restrictions can add time, so moves in the centre are better in other months.' },
    ],
  },
  {
    slug: 'cardiff',
    name: 'Cardiff',
    region: 'South Wales',
    nation: 'Wales',
    title: 'Removals Cardiff | South Wales House & Flat Movers',
    description:
      'Cardiff removals for Victorian terraces, Penarth villas and Cardiff Bay flats. Easy M4 links to Bristol and London. Free fixed-price quote.',
    h1: 'Removals in Cardiff',
    intro: [
      'Cardiff is a city of Victorian terraces: Cathays, Roath, Canton and Pontcanna are lined with them, each with the familiar front step, narrow hallway and steep staircase. Add the flats of Cardiff Bay and the larger homes of Penarth and Llandaff, and the range is wide.',
      'We cover Cardiff, Penarth, Barry and the Vale of Glamorgan, plus Newport and the Valleys. With the M4 on your doorstep, moves to and from Bristol and London are straightforward and regularly done on the same day.',
    ],
    areas: ['Pontcanna', 'Cathays', 'Roath', 'Canton', 'Penarth', 'Cardiff Bay', 'Llandaff', 'Whitchurch'],
    postcodes: 'CF and surrounding South Wales areas',
    localNotes: [
      { title: 'Property types', text: 'Victorian terraces with narrow halls and steep stairs, Penarth villas, and modern waterfront apartments in Cardiff Bay.' },
      { title: 'Student moves', text: 'Cathays is one of the UK’s densest student areas, and changeover weeks in summer are very busy.' },
      { title: 'Severn crossings', text: 'Moves to Bristol cross the Prince of Wales Bridge, which has been toll-free since 2018.' },
      { title: 'Match days', text: 'Events at the Principality Stadium affect traffic and parking in the city centre. Tell us your date and we will advise.' },
    ],
    peakTimes: 'Late June to September; match days in the centre.',
    routes: ['bristol-to-cardiff-removals', 'london-to-cardiff-removals'],
    faqs: [
      { q: 'Do you cover Penarth and Barry?', a: 'Yes, and the Vale of Glamorgan. Enter your postcode in the quote form and we will confirm.' },
      { q: 'Can you move us from Cardiff to London?', a: 'Yes. It is around 150 miles via the M4, so most moves load and unload on the same day.' },
    ],
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
