/* Age, pacing, reflection, and off-screen extensions for the six authored stories. */
const EXPERIENCE = {
  ocean: {
    youngVersion: 3, youngNarrationVersions: { b2b: 4, b3a: 4, b3b: 4, b4: 5, ending: 4 }, youngChoiceVersion: 2, youngQuestionVersion: 3, quickVersion: 3, quickYoungVersion: 2,
    youngText: {
      start: "Ollie is an octopus with eight arms. Tula is his turtle friend with a hard shell. Today, they open Tula’s treasure chest together.",
      b1: "Seven shells shine. Tula yawns and falls asleep beside the chest. Then a secret sparkle flashes underneath. Ollie’s eyes grow wide. He feels very curious, but he wants to be kind.",
      b1_context: "Ollie can wait so Tula wakes gently, and they can look together. Or he can peek now, but Tula may startle. Ollie takes a slow bubble breath. Should he wait or peek?",
      b2a: "Ollie waits and counts three bubbles. Tula wakes with a smile. What should Ollie say?",
      b2b: "Ollie peeks too soon. Oh! Tula wakes with a start. Ollie feels sorry and hides in swishing seaweed. He changes color. That is camouflage. Should he come out or say sorry?",
      b3a: "Tula thanks Ollie for waiting. A spiral shell curls like a wave. A pink fan opens wide. Which should they take: the spiral or the pink fan?",
      b3b: "Ollie comes out slowly. “I’m sorry,” he says softly. Tula smiles, and Ollie feels relieved. She shows a spiral shell and a pink fan shell. Which should they take?",
      b4: "Ollie makes the letter O. Octopus starts with O. A blue octagon has eight sides. An oyster has a smooth pearl. Which should go by the door: the blue octagon or the oyster pearl?",
      ending: "Pat-pat-pat! Ollie and Tula make a sandcastle. They add a shell and their O treasures. “We made it together!” Ollie cheers with joy. Tula beams beside him."
    },
    quick: {
      questionIndexes: [0, 1, 2, 3, 4],
      resolutionByNode: {
        b2a: { image: "ocean-paper-two-o-treasures-v2.png", sound: "treasure_glint", text: "Tula thanks Ollie and shares her shells. Ollie makes an O with one arm. Octopus starts with O. An octagon has eight sides. They carry the treasures across the sand.", youngText: "Tula thanks Ollie and shares her shells. Ollie makes an O. Octopus starts with O. An octagon has eight sides." },
        b2b: { image: "ocean-paper-two-o-treasures-v2.png", sound: "treasure_glint", text: "Ollie comes out and says sorry. Tula smiles and shares her shells. Ollie makes an O with one arm. Octopus starts with O. An octagon has eight sides. They carry the treasures across the sand.", youngText: "Ollie comes out and says sorry. Tula shares her shells. Ollie makes an O. Octopus starts with O. An octagon has eight sides." }
      }
    },
    wonder: {
      young: { image: "ocean-paper-choice-v1.jpg", prompt: "Tula is sleeping. What could Ollie do?", options: [{ emoji: "🫧", label: "Wait quietly", response: "Waiting quietly gives Tula time to wake up." }, { emoji: "🌞", label: "Say hello softly", response: "A soft hello can wake a friend gently." }] },
      middle: { image: "ocean-paper-two-o-treasures-v2.png", prompt: "Which new O word could the friends add to their castle?", options: [{ emoji: "🍊", label: "Orange", response: "Orange begins with the letter O." }, { emoji: "🦉", label: "Owl", response: "Owl also begins with the letter O, though an owl lives on land." }] },
      older: { image: "ocean-paper-camouflage-v1.jpg", prompt: "Why might an octopus use camouflage?", options: [{ emoji: "🫣", label: "To hide from danger", response: "Yes. Changing color or skin shape can help an octopus hide." }, { emoji: "🔎", label: "To become easier to see", response: "Camouflage usually makes an animal harder to see." }] }
    },
    facts: ["An octopus has eight arms.", "A hard shell covers a turtle’s back.", "Octopus starts with O, and an octagon has eight sides."],
    strength: "A thoughtful friend", strengthText: "You helped Ollie notice Tula’s feelings and make something together.",
    followUp: "Find three things shaped like an O, then count eight blocks like the sides of an octagon.",
    missions: [{ emoji: "🐙", title: "Draw eight arms", instruction: "Draw Ollie, then count and add all eight arms." }, { emoji: "⭕", title: "Make an O hunt", instruction: "With a grown-up, find three safe things shaped like the letter O." }, { emoji: "🏰", title: "Build a tiny castle", instruction: "Use blocks or cups to build a castle for Ollie and Tula." }]
  },
  moon: {
    youngVersion: 3, youngNarrationVersions: { start: 4, b1_context: 4, b2a: 5, b2b: 4, b5: 4 }, youngChoiceVersion: 2, youngQuestionVersion: 3, quickVersion: 3, quickYoungVersion: 2,
    youngText: {
      start: "Lumi is a little star. Puff is Lumi’s cloud friend who makes funny shapes. Earth has one Moon. Tonight, they will wave a silver ribbon at the Moon Dance.",
      b1: "Puff is gone. “Puff?” Lumi calls. No one answers. Lumi’s glow dims because she feels worried. She holds their ribbon, takes a brave breath, and says, “I will find you.”",
      b1_context: "A moonbeam makes a bright trail. The wind carries a cloud tuft and a tiny laugh. Both clues may lead to Puff. Which should Lumi try: the moonbeam or the wind?",
      b2a: "A moonbeam makes a bright trail. Lumi can stay close to it or look from above to see where it goes. Which plan should she try?",
      b2b: "The wind carries Puff’s laugh. Lumi cries with hope, “Puff!” She can follow the laugh or shine so Puff sees her. Which should she do?",
      b3: "Lumi sighs with relief, “Puff—you’re safe!” Puff is tired behind a dark rock. Lumi can stay close or look around the rock for sunlight. Which should she do?",
      b4: "A gold line comes from the Sun. They can follow it, or make bright star markers for the way home. Which plan should they try?",
      b5: "Sunlight makes a bright path. Puff is tired. Lumi says gently, “I’ve got you.” Should the ribbon pull Puff or make a soft seat?",
      b6: "They made it! The friends get back in time, tired but happy. Should they shine and spin or wave the ribbon?",
      ending: "Whoosh—flutter—shine! Puff makes a Moon shape. Lumi adds gold light. The friends laugh with joy. The Moon Dance begins!"
    },
    quick: { questionIndexes: [0, 1, 2, 3, 4], resolution: { image: "moon-bridge-v3.png", sound: "ribbon_flutter", text: "Your clue leads Lumi behind the dark rock, where Puff is safe but tired. The Sun is a star. The Moon does not make its own light, so sunlight shows a bright path. Lumi uses the ribbon to help Puff home.", youngText: "Lumi’s clue finds Puff behind a dark rock. The Sun is a star. The Moon does not make light. Sunlight makes a bright path, and Lumi helps Puff home." } },
    wonder: {
      young: { prompt: "What makes the Moon look bright: sunlight or its own lamp?", options: [{ emoji: "☀️", label: "Sunlight", response: "Yes. Sunlight makes the Moon look bright." }, { emoji: "💡", label: "Its own lamp", response: "The Moon has no lamp and makes no light. Sunlight shines on it." }] },
      middle: { prompt: "Puff is in shadow. Where can Lumi look for a bright path?", options: [{ emoji: "☀️", label: "Around the rock", response: "Yes. Sunlight may reach around the rock." }, { emoji: "🌙", label: "Inside the Moon", response: "The Moon does not make light inside. Lumi should look for sunlight." }] },
      older: { prompt: "Why is one place on the Moon bright while a rock makes another place dark?", audioVersion: 2, delivery: "curious/explanatory", options: [{ emoji: "☀️", label: "Sunlight reaches one place", response: "Exactly. The rock blocks sunlight and makes a shadow." }, { emoji: "🔘", label: "The Moon switches off", response: "The Moon has no light switch. The rock is blocking sunlight." }] }
    },
    facts: ["Earth has one Moon.", "The Sun is a star.", "The Moon looks bright because sunlight shines on it."],
    strength: "A steady friend", strengthText: "You stayed with Puff and helped both friends find their way home.",
    followUp: "Look for the Moon with a grown-up and notice which part looks bright. Lumi and Puff’s Moon Dance is make-believe.",
    missions: [{ emoji: "🌙", title: "Make a Moon shape", instruction: "Curve your arms into a Moon, then make the shape grow and shrink." }, { emoji: "🔦", title: "Make a Moon shine", instruction: "A grown-up shines a torch on a ball, away from every face. Turn the ball and watch the bright side." }, { emoji: "🎀", title: "Do the ribbon dance", instruction: "Wave a scarf slowly like Lumi and Puff’s silver ribbon." }]
  },
  forest: {
    youngVersion: 3, youngNarrationVersions: { b1_context: 4 }, youngChoiceVersion: 2, youngQuestionVersion: 3, quickVersion: 3, quickYoungVersion: 2,
    youngText: {
      start: "Nori is a squirrel who loves his drum. Bee, Bird, and Baby Fox are his forest friends. Today, they are getting ready for Baby Fox’s first Sunrise Dance.",
      b1: "Rattle-rattle—BOING! Nori’s drum rolls away. He gasps in alarm, “My drum!” It disappears into the trees. Nori’s paws feel shaky because the dance starts soon. His friends stay close.",
      b1_context: "Bee taps beside paw prints. Bird sings the drum song by the old tree. Both clues may help. Which should Nori try: Bee or Bird?",
      b2a: "Bee finds paw marks going to an old tree. Nori hears a soft boom. Should he follow the marks or the boom?",
      b2b: "Bird sings by the old tree. Nori can peek through a hollow or circle around toward the soft boom. Which should he try?",
      b3: "“There it is!” Nori hugs his drum with relief. A big acorn blocks the door. Nori can test one push, or everyone can push together. Which plan should they try?",
      b4: "Heave-ho! The acorn rolls away. At the broken bridge, Bird can see from above and Bee can point to safe steps. Nori’s big tail helps him balance. Who should guide him?",
      b5: "Bee holds a vine with six legs. There is room below, and Bird covers the sharp end above. Should Nori crawl under or step over?",
      b6: "They made it! Nori reaches Baby Fox at sunrise and grins with relief. Should Nori or Baby Fox make the first beat?",
      ending: "Tap-tap… BOOM! Baby Fox dances. Nori laughs with relief. Bee taps six legs. Bird shakes feathers. Hooray—the dance is saved!"
    },
    quick: { questionIndexes: [0, 1, 2, 3, 4], resolution: { image: "forest-parade-v3.png", sound: "drum_roll", text: "Your clue leads Nori into the old tree. The friends free the drum. Bee uses all six legs, Bird’s body is covered in feathers, and Nori’s big tail helps him balance across the bridge. They reach Baby Fox at sunrise.", youngText: "Nori’s clue leads to the old tree. The friends free the drum. Bee has six legs. Bird has feathers. Nori’s big tail helps him balance. They reach Baby Fox." } },
    wonder: {
      young: { prompt: "What helps Nori balance: his tail or his ears?", options: [{ emoji: "🐿️", label: "His tail", response: "Yes. A squirrel’s tail helps it balance." }, { emoji: "👂", label: "His ears", response: "His ears help him hear. His big tail helps him balance." }] },
      middle: { prompt: "Bee has three legs on each side. How many legs is that altogether?", options: [{ emoji: "6️⃣", label: "Six", response: "Yes. Three and three make six." }, { emoji: "4️⃣", label: "Four", response: "Let’s count again: three and three make six." }] },
      older: { prompt: "Why can a wide tail help on a wobbly branch?", options: [{ emoji: "⚖️", label: "It shifts balance", response: "Right. Moving the tail helps shift the squirrel’s weight." }, { emoji: "🪽", label: "It makes wings", response: "A tail is not a wing. It helps shift balance." }] }
    },
    facts: ["A bee has six legs.", "Feathers cover a bird’s body.", "A squirrel’s tail helps it balance."],
    strength: "A teamwork leader", strengthText: "You helped Nori use every friend’s special skill.",
    followUp: "From a safe distance, spot a bird, bee, or squirrel and name one body part that helps it.",
    missions: [{ emoji: "⚖️", title: "Balance like Nori", instruction: "With a grown-up close by, walk slowly along a line on the floor." }, { emoji: "6️⃣", title: "Make Bee’s beat", instruction: "Tap a table six times, counting each pretend bee leg." }, { emoji: "🪶", title: "Make a paper bird", instruction: "Draw a bird and add soft paper feathers." }]
  },
  dragon: {
    youngVersion: 5, youngNarrationVersions: { start: 6, b1: 6, b1_context: 6, b4: 6, b6: 6, ending: 7, ending_reveal: 8, ending_celebration: 8 }, youngChoiceVersion: 3, youngQuestionVersion: 3, quickVersion: 4, quickYoungVersion: 3,
    pathTransitions: {
      b2a: {
        youngText: "Yay—you chose the flowers! You are making Ember’s story. Let’s follow the blossoms to the rainbow seed.",
        youngAudio: "dragon_path_flowers_transition_young_v1.mp3",
        youngSpeechSegments: [
          "Yay—you chose the flowers!",
          "You are making Ember’s story.",
          "Let’s follow the blossoms to the rainbow seed."
        ]
      },
      b2b: {
        youngText: "Yay—you chose the rain! You are making Ember’s story. Let’s cross the stream toward the rainbow seed.",
        youngAudio: "dragon_path_rain_transition_young_v1.mp3",
        youngSpeechSegments: [
          "Yay—you chose the rain!",
          "You are making Ember’s story.",
          "Let’s cross the stream toward the rainbow seed."
        ]
      }
    },
    youngSounds: {
      start: "flower_magic@0.20*1.05,soft_wind@3.20*0.85,wing_flutter@9.00*1.15,flower_magic@12.45*0.90,seed_tinkle@17.40*1.15,pot_clink@18.60*1.05,flower_magic@20.50*0.90,heartbeat@23.35*0.86",
      b1: "gust@0.10*1.12,seed_tinkle@2.00*0.82,wing_flutter@7.80*1.10,gust@9.80*0.98,seed_tinkle@10.40*0.82,heartbeat@11.90*0.88,deep_breath@20.50*1.15,wing_flutter@25.10*1.08",
      b1_context: "flower_magic@0.25*1.05,soft_wind@3.15*0.90,gentle_rain@6.60*1.05,water_drips@9.65*0.72,flower_magic@13.10*0.88",
      b2a: "flower_magic@0.15*1.12,soft_wind@2.05*0.90,wing_flutter@3.60*1.10,flower_magic@5.25*0.90",
      b2b: "gentle_rain@0*1.08,water_drips@1.85*0.72,wing_flutter@6.40*1.02,water_drips@9.15*0.72",
      b3: "seed_tinkle@0.25*1.18,flower_magic@4.05*1.08,sprout@8.55*1.18,heartbeat@13.55*0.88,soft_wind@14.90*0.90",
      b4: "water_pour@0*1.15,water_drips@1.80*0.72,flower_magic@3.10*0.92,sprout@5.05*1.18,seed_tinkle@6.50*0.95,soft_wind@8.40*1.00,heartbeat@11.25*0.86",
      b5: "gentle_rain@0.20*0.98,water_drips@1.40*0.72,rainbow@3.00*1.22,flower_magic@4.55*1.05,gust@10.40*1.12",
      b6: "gust@0.05*1.08,soft_wind@1.90*0.92,warm_fire@5.60*1.10,pot_clink@8.20*0.95,sprout@9.45*1.18,flower_magic@10.75*0.95,ribbon_flutter@13.10*1.10",
      ending: "pot_clink@0.6*0.30,wing_flutter@3.8*0.42,soft_wind@6.2*0.18,birthday_pop@8.2*0.88,flower_magic@8.7*0.76,rainbow@10.0*0.58",
      ending_reveal: "ribbon_flutter@0.20*0.98,pot_clink@1.62*1.00,wing_flutter@2.25*1.18,soft_wind@5.05*0.98,flower_magic@7.62*1.15,heartbeat@9.79*0.92",
      ending_celebration: "birthday_pop@0.48*1.25,flower_magic@1.50*1.18,rainbow@3.35*1.12,wing_flutter@9.87*1.15,night_twinkle@16.60*0.90,seed_tinkle@20.50*0.95,heartbeat@21.75*0.88"
    },
    youngSpeechSegments: {
      start: [
        "Ember is a little green dragon who loves growing flowers with Grandma Sky, and she can hardly keep still—tomorrow is Grandma’s BIRTHDAY! Her wings flutter with excitement.",
        "Every birthday they plant one special flower together; this year Grandma gives Ember a rainbow seed and purple pot because she trusts Ember to grow it.",
        "Ember hugs the pot, eager to make Grandma proud."
      ],
      b1: [
        "Suddenly—WHOOOOSH! The wind grabs the seed—“MY SEED!” Ember cries loudly in alarm.",
        "She jumps, but she is too late, and the seed spins away over the hill.",
        "A worried tear rolls down her cheek as she sobs, “Grandma trusted me.”",
        "Ember closes her eyes and takes one long, deep breath—in... and out.",
        "She wipes her tear, stands tall, and says, “I won’t give up—I will find our seed.”"
      ],
      b1_context: [
        "Ember sees two sparkling trails: the flower trail winds between pink blossoms.",
        "The rain trail crosses a little stream on big, flat stones; both lead toward the sunny field.",
        "Which trail should she follow—the flowers or the rain?"
      ],
      b2a: [
        "Sparkles dance between delicate flowers.",
        "Ember can tiptoe through open spaces or fly above the petals.",
        "Both plans keep the flowers safe. How should she cross?"
      ],
      b2b: [
        "Drip, drop, patter-patter. Sparkles cross a shallow stream.",
        "Ember can fly over the water or step carefully on big, flat stones.",
        "How should she cross?"
      ],
      b3: [
        "Ember gasps with happy relief. “There you are!”",
        "Beside a gray pebble, the rainbow seed glows bright gold. Its striped shell is easy to see, and two green leaves poke out.",
        "The sprout is dry and partly shaded. It needs water and sunlight.",
        "Which should Ember bring first?"
      ],
      b4: [
        "Glug-glug—Ember gives the sprout water and sunlight.",
        "“You’re growing!” she says proudly.",
        "Then a cloud covers the Sun; her smile falls as she whispers, “Oh, no.”",
        "Should she blow the cloud gently or bounce light with a shiny shield?"
      ],
      b5: [
        "Sunlight meets rain drops. A huge rainbow opens—red, orange, yellow, green, blue, indigo, and violet. “Wow!” Ember breathes in wonder.",
        "Then cold wind whistles.",
        "Should her wing shelter the plant, or should a wall block the wind all night?"
      ],
      b6: [
        "Ember keeps the hot fire far from the leaves because she knows it is not safe for the plant.",
        "She warms one smooth stone, places it near the pot, and watches the bud grow round.",
        "Should she hide the pot until sunrise or tie on a ribbon for Grandma?"
      ],
      ending: [
        "Ember ties a ribbon around the purple pot and hides beside Grandma’s door, wiggling with excitement.",
        "The Sun rises. The closed rainbow bud glows and wiggles. Ember holds her breath—something magical is about to happen.",
        "With a happy POP, the flower opens and shines in seven rainbow colors. Grandma steps outside and stops. Her eyes grow wide.",
        "Ember jumps out, opens her paws, and calls brightly, “Surprise, Grandma! Happy birthday!”",
        "Grandma beams and wraps Ember in a big, warm dragon hug."
      ],
      ending_reveal: [
        "Ember ties a ribbon around the purple pot and hides beside Grandma’s door.",
        "The Sun rises. The closed rainbow bud glows and wiggles. Ember holds her breath—something magical is about to happen."
      ],
      ending_celebration: [
        "With a happy POP, the flower opens and shines in seven rainbow colors. Grandma steps outside and stops. Her eyes grow wide.",
        "Ember jumps out, opens her paws, and calls brightly, “Surprise, Grandma! Happy birthday!”",
        "Grandma gives a happy gasp. “You grew our flower!”",
        "She wraps Ember in a warm dragon hug."
      ]
    },
    missionPromptVersion: 3,
    missionPrompt: "What a wonderful birthday surprise! Now let’s put the phone down and keep Ember’s adventure going away from the screen. We can help a plant, find seven colors, or do the dragon stretch. Pick one mission, bring a grown-up, and let the real-world adventure begin!",
    missionPromptSpeechSegments: [
      "What a wonderful birthday surprise!",
      "Now let’s put the phone down and keep Ember’s adventure going away from the screen.",
      "We can help a plant, find seven colors, or do the dragon stretch.",
      "Pick one mission, bring a grown-up, and let the real-world adventure begin!"
    ],
    missionPromptDelivery: "bright, celebratory, and genuinely excited about putting the phone down; invite active real-world play with a grown-up, then give the last line an energetic lift",
    missionPromptYoungVersion: 3,
    missionPromptYoungText: "Yay—Ember’s birthday surprise is ready! Now let’s put the phone down and keep playing away from the screen. We can help a plant, find seven colors, or do the dragon stretch. Pick one, bring a grown-up, and let’s go!",
    missionPromptYoungSpeechSegments: [
      "Yay—Ember’s birthday surprise is ready!",
      "Now let’s put the phone down and keep playing away from the screen.",
      "We can help a plant, find seven colors, or do the dragon stretch.",
      "Pick one, bring a grown-up, and let’s go!"
    ],
    missionPromptYoungDelivery: "warm, simple, and bubbling with excitement; clearly invite the child to put the phone down and keep playing with a grown-up",
    youngText: {
      start: "Ember is a little green dragon who loves growing flowers with Grandma Sky, and she can hardly keep still—tomorrow is Grandma’s BIRTHDAY! Her wings flutter with excitement. Every birthday they plant one special flower together; this year Grandma gives Ember a rainbow seed and purple pot because she trusts Ember to grow it. Ember hugs the pot, eager to make Grandma proud.",
      b1: "Suddenly—WHOOOOSH! The wind grabs the seed—“MY SEED!” Ember cries loudly in alarm. She jumps, but she is too late, and the seed spins away over the hill. A worried tear rolls down her cheek as she sobs, “Grandma trusted me.” Ember closes her eyes and takes one long, deep breath—in... and out. She wipes her tear, stands tall, and says, “I won’t give up—I will find our seed.”",
      b1_context: "Ember sees two sparkling trails: the flower trail winds between pink blossoms. The rain trail crosses a little stream on big, flat stones; both lead toward the sunny field. Which trail should she follow—the flowers or the rain?",
      b2a: "Sparkles dance between delicate flowers. Ember can tiptoe through open spaces or fly above the petals. Both plans keep the flowers safe. How should she cross?",
      b2b: "Drip, drop, patter-patter. Sparkles cross a shallow stream. Ember can fly over the water or step carefully on big, flat stones. How should she cross?",
      b3: "Ember gasps with happy relief. “There you are!” Beside a gray pebble, the rainbow seed glows bright gold. Its striped shell is easy to see, and two green leaves poke out. The sprout is dry and partly shaded. It needs water and sunlight. Which should Ember bring first?",
      b4: "Glug-glug—Ember gives the sprout water and sunlight. “You’re growing!” she says proudly. Then a cloud covers the Sun; her smile falls as she whispers, “Oh, no.” Should she blow the cloud gently or bounce light with a shiny shield?",
      b5: "Sunlight meets rain drops. A huge rainbow opens—red, orange, yellow, green, blue, indigo, and violet. “Wow!” Ember breathes in wonder. Then cold wind whistles. Should her wing shelter the plant, or should a wall block the wind all night?",
      b6: "Ember keeps the hot fire far from the leaves because she knows it is not safe for the plant. She warms one smooth stone, places it near the pot, and watches the bud grow round. Should she hide the pot until sunrise or tie on a ribbon for Grandma?",
      ending: "Ember ties a ribbon around the purple pot and hides beside Grandma’s door, wiggling with excitement. The Sun rises. The closed rainbow bud glows and wiggles. Ember holds her breath—something magical is about to happen. With a happy POP, the flower opens and shines in seven rainbow colors. Grandma steps outside and stops. Her eyes grow wide. Ember jumps out, opens her paws, and calls brightly, “Surprise, Grandma! Happy birthday!” Grandma beams and wraps Ember in a big, warm dragon hug.",
      ending_reveal: "Ember ties a ribbon around the purple pot and hides beside Grandma’s door. The Sun rises. The closed rainbow bud glows and wiggles. Ember holds her breath—something magical is about to happen.",
      ending_celebration: "With a happy POP, the flower opens and shines in seven rainbow colors. Grandma steps outside and stops. Her eyes grow wide. Ember jumps out, opens her paws, and calls brightly, “Surprise, Grandma! Happy birthday!” Grandma gives a happy gasp. “You grew our flower!” She wraps Ember in a warm dragon hug."
    },
    youngEndingPages: {
      ending_reveal: {
        leftText: "Ember ties a ribbon around the purple pot and hides beside Grandma’s door.",
        rightText: "The Sun rises. The closed rainbow bud glows and wiggles. Ember holds her breath—something magical is about to happen."
      },
      ending_celebration: {
        leftText: "With a happy POP, the flower opens and shines in seven rainbow colors. Grandma steps outside and stops. Her eyes grow wide.",
        rightText: "Ember jumps out, opens her paws, and calls brightly, “Surprise, Grandma! Happy birthday!” Grandma gives a happy gasp. “You grew our flower!” She wraps Ember in a warm dragon hug."
      }
    },
    quick: { questionIndexes: [0, 1, 2, 3, 4], resolution: { image: "dragon-quick-rainbow-v1.png", sound: "seed_tinkle@0.20*1.18,flower_magic@1.85*0.92,heartbeat@4.35*0.85,water_pour@5.20*1.12,sprout@7.95*1.05,rainbow@9.70*1.20,warm_fire@12.85*0.95,pot_clink@16.05*0.90", youngSound: "seed_tinkle@0.20*1.18,flower_magic@1.80*0.92,water_pour@4.05*1.12,sprout@5.85*1.05,rainbow@6.75*1.20,flower_magic@8.25*0.90,warm_fire@10.60*0.95,pot_clink@12.80*0.90", text: "Ember’s trail leads to the bright golden seed beside a gray pebble. She cries with relief, gives the sprout water and sunlight, and watches a huge seven-color rainbow open clearly above the purple pot. She keeps the hot flame safely far away and places one gently warmed stone beside the pot to protect the bud.", youngText: "Ember finds the bright golden seed beside a gray pebble. She gives its sprout water and sunlight. A huge seven-color rainbow opens above the purple pot. She keeps the hot flame far away and puts one warm stone beside the pot." } },
    wonder: {
      young: { prompt: "What helps a little plant grow?", options: [{ emoji: "💧", label: "Water and sunlight", response: "Yes. Plants need water and light to grow." }, { emoji: "🧸", label: "Toys and shoes", response: "Those do not feed a plant. It needs water and light." }] },
      middle: { prompt: "What could happen if Ember holds hot fire close to the leaves?", options: [{ emoji: "🥀", label: "The leaves could burn", response: "Yes. Fire is hot, so Ember keeps it far away." }, { emoji: "🌸", label: "A flower opens at once", response: "Fire can burn leaves. Water and sunlight help the plant grow." }] },
      older: { prompt: "Which plan warms the plant more safely?", options: [{ emoji: "🪨", label: "A warm stone far away", response: "Good plan. The heat stays gentle and the fire stays away." }, { emoji: "🔥", label: "Fire on the leaves", response: "That could burn the plant. Fire must stay far away." }] }
    },
    facts: ["Plants need water and sunlight to grow.", "A rainbow is often named with seven colors.", "Fire is hot and children must stay away from it."],
    strength: "A patient grower", strengthText: "You helped Ember care for something small until it could grow.",
    followUp: "Choose one plant to check with a grown-up this week: does its soil need water, and does it get light?",
    missions: [{ emoji: "🌱", title: "Help a plant", instruction: "With a grown-up, give a real plant a small drink of water." }, { emoji: "🌈", title: "Find seven colors", instruction: "Line up seven different crayons like a rainbow." }, { emoji: "🐉", title: "Do the dragon stretch", instruction: "Curl like a seed, rise like a stem, then open like a flower." }]
  },
  robot: {
    youngVersion: 3, youngNarrationVersions: { b1_context: 4, b2b: 4 }, youngChoiceVersion: 2, youngQuestionVersion: 3, quickVersion: 3, quickYoungVersion: 2, quickVersions: { b2b: 4 }, quickYoungVersions: { b2b: 3 },
    youngText: {
      start: "Beep is an orange robot who loves music. Pip is a shy little blue robot on his first day in the workshop. Beep made him a welcome song. A silver bell goes ding.",
      b1: "CLANG—rattle-rattle! The bell rolls into the pipes. Beep cries in alarm, “Oh, bolts!” Pip startles and his wheels wobble. Then he bravely rolls closer. “I’ll help,” he says.",
      b1_context: "The magnet may pull the iron bell. A tiny ding comes from a pipe. Both clues begin a different search. Which should they try: the magnet or the ding?",
      b2a: "The magnet pulls a small iron bell. Another ding comes from a pipe. Should they move the magnet or listen by the pipe?",
      b2b: "Ding… ding… They follow the sound to a big pipe. Crrrreak—a little door opens. Pip feels nervous and curious. Should they shine a light or say hello?",
      b3: "The missing bell is iron. The magnet can pull it, and Pip can open the door. Should they do both jobs together, or open first and then pull?",
      b4: "The magnet pulls the iron bell. Beep cheers with relief, “We found it!” Then—tink—the little piece falls out. Should they look inside or shake gently?",
      b5: "The little piece makes the ding. Tap… tap… Its echo comes from the gears and tool box. Beep listens carefully. Where should he search first?",
      b6: "Click—ding! Beep fixes the bell. Pip’s wheels wobble because he feels shy. “We can start gently,” Beep says. Should they ding or tap softly?",
      fork_sound_1: "Stairs lead to a secret room. Little repair mice are playing the missing bell. Should Beep and Pip wave or ask about the bell?",
      fork_sound_2: "Beep’s magnet pulls the iron bell, but not the wood toys. The new friends can play one song here or invite the mice upstairs. Which should they do?",
      fork_sound_3: "A little piece inside the bell is loose. It must tap the bell to make a ding. Should Pip or a mouse test it?",
      fork_sound_4: "Ding! The fixed bell rings. Pip asks the mouse band to join. Should the song start with a bell or a mouse drum?",
      ending: "Ding… tap-tap… BOOM! All the machines play. Pip smiles, drums bravely, and takes a happy bow. Beep feels proud of his new friend!",
      ending_sound: "The mouse band rolls into the workshop. Beep rings the bell. Pip and the mice play. Pip has new friends."
    },
    quick: { questionIndexes: [0, 1, 2, 3, 4], resolutionByNode: {
      b2a: { image: "robot-rehearsal-v3.png", sound: "magnet_ding", text: "Your magnet clue leads to the iron bell. The magnet pulls the bell but not wood. Beep and Pip find the little piece inside, fix its ding, and get ready to play Pip’s welcome song.", youngText: "The magnet clue finds the iron bell. This magnet pulls iron but not wood. Beep and Pip fix the bell and play a welcome song." },
      b2b: { image: "robot-sound-invite-v1.png", sound: "band", text: "Your sound clue opens a secret room where repair mice are playing the iron bell. Beep shows that his magnet can pull iron but not wood. Everyone shares the bell, fixes the little piece that makes it ding, and forms a new band.", youngText: "The sound clue finds mice playing the iron bell. Beep’s magnet pulls iron but not wood. Everyone fixes the bell and makes a new band." }
    } },
    wonder: {
      young: { prompt: "What can make a ding: a bell or a sock?", options: [{ emoji: "🔔", label: "A bell", response: "Yes. The little piece inside taps the bell and makes a ding." }, { emoji: "🧦", label: "A sock", response: "A sock is soft and quiet. A bell can ding." }] },
      middle: { prompt: "Why can Beep’s magnet move an iron bell but not a wooden block?", options: [{ emoji: "🔩", label: "The bell has iron", response: "Exactly. This magnet can pull iron, but not wood." }, { emoji: "😴", label: "The wood was sleeping", response: "Wood is not asleep. This magnet does not pull wood." }] },
      older: { prompt: "Do magnets pull every kind of metal?", options: [{ emoji: "🧲", label: "Some metals, like iron", response: "Correct. Magnets attract some metals, including iron, but not every metal." }, { emoji: "🔩", label: "Every metal", response: "Not every metal is magnetic. Iron is one metal many magnets attract." }] }
    },
    facts: ["Iron is a kind of metal.", "Many magnets pull iron, but they do not pull wood.", "A little piece inside a bell taps its sides to make a ding."],
    strength: "A curious problem-solver", strengthText: "You followed a clue, tested an idea, and helped shy Pip join the music.",
    followUp: "With a grown-up, predict whether a magnet will pull a safe iron object, then test it. Keep magnets away from mouths and electronics.",
    missions: [{ emoji: "🧲", title: "Safe magnet hunt", instruction: "A grown-up chooses three safe objects. Guess, then test which one a magnet pulls. Keep it away from mouths and electronics." }, { emoji: "🥁", title: "Build a soft band", instruction: "Tap a cushion, a cardboard box, and your knees. Which sound is highest?" }, { emoji: "🤖", title: "Robot welcome dance", instruction: "Make one ding, one boom, and one friendly robot wave." }]
  },
  cloud: {
    youngVersion: 3, youngNarrationVersions: { b1_context: 4, b3: 4 }, youngChoiceVersion: 2, youngQuestionVersion: 3, quickVersion: 3, quickYoungVersion: 2,
    youngSounds: { b1: "train_chug@0*0.72,train_stop@4.35*0.92" },
    youngSpeechSegments: {
      ending: [
        "Pitter-patter, shhhhh.",
        "Gentle rain falls.",
        "Flowers open under the rainbow.",
        "The drop children cheer.",
        "Mina beams—the garden is happy again!"
      ]
    },
    youngText: {
      start: "Mina drives the smiling Cloud Train. Little water-drop friends ride inside. Below, a dry garden droops sadly. Mina feels sad for the thirsty flowers and wants to help.",
      b1: "Chug-chug… then—BUMP! The train stops at a rainbow-track gap. Mina cries with worry, “Oh no!” The dry flowers droop below. She feels sad, but promises, “We will bring your rain.”",
      b1_context: "The train stays safely still. Shiny drops lead to a sparkle. Sunlight makes a rainbow streak. Both clues may find the missing track. Which should Mina try: the drops or the sunlight?",
      b2a: "Mina studies drops from the safe platform. Should she trace the nearby drops or use her spyglass?",
      b2b: "A curved rainbow follows water drops. A straight sunbeam shows the light’s direction. Which should Mina trace?",
      b3: "The track piece is across a windy gap. Mina says with determination, “Hold on!” She can hook it with her stick or make a soft cloud bridge. Which safe plan should she try?",
      b4: "CLICK! Mina sighs with relief, “Phew—we fixed it!” Fast travel may jostle the heavy drops. Slow travel keeps the cars steady. How should she move?",
      b5: "“We made it!” Mina opens the rain doors. Shhhhh—rain falls down. Her worry turns to hope. Should she look through the rain or toward the sunlight?",
      b6: "A rainbow curls over the garden. Near flowers lift their heads, but far flowers still droop. Mina beams with hope. Should she stop nearby or carry gentle rain farther?",
      ending: "Pitter-patter, shhhhh. Gentle rain falls. Flowers open under the rainbow. The drop children cheer. Mina beams—the garden is happy again!"
    },
    quick: { questionIndexes: [0, 1, 2, 3, 4], resolution: { image: "cloud-rainbow-ride-v3.png", sound: "garden_rain", text: "Your clue leads Mina to the missing track piece. She repairs the Cloud Train. Heavy water drops fall down as rain, and sunlight through the drops makes a rainbow on the way to the garden.", youngText: "Mina’s clue finds the track piece. She fixes the train. Heavy water drops fall down as rain. Sunlight through the drops makes a rainbow. Mina reaches the garden." } },
    wonder: {
      young: { prompt: "When rain falls, does it go down or up?", options: [{ emoji: "⬇️", label: "Down", response: "Yes. Rain falls down from clouds." }, { emoji: "⬆️", label: "Up", response: "Rain does not fall up. It falls down." }] },
      middle: { prompt: "What two things helped Mina find a rainbow?", options: [{ emoji: "🌦️", label: "Sunlight and water drops", response: "Yes. Sunlight through water drops can make a rainbow." }, { emoji: "🌙", label: "Moonlight and cotton", response: "Clouds are not cotton. Sunlight and water drops can make a rainbow." }] },
      older: { prompt: "Why can a rainbow appear near falling rain?", options: [{ emoji: "🌈", label: "Light spreads into colors", response: "Yes. Water drops bend and spread sunlight into colors." }, { emoji: "🎨", label: "Rain paints the sky", response: "That is a lovely picture, but sunlight and water drops make the colors." }] }
    },
    facts: ["Clouds contain tiny water drops and sometimes ice crystals.", "Heavy drops can fall from clouds as rain.", "Sunlight through water drops can make a rainbow."],
    strength: "A caring conductor", strengthText: "You helped Mina slow down, repair the track, and carry water where it was needed.",
    followUp: "After rain, look for sunlight and water drops together. That is a good time to look for a rainbow.",
    missions: [{ emoji: "☁️", title: "Cloud-shape hunt", instruction: "Look through a window with a grown-up. What shape can you imagine in a cloud?" }, { emoji: "🌧️", title: "Make a rain rhythm", instruction: "Tap knees softly for drizzle, then a little faster for rain." }, { emoji: "🌈", title: "Rainbow color hunt", instruction: "Find one safe thing for each of seven rainbow colors." }]
  }
};

