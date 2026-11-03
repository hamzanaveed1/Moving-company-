export interface Faq {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  name: string;
  /** SEO <title> (<= 60 chars; brand suffix is added by the layout) */
  title: string;
  /** Meta description (<= 155 chars) */
  description: string;
  h1: string;
  summary: string;
  icon: 'home' | 'building' | 'office' | 'route' | 'pin' | 'box' | 'warehouse' | 'van';
  intro: string[];
  included: string[];
  bestFor: string[];
  process: { title: string; text: string }[];
  tips: string[];
  faqs: Faq[];
  relatedPosts: string[];
}

export const services: Service[] = [
  {
    slug: 'house-removals',
    name: 'House Removals',
    title: 'House Removals UK | Fully Insured & Professionally Packed',
    description:
      'Careful, fully planned house removals for 1 to 6+ bedroom homes anywhere in the UK. Trained crews, protected furniture, fixed-price quotes. Get a free quote today.',
    h1: 'House removals, planned properly and carried out carefully',
    summary: 'Full-service moves for 1 to 6+ bedroom homes, from a quick local hop to a cross-country relocation.',
    icon: 'home',
    intro: [
      'Moving house is one of the most stressful things most people do, and most of that stress comes from not knowing what will happen on the day. We take the guesswork out. Before we quote, we ask about your access, your inventory and your timings, so the van, crew size and schedule match your move rather than a generic average.',
      'On the day, a trained crew arrives on time, protects your floors and doorframes, wraps and straps furniture, and loads the van in a deliberate order so it unloads quickly and logically at the other end. Beds are rebuilt, boxes go to the right rooms, and you are never left standing in a house full of piles.',
    ],
    included: [
      'Experienced, uniformed crew (2 to 4 people depending on the size of the move)',
      'Purpose-built removal vans with tail-lifts and ramps where needed',
      'Furniture blankets, shrink wrap and floor and doorway protection',
      'Dismantling and rebuilding of beds, wardrobes and flat-pack furniture',
      'Disconnect and reconnect of washing machines and dishwashers (plumbing-ready)',
      'Optional packing service, packing materials and storage',
      'Goods-in-transit insurance cover options (ask for your policy wording)',
    ],
    bestFor: [
      'Families moving between houses of 2 to 6+ bedrooms',
      'Chain-dependent moves where the completion window is tight',
      'People who want one team to pack, move, unpack and clear',
    ],
    process: [
      { title: 'Tell us about the move', text: 'Complete the quote form or call. We ask about rooms, large items, access, parking and your date.' },
      { title: 'Get a fixed written quote', text: 'You receive a clear price, the van and crew we plan to send, and what is and is not included.' },
      { title: 'Plan and pack', text: 'We confirm timings, agree any packing help, and send a checklist so nothing is missed.' },
      { title: 'Moving day', text: 'We protect, load, drive and unload in a planned order, then place furniture where you want it.' },
    ],
    tips: [
      'Book 4 to 6 weeks ahead if you can. Fridays, month-end and school holidays fill up first.',
      'Tell us about stairs, narrow doors, long carries and parking restrictions. They change crew size and time more than the distance does.',
      'Keep a "first night" box with kettle, bedding, chargers and medication.',
    ],
    faqs: [
      { q: 'How much does a house removal cost?', a: 'It depends on the volume of belongings, the distance, access at both ends, crew size and any packing or storage. Local 2 to 3 bedroom moves usually cost less than a long-distance move of the same size. We give a fixed written quote after you tell us the details, so there are no surprises on the day.' },
      { q: 'Are my belongings insured while being moved?', a: 'Ask any removal company for the exact wording of their goods-in-transit policy, including the cover limit and excess, before you book. We will send ours with your quote so you can compare it fairly.' },
      { q: 'Can you move me at short notice?', a: 'Often yes, especially midweek. Call us with your date and we will tell you honestly what we can do. Same-week moves are usually possible outside peak days.' },
      { q: 'Do you dismantle and rebuild furniture?', a: 'Yes. Beds, wardrobes, desks and most flat-pack pieces are taken apart, protected, and rebuilt in the new home as part of a standard house move.' },
    ],
    relatedPosts: ['moving-house-checklist-uk', 'how-much-does-moving-house-cost-uk', 'how-to-pack-for-a-house-move'],
  },
  {
    slug: 'flat-removals',
    name: 'Flat Removals',
    title: 'Flat Removals UK | Lift, Stairs & Parking Experts',
    description:
      'Flat and apartment removals handled by crews who plan for lifts, stairs, permits and tight corners. Studio to 3 bed. Free, fixed-price quote.',
    h1: 'Flat and apartment removals without the stairwell stress',
    summary: 'Studios to 3-bed flats, planned around lifts, stairs, loading bays and parking permits.',
    icon: 'building',
    intro: [
      'Flat moves go wrong for different reasons than house moves. The van cannot park close, the lift is booked by another resident, the corridor is narrow, or the building has strict moving hours. The belongings are fewer, but the logistics are harder.',
      'We plan flat moves around the building. We ask about floors, lift size and booking rules, parking and loading access, and whether a permit or bay suspension is needed. Then we send the right size of van and crew so you are not paying for a lorry that cannot get near the door.',
    ],
    included: [
      'Pre-move questions on lift size, floors, loading bay and building rules',
      'Corridor, lift and stair protection where the building requires it',
      'Short-carry crews and smaller vans for tight streets',
      'Help arranging parking suspension or permit timings (you apply, we advise on lead times)',
      'Furniture dismantling for stairs and narrow doorways',
      'Optional packing and boxed-delivery to a specific floor or room',
    ],
    bestFor: [
      'Renters moving between flats at the end of a tenancy',
      'First-time buyers moving into a leasehold flat',
      'Buildings with managed lifts, concierge or restricted hours',
    ],
    process: [
      { title: 'Share building details', text: 'Floor, lift (yes/no and size), parking and any managing agent rules at both ends.' },
      { title: 'Book your lift and parking', text: 'We tell you what to request from your landlord or managing agent, and how far ahead.' },
      { title: 'Right-sized crew and van', text: 'We send a vehicle that suits the street and a crew suited to the carry.' },
      { title: 'Load, move, place', text: 'Items are protected, carried efficiently and placed in the right room straight away.' },
    ],
    tips: [
      'Ask your managing agent about lift booking and moving hours at least two weeks before.',
      'Measure the lift and the narrowest doorway if you own a large sofa or wardrobe.',
      'For permits, local councils often need several working days notice, and charges vary by borough.',
    ],
    faqs: [
      { q: 'Do I need a parking permit for the van?', a: 'In many busy streets, yes. Councils offer parking bay suspensions or dispensations, usually applied for online with several working days notice. Rules and fees vary by council, so check yours early.' },
      { q: 'What if the lift is too small?', a: 'Tell us before the day. We can dismantle furniture, use stair carries with extra crew, or use a smaller van for a shuttle. These choices change the price, so it is best to agree them up front.' },
      { q: 'Do you move students and renters?', a: 'Yes. We move one-bed flats and shared houses regularly, and offer flexible slots around tenancy end dates.' },
    ],
    relatedPosts: ['moving-house-checklist-uk', 'man-and-van-vs-removal-company'],
  },
  {
    slug: 'office-removals',
    name: 'Office Removals',
    title: 'Office Removals UK | Business Relocation With Minimal Downtime',
    description:
      'Office and commercial removals planned around your working hours. Desks, IT kit, archives and furniture moved with minimal downtime. Request a business quote.',
    h1: 'Office removals that keep your business running',
    summary: 'Evening and weekend office moves, IT-safe handling and clear labelling so you are working on day one.',
    icon: 'office',
    intro: [
      'Every day your team is not working costs money. A good office move is planned like a small project: a floor plan, a labelling system, a move order and a clear window for the move itself, often evenings or weekends.',
      'We work with office managers and IT teams to agree what moves, in what order, and where it goes. Desks, chairs, filing and archives are tagged to their new location, so the first morning in the new space is spent working, not hunting for cables.',
    ],
    included: [
      'Pre-move survey (in person or by video) and written move plan',
      'Numbered crates and colour-coded labels linked to a floor plan',
      'Evening, overnight and weekend moves to reduce downtime',
      'Careful handling of monitors, PCs and AV kit; IT disconnection is by your IT team or supplier',
      'Desk and workstation dismantling and reassembly',
      'Confidential archive handling and secure storage options',
      'Disposal and clearance of unwanted furniture (where licensed carriers are used)',
    ],
    bestFor: [
      'Small businesses and start-ups relocating to a new unit',
      'Professional services, clinics and studios with sensitive equipment',
      'Property managers clearing or fitting out a space',
    ],
    process: [
      { title: 'Survey and plan', text: 'We walk the space or do a video survey, and agree the inventory, move order and timings.' },
      { title: 'Label and crate', text: 'Crates and labels are delivered ahead. Your team packs desks; we handle furniture and heavy items.' },
      { title: 'Move out of hours', text: 'The move happens when it hurts the least, usually evenings or weekends.' },
      { title: 'Set up and sign-off', text: 'We place furniture to the floor plan and walk through with you before we leave.' },
    ],
    tips: [
      'Appoint one point of contact on your side. It removes the biggest cause of delay.',
      'Book IT disconnection and reconnection with your supplier before you fix the date.',
      'Check lease break and dilapidation dates early. They often drive the real deadline.',
    ],
    faqs: [
      { q: 'Can you move us over a weekend?', a: 'Yes. Most office moves happen out of hours so staff can finish on Friday and start in the new space on Monday.' },
      { q: 'Do you handle IT equipment?', a: 'We carefully move computers, monitors and AV kit. Disconnecting and reconnecting network equipment should be done by your IT team or supplier, and we plan the schedule around them.' },
      { q: 'Can you store furniture between offices?', a: 'Yes. Short- and long-term storage is available if there is a gap between leaving one office and fitting out another.' },
    ],
    relatedPosts: ['moving-house-checklist-uk'],
  },
  {
    slug: 'long-distance-removals',
    name: 'Long-Distance Removals',
    title: 'Long-Distance Removals UK | City-to-City Moves',
    description:
      'Reliable long-distance removals between UK cities. Scheduled, fully insured and fixed-price. London, Manchester, Birmingham, Leeds, Bristol, Scotland and more.',
    h1: 'Long-distance removals between UK cities',
    summary: 'Dedicated, scheduled moves between cities, with a fixed price and a named delivery window.',
    icon: 'route',
    intro: [
      'Long-distance moves are about reliability. You are not just paying for miles, you are paying for the certainty that your furniture will arrive when your keys do. That means realistic driving times, legal driver hours, and a plan for what happens if the completion time slips.',
      'We run dedicated loads on city-to-city routes, so your belongings are not left waiting in a depot or consolidated with strangers unless you choose a shared-load option. Whether you are leaving London for Bristol or moving from Manchester to Edinburgh, you get a fixed price, a clear schedule and one person to call.',
    ],
    included: [
      'Dedicated van and crew for your load (shared-load option available for lower cost)',
      'Fixed price including fuel, tolls and driver hours',
      'Load and unload on the same day for most routes under 250 miles',
      'Overnight stay planning for longer routes, such as to Scotland',
      'Storage-in-transit if your completion dates do not line up',
      'Tracking updates from the crew on the day',
    ],
    bestFor: [
      'Relocations for work, family or a lifestyle change',
      'Moving between cities such as London to Manchester, or Birmingham to Leeds',
      'Moves where completion dates are tight or a chain is involved',
    ],
    process: [
      { title: 'Route and date planning', text: 'We check the route, the timings and driver hours, and confirm the earliest and latest arrival.' },
      { title: 'Inventory and quote', text: 'You list your belongings; we give a fixed quote with the van size and crew.' },
      { title: 'Load and go', text: 'We load carefully, secure the load for motorway driving, and leave on schedule.' },
      { title: 'Unload and settle', text: 'Same crew unloads, rebuilds beds and places boxes. Storage is there if you need it.' },
    ],
    tips: [
      'Be flexible by a day if you can. It can reduce cost, particularly on shared loads.',
      'Pack a bag for yourself as the van may arrive before or after you.',
      'Tell us about delivery access (stairs, parking, low bridges) at the destination, not just where you are leaving.',
    ],
    faqs: [
      { q: 'How long does a long-distance move take?', a: 'Most moves under 250 miles are loaded and delivered on the same day. Longer routes, such as London to Edinburgh, may need an overnight stop to meet legal driver hours.' },
      { q: 'What is the difference between dedicated and shared load?', a: 'A dedicated load means a vehicle carries only your belongings and travels directly. A shared load combines several customers on one route, which is cheaper but less flexible on dates.' },
      { q: 'What if completion dates change on the day?', a: 'Tell us as early as you can. We can hold the load in storage-in-transit or adjust timing, which may carry an extra charge.' },
    ],
    relatedPosts: ['long-distance-moving-tips-uk', 'how-much-does-moving-house-cost-uk'],
  },
  {
    slug: 'local-removals',
    name: 'Local Removals',
    title: 'Local Removals | Moves Within Your City or Town',
    description:
      'Local removals within your city or town. Quick, careful and fairly priced, with flexible hourly or fixed-price options. Free quote in minutes.',
    h1: 'Local removals within your city',
    summary: 'Short-distance moves, priced fairly, with flexible start times and the same careful crew.',
    icon: 'pin',
    intro: [
      'A local move should not feel like a long-distance one. The drive is short, so the cost is mostly crew time, and how well the day is organised matters more than the mileage. We plan the load order, keep the carries short and make the day efficient so you pay for work, not waiting.',
      'We offer fixed-price or hourly options for local moves, and flexible start times. Many local customers book an early morning start so they are in before dark, or a late finish after work.',
    ],
    included: [
      'Fixed-price or hourly pricing, whichever suits you better',
      'Two-person minimum crew, with more for larger moves',
      'Furniture protection, wrapping and straps',
      'Multi-trip flexibility for short moves where it saves cost',
      'Optional packing materials, boxes and tape',
      'Optional rubbish and small-item clear-out before you go',
    ],
    bestFor: [
      'Moves within the same city, borough or town',
      'Tenants changing flats with a strict key-handover time',
      'People moving a smaller home who want an economical option',
    ],
    process: [
      { title: 'Quick quote', text: 'Tell us what you are moving and where. We confirm the price and timing, usually the same day.' },
      { title: 'Choose your slot', text: 'Early starts and late finishes are available. We will advise the best time for traffic and parking.' },
      { title: 'Move', text: 'Short, efficient loads with a crew that keeps things moving.' },
      { title: 'Settle in', text: 'Furniture rebuilt and boxes placed, so you can start living in the new place.' },
    ],
    tips: [
      'Moving locally does not mean packing less. Last-minute packing is the main reason local moves overrun.',
      'Park the van as close as possible. Every extra 20 metres of carrying adds time.',
      'Check bin collection and parking rules on both streets.',
    ],
    faqs: [
      { q: 'Is it cheaper to pay by the hour or a fixed price?', a: 'Hourly is often better for smaller, simple moves with good access. A fixed price is better for larger or more complex moves where you want certainty. We will recommend the better option when you ask for a quote.' },
      { q: 'Can I help carry things to save money?', a: 'You are welcome to move small items yourself beforehand, which can reduce the load and time. For insurance and safety reasons, we ask that you leave furniture and heavy items to our crew.' },
    ],
    relatedPosts: ['man-and-van-vs-removal-company', 'moving-house-checklist-uk'],
  },
  {
    slug: 'packing-service',
    name: 'Packing Service',
    title: 'Professional Packing Service | Full & Part Packing',
    description:
      'Full or part professional packing before your move: fragile items, kitchens, wardrobes and books packed securely, with materials supplied. Free quote.',
    h1: 'Professional packing service for stress-free moves',
    summary: 'Full or part packing, with strong boxes, wardrobe cartons and fragile items protected properly.',
    icon: 'box',
    intro: [
      'Packing takes far longer than anyone expects, and it is where most damage happens. A professional packer wraps glass, china and electronics correctly, uses the right box for the right item, and labels everything so unpacking is quick.',
      'You can choose a full pack, where our team packs the entire home the day before the move, or a part pack for just the kitchen, fragile items or wardrobes. We supply the materials, take the boxes away if you want, and can unpack at the other end.',
    ],
    included: [
      'All materials: new boxes, packing paper, bubble wrap, tape and wardrobe cartons',
      'Full pack, part pack or fragile-only options',
      'Clear labelling by room and contents',
      'Unpacking and box removal at the new property (optional)',
      'Mattress, picture and mirror protection',
    ],
    bestFor: [
      'People short on time or recovering from illness or injury',
      'Homes with lots of fragile or valuable items',
      'Busy families and professionals moving at short notice',
    ],
    process: [
      { title: 'Plan what to pack', text: 'We agree which rooms, how long it will take, and what you want to keep unpacked.' },
      { title: 'Pack day', text: 'The pack team arrives the day before (or morning of) the move with materials.' },
      { title: 'Label and list', text: 'Every box is labelled by room and contents so nothing is lost.' },
      { title: 'Unpack (optional)', text: 'We place boxes in rooms, unpack as agreed and take away the packaging.' },
    ],
    tips: [
      'Do a clear-out first. Every box you do not pack is money and time saved.',
      'Keep essentials, valuables and important documents with you. Do not put them on the van.',
      'Tell us about antiques, art or anything sentimental so we handle it with specific care.',
    ],
    faqs: [
      { q: 'How long does it take to pack a house?', a: 'A two-bed flat usually takes a crew of two a few hours, while a four-bed home may take a full day or more. We give you a time estimate in your quote.' },
      { q: 'Do you provide the boxes?', a: 'Yes, packing materials are included in a packing quote. We can also deliver boxes ahead for you to pack yourself.' },
    ],
    relatedPosts: ['how-to-pack-for-a-house-move', 'moving-house-checklist-uk'],
  },
  {
    slug: 'storage',
    name: 'Storage Solutions',
    title: 'Removals Storage UK | Short & Long-Term Furniture Storage',
    description:
      'Secure short and long-term storage for household and business goods, with collection and delivery by our crew. Ideal for chain delays and gaps between moves.',
    h1: 'Secure storage that fits around your move',
    summary: 'Short or long-term storage, with collection and delivery from the same crew.',
    icon: 'warehouse',
    intro: [
      'Not every move lines up. Completion dates slip, new homes are not ready, or you are downsizing and cannot fit everything. Storage gives you breathing room.',
      'We collect your goods, store them securely, and deliver them when you are ready, all by the same team who packed them. You do not need to hire a separate van to get items in and out of a self-storage unit.',
    ],
    included: [
      'Collection and delivery by our crew',
      'Flexible short or long-term terms',
      'Furniture wrapped and protected before storage',
      'Monitored premises with access controls (confirm specification at quote)',
      'Part-load and multi-drop options',
    ],
    bestFor: [
      'Chain delays and gaps between completion dates',
      'Downsizing, travelling abroad or between tenancies',
      'Renovations where rooms need to be empty',
    ],
    process: [
      { title: 'Tell us what you are storing', text: 'Volume, duration and any items with special needs, such as pianos or antiques.' },
      { title: 'Collection', text: 'We collect, wrap and itemise your goods.' },
      { title: 'Stored securely', text: 'Items are held in a monitored facility until you are ready.' },
      { title: 'Delivery', text: 'We deliver to your new home or another address on your schedule.' },
    ],
    tips: [
      'Check your home insurance. It may not cover items in storage unless you extend it.',
      'Label boxes clearly. It makes later retrieval much faster.',
      'Avoid storing items that react poorly to cold or damp, such as certain electronics or leather.',
    ],
    faqs: [
      { q: 'How long can I store my belongings?', a: 'Terms are flexible, from a few days to many months. Longer storage is usually priced monthly.' },
      { q: 'Can I access my belongings while they are in storage?', a: 'Access is usually by appointment because goods are packed in a managed facility. Tell us what you need and we will advise on the options.' },
    ],
    relatedPosts: ['long-distance-moving-tips-uk', 'moving-house-checklist-uk'],
  },
  {
    slug: 'man-and-van',
    name: 'Man and Van',
    title: 'Man and Van Hire | Small Moves & Single Items',
    description:
      'Affordable man and van for small moves, single items and student moves. Fast, flexible and fairly priced. Get a free quote in minutes.',
    h1: 'Man and van for small moves and single items',
    summary: 'A van and one or two helpers for studio flats, student moves, furniture deliveries and small loads.',
    icon: 'van',
    intro: [
      'If you are moving a studio, a few rooms, or a handful of large items, a full removal crew can be more than you need. A man and van is the practical choice: a vehicle, a driver and one or two helpers, priced by the hour or by the job.',
      'Our man and van service is ideal for student moves, furniture collected from marketplaces, single-item deliveries and small flat moves. You get a reliable team and the same standard of care we apply to larger moves.',
    ],
    included: [
      'Van with driver and helper (second helper optional)',
      'Blankets and straps to protect items',
      'Hourly or fixed-price options',
      'Same-day and next-day availability on many days',
      'Short trips, multi-drops and tip runs',
    ],
    bestFor: [
      'Students and anyone moving a studio or a few rooms',
      'Furniture collections and deliveries',
      'Small loads where a full crew is not needed',
    ],
    process: [
      { title: 'Describe the load', text: 'Tell us what you are moving and where it is going.' },
      { title: 'Get a quote', text: 'We give an hourly or fixed price with an estimate of time.' },
      { title: 'We arrive and load', text: 'Items are protected and loaded efficiently.' },
      { title: 'Delivered', text: 'We unload and place items where you need them.' },
    ],
    tips: [
      'If you have more than a studio-worth of furniture, ask about a full removals crew. Two trips can cost more than one proper van.',
      'Measure large items and doorways before booking.',
      'Be clear about access. Stairs and long carries add time.',
    ],
    faqs: [
      { q: 'What is the difference between man and van and a removal company?', a: 'A man and van suits smaller loads, with one or two people. A removal company sends a larger vehicle and crew, with more equipment, packing options and often more insurance. Our guide compares them in detail.' },
      { q: 'How many people come with the van?', a: 'The default is a driver and one helper. You can add a second helper if you have heavy or awkward items.' },
    ],
    relatedPosts: ['man-and-van-vs-removal-company', 'how-much-does-moving-house-cost-uk'],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
