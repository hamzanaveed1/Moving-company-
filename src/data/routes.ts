import type { Faq } from './services';

export interface RouteItem {
  slug: string; // e.g. london-to-manchester-removals
  from: string;
  to: string;
  fromSlug: string; // location slug
  toSlug: string;
  /** Approximate road distance in miles (via main route) */
  miles: number;
  /** Typical driving time, excluding traffic and breaks */
  drive: string;
  roads: string;
  plan: 'Same-day delivery' | 'Same-day or next-day delivery' | 'Overnight stop recommended';
  title: string;
  description: string;
  intro: string[];
  whyPeopleMove: string;
  considerations: string[];
  faqs: Faq[];
}

export const routes: RouteItem[] = [
  {
    slug: 'london-to-manchester-removals',
    from: 'London', to: 'Manchester', fromSlug: 'london', toSlug: 'manchester',
    miles: 200, drive: '4 to 5 hours', roads: 'M1, M6 and M56',
    plan: 'Same-day delivery',
    title: 'London to Manchester Removals | Fixed-Price Moves',
    description: 'Dedicated London to Manchester removals, about 200 miles. Same-day loading and delivery, fully planned and fixed-price. Get a free quote.',
    intro: [
      'London to Manchester is one of the busiest relocation routes in the UK. Cheaper housing, more space and a strong job market draw people north, while others head south for work or study.',
      'The journey is roughly 200 miles and takes four to five hours without traffic. We plan departure times around M1 and M6 congestion so your load arrives in daylight and on schedule, usually on the same day.',
    ],
    whyPeopleMove: 'Lower property prices, larger homes and a growing job market in Greater Manchester.',
    considerations: [
      'Leave London early to avoid the M25 and M1 morning rush.',
      'London parking suspensions need applying for ahead of time.',
      'In Manchester, check lift booking for city-centre apartments.',
    ],
    faqs: [
      { q: 'How long does a London to Manchester removal take?', a: 'About 4 to 5 hours of driving, plus loading and unloading, so most moves are completed in a single day.' },
      { q: 'Do you do Manchester to London as well?', a: 'Yes. We run the route in both directions and can often combine loads to keep costs down.' },
    ],
  },
  {
    slug: 'london-to-birmingham-removals',
    from: 'London', to: 'Birmingham', fromSlug: 'london', toSlug: 'birmingham',
    miles: 120, drive: '2 to 3 hours', roads: 'M40 or M1/M6',
    plan: 'Same-day delivery',
    title: 'London to Birmingham Removals | Same-Day Moves',
    description: 'London to Birmingham removals, about 120 miles via the M40. Same-day delivery, careful crews and fixed-price quotes. Request yours now.',
    intro: [
      'London to Birmingham is a short enough journey that most moves load in the morning and unload in the afternoon. The M40 and M1 give two sensible routes, and we pick whichever is clearer on the day.',
      'People move this route for space, commuting options and better value. High-speed rail makes Birmingham a realistic home for London workers, and the city has attractive suburbs from Harborne to Solihull.',
    ],
    whyPeopleMove: 'More space for the money, and a faster commute to London than many realise.',
    considerations: [
      'Birmingham has a Clean Air Zone. We use compliant vehicles to avoid charges.',
      'Choose a date away from the school summer holidays if you can.',
      'Check parking on both streets before you book.',
    ],
    faqs: [
      { q: 'How far is London to Birmingham?', a: 'Around 120 miles, which usually takes 2 to 3 hours depending on traffic.' },
      { q: 'Can you load and deliver on the same day?', a: 'Yes, for most house and flat moves. Larger homes may need an early start.' },
    ],
  },
  {
    slug: 'london-to-bristol-removals',
    from: 'London', to: 'Bristol', fromSlug: 'london', toSlug: 'bristol',
    miles: 120, drive: '2 to 3 hours', roads: 'M4',
    plan: 'Same-day delivery',
    title: 'London to Bristol Removals | M4 Same-Day Movers',
    description: 'London to Bristol removals via the M4. Straightforward same-day moves with careful crews and fixed-price quotes. Get a free quote.',
    intro: [
      'The M4 makes London to Bristol one of the simplest long-distance moves in the country. It is around 120 miles, and with a well-planned start most moves are loaded, driven and unloaded in a single day.',
      'The difficulty is at the Bristol end, where steep streets and Georgian terraces can limit vehicle size. We scout the destination and decide if a smaller van or shuttle is best.',
    ],
    whyPeopleMove: 'Lifestyle, green space, and a strong creative and tech sector.',
    considerations: [
      'Bristol has hills and narrow streets, so the destination access check is important.',
      'Heavy M4 traffic on Fridays and holiday weekends can add an hour or more.',
      'Bristol has a Clean Air Zone in the centre.',
    ],
    faqs: [
      { q: 'How long does the M4 journey take?', a: 'Typically 2 to 3 hours without incidents. We plan around known congestion.' },
      { q: 'Do you also move from Bristol to London?', a: 'Yes. We run the route both ways.' },
    ],
  },
  {
    slug: 'london-to-leeds-removals',
    from: 'London', to: 'Leeds', fromSlug: 'london', toSlug: 'leeds',
    miles: 195, drive: '3.5 to 4.5 hours', roads: 'M1',
    plan: 'Same-day delivery',
    title: 'London to Leeds Removals | M1 Long-Distance Movers',
    description: 'London to Leeds removals, around 195 miles via the M1. Dedicated or shared load options with clear, fixed pricing. Get your quote.',
    intro: [
      'London to Leeds is a straight run up the M1 and one of the most popular northern relocations, driven by Leeds’ expanding finance, legal and digital sectors.',
      'We allow for roadworks and smart-motorway slowdowns on the M1, plan a realistic delivery window, and can offer either a dedicated or shared load depending on your budget and flexibility.',
    ],
    whyPeopleMove: 'A thriving city with a lower cost of living and strong job opportunities.',
    considerations: [
      'The M1 is prone to roadworks, so allow a margin in your timings.',
      'Hilly terraced streets in Leeds may need a smaller vehicle.',
      'Student changeover weeks can congest areas like Headingley.',
    ],
    faqs: [
      { q: 'Is a dedicated or shared load better?', a: 'Dedicated is faster and more flexible on dates. Shared is cheaper if you can accept a delivery window.' },
      { q: 'How long does it take?', a: 'About 4 hours of driving, so most moves complete in a day.' },
    ],
  },
  {
    slug: 'london-to-edinburgh-removals',
    from: 'London', to: 'Edinburgh', fromSlug: 'london', toSlug: 'edinburgh',
    miles: 400, drive: '7 to 8 hours', roads: 'A1(M) and A1',
    plan: 'Overnight stop recommended',
    title: 'London to Edinburgh Removals | Long-Distance Scotland Moves',
    description: 'London to Edinburgh removals, about 400 miles. Planned overnight stops, legal driver hours and fixed-price quotes. Get a free quote.',
    intro: [
      'London to Edinburgh is a full-day drive. At around 400 miles and 7 to 8 hours of driving, we plan legal driver hours and breaks, and for many moves we recommend loading one day and delivering the next.',
      'It is a major relocation route for work, study and lifestyle. Moving to Edinburgh also means handling cobbles, permits and Low Emission Zone rules at the destination, which we plan for before travelling.',
    ],
    whyPeopleMove: 'A change of lifestyle, strong job opportunities and Scotland’s university sector.',
    considerations: [
      'Allow a two-day window where possible.',
      'Edinburgh’s centre has a Low Emission Zone and controlled parking.',
      'Avoid August if you are moving into the Old or New Town.',
    ],
    faqs: [
      { q: 'Can the move happen in one day?', a: 'Only if timings allow within legal driver hours. Most moves of this length are better as an overnight stop with delivery the next day.' },
      { q: 'Do you offer storage in transit?', a: 'Yes, if your completion dates do not match.' },
    ],
  },
  {
    slug: 'london-to-cardiff-removals',
    from: 'London', to: 'Cardiff', fromSlug: 'london', toSlug: 'cardiff',
    miles: 150, drive: '2.5 to 3.5 hours', roads: 'M4',
    plan: 'Same-day delivery',
    title: 'London to Cardiff Removals | M4 Moves to South Wales',
    description: 'London to Cardiff removals, about 150 miles along the M4. Reliable same-day moves to South Wales with fixed-price quotes.',
    intro: [
      'The M4 takes you straight from west London to South Wales, with the Prince of Wales Bridge toll-free since 2018. At around 150 miles, most moves are done in a day.',
      'Cardiff’s terraced streets and student areas need a little planning at the destination, but the route itself is simple and well suited to dedicated loads.',
    ],
    whyPeopleMove: 'Space, coast and countryside within reach, and a lower cost of living.',
    considerations: [
      'Check parking and access on narrow Cardiff terrace streets.',
      'Avoid match days near the city centre.',
      'M4 delays around Newport can add time.',
    ],
    faqs: [
      { q: 'Is there a toll on the Severn crossing?', a: 'No, the Prince of Wales Bridge has been toll-free since December 2018.' },
      { q: 'How long does it take?', a: 'Around three hours of driving, so most moves are completed in a day.' },
    ],
  },
  {
    slug: 'manchester-to-leeds-removals',
    from: 'Manchester', to: 'Leeds', fromSlug: 'manchester', toSlug: 'leeds',
    miles: 45, drive: '1 to 1.5 hours', roads: 'M62',
    plan: 'Same-day delivery',
    title: 'Manchester to Leeds Removals | Trans-Pennine Movers',
    description: 'Manchester to Leeds removals over the M62. Quick, affordable same-day moves with experienced crews. Free fixed-price quote.',
    intro: [
      'Manchester to Leeds is a short Trans-Pennine hop, but the M62 can be slow when the weather turns or roadworks bite. Our crews allow for it so you are never waiting around.',
      'It is an economical long-distance move, often completed in a few hours with room for a second job on the same day.',
    ],
    whyPeopleMove: 'Job changes, university moves and a different pace of life.',
    considerations: [
      'The M62 summit can close in winter weather.',
      'Check lift and parking at both ends for city-centre flats.',
      'Leeds hilly terraces may need a smaller vehicle.',
    ],
    faqs: [
      { q: 'How much does a short long-distance move cost?', a: 'It depends on volume and access. Shorter distance usually means a lower price than longer routes of the same size.' },
      { q: 'Can you do Leeds to Manchester too?', a: 'Yes, the route runs in both directions.' },
    ],
  },
  {
    slug: 'birmingham-to-manchester-removals',
    from: 'Birmingham', to: 'Manchester', fromSlug: 'birmingham', toSlug: 'manchester',
    miles: 85, drive: '1.5 to 2.5 hours', roads: 'M6',
    plan: 'Same-day delivery',
    title: 'Birmingham to Manchester Removals | M6 Same-Day Moves',
    description: 'Birmingham to Manchester removals via the M6, about 85 miles. Same-day moves with experienced crews and clear fixed-price quotes.',
    intro: [
      'The M6 connects two of England’s biggest cities, and the Birmingham to Manchester run is one of our most reliable routes. At around 85 miles, it is a comfortable same-day move.',
      'The main variable is the M6 itself, which can be heavy around Stoke and Knutsford. We plan the departure time to avoid the worst.',
    ],
    whyPeopleMove: 'Job opportunities, family and a change of city.',
    considerations: [
      'The M6 is often congested around Birmingham and Stockport junctions.',
      'Birmingham’s Clean Air Zone applies at the start of the route.',
      'Fridays are the busiest days.',
    ],
    faqs: [
      { q: 'How long is the journey?', a: 'About 1.5 to 2.5 hours depending on traffic.' },
      { q: 'Do you also cover Manchester to Birmingham?', a: 'Yes.' },
    ],
  },
  {
    slug: 'bristol-to-cardiff-removals',
    from: 'Bristol', to: 'Cardiff', fromSlug: 'bristol', toSlug: 'cardiff',
    miles: 45, drive: '1 hour', roads: 'M4',
    plan: 'Same-day delivery',
    title: 'Bristol to Cardiff Removals | Cross-Severn Movers',
    description: 'Bristol to Cardiff removals across the Prince of Wales Bridge. Fast, toll-free and fixed-price. Get a free quote.',
    intro: [
      'Bristol to Cardiff is a short hop across the Severn, and since the tolls were abolished it has become even easier. Most moves are done and dusted in a day, with time for a second trip if needed.',
      'We know both cities well: Bristol’s hills and Georgian terraces, and Cardiff’s Victorian streets.',
    ],
    whyPeopleMove: 'Work, family and the lure of the Welsh capital.',
    considerations: [
      'Bristol’s steep roads may need a smaller vehicle.',
      'Avoid rugby and football match days around Cardiff city centre.',
      'M4 delays are possible, particularly around Newport.',
    ],
    faqs: [
      { q: 'Is there a toll between Bristol and Cardiff?', a: 'No. The Prince of Wales Bridge has been toll-free since 2018.' },
      { q: 'Can you do a same-day move?', a: 'Yes, usually with time to spare.' },
    ],
  },
  {
    slug: 'leeds-to-newcastle-removals',
    from: 'Leeds', to: 'Newcastle', fromSlug: 'leeds', toSlug: 'newcastle',
    miles: 100, drive: '1.5 to 2 hours', roads: 'A1(M)',
    plan: 'Same-day delivery',
    title: 'Leeds to Newcastle Removals | A1(M) Movers',
    description: 'Leeds to Newcastle removals along the A1(M). Reliable same-day moves, careful crews and a clear fixed price.',
    intro: [
      'The A1(M) is an easy run between Leeds and Newcastle, taking around two hours. With a good start, most moves are completed comfortably in a day.',
      'The destination is the main variable. Newcastle’s Tyneside flats, Jesmond terraces and Quayside apartments each need different handling.',
    ],
    whyPeopleMove: 'Lower living costs, coastline access and a strong university and tech scene.',
    considerations: [
      'Tyne crossings and the A1 Western Bypass can slow arrival.',
      'Tyneside flats may require dismantling for stairs.',
      'Peak commuter traffic around Newcastle should be avoided.',
    ],
    faqs: [
      { q: 'How far is Leeds to Newcastle?', a: 'About 100 miles, taking around two hours.' },
      { q: 'Do you move Tyneside flats?', a: 'Yes. We plan for internal stairs and entrances.' },
    ],
  },
  {
    slug: 'manchester-to-glasgow-removals',
    from: 'Manchester', to: 'Glasgow', fromSlug: 'manchester', toSlug: 'glasgow',
    miles: 215, drive: '4 to 5 hours', roads: 'M6 and A74(M)/M74',
    plan: 'Same-day or next-day delivery',
    title: 'Manchester to Glasgow Removals | M6 & M74 Movers',
    description: 'Manchester to Glasgow removals, about 215 miles via the M6 and M74. Planned for tenement stairs and the Low Emission Zone. Free quote.',
    intro: [
      'The M6 and M74 take you from Greater Manchester to Glasgow in around four to five hours. Many moves are done in a day, but larger homes or late departures may be better with an overnight stop.',
      'The challenge is usually at the destination, where tenement stairs, shared closes and the Low Emission Zone call for planning.',
    ],
    whyPeopleMove: 'Career moves, the creative scene and Scotland’s university sector.',
    considerations: [
      'Tenement stairs need extra crew and sometimes dismantling.',
      'Glasgow’s Low Emission Zone applies in the centre.',
      'Winter weather on the M6 Shap and M74 can add delays.',
    ],
    faqs: [
      { q: 'Is the move completed in a single day?', a: 'Often yes, for smaller loads that leave early. Larger moves are safer with an overnight stop.' },
      { q: 'Can you handle a tenement flat?', a: 'Yes. Tell us floor numbers and stair width so we plan correctly.' },
    ],
  },
  {
    slug: 'newcastle-to-edinburgh-removals',
    from: 'Newcastle', to: 'Edinburgh', fromSlug: 'newcastle', toSlug: 'edinburgh',
    miles: 105, drive: '2 to 2.5 hours', roads: 'A1',
    plan: 'Same-day delivery',
    title: 'Newcastle to Edinburgh Removals | A1 Cross-Border Movers',
    description: 'Newcastle to Edinburgh removals along the A1. Scenic, straightforward and same-day. Fixed-price quotes and careful crews.',
    intro: [
      'The A1 between Newcastle and Edinburgh runs past Northumberland’s coast and countryside, and the drive takes around two hours. It is a short cross-border move that is easily done in a day.',
      'In Edinburgh, we plan for cobbles, permits and the Low Emission Zone, particularly in the Old and New Town.',
    ],
    whyPeopleMove: 'A change of city, work, or university in Scotland’s capital.',
    considerations: [
      'Plan parking suspensions for central Edinburgh.',
      'Avoid August festival congestion if moving into the centre.',
      'Winter weather on the A1 can affect timings.',
    ],
    faqs: [
      { q: 'Is there any cross-border paperwork?', a: 'No customs or paperwork is needed for a move between England and Scotland.' },
      { q: 'How long does it take?', a: 'Around two hours of driving, so a same-day move is typical.' },
    ],
  },
  {
    slug: 'london-to-liverpool-removals',
    from: 'London', to: 'Liverpool', fromSlug: 'london', toSlug: 'liverpool',
    miles: 215, drive: '4 to 5 hours', roads: 'M1, M6 and M56/M62',
    plan: 'Same-day delivery',
    title: 'London to Liverpool Removals | Long-Distance Movers',
    description: 'London to Liverpool removals, about 215 miles. Planned departures, careful crews and fixed-price quotes. Get a free quote.',
    intro: [
      'London to Liverpool is a full day on the road at roughly 215 miles, usually via the M1 and M6. With an early start, most moves are loaded and delivered the same day.',
      'In Liverpool, the destination often decides the vehicle: Georgian townhouses near the city centre, red-brick terraces in Wavertree and Allerton, and waterfront flats with booked lifts.',
    ],
    whyPeopleMove: 'More space for the money, a strong cultural scene and easy access to the coast and Lake District.',
    considerations: [
      'Allow extra time for M6 congestion around Birmingham and Stoke.',
      'Moves to the Wirral may involve a Mersey tunnel toll.',
      'Avoid match days near Anfield if you are moving in the north of the city.',
    ],
    faqs: [
      { q: 'How long does London to Liverpool take?', a: 'Around four to five hours of driving, so a same-day move is realistic with an early start.' },
      { q: 'Are tunnel tolls included in the quote?', a: 'Any toll that applies to your route is stated in your fixed-price quote.' },
    ],
  },
  {
    slug: 'london-to-sheffield-removals',
    from: 'London', to: 'Sheffield', fromSlug: 'london', toSlug: 'sheffield',
    miles: 165, drive: '3 to 4 hours', roads: 'M1',
    plan: 'Same-day delivery',
    title: 'London to Sheffield Removals | M1 Long-Distance Movers',
    description: 'London to Sheffield removals along the M1, about 165 miles. Same-day moves, hilly-street know-how and clear fixed-price quotes.',
    intro: [
      'The M1 runs almost the whole way from London to Sheffield, about 165 miles and three to four hours. It is a popular route for people trading London prices for more space and easy access to the Peak District.',
      'The destination is what needs planning. Sheffield’s hills mean some streets are too steep or tight for a large lorry, so we check access and, if needed, use a smaller vehicle for the last leg.',
    ],
    whyPeopleMove: 'Housing affordability, green space and proximity to the Peak District.',
    considerations: [
      'Roadworks on the M1 can add time, especially around Leicestershire and Northamptonshire.',
      'Steep streets in Crookes and Walkley may need a shuttle.',
      'Late June and September are busy for student moves.',
    ],
    faqs: [
      { q: 'Can a big van get up Sheffield’s hills?', a: 'Often, but not always. We check the street before the move and plan a smaller vehicle if needed.' },
      { q: 'How long does the move take?', a: 'Most moves are completed within a day thanks to the M1.' },
    ],
  },
  {
    slug: 'london-to-nottingham-removals',
    from: 'London', to: 'Nottingham', fromSlug: 'london', toSlug: 'nottingham',
    miles: 130, drive: '2.5 to 3 hours', roads: 'M1',
    plan: 'Same-day delivery',
    title: 'London to Nottingham Removals | M1 Same-Day Movers',
    description: 'London to Nottingham removals along the M1, about 130 miles. Same-day moves with careful crews and fixed-price quotes.',
    intro: [
      'London to Nottingham is straight up the M1, around 130 miles. With a morning start, most moves are comfortably loaded and delivered in a single day.',
      'Nottingham’s suburbs, from West Bridgford to The Park Estate and Beeston, are popular with London movers looking for space and good schools.',
    ],
    whyPeopleMove: 'Space, schools and housing value, plus a direct train line back to London.',
    considerations: [
      'M1 roadworks near Milton Keynes and Leicester can add time.',
      'Check on-street parking in older Nottingham neighbourhoods.',
      'Avoid student changeover weeks in Lenton and Beeston.',
    ],
    faqs: [
      { q: 'How far is it from London to Nottingham?', a: 'About 130 miles, taking 2.5 to 3 hours without heavy traffic.' },
      { q: 'Do you offer part-loads?', a: 'Yes. A shared load can reduce the cost if you can be flexible on delivery dates.' },
    ],
  },
];

export const getRoute = (slug: string) => routes.find((r) => r.slug === slug);