for (const [storyKey, experience] of Object.entries(EXPERIENCE)) {
  const story = CONTENT.stories[storyKey];
  story.experience = experience;
  const young = experience.youngText;
  const youngAudio = beat => `${storyKey}_${beat}_young_v${experience.youngNarrationVersions?.[beat] || experience.youngVersion || 1}.mp3`;
  story.start.youngText = young.start;
  story.start.youngAudio = youngAudio("start");
  if (experience.youngSounds?.start) story.start.youngSound = experience.youngSounds.start;
  if (story.start.delivery) {
    story.start.youngDelivery = story.start.delivery;
    story.start.youngSpeechSegments = experience.youngSpeechSegments?.start || splitNarrationSegments(young.start);
  }
  for (const [nodeKey, node] of Object.entries(story.nodes)) {
    if (young[nodeKey]) {
      node.youngText = young[nodeKey];
      node.youngAudio = youngAudio(nodeKey);
      if (experience.youngSounds?.[nodeKey]) node.youngSound = experience.youngSounds[nodeKey];
      if (node.delivery) {
        node.youngDelivery = node.delivery;
        node.youngSpeechSegments = experience.youngSpeechSegments?.[nodeKey] || splitNarrationSegments(young[nodeKey]);
      }
    }
    if (node.choices?.length > 2) node.youngChoiceAudio = `${storyKey}_${nodeKey}_choices_young_v${experience.youngChoiceVersion || 1}.mp3`;
  }
  for (const [nextNodeKey, youngTransition] of Object.entries(experience.pathTransitions || {})) {
    const pathChoice = story.nodes.b1_context?.choices?.find(choice => choice.next === nextNodeKey);
    if (!pathChoice?.transition) continue;
    Object.assign(pathChoice.transition, {
      youngText: youngTransition.youngText,
      youngAudio: youngTransition.youngAudio,
      youngDelivery: pathChoice.transition.delivery,
      youngSpeechSegments: youngTransition.youngSpeechSegments
    });
  }
  story.ending.youngText = young.ending;
  story.ending.youngAudio = youngAudio("ending");
  if (experience.youngSounds?.ending) story.ending.youngSound = experience.youngSounds.ending;
  if (story.ending.delivery) {
    story.ending.youngDelivery = story.ending.delivery;
    story.ending.youngSpeechSegments = experience.youngSpeechSegments?.ending || splitNarrationSegments(young.ending);
  }
  for (const page of story.ending.endingPages || []) {
    const pageYoungText = young[page.key];
    if (!pageYoungText) continue;
    const youngPageLayout = experience.youngEndingPages?.[page.key];
    page.youngText = pageYoungText;
    page.youngAudio = youngAudio(page.key);
    page.youngSound = experience.youngSounds?.[page.key] ?? page.sound;
    page.youngDelivery = page.delivery;
    page.youngSpeechSegments = experience.youngSpeechSegments?.[page.key] || splitNarrationSegments(pageYoungText);
    if (youngPageLayout?.leftText) page.youngLeftText = youngPageLayout.leftText;
    if (youngPageLayout?.rightText) page.youngRightText = youngPageLayout.rightText;
  }
  for (const [forkKey, ending] of Object.entries(story.forkEndings || {})) {
    const key = `ending_${forkKey}`;
    if (young[key]) {
      ending.youngText = young[key];
      ending.youngAudio = youngAudio(key);
      if (ending.delivery) {
        ending.youngDelivery = ending.delivery;
        ending.youngSpeechSegments = experience.youngSpeechSegments?.[key] || splitNarrationSegments(young[key]);
      }
    }
  }
  story.questions.forEach((question, index) => {
    const version = experience.youngQuestionVersion || (question.kind === "claim" ? 2 : 1);
    question.youngAudio = `${storyKey}_q${index + 1}_prompt_young_v${version}.mp3`;
  });
  if (!experience.quick.resolutionByNode) {
    const pathKeys = Object.keys(story.nodes).filter(nodeKey => /^b2[a-z]$/.test(nodeKey));
    experience.quick.resolutionByNode = Object.fromEntries(pathKeys.map(nodeKey => [nodeKey, { ...experience.quick.resolution }]));
  }
  for (const [nodeKey, resolution] of Object.entries(experience.quick.resolutionByNode)) {
    const quickVersion = experience.quickVersions?.[nodeKey] || experience.quickVersion || 2;
    const quickYoungVersion = experience.quickYoungVersions?.[nodeKey] || experience.quickYoungVersion || 1;
    resolution.audio = `${storyKey}_quick_${nodeKey}_v${quickVersion}.mp3`;
    if (resolution.youngText) resolution.youngAudio = `${storyKey}_quick_${nodeKey}_young_v${quickYoungVersion}.mp3`;
  }
  for (const [band, wonder] of Object.entries(experience.wonder)) {
    wonder.choiceText = `Your choices are ${wonder.options.map(option => option.label).join(", or ")}. Say your idea.`;
    wonder.spokenText = `${wonder.prompt} ${wonder.choiceText}`;
    wonder.audio = `${storyKey}_wonder_${band}_v${wonder.audioVersion || 1}.mp3`;
    if (wonder.delivery) wonder.speechSegments = wonder.speechSegments || splitNarrationSegments(wonder.spokenText);
    wonder.options.forEach((option, index) => { option.audio = `${storyKey}_wonder_${band}_response_${index + 1}_v1.mp3`; });
  }
  experience.missionPrompt = experience.missionPrompt || `Pick an off-screen mission. Your choices are ${experience.missions.map(mission => mission.title).join(", or ")}. Say a mission.`;
  experience.missionPromptAudio = `${storyKey}_mission_choices_v${experience.missionPromptVersion || 1}.mp3`;
  if (experience.missionPromptDelivery) experience.missionPromptSpeechSegments = experience.missionPromptSpeechSegments || splitNarrationSegments(experience.missionPrompt);
  experience.missionPromptYoungAudio = experience.missionPromptYoungText
    ? `${storyKey}_mission_choices_young_v${experience.missionPromptYoungVersion || experience.missionPromptVersion || 1}.mp3`
    : null;
  experience.missionPromptEntity = {
    text: experience.missionPrompt,
    audio: experience.missionPromptAudio,
    delivery: experience.missionPromptDelivery,
    speechSegments: experience.missionPromptSpeechSegments,
    youngText: experience.missionPromptYoungText,
    youngAudio: experience.missionPromptYoungAudio,
    youngDelivery: experience.missionPromptYoungDelivery,
    youngSpeechSegments: experience.missionPromptYoungSpeechSegments
  };
  experience.missions.forEach((mission, index) => {
    mission.key = ["draw", "act", "find"][index];
    mission.audio = `${storyKey}_mission_${index + 1}_v1.mp3`;
  });
}

/*
 * Long narration is divided into real illustrated pages at existing quiet audio
 * joins. The original aggregate entities remain intact for manifest generation,
 * while the browser can play only the matching slice of the approved MP3.
 */
const addIllustratedPages = (entity, {
  key,
  images,
  splitAfter,
  youngSplitAfter,
  audioBreak,
  youngAudioBreak,
  alts = []
}) => {
  if (!entity || !Array.isArray(images) || images.length !== 2) throw new Error(`${key}: two page images are required`);
  const divide = (text, marker, owner) => {
    const source = String(text || "");
    const position = source.indexOf(marker);
    if (position < 0) throw new Error(`${owner}: page split marker was not found`);
    const boundary = position + marker.length;
    const parts = [source.slice(0, boundary).trim(), source.slice(boundary).trim()];
    if (!parts[0] || !parts[1] || parts.join(" ") !== source.trim()) throw new Error(`${owner}: page text does not rejoin exactly`);
    return parts;
  };
  const standard = divide(entity.text, splitAfter, `${key} standard`);
  const young = entity.youngText
    ? divide(entity.youngText, youngSplitAfter, `${key} young`)
    : standard;
  entity.pages = images.map((image, index) => ({
    key: `${key}_${index + 1}`,
    image,
    alt: alts[index] || `Illustrated page ${index + 1}`,
    text: standard[index],
    youngText: young[index],
    audioStart: index === 0 ? 0 : audioBreak,
    audioEnd: index === 0 ? audioBreak : null,
    youngAudioStart: index === 0 ? 0 : youngAudioBreak,
    youngAudioEnd: index === 0 ? youngAudioBreak : null
  }));
};

const pageStory = CONTENT.stories;

addIllustratedPages(pageStory.ocean.start, {
  key: "ocean_start", images: ["ocean-paper-start-v1.png", "ocean-paper-treasure-chest-arrival-v1.png"],
  splitAfter: "Ollie has eight arms and can change color to hide.", youngSplitAfter: "Ollie is an octopus with eight arms.",
  audioBreak: 7.9575, youngAudioBreak: 2.635,
  alts: ["Ollie the octopus and Tula the turtle meet under the sea", "Ollie and Tula open the shell treasure chest together"]
});
addIllustratedPages(pageStory.ocean.nodes.b1, {
  key: "ocean_b1", images: ["ocean-paper-choice-v1.jpg", "ocean-paper-secret-sparkle-v1.png"],
  splitAfter: "Tula gives a tiny yawn, curls up beside it, and falls asleep.", youngSplitAfter: "Tula yawns and falls asleep beside the chest.",
  audioBreak: 7.655, youngAudioBreak: 5.0425,
  alts: ["Tula falls asleep beside the open shell chest", "Ollie notices a secret sparkle while Tula sleeps"]
});
addIllustratedPages(pageStory.ocean.nodes.b1_context, {
  key: "ocean_b1_context", images: ["ocean-paper-imagines-two-choices-v1.png", "ocean-paper-kind-choice-v1.png"],
  splitAfter: "If he peeks now, he may see it sooner—but he might wake and startle her.", youngSplitAfter: "Or he can peek now, but Tula may startle.",
  audioBreak: 13.305, youngAudioBreak: 7.625,
  alts: ["Ollie imagines waiting quietly or peeking at the chest", "Ollie takes a slow bubble breath before choosing"]
});
addIllustratedPages(pageStory.ocean.nodes.b2a, {
  key: "ocean_b2a", images: ["ocean-paper-wait-v1.png", "ocean-paper-tula-wakes-v1.png"],
  splitAfter: "Tula wakes gently and smiles at her patient friend.", youngSplitAfter: "Tula wakes with a smile.",
  audioBreak: 6.445, youngAudioBreak: 4.5525,
  alts: ["Ollie patiently counts three bubbles beside sleeping Tula", "Tula wakes gently and smiles at Ollie"]
});
addIllustratedPages(pageStory.ocean.nodes.b2b, {
  key: "ocean_b2b", images: ["ocean-paper-peek-startle-v1.png", "ocean-paper-camouflage-v1.jpg"],
  splitAfter: "he slips behind the swishing seaweed and changes color to hide.", youngSplitAfter: "Ollie feels sorry and hides in swishing seaweed.",
  audioBreak: 14.39, youngAudioBreak: 8.625,
  alts: ["Tula wakes with a start when Ollie peeks", "Ollie uses camouflage behind the seaweed"]
});
addIllustratedPages(pageStory.ocean.ending, {
  key: "ocean_ending", images: ["ocean-paper-sandcastle-building-v1.png", "ocean-paper-sandcastle-two-treasures-v3.png"],
  splitAfter: "They place a shell on top, then add the blue octagon and oyster pearl.", youngSplitAfter: "They add a shell and their O treasures.",
  audioBreak: 9.515, youngAudioBreak: 6.3875,
  alts: ["Ollie and Tula build their sandcastle together", "Ollie and Tula celebrate their finished treasure castle"]
});

addIllustratedPages(pageStory.moon.start, {
  key: "moon_start", images: ["moon-opening-v3.png", "moon-dance-preparation-v1.png"],
  splitAfter: "They are best friends above Earth.", youngSplitAfter: "Puff is Lumi’s cloud friend who makes funny shapes.",
  audioBreak: 8.51, youngAudioBreak: 5.82,
  alts: ["Lumi and Puff together above Earth", "Lumi and Puff prepare their silver ribbon for the Moon Dance"]
});
addIllustratedPages(pageStory.moon.nodes.b1, {
  key: "moon_b1", images: ["moon-searching-clouds-v1.png", "moon-puff-missing-v1.png"],
  splitAfter: "Lumi searches behind every little cloud.", youngSplitAfter: "No one answers.",
  audioBreak: 7.69, youngAudioBreak: 5.2625,
  alts: ["Lumi searches the little clouds for Puff", "Lumi takes a brave breath and keeps searching"]
});
addIllustratedPages(pageStory.moon.nodes.b1_context, {
  key: "moon_b1_context", images: ["moon-clues-appear-v1.png", "moon-two-clues-v1.png"],
  splitAfter: "The wind carries a soft cloud tuft—and perhaps the tiniest giggle.", youngSplitAfter: "The wind carries a cloud tuft and a tiny laugh.",
  audioBreak: 10.85, youngAudioBreak: 5.6525,
  alts: ["A moonbeam and a windy cloud tuft appear as clues", "Lumi looks between the moonbeam and wind clues"]
});
for (const resolution of Object.values(pageStory.moon.experience.quick.resolutionByNode)) addIllustratedPages(resolution, {
  key: "moon_quick", images: ["moon-quick-found-puff-v1.png", "moon-bridge-v3.png"],
  splitAfter: "The Moon does not make its own light, so sunlight shows a bright path.", youngSplitAfter: "The Moon does not make light.",
  audioBreak: 10.9975, youngAudioBreak: 6.5825,
  alts: ["Lumi finds tired Puff behind the dark rock", "Lumi uses the silver ribbon to help Puff home"]
});

addIllustratedPages(pageStory.forest.start, {
  key: "forest_start", images: ["forest-opening-v3.png", "forest-sunrise-preparations-v1.png"],
  splitAfter: "Bee, Bird, and little Baby Fox are his forest friends.", youngSplitAfter: "Bee, Bird, and Baby Fox are his forest friends.",
  audioBreak: 6.81, youngAudioBreak: 6.4225,
  alts: ["Nori and his forest friends gather at dawn", "The friends decorate for Baby Fox’s Sunrise Dance"]
});
addIllustratedPages(pageStory.forest.nodes.b1, {
  key: "forest_b1", images: ["forest-drum-rollaway-v1.png", "forest-nori-determination-v1.png"],
  splitAfter: "Nori gasps in alarm, “My drum!”", youngSplitAfter: "It disappears into the trees.",
  audioBreak: 10.4625, youngAudioBreak: 10.2,
  alts: ["Nori’s drum rolls down the forest path", "Worried Nori becomes determined to find his drum"]
});
addIllustratedPages(pageStory.forest.nodes.b1_context, {
  key: "forest_b1_context", images: ["forest-clues-appear-v1.png", "forest-two-clues-v1.png"],
  splitAfter: "Bird sings Nori’s drum rhythm from an old hollow tree.", youngSplitAfter: "Bird sings the drum song by the old tree.",
  audioBreak: 9.9725, youngAudioBreak: 4.94,
  alts: ["Bee’s paw prints and Bird’s song appear as clues", "Nori compares Bee and Bird’s two clues"]
});
for (const resolution of Object.values(pageStory.forest.experience.quick.resolutionByNode)) addIllustratedPages(resolution, {
  key: "forest_quick", images: ["forest-quick-free-drum-v1.png", "forest-parade-v3.png"],
  splitAfter: "The friends free the drum.", youngSplitAfter: "The friends free the drum.",
  audioBreak: 4.7375, youngAudioBreak: 4.2,
  alts: ["Nori and friends free the drum inside the old tree", "The friends carry the drum safely toward Baby Fox"]
});

addIllustratedPages(pageStory.dragon.start, {
  key: "dragon_start", images: ["dragon-opening-v3.png", "dragon-grandma-gives-seed-v1.png"],
  splitAfter: "Her little wings flutter with excitement.", youngSplitAfter: "Her wings flutter with excitement.",
  audioBreak: 12.0625, youngAudioBreak: 11.9175,
  alts: ["Ember wiggles with excitement for Grandma Sky’s birthday", "Grandma Sky trusts Ember with the rainbow seed and purple pot"]
});
addIllustratedPages(pageStory.dragon.nodes.b1, {
  key: "dragon_b1", images: ["dragon-seed-gust-v1.png", "dragon-brave-breath-v1.png"],
  splitAfter: "“Grandma trusted me.”", youngSplitAfter: "“Grandma trusted me.”",
  audioBreak: 26.835, youngAudioBreak: 17.635,
  alts: ["A gust carries Ember’s rainbow seed away as she cries", "Ember takes a deep breath and bravely promises to find the seed"]
});
for (const resolution of Object.values(pageStory.dragon.experience.quick.resolutionByNode)) addIllustratedPages(resolution, {
  key: "dragon_quick", images: ["dragon-quick-found-seed-v1.png", "dragon-quick-rainbow-v1.png"],
  splitAfter: "She cries with relief, gives the sprout water and sunlight, and watches a huge seven-color rainbow open clearly above the purple pot.", youngSplitAfter: "A huge seven-color rainbow opens above the purple pot.",
  audioBreak: 12.185, youngAudioBreak: 9.9925,
  alts: ["Ember finds the golden seed and helps its sprout grow", "Ember protects the rainbow birthday bud with a warm stone"]
});

addIllustratedPages(pageStory.robot.start, {
  key: "robot_start", images: ["robot-opening-v3.png", "robot-welcome-song-v1.png"],
  splitAfter: "Pip feels shy, so Beep made him a welcome song.", youngSplitAfter: "Pip is a shy little blue robot on his first day in the workshop.",
  audioBreak: 10.57, youngAudioBreak: 7.09,
  alts: ["Beep welcomes shy Pip into the music workshop", "Beep demonstrates Pip’s drums, pipes, and silver bell welcome song"]
});
addIllustratedPages(pageStory.robot.nodes.b1, {
  key: "robot_b1", images: ["robot-bell-rollaway-v1.png", "robot-pip-offers-help-v1.png"],
  splitAfter: "The silver bell leaps from its hook and vanishes into the pipe maze.", youngSplitAfter: "The bell rolls into the pipes.",
  audioBreak: 12.2975, youngAudioBreak: 4.18,
  alts: ["The silver bell tumbles into the workshop pipe maze", "Shy Pip rolls close and bravely offers to help Beep"]
});
addIllustratedPages(pageStory.robot.nodes.b1_context, {
  key: "robot_b1_context", images: ["robot-clues-appear-v1.png", "robot-two-clues-v1.png"],
  splitAfter: "A faint ding echoes from a copper pipe, so listening could reveal where the bell rolled.", youngSplitAfter: "A tiny ding comes from a pipe.",
  audioBreak: 12.36, youngAudioBreak: 4.5425,
  alts: ["A magnet tug and faint pipe ding offer two workshop clues", "Beep and Pip compare the magnet and ding clues"]
});
addIllustratedPages(pageStory.robot.experience.quick.resolutionByNode.b2a, {
  key: "robot_quick_magnet", images: ["robot-quick-magnet-rescue-v1.png", "robot-rehearsal-v3.png"],
  splitAfter: "The magnet pulls the bell but not wood.", youngSplitAfter: "This magnet pulls iron but not wood.",
  audioBreak: 6.1425, youngAudioBreak: 5.3475,
  alts: ["Beep’s magnet safely pulls the iron bell from the pipes", "Beep and Pip repair the bell and prepare their welcome song"]
});
addIllustratedPages(pageStory.robot.experience.quick.resolutionByNode.b2b, {
  key: "robot_quick_sound", images: ["robot-quick-mouse-band-v1.png", "robot-sound-invite-v1.png"],
  splitAfter: "Beep shows that his magnet can pull iron but not wood.", youngSplitAfter: "Beep’s magnet pulls iron but not wood.",
  audioBreak: 8.2975, youngAudioBreak: 6.515,
  alts: ["Beep and Pip find repair mice playing the missing bell", "The robots and repair mice form a friendly welcome band"]
});

addIllustratedPages(pageStory.cloud.start, {
  key: "cloud_start", images: ["cloud-opening-v3.png", "cloud-dry-garden-v1.png"],
  splitAfter: "Clouds are made of tiny water drops.", youngSplitAfter: "Little water-drop friends ride inside.",
  audioBreak: 10.4625, youngAudioBreak: 6.06,
  alts: ["Mina drives the Cloud Train with her water-drop friends", "Mina sees the dry drooping garden and resolves to bring rain"]
});
addIllustratedPages(pageStory.cloud.nodes.b1, {
  key: "cloud_b1", images: ["cloud-train-stop-v1.png", "cloud-stopped-promise-v1.png"],
  splitAfter: "Mina grips the brake.", youngSplitAfter: "The train stops at a rainbow-track gap.",
  audioBreak: 13.32, youngAudioBreak: 4.635,
  alts: ["The Cloud Train stops at a gap in the rainbow track", "Mina sees the dry garden and promises to deliver the rain"]
});
addIllustratedPages(pageStory.cloud.nodes.b1_context, {
  key: "cloud_b1_context", images: ["cloud-clues-appear-v1.png", "cloud-two-clues-v1.png"],
  splitAfter: "Sunlight makes a rainbow streak across the clouds.", youngSplitAfter: "Sunlight makes a rainbow streak.",
  audioBreak: 10.98, youngAudioBreak: 6.8375,
  alts: ["Shining water drops and a sunlight rainbow appear as clues", "Mina compares the water-drop and sunlight clues"]
});
for (const resolution of Object.values(pageStory.cloud.experience.quick.resolutionByNode)) addIllustratedPages(resolution, {
  key: "cloud_quick", images: ["cloud-quick-track-repair-v1.png", "cloud-rainbow-ride-v3.png"],
  splitAfter: "She repairs the Cloud Train.", youngSplitAfter: "She fixes the train.",
  audioBreak: 5.4575, youngAudioBreak: 3.805,
  alts: ["Mina repairs the missing rainbow track piece", "The Cloud Train delivers rain and makes a rainbow"]
});
