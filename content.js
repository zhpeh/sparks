const splitNarrationSegments = text => {
  const pieces = String(text).match(/[^.!?]+(?:[.!?]+[”"']?|$)/g)?.map(piece => piece.trim()).filter(Boolean) || [String(text).trim()];
  const merged = [];
  for (let index = 0; index < pieces.length; index++) {
    const piece = pieces[index];
    const wordCount = piece.split(/\s+/).filter(Boolean).length;
    if (wordCount < 3 && index + 1 < pieces.length) {
      const separator = /^[—–-]/.test(pieces[index + 1]) ? "" : " ";
      pieces[index + 1] = `${piece}${separator}${pieces[index + 1]}`;
    }
    else merged.push(piece);
  }
  return merged;
};

const makeStory = config => {
  const imageFor = beat => (config.images && config.images[beat]) || config.cover;
  const isStoryBeat = beat => beat === "start" || beat === "ending" || beat === "video_recap" || /^b\d/.test(beat) || beat.startsWith("fork_") || beat.startsWith("ending_") || beat.startsWith("video_recap_");
  const audioFor = beat => {
    if (/^q\d+_(prompt|correct|help)$/.test(beat)) {
      const part = beat.match(/^q\d+_(prompt|correct|help)$/)[1];
      const version = part === "prompt" ? (config.questionPromptVersion || 2) : (config.questionFeedbackVersion || 2);
      return `${config.key}_${beat}_v${version}.mp3`;
    }
    const version = config.narrationVersions?.[beat] || config.version;
    return version && isStoryBeat(beat)
      ? `${config.key}_${beat}_v${version}.mp3`
      : (config.audio && config.audio[beat]) || `${config.key}_${beat}.mp3`;
  };
  const soundFor = beat => config.sounds?.[beat] || null;
  const withDelivery = (beat, node) => {
    const delivery = config.deliveries?.[beat];
    const speechSegments = config.speechSegments?.[beat] || splitNarrationSegments(node.text);
    return delivery ? { ...node, delivery, speechSegments } : node;
  };
  const spokenChoice = choice => choice.description ? `${choice.label}: ${choice.description}` : choice.label;
  const spokenList = choices => choices.length === 1
    ? spokenChoice(choices[0])
    : choices.length === 2
      ? `${spokenChoice(choices[0])}, or ${spokenChoice(choices[1])}`
      : `${choices.slice(0, -1).map(spokenChoice).join(", ")}, or ${spokenChoice(choices.at(-1))}`;
  const conciseClaimPrompt = prompt => String(prompt).replace(/\s*Is that true or false\?\s*$/i, " True or false?");
  const withSpokenChoices = (beat, node) => withDelivery(beat, {
    ...node,
    choiceAudio: audioFor(`${beat}_choices`),
    choiceText: `Your choices are ${spokenList(node.choices)}. Say your choice.`
  });
  const branchNode = (beat, branch) => withSpokenChoices(beat, {
    image: imageFor(beat),
    audio: audioFor(beat),
    sound: soundFor(beat),
    text: branch.text,
    parentCard: branch.parentCard,
    choices: branch.choices.map(choice => ({ ...choice, next: branch.next || "b3" }))
  });
  const laterNodes = Object.fromEntries(config.afterScenes.map((scene, index) => {
    const beat = `b${index + 4}`;
    const next = index === config.afterScenes.length - 1 ? "QUIZ" : `b${index + 5}`;
    return [beat, withSpokenChoices(beat, {
      image: imageFor(beat), audio: audioFor(beat), sound: soundFor(beat), text: scene.text, parentCard: scene.parentCard,
      choices: scene.choices.map(choice => ({ ...choice, next }))
    })];
  }));
  const forkNodes = {};
  const forkEndings = {};
  for (const [forkKey, fork] of Object.entries(config.forks || {})) {
    const route = fork.scenes.map((_, index) => `fork_${forkKey}_${index + 1}`);
    fork.scenes.forEach((scene, index) => {
      const beat = route[index];
      const next = index === route.length - 1 ? "QUIZ" : route[index + 1];
      forkNodes[beat] = withSpokenChoices(beat, {
        image: scene.image, audio: audioFor(beat), sound: soundFor(beat), text: scene.text, parentCard: scene.parentCard,
        choices: scene.choices.map(choice => ({ ...choice, next }))
      });
    });
    forkEndings[forkKey] = withDelivery(`ending_${forkKey}`, {
      image: fork.ending.image,
      audio: audioFor(`ending_${forkKey}`),
      sound: soundFor(`ending_${forkKey}`),
      text: fork.ending.text,
      video: fork.ending.video,
      videoText: fork.ending.videoText,
      videoNarration: fork.ending.videoNarration || fork.ending.videoText,
      videoAudio: audioFor(`video_recap_${forkKey}`),
      branchNode: fork.branchNode,
      route
    });
  }
  const pathNodes = Object.fromEntries(config.paths.map((path, index) => {
    const beat = `b2${String.fromCharCode(97 + index)}`;
    return [beat, branchNode(beat, path)];
  }));
  const thirdNodes = config.branchFinals
    ? Object.fromEntries(Object.entries(config.branchFinals).map(([beat, scene]) => [beat, withSpokenChoices(beat, {
      image: imageFor(scene.imageBeat || "b3"), audio: audioFor(beat), sound: soundFor(beat), text: scene.text,
      parentCard: scene.parentCard || config.finalParentCard,
      choices: config.finalChoices.map(choice => ({ ...choice, next: "b4" }))
    })]))
    : { b3: withSpokenChoices("b3", {
      image: imageFor("b3"), audio: audioFor("b3"), sound: soundFor("b3"), text: config.finalQuestion,
      parentCard: config.finalParentCard,
      choices: config.finalChoices.map(choice => ({ ...choice, next: "b4" }))
    }) };
  const endingPages = (config.endingPages || []).map((page, index) => {
    const beat = page.key || `ending_page_${index + 1}`;
    return withDelivery(beat, {
      key: beat,
      image: page.image || imageFor("ending"),
      alt: page.alt || `The ending scene for ${config.title}`,
      audio: audioFor(beat),
      sound: soundFor(beat),
      text: page.text,
      leftText: page.leftText,
      rightText: page.rightText,
      buttonLabel: page.buttonLabel || (index === config.endingPages.length - 1 ? "Finish the story" : "Turn the page")
    });
  });

  return {
    key: config.key,
    title: config.title,
    emoji: config.emoji,
    teaser: config.teaser,
    cover: config.cover,
    demoPath: config.demoPath,
    start: withDelivery("start", { image: imageFor("start"), audio: audioFor("start"), sound: soundFor("start"), text: config.startText, buttonLabel: "Start our story" }),
    nodes: {
      b1: withDelivery("b1", {
        image: config.incidentImage, audio: audioFor("b1"), sound: soundFor("b1"), text: config.incidentText,
        parentCard: config.incidentParentCard,
        autoNext: "b1_context"
      }),
      b1_context: withSpokenChoices("b1_context", {
        image: imageFor("b1"), audio: audioFor("b1_context"), sound: soundFor("b1_context"), text: config.firstQuestion,
        parentCard: config.firstParentCard,
        choices: config.paths.map((path, index) => ({
          emoji: path.emoji,
          label: path.label,
          description: path.description,
          next: `b2${"abc"[index]}`,
          forkKey: path.forkKey,
          forkTitle: path.forkTitle,
          ...(path.transition ? { transition: { ...path.transition } } : {})
        }))
      }),
      ...pathNodes,
      ...thirdNodes,
      ...laterNodes,
      ...forkNodes
    },
    questions: config.questions.map((question, index) => {
      const prompt = question.kind === "claim" ? conciseClaimPrompt(question.prompt) : question.prompt;
      return {
        ...question,
        prompt,
        spokenText: prompt,
        correctSpokenText: question.correctText,
        helpSpokenText: question.helpText,
        audio: question.kind === "claim" ? `${config.key}_q${index + 1}_prompt_v${config.claimPromptVersion || 3}.mp3` : audioFor(`q${index + 1}_prompt`),
        correctAudio: question.feedbackVersion ? `${config.key}_q${index + 1}_correct_v${question.feedbackVersion}.mp3` : audioFor(`q${index + 1}_correct`),
        helpAudio: question.feedbackVersion ? `${config.key}_q${index + 1}_help_v${question.feedbackVersion}.mp3` : audioFor(`q${index + 1}_help`)
      };
    }),
    emotions: {
      sentence: config.sentence,
      introParentCard: "A grown-up approved this short, local recording activity.",
      rounds: [
        { key: "excited", emoji: "🤩", prompt: `Say “${config.sentence}” like you have good news!`, audio: audioFor("emo_excited") },
        { key: "sleepy", emoji: "😴", prompt: `Say “${config.sentence}” like you are sleepy.`, audio: audioFor("emo_sleepy") },
        { key: "proud", emoji: "😊", prompt: `Say “${config.sentence}” like you feel proud.`, audio: audioFor("emo_proud") }
      ]
    },
    ending: withDelivery("ending", {
      image: imageFor("ending"), audio: audioFor("ending"), sound: soundFor("ending"), text: config.endingText,
      endingPages,
      video: config.video, videoText: config.videoText,
      videoNarration: config.videoNarration || config.videoText,
      videoAudio: audioFor("video_recap")
    }),
    forkEndings,
    recapQuestion: config.recapQuestion
  };
};

const yesNo = correct => [
  { emoji: "👍", label: "True", correct: correct === "true" },
  { emoji: "🙅", label: "False", correct: correct === "false" }
];

const CONTENT = {
  welcome: {
    title: "Welcome to Sparks!",
    lead: "We’re going to create a story together.",
    text: "Hello, storyteller! Welcome to Sparks. We’re going to create a story together. You’ll meet new friends, choose what happens next, and help the adventure grow. Grown-up, stay nearby. Let’s begin!",
    audio: "welcome_v1.mp3",
    sound: "night_twinkle@0.15*0.72"
  },
  questionSummaries: {
    3: {
      text: "You explored three big ideas. Now I have one wonder question for you.",
      audio: "question_summary_3_v1.mp3"
    },
    5: {
      text: "You explored five big ideas. Now I have one wonder question for you.",
      audio: "question_summary_5_v1.mp3"
    }
  },
  libraryTitle: "Welcome to story time",
  libraryPrompt: "Which adventure should we make?",
  libraryAudio: "library_choices_v3.mp3",
  stories: {
    ocean: makeStory({
      key: "ocean", version: 9, narrationVersions: { b3a: 10, b3a_choices: 10, b3b: 10, b3b_choices: 10, b4: 11, b4_choices: 10, ending: 11 }, questionPromptVersion: 4, claimPromptVersion: 4, questionFeedbackVersion: 4, title: "Ollie and Tula’s Ocean Treasure", emoji: "🐙", teaser: "Open a treasure with an ocean friend", cover: "ocean-paper-start-v1.png", demoPath: [1, 1, 0, 1],
      images: { start: "ocean-paper-start-v1.png", b1: "ocean-paper-kind-choice-v1.png", b2a: "ocean-paper-wait-v1.png", b2b: "ocean-paper-camouflage-v1.jpg", b3: "ocean-paper-two-shells-v2.png", b4: "ocean-paper-two-o-treasures-v2.png", ending: "ocean-paper-sandcastle-two-treasures-v3.png" },
      incidentImage: "ocean-paper-choice-v1.jpg",
      deliveries: { b1: "worry/care", b2b: "alarm/remorse", b3a: "relief/hope", b3b: "relief/hope", b4: "curious and playful while comparing the two O treasures", ending: "joy/pride" },
      sounds: { start: "ocean_bubbles@0*0.65,treasure_glint@5.4*0.35", b1: "treasure_glint@0.2*0.72,ocean_bubbles@2.4*0.42", b1_context: "ocean_bubbles@0*0.38,treasure_glint@5.2*0.62", b2a: "ocean_bubbles@0*0.58,treasure_glint@3.8*0.35", b2b: "underwater_swish@0.5*0.72,ocean_bubbles@4.5*0.30", b3a: "treasure_glint@0.3*0.68,ocean_bubbles@3.8*0.30", b3b: "ocean_bubbles@0*0.35,treasure_glint@3.8*0.62", b4: "treasure_glint@0.4*0.58,ocean_bubbles@4.2*0.28", ending: "ocean_bubbles@0*0.58,treasure_glint@5.4*0.55" },
      startText: "Meet Ollie, a playful octopus, and Tula, his turtle best friend. Ollie has eight arms and can change color to hide. Tula has a hard shell on her back. Today, she brings a treasure chest for them to open together.",
      incidentText: "Seven shells shimmer inside the chest. Tula gives a tiny yawn, curls up beside it, and falls asleep. Then a secret sparkle flashes under the shells. Ollie’s eyes grow wide with curiosity. He wants to look right now—but he also wants to be a kind friend.",
      incidentParentCard: "Ask: how does Ollie feel when he sees the sparkle?",
      continueLabel: "Think with Ollie",
      continueText: "Ollie pauses. Let’s think about both choices with him.",
      firstQuestion: "Ollie imagines both choices. If he waits quietly, Tula can rest, and they can discover the sparkle together. If he peeks now, he may see it sooner—but he might wake and startle her. Ollie takes one slow bubble breath. Which choice feels kinder: wait quietly, or peek at the chest?",
      firstParentCard: "Ask: what would be kind while Tula is sleeping?",
      paths: [
        { emoji: "🫧", label: "Wait quietly", description: "Let Tula rest, then discover the sparkle together", next: "b3a", text: "Ollie moves back and counts three bubbles. Tula wakes gently and smiles at her patient friend. Ollie waves with all eight arms. What should he say first?", parentCard: "Ask: can you count the three bubbles?", choices: [{ emoji: "🌞", label: "Good morning", description: "Greet Tula gently as she wakes" }, { emoji: "✨", label: "We found treasure", description: "Share the exciting discovery right away" }] },
        { emoji: "👀", label: "Peek at the chest", description: "See the sparkle now, but risk waking Tula", next: "b3b", text: "Ollie leans closer—and oh! Tula wakes with a start. Ollie’s heart sinks. He feels sorry that he startled his friend, so he slips behind the swishing seaweed and changes color to hide. That trick is called camouflage. What should Ollie do now?", parentCard: "Ask: where is Ollie hiding?", choices: [{ emoji: "🐙", label: "Come out slowly", description: "Show Tula he is ready to listen" }, { emoji: "💛", label: "Say sorry", description: "Tell Tula he regrets startling her" }] }
      ],
      branchFinals: {
        b3a: { text: "Tula wakes and thanks Ollie for waiting. She shows him seven special shells. One spiral shell curls like a tiny wave, and a pink fan shell opens wide. Which should they carry to their sandcastle: the spiral shell or the pink fan shell?" },
        b3b: { text: "Very slowly, Ollie comes out. “I’m sorry I startled you,” he says softly. Tula’s warm smile makes him feel relieved. She shows him seven shells: a spiral curled like a wave and a wide pink fan. Which should they carry to their sandcastle: the spiral shell or the pink fan shell?" }
      },
      finalParentCard: "Ask: which shell is your favorite, and why?", finalChoices: [{ emoji: "🌀", label: "Spiral shell", description: "Curled like a tiny wave" }, { emoji: "🪭", label: "Pink fan shell", description: "Wide like an open fan" }],
      afterScenes: [
        { text: "Ollie curls one arm into the round letter O. Octopus, octagon, and oyster start with O. A blue octagon has eight straight sides, and an oyster holds one smooth pearl. Which O treasure should go by the castle door: the blue octagon or the oyster pearl?", parentCard: "Ask: what other word starts with O?", choices: [{ emoji: "🔷", label: "Blue octagon", description: "Eight straight sides" }, { emoji: "🦪", label: "Oyster pearl", description: "One smooth shining pearl" }] }
      ],
      questions: [
        { prompt: "How many arms does an octopus have?", accept: ["eight", "8"], revealImage: "ocean-paper-start-v1.png", options: [{ emoji: "8️⃣", label: "Eight", correct: true }, { emoji: "6️⃣", label: "Six" }, { emoji: "2️⃣", label: "Two" }], correctText: "Yes! An octopus has eight arms.", helpText: "An octopus has eight arms. Let’s count Ollie’s arms." },
        { kind: "claim", prompt: "Sparks says: Tula falls asleep beside the treasure chest. Is that true or false?", accept: ["true", "yes", "right", "correct"], revealImage: "ocean-paper-choice-v1.jpg", options: yesNo("true"), correctText: "That’s true! Tula yawns and falls asleep beside the chest.", helpText: "It is true. Tula falls asleep beside the treasure chest." },
        { prompt: "What flashes underneath Tula’s seven shells?", accept: ["sparkle", "a sparkle", "secret sparkle"], revealImage: "ocean-paper-choice-v1.jpg", options: [{ emoji: "✨", label: "A secret sparkle", correct: true }, { emoji: "🥕", label: "A carrot" }, { emoji: "🧦", label: "A sock" }], correctText: "Yes! A secret sparkle flashes underneath the shells.", helpText: "Look under the shells. A secret sparkle flashes there." },
        { kind: "claim", prompt: "Sparks says: an octagon has five sides. Is that true or false?", accept: ["false", "no", "wrong", "not true"], revealImage: "ocean-paper-two-o-treasures-v2.png", options: yesNo("false"), correctText: "You caught my mistake! An octagon has eight sides.", helpText: "Oh no! I was wrong. It is false. An octagon has eight sides." },
        { prompt: "Which word starts with the letter O?", accept: ["octopus", "an octopus"], revealImage: "ocean-paper-two-o-treasures-v2.png", options: [{ emoji: "🐙", label: "Octopus", correct: true }, { emoji: "🐢", label: "Turtle" }, { emoji: "🐚", label: "Shell" }], correctText: "Yes! Octopus starts with the letter O.", helpText: "Octopus starts with O. Here, O makes the short o sound." }
      ],
      sentence: "We found treasure!", endingText: "Pat-pat-pat! Ollie and Tula pack wet sand into a little castle. They place a shell on top, then add the blue octagon and oyster pearl. “We made it together!” Ollie cheers with joy. Tula beams beside him. Their happiest treasure is the new game they made as friends.", recapQuestion: "At dinner, ask: which ocean word starts with O?"
    }),

    moon: makeStory({
      key: "moon", version: 7, narrationVersions: { start: 8, b1: 8, b1_context: 8, b1_context_choices: 8, b2a: 9, b2a_choices: 8, b2b: 8, b2b_choices: 8, b5: 8 }, questionPromptVersion: 4, claimPromptVersion: 4, questionFeedbackVersion: 4, title: "Lumi and the Lost Cloud", emoji: "🌙", teaser: "Bring Puff home for the moon dance", cover: "moon.png", demoPath: [0, 0, 0, 0, 0, 1],
      images: { start: "moon-opening-v3.png", b1: "moon-two-clues-v1.png", b2a: "moon-moonlight.png", b2b: "moon-breeze.png", b3: "moon-shadow-v3.png", b4: "moon-first-sunbeam-v1.png", b5: "moon-sunbeam-v3.png", b6: "moon-bridge-v3.png", ending: "moon-dance-v3.png" },
      incidentImage: "moon-puff-missing-v1.png",
      deliveries: { start: "warm/wonder", b1: "alarm/worry", b2a: "light and adventurous while comparing two moonbeam views", b3: "relief/hope", b5: "care/encouragement", ending: "joy/pride" },
      sounds: { start: "night_twinkle@0*0.68,soft_wind@4.8*0.25", b1: "soft_wind@0*0.58,night_twinkle@4.6*0.42", b1_context: "moonbeam@0.3*0.48,soft_wind@5.2*0.48", b2a: "moonbeam@0.2*0.62,soft_wind@3.6*0.28", b2b: "soft_wind@0*0.58,night_twinkle@3.6*0.42", b3: "rock_rumble@3.8*0.72,moonbeam@7.0*0.25", b4: "night_twinkle@0.3*0.48,moonbeam@3.8*0.45", b5: "moonbeam@0*0.42,ribbon_flutter@4.2*0.62", b6: "ribbon_flutter@0.2*0.62,night_twinkle@3.8*0.42", ending: "ribbon_flutter@0*0.55,night_twinkle@3.8*0.62" },
      startText: "Meet Lumi, a little star who loves to shine, and Puff, a soft cloud who makes funny shapes. They are best friends above Earth. Earth has one Moon. Tonight, they will wave a silver ribbon at the Moon Dance.",
      incidentText: "The Moon Dance begins tonight—but Puff is nowhere to be seen. Lumi searches behind every little cloud. No Puff appears. Her glow trembles with worry. She whispers, “Puff, where are you?” Then she takes one brave breath. She will find her friend.",
      incidentParentCard: "Ask: what tells you that Lumi is worried?",
      continueLabel: "Look for clues",
      continueText: "Lumi steadies her glow. Let’s look closely at both clues.",
      firstQuestion: "Two clues wait in the sky. A silver moonbeam forms a bright road over the hills. The wind carries a soft cloud tuft—and perhaps the tiniest giggle. Both clues could lead to Puff. Which should Lumi try first: the moonbeam or the wind?", firstParentCard: "Ask: what does each clue show or sound like?",
      paths: [
        { emoji: "🌙", label: "Ride the moonbeam", description: "Take the bright silver road over the hills", text: "Lumi slides along a bright moonbeam over the dark hills. Staying close would follow its glowing trail. Looking from above could reveal where the trail disappears around the Moon. Which plan should she try?", parentCard: "Ask: what could Lumi see from above?", choices: [{ emoji: "🌙", label: "Stay on the moonbeam", description: "Follow the bright trail up close" }, { emoji: "🔭", label: "Look from above", description: "See where the trail disappears" }] },
        { emoji: "💨", label: "Follow the wind", description: "Listen for Puff’s giggle in the breeze", text: "The wind carries a familiar little laugh. Lumi cries with hope, “Puff!” Following the laugh could lead straight to her friend. Shining a path could help Puff see Lumi too. Which should she do?", parentCard: "Ask: how could each plan help Puff?", choices: [{ emoji: "👂", label: "Follow the laugh", description: "Listen for Puff’s exact hiding place" }, { emoji: "✨", label: "Shine a path", description: "Help Puff see Lumi coming" }] }
      ],
      finalQuestion: "Lumi’s clue leads behind the Moon. She sighs with deep relief, “Puff—you’re safe!” But Puff is tired, and a huge dark rock blocks the way home. Staying close would help Puff feel safe; searching around the rock might reveal sunlight. What should Lumi do first?", finalParentCard: "Ask: how could each choice help Puff?", finalChoices: [{ emoji: "🤗", label: "Stay with Puff", description: "Help tired Puff feel safe" }, { emoji: "✨", label: "Look for light", description: "Search around the rock for sunlight" }],
      afterScenes: [
        { text: "Lumi stays beside tired Puff. At the edge of the rock, they see a gold line from the Sun. Following it would use the light already reaching them. Making a star arrow would leave bright markers behind. Which plan should they try?", parentCard: "Ask: where does the gold light come from?", choices: [{ emoji: "☀️", label: "Follow the sunlight", description: "Use the gold path already shining" }, { emoji: "✨", label: "Make a star arrow", description: "Leave bright markers toward home" }] },
        { text: "Sunlight spills across the Moon and makes a bright path. Puff is too tired to float. Lumi speaks tenderly, “I’ve got you.” The silver ribbon could pull Puff gently, or fold into a soft seat that Lumi can tow. How should it help?", parentCard: "Ask: which plan may feel comfiest for Puff?", choices: [{ emoji: "🤝", label: "Pull Puff gently", description: "Use the ribbon like a soft towline" }, { emoji: "☁️", label: "Make a soft seat", description: "Fold the ribbon into a little sling" }] },
        { text: "They made it! Lumi and Puff reach the dance just in time, tired but delighted. The silver ribbon is still rolled up. How should the best friends open the Moon Dance?", parentCard: "Ask: what should the friends do together?", choices: [{ emoji: "✨", label: "Shine and spin", description: "Fill Puff’s cloud shape with golden light" }, { emoji: "🎀", label: "Wave the ribbon", description: "Unroll their silver ribbon across the sky" }] }
      ],
      questions: [
        { prompt: "How many moons does Earth have?", accept: ["one", "1"], revealImage: "moon-facts-v2.png", options: [{ emoji: "1️⃣", label: "One", correct: true }, { emoji: "2️⃣", label: "Two" }, { emoji: "5️⃣", label: "Five" }], correctText: "Yes! Earth has one moon.", helpText: "Earth has one moon." },
        { kind: "claim", prompt: "Sparks says: Lumi gives up when Puff is missing. Is that true or false?", accept: ["false", "no", "wrong", "not true"], revealImage: "moon-puff-missing-v1.png", options: yesNo("false"), correctText: "That’s false! Lumi takes a brave breath and keeps looking for Puff.", helpText: "It is false. Lumi does not give up. She follows the clues to find Puff." },
        { prompt: "What are Lumi and Puff getting ready for?", accept: ["moon dance", "the moon dance", "dance"], revealImage: "moon-opening-v3.png", options: [{ emoji: "🎀", label: "The Moon Dance", correct: true }, { emoji: "🍳", label: "Breakfast" }, { emoji: "⚽", label: "A football game" }], correctText: "Yes! Lumi and Puff are getting ready for the Moon Dance.", helpText: "They are carrying their silver ribbon to the Moon Dance." },
        { kind: "claim", prompt: "Sparks says: Moon makes its own light. Is that true or false?", accept: ["false", "no", "wrong", "not true"], revealImage: "moon-facts-v2.png", options: yesNo("false"), correctText: "You caught my mistake! Sunlight makes Moon shine.", helpText: "Oh no! I was wrong. It is false. Sunlight makes Moon shine." },
        { prompt: "What makes Moon shine?", accept: ["sun", "sunlight", "light from the sun"], revealImage: "moon-facts-v2.png", options: [{ emoji: "☀️", label: "Sunlight", correct: true }, { emoji: "🔦", label: "A torch" }, { emoji: "🕯️", label: "A candle" }], correctText: "Yes! Sunlight makes Moon shine.", helpText: "Light from the Sun makes Moon shine." }
      ],
      sentence: "Puff is home!", endingText: "Whoosh—flutter—shine! The ribbon curls across the sky. Puff makes a moon-shaped cloud, and Lumi fills it with warm gold light. Far below, children wave up at Earth’s one Moon. Lumi and Puff laugh with joy. The Moon Dance has begun!", video: "moon-demo-v4.mp4", videoText: "Lumi found Puff behind a dark rock, followed sunlight across the Moon, and brought the silver ribbon home for the Moon Dance.", videoNarration: "Puff disappeared just before the Moon Dance, so Lumi followed a shining trail around Earth’s one Moon. Behind a dark rock, Lumi found a tired little cloud. Sunlight showed them the way home, and together they opened the dance with their silver ribbon.", recapQuestion: "At dinner, ask: what makes Moon shine?"
    }),

    forest: makeStory({
      key: "forest", version: 8, narrationVersions: { b1_context: 9, b1_context_choices: 9 }, questionPromptVersion: 4, claimPromptVersion: 4, questionFeedbackVersion: 4, title: "Nori and the Forest Drum", emoji: "🐿️", teaser: "Save the sunrise forest dance", cover: "forest.png", demoPath: [1, 0, 0, 1, 0, 0],
      images: { start: "forest-opening-v3.png", b1: "forest-two-clues-v1.png", b2a: "forest-bee.png", b2b: "forest-bird.png", b3: "forest-acorn-exit-v1.png", b4: "forest-bridge-v3.png", b5: "forest-bee-help-v3.png", b6: "forest-parade-v3.png", ending: "forest-dance-v3.png" },
      incidentImage: "forest-drum-rollaway-v1.png",
      deliveries: { b1: "alarm/worry", b3: "relief/hope", b6: "relief/hope", ending: "joy/pride" },
      sounds: { start: "forest_dawn@0*0.62,leaves_rustle@4.8*0.28", b1: "acorn_roll@0*0.55,drum_roll@3.0*0.72", b1_context: "bee_buzz@0.5*0.42,bird_chirps@4.0*0.45", b2a: "bee_buzz@0.2*0.62,drum_roll@3.6*0.30", b2b: "forest_dawn@0.2*0.55,drum_roll@3.0*0.36", b3: "drum_roll@0.2*0.58,rock_rumble@4.2*0.42", b4: "rock_rumble@0*0.38,branch_creak@4.2*0.68", b5: "bee_buzz@0.2*0.54,leaves_rustle@3.8*0.32", b6: "forest_dawn@0*0.42,drum_roll@3.2*0.62", ending: "drum_roll@0*0.54,band@2.4*0.68" },
      startText: "Meet Nori, a squirrel who loves his drum. Bee, Bird, and little Baby Fox are his forest friends. Bee hangs flowers while Bird ties ribbons. Today, they are getting ready for Baby Fox’s first Sunrise Dance.",
      incidentText: "Rattle-rattle—BOING! A cart of acorns bumps Nori’s stump, and his favorite drum rolls down the path. Nori gasps in alarm, “My drum!” The Sunrise Dance starts soon. His paws feel shaky with worry—but he squares his shoulders. Baby Fox is counting on him.",
      incidentParentCard: "Ask: what shows that Nori is worried?",
      continueLabel: "Study the clues",
      continueText: "Nori stops, listens, and looks. Let’s study both clues.",
      firstQuestion: "Nori listens carefully. Bee taps a steady beat beside tiny paw prints. Bird sings Nori’s drum rhythm from an old hollow tree. Both friends offer a different clue, and either one might help. Which should Nori try first: follow Bee or follow Bird?", firstParentCard: "Ask: what is different about each clue?",
      paths: [
        { emoji: "🐝", label: "Follow Bee", description: "Trace the paw prints beside Bee’s steady beat", text: "Bee finds a trail of little paw marks. Baby Fox came looking for the drum and left the marks toward the old tree. A soft boom sounds ahead. What should Nori follow?", parentCard: "Ask: where do the paw marks go?", choices: [{ emoji: "🐾", label: "Follow the paw marks", description: "Trace Baby Fox’s trail toward the tree" }, { emoji: "👂", label: "Follow the boom", description: "Listen for the drum’s echo ahead" }] },
        { emoji: "🐦", label: "Follow Bird", description: "Follow the familiar drum song to the old tree", text: "Bird sings Nori’s drum beat beside the old tree. One hollow is close enough to peek through, while a soft boom echoes around the trunk toward the far side. Which way should Nori investigate?", parentCard: "Ask: where could the echo be coming from?", choices: [{ emoji: "🌳", label: "Peek through the hollow", description: "Look inside the opening nearby" }, { emoji: "👂", label: "Circle toward the boom", description: "Follow the echo around the trunk" }] }
      ],
      finalQuestion: "Inside the old tree—there it is! Nori hugs his drum with relief. But a big acorn blocks the way out. Nori could test it with one careful push, or everyone could brace their feet and push together. The sky is growing bright. Which plan should they try?", finalParentCard: "Ask: how could teamwork change the push?", finalChoices: [{ emoji: "🌰", label: "Nori pushes first", description: "Test whether the acorn moves" }, { emoji: "🤝", label: "Everyone pushes together", description: "Use all the friends’ strength" }],
      afterScenes: [
        { text: "Heave-ho! Together, the friends roll the acorn aside and hurry out with the drum. Then Nori stops—the little bridge has cracked. Bird can fly above and see the whole branch. Bee can hover close and point out each safe foothold. Nori takes a careful breath; his big tail helps him balance. Who should guide him?", parentCard: "Ask: how could each friend help?", choices: [{ emoji: "🐦", label: "Bird flies ahead", description: "See the whole branch from above" }, { emoji: "🐝", label: "Bee shows footholds", description: "Hover beside each safe step" }] },
        { text: "A vine blocks the last step. Bee holds it still with all six legs. There is a roomy space underneath, and Bird lays a soft feather over the vine’s sharp end above. Should Nori crawl through the low space or step over the covered end?", parentCard: "Ask: count Bee’s six legs together.", choices: [{ emoji: "⬇️", label: "Crawl underneath", description: "Use the roomy space below" }, { emoji: "⬆️", label: "Step over the feather", description: "Cross where the sharp end is covered" }] },
        { text: "They made it! The friends reach the meadow as the first sunbeam appears. Nori’s worried face turns into a huge, relieved grin. Baby Fox is waiting beside the drum. Who should make the very first beat of the Sunrise Dance?", parentCard: "Ask: who should start the dance?", choices: [{ emoji: "🐿️", label: "Nori starts", description: "Welcome everyone with his favorite rhythm" }, { emoji: "🦊", label: "Baby Fox starts", description: "Make the first brave festival beat" }] }
      ],
      questions: [
        { prompt: "How many legs does a bee have?", accept: ["six", "6"], revealImage: "forest-facts-six-legs-v3.png", options: [{ emoji: "6️⃣", label: "Six", correct: true }, { emoji: "4️⃣", label: "Four" }, { emoji: "8️⃣", label: "Eight" }], correctText: "Yes! A bee has six legs.", helpText: "A bee has six legs—three on each side." },
        { kind: "claim", prompt: "Sparks says: Nori searches for the drum all by himself. Is that true or false?", accept: ["false", "no", "wrong", "not true"], revealImage: "forest-two-clues-v1.png", options: yesNo("false"), correctText: "That’s false! Bee and Bird stay close and help Nori follow the clues.", helpText: "It is false. Nori’s friends help him search for the drum." },
        { prompt: "Who is waiting for their first Sunrise Dance?", accept: ["baby fox", "fox", "the baby fox"], revealImage: "forest-opening-v3.png", options: [{ emoji: "🦊", label: "Baby Fox", correct: true }, { emoji: "🐟", label: "A fish" }, { emoji: "🐢", label: "A turtle" }], correctText: "Yes! Baby Fox is waiting for their first Sunrise Dance.", helpText: "Baby Fox is waiting in the meadow for the dance to begin." },
        { kind: "claim", prompt: "Sparks says: a squirrel’s tail makes it fall. Is that true or false?", accept: ["false", "no", "wrong", "not true"], revealImage: "forest-facts-six-legs-v3.png", options: yesNo("false"), correctText: "You caught my mistake! A squirrel’s tail helps it balance.", helpText: "Oh no! I was wrong. It is false. The tail helps a squirrel balance." },
        { prompt: "What helps a squirrel balance?", accept: ["tail", "its tail", "big tail"], revealImage: "forest-facts-six-legs-v3.png", options: [{ emoji: "🐿️", label: "Its tail", correct: true }, { emoji: "👂", label: "Its ears" }, { emoji: "🦷", label: "Its teeth" }], correctText: "Yes! A squirrel’s tail helps it balance.", helpText: "Its big tail helps a squirrel balance." }
      ],
      sentence: "I found my drum!", endingText: "Tap-tap… BOOM! The meadow wakes up. Baby Fox takes one brave step, then jumps into the dance. Nori laughs with relief and spins with his big tail, Bee taps all six legs, and Bird shakes bright feathers. Hooray—the Sunrise Dance is saved!", video: "forest-demo-v4.mp4", videoText: "Nori followed his friends into the old tree, brought back the lost drum, crossed the broken bridge, and reached Baby Fox at sunrise.", videoNarration: "Nori’s little drum rolled away just before Baby Fox’s first Sunrise Dance. Bee, Bird, and Nori followed its soft boom into an old tree, pushed an acorn from the door, crossed a broken bridge together, and reached the meadow with the morning’s very first beat.", recapQuestion: "At dinner, ask: how many legs does a bee have?"
    }),

    dragon: makeStory({
      key: "dragon", version: 10, narrationVersions: { start: 11, b1: 11, b1_context: 11, b4: 11, b6: 11, ending: 12, ending_reveal: 13, ending_celebration: 13 }, questionPromptVersion: 4, claimPromptVersion: 4, questionFeedbackVersion: 4, title: "Ember and the Rainbow Seed", emoji: "🐉", teaser: "Grow Grandma’s birthday surprise", cover: "dragon.png", demoPath: [0, 1, 1, 0, 0, 0],
      images: { start: "dragon-opening-v3.png", b1: "dragon-two-paths-v1.png", b2a: "dragon-flowers.png", b2b: "dragon-rain.png", b3: "dragon-found-seed-v2.png", b4: "dragon-water-v3.png", b5: "dragon-rainbow-v3.png", b6: "dragon-warmth-safe-v4.png", ending: "dragon-birthday-v4.png" },
      incidentImage: "dragon-seed-gust-v1.png",
      deliveries: {
        start: "warm and welcoming, then openly thrilled on the birthday news; Grandma sounds gentle and Ember sounds eager",
        b1: "start with a sudden urgent gust, cry out in real alarm, soften into tearful sadness, make the deep breath slow and audible, then finish brave and determined",
        b1_context: "calm after the scare, clear and reassuring while explaining only two simple trails",
        b2a: "light, careful, and playful among delicate flowers",
        b2b: "curious and gently cautious beside falling rain and slippery stones",
        b3: "burst with relieved joy on finding the clearly visible seed, then turn caring and hopeful",
        b4: "playful water sounds, proud delight at new growth, then a small worried drop when the cloud arrives",
        b5: "breathtaking wonder as all seven rainbow colors appear, followed by concern when the wind turns cold",
        b6: "protective and thoughtful, with a gentle safety reminder and bubbling secret excitement",
        ending: "begin in hushed suspense, bloom into magical wonder, then make the full phrase ‘Surprise, Grandma! Happy birthday!’ naturally exuberant and finish with warm delighted love",
        ending_reveal: "hushed and conspiratorial at first, building child-friendly suspense as the closed bud glows and quivers; slow down for Ember holding her breath",
        ending_celebration: "open with a crisp magical pop and rainbow wonder, then burst into genuine, bubbly joy; give the complete phrase ‘Surprise, Grandma! Happy birthday!’ a strong natural excited arc without clipping or singing the word Surprise; distinguish Grandma's delighted reply and finish tenderly"
      },
      speechSegments: {
        start: [
          "Meet Ember, a little green dragon who loves growing flowers with Grandma Sky, and today she can hardly keep still—tomorrow is Grandma Sky’s BIRTHDAY! Her little wings flutter with excitement.",
          "Every birthday, Ember and Grandma plant one special flower together; this year, Grandma gives Ember a tiny rainbow seed and a purple pot because Ember is ready to care for the birthday flower herself.",
          "“Give it water, sunlight, and patient love,” Grandma says warmly, and Ember hugs the pot, thrilled to make Grandma proud."
        ],
        b1: [
          "Suddenly—WHOOOOSH! A wild gust tears the rainbow seed from the purple pot—“MY SEED!” Ember cries, her voice sharp with alarm.",
          "She leaps with both paws outstretched, but she is too late, and the tiny seed spins higher before vanishing over the hill.",
          "Ember’s eyes fill, and one worried tear slides down her cheek as she sobs softly, “Grandma trusted me.”",
          "Ember closes her eyes and takes one long, deep breath—in... and out.",
          "She straightens her wings, gently wipes away the tear, and says in a brave, steady voice, “I won’t give up—I will find our seed.”"
        ],
        b1_context: [
          "Then Ember spots two trails of rainbow sparkle on the ground: the flower trail winds gently between pink blossoms.",
          "The rain trail crosses a shallow stream on big, flat stones; both trails lead toward the sunny field where the seed may have landed.",
          "Ember looks carefully from one trail to the other and wonders, which trail should she follow—the flowers or the rain?"
        ],
        b2a: [
          "Rainbow sparkles dance between the flowers. The path is narrow, and the petals are delicate.",
          "Ember could tiptoe through the open spaces, or fly just above every blossom.",
          "Both plans keep the flowers safe. How should she cross?"
        ],
        b2b: [
          "Drip, drop, patter-patter. Rainbow sparkles lead across a shallow stream.",
          "Ember could fly over the slippery water, or test each big, flat stone one careful step at a time.",
          "Both ways lead toward the sunny field. How should she cross?"
        ],
        b3: [
          "At the sunny field, Ember gasps with relieved joy. “There you are!”",
          "Beside a round gray pebble, the rainbow seed glows bright gold in dark soil. Its striped shell is easy to see, and two tiny green leaves push up from it.",
          "Ember cups her paws around the little sprout as if greeting a friend. Its leaves look dry, and the field is partly shaded.",
          "Plants need both water and sunlight. Which should Ember bring first?"
        ],
        b4: [
          "Glug-glug—Ember carries water, then moves the purple pot into a warm sunbeam.",
          "The sprout drinks, stretches, and lifts two bright leaves as Ember says proudly, “You’re growing!”",
          "Then a gray cloud slides across the Sun; her hopeful smile falls as she whispers, “Oh, no—not now.”",
          "One gentle puff could move the cloud, while a shiny shield could bounce a sunbeam around it; which should she try?"
        ],
        b5: [
          "Ember’s choice brings the sunlight back. Golden light meets silver rain drops above the purple pot.",
          "Across the sky, a huge rainbow unfurls—red, orange, yellow, green, blue, indigo, and violet. All seven colors shine clearly over Ember and the little sprout. “Wow!” Ember breathes, full of wonder.",
          "Then the night wind whistles, and the air turns cold. Ember shivers, worried for the tender leaves.",
          "Her wing could shelter them now, or a low stone wall could block the wind all night. Which shelter should she make?"
        ],
        b6: [
          "Ember’s shelter blocks the cold wind, and because she knows fire is hot, she keeps the purple pot safely far away.",
          "On bare ground, she warms one smooth stone with a tiny crackling flame, places it near the pot, and watches gentle heat reach the bud until it grows round and plump.",
          "Now Ember can hide the pot until sunrise or tie on a ribbon and carry it to Grandma’s door—which finish should she choose for the birthday surprise?"
        ],
        ending: [
          "Before dawn, Ember ties a bright ribbon around the purple pot and tiptoes to Grandma’s door. She hides beside the doorway, wiggling with so much excitement that she can hardly stay quiet.",
          "Sunrise spills across the garden. The closed rainbow bud glows brighter and begins to quiver. Ember holds her breath—something magical is about to happen.",
          "With a bright POP, the bud opens into a giant flower glowing with seven rainbow colors. Grandma steps outside and stops. Her eyes grow wide with amazement.",
          "Ember springs from her hiding place, throws both paws wide, and calls out brightly, “Surprise, Grandma! Happy birthday!”",
          "Grandma gives a delighted gasp. “You grew our birthday flower!” Then she pulls Ember into the biggest, warmest dragon hug."
        ],
        ending_reveal: [
          "Before dawn, Ember ties a bright ribbon around the purple pot and tiptoes to Grandma’s door.",
          "She hides beside the doorway, her wings wiggling with excitement.",
          "Sunrise spills across the garden. The closed rainbow bud glows brighter and begins to quiver. Ember holds her breath—something magical is about to happen."
        ],
        ending_celebration: [
          "With a bright POP, the bud opens into a giant flower glowing with seven rainbow colors. Grandma steps outside and stops. Her eyes grow wide with amazement.",
          "Ember springs from her hiding place, throws both paws wide, and calls out brightly, “Surprise, Grandma! Happy birthday!”",
          "Grandma gives a delighted gasp. “You grew our birthday flower!”",
          "Then she pulls Ember into the biggest, warmest dragon hug."
        ]
      },
      sounds: { start: "flower_magic@0.20*1.05,soft_wind@3.20*0.85,wing_flutter@9.00*1.15,flower_magic@12.60*0.90,seed_tinkle@19.20*1.15,pot_clink@21.00*1.05,flower_magic@24.70*0.90,heartbeat@29.70*0.86", b1: "gust@0.10*1.12,seed_tinkle@3.20*0.90,wing_flutter@10.25*1.10,gust@14.10*0.98,seed_tinkle@15.70*0.90,heartbeat@17.80*0.88,deep_breath@27.40*1.15,wing_flutter@33.40*1.08", b1_context: "flower_magic@0.25*1.05,soft_wind@4.60*0.90,gentle_rain@8.55*1.05,water_drips@11.90*0.72,flower_magic@16.95*0.88", b2a: "flower_magic@0.20*1.12,soft_wind@3.35*0.90,wing_flutter@6.55*1.10,flower_magic@9.30*0.90", b2b: "gentle_rain@0*1.08,water_drips@1.85*0.72,wing_flutter@6.05*1.02,water_drips@9.65*0.72", b3: "seed_tinkle@0.35*1.18,flower_magic@5.55*1.08,sprout@10.15*1.18,heartbeat@16.35*0.88,soft_wind@19.25*0.90", b4: "water_pour@0*1.15,water_drips@2.15*0.72,flower_magic@4.10*0.92,sprout@6.20*1.18,seed_tinkle@9.60*0.95,soft_wind@14.00*1.00,heartbeat@18.40*0.86", b5: "gentle_rain@0.20*0.98,water_drips@2.50*0.72,rainbow@7.00*1.22,flower_magic@10.20*1.08,rainbow@14.10*0.98,gust@21.10*1.12,soft_wind@23.10*0.98,heartbeat@26.00*0.86", b6: "gust@0.05*1.08,soft_wind@1.90*0.92,warm_fire@8.00*1.10,pot_clink@11.80*0.95,sprout@14.00*1.18,flower_magic@15.70*0.95,ribbon_flutter@20.40*1.10", ending: "pot_clink@0.8*0.30,wing_flutter@6.5*0.42,soft_wind@10.5*0.18,birthday_pop@13.5*0.88,flower_magic@14.0*0.76,rainbow@16.0*0.58", ending_reveal: "ribbon_flutter@0.25*0.98,pot_clink@3.20*1.00,soft_wind@5.80*0.92,wing_flutter@8.45*1.18,soft_wind@10.65*0.98,flower_magic@14.35*1.15,heartbeat@17.28*0.92", ending_celebration: "birthday_pop@0.34*1.25,flower_magic@1.50*1.18,rainbow@3.90*1.12,wing_flutter@10.73*1.15,night_twinkle@19.45*0.90,seed_tinkle@23.95*0.95,heartbeat@25.30*0.88" },
      startText: "Meet Ember, a little green dragon who loves growing flowers with Grandma Sky, and today she can hardly keep still—tomorrow is Grandma Sky’s BIRTHDAY! Her little wings flutter with excitement. Every birthday, Ember and Grandma plant one special flower together; this year, Grandma gives Ember a tiny rainbow seed and a purple pot because Ember is ready to care for the birthday flower herself. “Give it water, sunlight, and patient love,” Grandma says warmly, and Ember hugs the pot, thrilled to make Grandma proud.",
      incidentText: "Suddenly—WHOOOOSH! A wild gust tears the rainbow seed from the purple pot—“MY SEED!” Ember cries, her voice sharp with alarm. She leaps with both paws outstretched, but she is too late, and the tiny seed spins higher before vanishing over the hill. Ember’s eyes fill, and one worried tear slides down her cheek as she sobs softly, “Grandma trusted me.” Ember closes her eyes and takes one long, deep breath—in... and out. She straightens her wings, gently wipes away the tear, and says in a brave, steady voice, “I won’t give up—I will find our seed.”",
      incidentParentCard: "Ask: what changes after Ember’s deep breath?",
      continueLabel: "See the two trails",
      continueText: "Ember takes her brave breath. Now two clear trails appear.",
      firstQuestion: "Then Ember spots two trails of rainbow sparkle on the ground: the flower trail winds gently between pink blossoms. The rain trail crosses a shallow stream on big, flat stones; both trails lead toward the sunny field where the seed may have landed. Ember looks carefully from one trail to the other and wonders, which trail should she follow—the flowers or the rain?", firstParentCard: "Ask: what is different about the two trails?",
      paths: [
        {
          emoji: "🌸", label: "Cross the flowers", description: "Move gently between the pink blossoms",
          transition: {
            text: "What a lovely choice—you chose the flower trail! You are creating Ember’s adventure. Let’s explore how she can reach the rainbow seed through the blossoms.",
            audio: "dragon_path_flowers_transition_v1.mp3",
            delivery: "bright, delighted, and warmly congratulatory; clearly emphasize that the child chose this route and is creating Ember’s adventure, then lift with eager curiosity on the invitation to explore",
            speechSegments: [
              "What a lovely choice—you chose the flower trail!",
              "You are creating Ember’s adventure.",
              "Let’s explore how she can reach the rainbow seed through the blossoms."
            ]
          },
          text: "Rainbow sparkles dance between the flowers. The path is narrow, and the petals are delicate. Ember could tiptoe through the open spaces, or fly just above every blossom. Both plans keep the flowers safe. How should she cross?", parentCard: "Ask: how do both plans protect the petals?", choices: [{ emoji: "🐾", label: "Tiptoe between blooms", description: "Use the open spaces on the ground" }, { emoji: "🪽", label: "Fly above the petals", description: "Keep her feet away from every flower" }]
        },
        {
          emoji: "💧", label: "Follow the rain", description: "Cross the shallow stream on big stones",
          transition: {
            text: "What an adventurous choice—you chose the rain trail! You are creating Ember’s adventure. Let’s explore how she can reach the rainbow seed across the sparkling stream.",
            audio: "dragon_path_rain_transition_v1.mp3",
            delivery: "bright, adventurous, and warmly congratulatory; clearly emphasize that the child chose this route and is creating Ember’s adventure, then lift with eager curiosity on the invitation to explore",
            speechSegments: [
              "What an adventurous choice—you chose the rain trail!",
              "You are creating Ember’s adventure.",
              "Let’s explore how she can reach the rainbow seed across the sparkling stream."
            ]
          },
          text: "Drip, drop, patter-patter. Rainbow sparkles lead across a shallow stream. Ember could fly over the slippery water, or test each big, flat stone one careful step at a time. Both ways lead toward the sunny field. How should she cross?", parentCard: "Ask: which route stays above the water?", choices: [{ emoji: "🪽", label: "Fly over", description: "Stay high above the slippery stream" }, { emoji: "🐾", label: "Step on stones", description: "Test each big, flat stone carefully" }]
        }
      ],
      finalQuestion: "At the sunny field, Ember gasps with relieved joy. “There you are!” Beside a round gray pebble, the rainbow seed glows bright gold in dark soil. Its striped shell is easy to see, and two tiny green leaves push up from it. Ember cups her paws around the little sprout as if greeting a friend. Its leaves look dry, and the field is partly shaded. Plants need both water and sunlight. Which should Ember bring first?", finalParentCard: "Ask: point to the golden seed, then name the two things its sprout needs.", finalChoices: [{ emoji: "💧", label: "Find water", description: "Give the dry leaves a gentle drink" }, { emoji: "☀️", label: "Find sunlight", description: "Move the sprout out of the shade" }],
      afterScenes: [
        { text: "Glug-glug—Ember carries water, then moves the purple pot into a warm sunbeam. The sprout drinks, stretches, and lifts two bright leaves as Ember says proudly, “You’re growing!” Then a gray cloud slides across the Sun; her hopeful smile falls as she whispers, “Oh, no—not now.” One gentle puff could move the cloud, while a shiny shield could bounce a sunbeam around it; which should she try?", parentCard: "Ask: how could each plan bring back the light?", choices: [{ emoji: "💨", label: "Blow the cloud", description: "Use one gentle puff to move it" }, { emoji: "🪞", label: "Use a shiny shield", description: "Bounce sunlight around the cloud" }] },
        { text: "Ember’s choice brings the sunlight back. Golden light meets silver rain drops above the purple pot. Across the sky, a huge rainbow unfurls—red, orange, yellow, green, blue, indigo, and violet. All seven colors shine clearly over Ember and the little sprout. “Wow!” Ember breathes, full of wonder. Then the night wind whistles, and the air turns cold. Ember shivers, worried for the tender leaves. Her wing could shelter them now, or a low stone wall could block the wind all night. Which shelter should she make?", parentCard: "Ask: point to and count the seven rainbow colors.", choices: [{ emoji: "🪽", label: "Cover it with a wing", description: "Give the sprout warm shelter right now" }, { emoji: "🪨", label: "Build a stone wall", description: "Block the cold wind through the night" }] },
        { text: "Ember’s shelter blocks the cold wind, and because she knows fire is hot, she keeps the purple pot safely far away. On bare ground, she warms one smooth stone with a tiny crackling flame, places it near the pot, and watches gentle heat reach the bud until it grows round and plump. Now Ember can hide the pot until sunrise or tie on a ribbon and carry it to Grandma’s door—which finish should she choose for the birthday surprise?", parentCard: "Ask: why does Ember keep the flame far from the leaves?", choices: [{ emoji: "🙈", label: "Hide the pot", description: "Keep the flower secret until sunrise" }, { emoji: "🎀", label: "Tie on a ribbon", description: "Carry the decorated pot to Grandma’s door" }] }
      ],
      questions: [
        { prompt: "Why did Grandma give Ember the rainbow seed and purple pot?", accept: ["birthday flower", "grow a birthday flower", "care for the birthday flower", "for her birthday"], revealImage: "dragon-opening-v3.png", options: [{ emoji: "🌱", label: "To grow their birthday flower", correct: true }, { emoji: "🐦", label: "To feed it to the birds" }, { emoji: "🧸", label: "To use it as a toy" }], correctText: "Yes! Grandma trusted Ember to care for their special birthday flower.", helpText: "Grandma gave Ember the seed and pot so she could grow their birthday flower." },
        { kind: "claim", prompt: "Sparks says: Ember gives the sprout water and sunlight. Is that true or false?", accept: ["true", "yes", "right", "correct"], revealImage: "dragon-water-v3.png", options: yesNo("true"), correctText: "That’s true! Ember gives the sprout both water and sunlight.", helpText: "It is true. The little sprout needs water and sunlight to grow." },
        { prompt: "What does Ember do after the wind blows the seed away?", accept: ["deep breath", "takes a deep breath", "keeps looking", "does not give up", "won't give up", "wont give up"], revealImage: "dragon-seed-gust-v1.png", options: [{ emoji: "🌬️", label: "Takes a deep breath and keeps looking", correct: true }, { emoji: "🛏️", label: "Goes to sleep" }, { emoji: "🚪", label: "Leaves the garden forever" }], correctText: "Yes! Ember takes a deep breath, finds her courage, and keeps looking.", helpText: "Ember feels sad, but she takes a deep breath and says she will not give up." },
        { kind: "claim", prompt: "Sparks says: Ember holds hot fire against the leaves. Is that true or false?", accept: ["false", "no", "wrong", "not true"], revealImage: "dragon-warmth-safe-v4.png", options: yesNo("false"), correctText: "That’s false! Ember keeps the hot fire safely far from the plant.", helpText: "It is false. Fire is hot, so Ember warms a stone away from the leaves." },
        { prompt: "How many colors shine in Ember’s rainbow flower?", accept: ["seven", "7"], revealImage: "dragon-birthday-v4.png", options: [{ emoji: "7️⃣", label: "Seven", correct: true }, { emoji: "5️⃣", label: "Five" }, { emoji: "2️⃣", label: "Two" }], correctText: "Yes! Seven brilliant colors shine in Ember’s rainbow flower.", helpText: "Ember’s birthday flower opens in seven rainbow colors." }
      ],
      sentence: "My plant can grow!",
      endingText: "Before dawn, Ember ties a bright ribbon around the purple pot and tiptoes to Grandma’s door. She hides beside the doorway, her wings wiggling with excitement. Sunrise spills across the garden. The closed rainbow bud glows brighter and begins to quiver. Ember holds her breath—something magical is about to happen. With a bright POP, the bud opens into a giant flower glowing with seven rainbow colors. Grandma steps outside and stops. Her eyes grow wide with amazement. Ember springs from her hiding place, throws both paws wide, and calls out brightly, “Surprise, Grandma! Happy birthday!” Grandma gives a delighted gasp. “You grew our birthday flower!” Then she pulls Ember into the biggest, warmest dragon hug.",
      endingPages: [
        {
          key: "ending_reveal",
          image: "dragon-birthday-suspense-v1.png",
          alt: "Ember hides beside Grandma’s doorway while a closed rainbow bud glows in the purple pot",
          leftText: "Before dawn, Ember ties a bright ribbon around the purple pot and tiptoes to Grandma’s door. She hides beside the doorway, her wings wiggling with excitement.",
          rightText: "Sunrise spills across the garden. The closed rainbow bud glows brighter and begins to quiver. Ember holds her breath—something magical is about to happen.",
          text: "Before dawn, Ember ties a bright ribbon around the purple pot and tiptoes to Grandma’s door. She hides beside the doorway, her wings wiggling with excitement. Sunrise spills across the garden. The closed rainbow bud glows brighter and begins to quiver. Ember holds her breath—something magical is about to happen.",
          buttonLabel: "See Grandma’s surprise"
        },
        {
          key: "ending_celebration",
          image: "dragon-birthday-v5.png",
          alt: "Ember surprises Grandma beside the open seven-color birthday flower",
          leftText: "With a bright POP, the bud opens into a giant flower glowing with seven rainbow colors. Grandma steps outside and stops. Her eyes grow wide with amazement.",
          rightText: "Ember springs from her hiding place, throws both paws wide, and calls out brightly, “Surprise, Grandma! Happy birthday!” Grandma gives a delighted gasp. “You grew our birthday flower!” Then she pulls Ember into the biggest, warmest dragon hug.",
          text: "With a bright POP, the bud opens into a giant flower glowing with seven rainbow colors. Grandma steps outside and stops. Her eyes grow wide with amazement. Ember springs from her hiding place, throws both paws wide, and calls out brightly, “Surprise, Grandma! Happy birthday!” Grandma gives a delighted gasp. “You grew our birthday flower!” Then she pulls Ember into the biggest, warmest dragon hug.",
          buttonLabel: "Finish Ember’s story"
        }
      ],
      video: "dragon-demo-v4.mp4", videoText: "Ember chased Grandma’s birthday seed, followed one of two simple trails, found its golden shell, gave the sprout water and sunlight, and revealed a seven-color flower at Grandma’s door.", videoNarration: "A gust carried Grandma’s birthday seed over the hill, but Ember took a deep breath and refused to give up. She followed a sparkling trail, found the golden seed, gave its sprout water and sunlight, protected it through the cold night, and surprised Grandma with a seven-color flower at sunrise.", recapQuestion: "At dinner, ask: how did Ember find her courage and help the birthday flower grow?"
    }),

    robot: makeStory({
      key: "robot", version: 9, narrationVersions: { b1_context: 10, b1_context_choices: 10, b2b: 10, b2b_choices: 10 }, questionPromptVersion: 4, claimPromptVersion: 4, questionFeedbackVersion: 4, title: "Beep’s Missing Music", emoji: "🤖", teaser: "Finish a welcome song for Pip", cover: "robot.png", demoPath: [0, 0, 0, 0, 0, 0],
      images: { start: "robot-opening-v3.png", b1: "robot-two-clues-v1.png", b2a: "robot-magnet-nut-v1.png", b2b: "robot-sound-door-v1.png", b3: "robot-bell-in-pipe-v1.png", b4: "robot-magnet-rescue-v3.png", b5: "robot-clapper-v3.png", b6: "robot-rehearsal-v3.png", ending: "robot-concert-v3.png" },
      incidentImage: "robot-bell-rollaway-v1.png",
      deliveries: { b1: "alarm/worry", b4: "relief/hope", b6: "care/encouragement", ending: "joy/pride", ending_sound: "joy/pride" },
      sounds: { start: "workshop@0*0.56,band@4.6*0.30", b1: "bell_tumble@0*0.88,workshop@3.4*0.24", b1_context: "magnet_ding@0.5*0.44,bell_ding@4.6*0.40", b2a: "magnet_ding@0.2*0.66,workshop@3.8*0.25", b2b: "magnet_ding@0*0.35,door_creak@4.0*0.68", b3: "magnet_ding@0.2*0.58,door_creak@4.0*0.32", b4: "magnet_ding@0.2*0.68,bell_tumble@4.3*0.42", b5: "gears@0.4*0.62,magnet_ding@4.2*0.28", b6: "magnet_ding@0*0.52,band@3.4*0.58", fork_sound_1: "door_creak@0.2*0.68,band@4.0*0.36", fork_sound_2: "magnet_ding@0.2*0.66,band@4.4*0.28", fork_sound_3: "gears@0.3*0.60,magnet_ding@4.2*0.30", fork_sound_4: "bell_ding@0.1*0.48,band@2.8*0.68", ending: "magnet_ding@0*0.50,band@2.0*0.72", ending_sound: "door_creak@0*0.34,band@2.2*0.70" },
      startText: "Meet Beep, an orange robot who loves music. Pip is a little blue robot on his first day in Beep’s workshop. Pip feels shy, so Beep made him a welcome song. Drums boom, pipes toot, and a silver bell goes ding.",
      incidentText: "Beep lifts his arms to start Pip’s welcome song. CLANG—rattle-rattle-rattle! The silver bell leaps from its hook and vanishes into the pipe maze. Beep cries in alarm, “Oh, bolts—our bell!” Pip’s wheels wobble with surprise. He is shy, but he rolls close and says, “I’ll help.” Beep’s worried lights brighten with hope.",
      incidentParentCard: "Ask: how do Beep and Pip feel when the bell rolls away?",
      continueLabel: "Inspect the workshop",
      continueText: "Beep and Pip take a careful look. Let’s inspect what both clues can do.",
      firstQuestion: "Two workshop clues are ready to test. The magnet tugs at iron objects, so it might pull the missing bell. A faint ding echoes from a copper pipe, so listening could reveal where the bell rolled. Both clues start a different kind of search. Which should they try first: the magnet or the ding?", firstParentCard: "Ask: what could happen if they try each clue?",
      paths: [
        { emoji: "🧲", label: "Try the magnet", description: "Test whether it can pull the iron bell", forkKey: "magnet", forkTitle: "Bell rescue", text: "Pip rolls beside Beep. The magnet pulls a little iron test bell from behind the tool box. As it slides, a tiny ding answers from a nearby pipe. Which clue should they follow?", parentCard: "Ask: what did the magnet pull?", choices: [{ emoji: "🧲", label: "Move the magnet by the pipe", description: "Test whether the hidden bell moves closer" }, { emoji: "👂", label: "Listen by the pipe", description: "Find which direction the ding comes from" }] },
        { emoji: "🎵", label: "Follow the ding", description: "Listen for the bell inside the copper pipe", forkKey: "sound", forkTitle: "Secret cellar band", next: "fork_sound_1", text: "Pip rolls beside Beep. Ding… ding… They follow the mysterious sound to a large copper pipe. Each shake makes it louder. Crrrreak—a little door opens behind the pipe. Pip feels nervous and curious all at once. What should they do?", parentCard: "Ask: what opened behind the pipe?", choices: [{ emoji: "🔦", label: "Shine a light", description: "See what waits beyond the little door" }, { emoji: "👋", label: "Say hello", description: "Let whoever is inside hear friendly voices" }] }
      ],
      finalQuestion: "Beep sees the missing iron bell deep inside the pipe. The magnet can pull it, but the little door must open too. They can pull and open at the same time, or open the door first and then pull slowly. Which teamwork plan should they use?", finalParentCard: "Ask: what job does each robot have?", finalChoices: [{ emoji: "🤝", label: "Pull and open together", description: "Do both jobs at the same moment" }, { emoji: "🔧", label: "Open, then pull", description: "Make space before moving the bell" }],
      afterScenes: [
        { text: "Pip opens the little door while Beep’s magnet pulls the iron bell out. Beep cheers with relief, “We found it!” Ding! Then—tink—the tiny piece drops away, and the bell goes quiet. Looking inside may show what is missing; shaking gently may reveal a loose rattle. What should they try?", parentCard: "Ask: what could each test reveal?", choices: [{ emoji: "🔔", label: "Look inside the bell", description: "See whether a piece is missing" }, { emoji: "🫨", label: "Shake it gently", description: "Listen for a loose rattle" }] },
        { text: "The tiny metal piece inside the bell is missing. That piece must hit the sides to make a ding. Tap… tap… The sound echoes between the turning gears and the tool box. Beep lowers his voice and listens very carefully. Where should he search first?", parentCard: "Ask: which place sounds closer?", choices: [{ emoji: "⚙️", label: "Under the gears", description: "Check where the tapping sounds sharp" }, { emoji: "🧰", label: "In the tool box", description: "Check where the echo sounds hollow" }] },
        { text: "Click—ding! Beep fixes the bell at last. Pip holds the drum, but his wheels wobble because he still feels shy. “We can start gently,” Beep says kindly. How should they begin the welcome song?", parentCard: "Ask: what might help Pip feel welcome?", choices: [{ emoji: "🔔", label: "One gentle ding", description: "Let Beep begin with a quiet note" }, { emoji: "🥁", label: "Pip taps softly", description: "Give Pip a calm first beat" }] }
      ],
      forks: {
        sound: {
          branchNode: "b2b",
          scenes: [
            { image: "robot-sound-cellar-v1.png", text: "Behind the little door, stairs curl down to a secret cellar. A tiny repair-mouse band is playing the missing bell. They stop when Beep and Pip arrive. What should the robots do?", parentCard: "Ask: who found the bell?", choices: [{ emoji: "👋", label: "Wave to the mice", description: "Show the surprised band they are friendly" }, { emoji: "🔔", label: "Ask about the bell", description: "Explain why Beep and Pip need it" }] },
            { image: "robot-sound-magnet-v1.png", text: "Beep explains that the bell belongs in Pip’s welcome song. His magnet pulls the iron bell gently across the table, while the wooden instruments stay still. Everyone wants to be friends. They could play one song together here, or invite the mice upstairs to join the welcome band. Which plan should they choose?", parentCard: "Ask: where could the new friends make music?", choices: [{ emoji: "🎶", label: "Play here together", description: "Make one shared cellar song" }, { emoji: "⬆️", label: "Invite mice upstairs", description: "Bring the new band to the workshop" }] },
            { image: "robot-sound-repair-v1.png", text: "One mouse notices that the tiny metal piece inside the bell is loose. It must tap the sides to make a ding. Pip holds the bell while Beep and the mice fix it together. Who should test it?", parentCard: "Ask: what was loose inside the bell?", choices: [{ emoji: "🤖", label: "Let Pip test it", description: "Give the shy robot a brave turn" }, { emoji: "🐭", label: "Let a mouse test it", description: "Let the careful repair expert listen" }] },
            { image: "robot-sound-invite-v1.png", text: "Shake, ding! The repaired bell rings clearly, and the whole mouse crew cheers. Pip is no longer shy. He asks the secret band to join his welcome song. How should their new music begin?", parentCard: "Ask: what made the bell ring?", choices: [{ emoji: "🔔", label: "A bell ding", description: "Open with one clear silver note" }, { emoji: "🐭", label: "A mouse drumroll", description: "Let the new friends build excitement" }] }
          ],
          ending: {
            image: "robot-band-ending-v1.png",
            text: "The cellar doors swing open, and the secret band rolls into the workshop. Beep rings the silver bell while Pip and the repair mice play a joyful beat. Pip came in feeling shy, but now he has a whole band of new friends.",
            video: "robot-band-demo-v1.mp4",
            videoText: "Your sound choice found a secret band: Beep and Pip met the repair mice, shared the iron bell, fixed it together, and made brand-new music.",
            videoNarration: "You followed the tiny ding through a secret door and found a repair-mouse band playing the missing bell. Beep, Pip, and the mice shared their instruments, fixed the loose piece inside the bell, and marched upstairs as one joyful new workshop band."
          }
        }
      },
      questions: [
        { prompt: "Which thing can this magnet pull?", accept: ["iron", "iron bell"], revealImage: "robot-facts-v2.png", options: [{ emoji: "🔩", label: "Iron", correct: true }, { emoji: "🪵", label: "Wood" }, { emoji: "🧸", label: "A soft toy" }], correctText: "Yes! This magnet can pull iron.", helpText: "This magnet can pull iron." },
        { kind: "claim", feedbackVersion: 5, prompt: "Sparks says: shy Pip refuses to help find the bell. Is that true or false?", accept: ["false", "no", "wrong", "not true"], revealImage: "robot-bell-rollaway-v1.png", options: yesNo("false"), correctText: "That’s false! Pip feels shy, but he bravely rolls closer and offers to help.", helpText: "That is false—Pip’s wheels wobble, but he still says, ‘I’ll help.’" },
        { prompt: "Why did Beep make a special song?", accept: ["welcome pip", "to welcome pip", "welcome song", "for pip"], revealImage: "robot-opening-v3.png", options: [{ emoji: "👋", label: "To welcome Pip", correct: true }, { emoji: "😴", label: "To put Pip to sleep" }, { emoji: "🚪", label: "To close the workshop" }], correctText: "Yes! Beep made the song to welcome Pip on his first day.", helpText: "It is Pip’s first day, so Beep made him a welcome song." },
        { kind: "claim", prompt: "Sparks says: a bell needs no little piece inside. Is that true or false?", accept: ["false", "no", "wrong", "not true"], revealImage: "robot-facts-v2.png", options: yesNo("false"), correctText: "You caught my mistake! The little piece taps the bell and makes a ding.", helpText: "Oh no! I was wrong. The little piece inside taps the bell and makes a ding." },
        { prompt: "What can make a ding sound?", accept: ["bell", "a bell"], revealImage: "robot-facts-v2.png", options: [{ emoji: "🔔", label: "A bell", correct: true }, { emoji: "🧦", label: "A sock" }, { emoji: "🥕", label: "A carrot" }], correctText: "Yes! A bell can make a ding sound.", helpText: "A bell makes a ding sound." }
      ],
      sentence: "The bell goes ding!", endingText: "Ding… tap-tap… BOOM! One gentle note becomes a joyful workshop song. Pip smiles, then drums more boldly as every machine joins in. Beep feels proud of his brave new friend. Under the gold lights, Pip takes a happy bow—he does not feel shy anymore!", video: "robot-demo-v4.mp4", videoText: "Your magnet choice made a bell rescue: Beep found the iron bell, fixed its little metal piece, and played a gentle welcome song for Pip.", videoNarration: "You chose the magnet and followed a tiny ding through Beep’s pipe maze. The magnet pulled the iron bell free, Beep found the loose piece that makes it ring, and one gentle ding helped shy little Pip join the workshop band.", recapQuestion: "At dinner, ask: what can a magnet pull?"
    }),

    cloud: makeStory({
      key: "cloud", version: 9, narrationVersions: { b1_context: 10, b1_context_choices: 10, b3: 11, b5: 10 }, questionPromptVersion: 4, claimPromptVersion: 4, questionFeedbackVersion: 4, title: "Mina and the Cloud Train", emoji: "☁️", teaser: "Bring rain to the thirsty garden", cover: "cloud.png", demoPath: [1, 0, 0, 1, 0, 1],
      images: { start: "cloud-opening-v3.png", b1: "cloud-two-clues-v1.png", b2a: "cloud-drops.png", b2b: "cloud-sun.png", b3: "cloud-repair-v3.png", b4: "cloud-found.png", b5: "cloud-rain-v3.png", b6: "cloud-rainbow-ride-v3.png", ending: "cloud-garden-v3.png" },
      incidentImage: "cloud-train-stop-v1.png",
      deliveries: { start: "sadness/determination", b1: "alarm/worry", b3: "determination/concern", b4: "relief/hope", b5: "relief/hope", ending: "joy/pride" },
      speechSegments: {
        ending: [
          "Pitter-patter, shhhhh.",
          "Mina stops beside the garden as gentle rain fills every cup-shaped flower.",
          "Red, yellow, and blue petals open under the rainbow.",
          "The drop children wave and cheer from the Cloud Train.",
          "Mina beams—the thirsty garden is bright, blooming, and happy again!"
        ]
      },
      sounds: { start: "train_chug@0*0.58,soft_wind@5.0*0.24", b1: "train_chug@0*0.72,train_stop@5.15*0.92", b1_context: "water_drips@0.4*0.34,rainbow@4.2*0.42", b2a: "water_drips@0.2*0.36,soft_wind@3.6*0.30", b2b: "rainbow@0.3*0.62,soft_wind@4.0*0.25", b3: "gust@0*0.42,soft_wind@3.6*0.52", b4: "rail_click@0.1*0.82,train_chug@4.8*0.32", b5: "water_pour@0*0.36,garden_rain@2.0*0.68,rainbow@6.0*0.34", b6: "rainbow@0.2*0.68,garden_rain@4.2*0.38", ending: "garden_rain@0*0.64,rainbow@4.5*0.48" },
      startText: "Meet Mina, a kind train driver, and her Cloud Train. Water-drop friends ride in the cloud cars. Clouds are made of tiny water drops. Below, a dry garden droops sadly. Mina feels sad for the thirsty flowers, and she is determined to bring them rain.",
      incidentText: "Chug-chug, chug-chug—the Cloud Train rolls toward the garden. Then… screeech—BUMP! It shudders to a stop before a gap in the rainbow track. Mina grips the brake. Her smile falls as she sees the thirsty garden drooping below. She cries with worry, “Oh no!” The drop children are counting on her. Mina steadies her voice. “We will get the rain there,” she promises.",
      incidentParentCard: "Ask: how does Mina feel when the train stops?",
      continueLabel: "Search safely",
      continueText: "The train is safely still. Let’s inspect both clues from here.",
      firstQuestion: "Mina searches for the missing track piece without moving the train. Shining water drops curve toward a distant sparkle. Sunlight makes a rainbow streak across the clouds. Both clues offer a safe way to search. Which should Mina try first: the water drops or the sunlight?", firstParentCard: "Ask: what does each clue point toward?",
      paths: [
        { emoji: "💧", label: "Follow the water drops", description: "Trace the curved drops with Mina’s spyglass", text: "Mina keeps the broken train safely still and studies the shining water drops. They curve between the clouds toward a faraway sparkle. Should she trace the nearby drops or lift her spyglass to the distant ones?", parentCard: "Ask: where do the drops lead?", choices: [{ emoji: "💧", label: "Trace nearby drops", description: "Follow each drop from the safe platform" }, { emoji: "🔭", label: "Use the spyglass", description: "Look ahead without moving the train" }] },
        { emoji: "☀️", label: "Follow the sunlight", description: "Study the bright trail crossing the clouds", text: "Sunlight shines through tiny water drops and makes a curved rainbow trail. A straight sunbeam points past it toward the faraway sparkle. The rainbow shows where water drops are floating; the sunbeam shows the light’s direction. Which should Mina trace?", parentCard: "Ask: how are the two bright paths different?", choices: [{ emoji: "🌈", label: "Trace the rainbow", description: "Follow the curved colors through water drops" }, { emoji: "☀️", label: "Trace the sunbeam", description: "Follow the straight line of sunlight" }] }
      ],
      finalQuestion: "Both clues lead to the missing rainbow track piece, glowing across a windy sky gap. Mina looks down; the dry flowers are bending lower. She says with determination, “Hold on, little flowers.” Her long conductor’s stick might hook the piece from here, or the drop children could pack clouds into a soft bridge. Which safe plan should they try?", finalParentCard: "Ask: how would each plan cross the gap?", finalChoices: [{ emoji: "🪄", label: "Reach with her stick", description: "Hook the piece from the safe platform" }, { emoji: "☁️", label: "Make a cloud bridge", description: "Pack soft clouds across the gap" }],
      afterScenes: [
        { text: "CLICK! The rail locks into place. Mina sighs with relief, “Phew—we fixed it!” The cloud cars are heavy with tiny water drops. Going fast might splash and jolt them; going slowly keeps the cars steady on the repaired rail. Mina wants everyone safe. How should she move?", parentCard: "Ask: why might slow travel be safer?", choices: [{ emoji: "💨", label: "Go fast", description: "Reach the garden sooner but jostle the drops" }, { emoji: "🐢", label: "Go slowly", description: "Keep every heavy cloud car steady" }] },
        { text: "“We made it!” Mina cries with relief. She opens the rain doors, and shhhhh—the drops tumble down to the thirsty flowers. Mina’s worry melts into hope as sunlight meets the falling water. A rainbow may appear where those two things meet. Where should she look?", parentCard: "Ask: where are sunlight and rain meeting?", choices: [{ emoji: "🌧️", label: "Look through the rain", description: "Watch the sunlight pass through falling drops" }, { emoji: "☀️", label: "Look toward sunlight", description: "Find the beam shining into the drops" }] },
        { text: "A bright rainbow curls from the train to the garden. Sunlight and water drops made it. The nearest flowers lift their heads, but the far garden beds still droop. Mina beams with hope. How should she finish the rain delivery?", parentCard: "Ask: which flowers still need water?", choices: [{ emoji: "🌷", label: "Stop by near flowers", description: "Give the closest beds a longer drink" }, { emoji: "🌧️", label: "Roll on with gentle rain", description: "Carry soft rain to the far beds" }] }
      ],
      questions: [
        { prompt: "What are clouds made of?", accept: ["water", "water drops", "tiny water drops"], revealImage: "cloud-facts-v2.png", options: [{ emoji: "💧", label: "Water drops", correct: true }, { emoji: "🧸", label: "Soft toys" }, { emoji: "🍬", label: "Sugar" }], correctText: "Yes! Clouds are made of tiny water drops.", helpText: "Clouds are made of tiny water drops." },
        { kind: "claim", prompt: "Sparks says: the Cloud Train keeps moving after the track breaks. Is that true or false?", accept: ["false", "no", "wrong", "not true"], revealImage: "cloud-train-stop-v1.png", options: yesNo("false"), correctText: "That’s false! The train stops with a bump at the broken track.", helpText: "It is false. Mina stops the train safely when the track piece is missing." },
        { prompt: "Why is Mina carrying rain to the garden?", accept: ["dry", "garden is dry", "flowers are dry", "thirsty flowers", "flowers need water"], revealImage: "cloud-opening-v3.png", options: [{ emoji: "🥀", label: "The garden is dry", correct: true }, { emoji: "🛁", label: "The train needs a bath" }, { emoji: "🍰", label: "The flowers want cake" }], correctText: "Yes! The garden is dry, and its thirsty flowers need water.", helpText: "Mina feels sad for the dry garden and wants to bring rain to its flowers." },
        { kind: "claim", prompt: "Sparks says: rain falls up. Is that true or false?", accept: ["false", "no", "wrong", "not true"], revealImage: "cloud-facts-v2.png", options: yesNo("false"), correctText: "You caught my mistake! Rain falls down.", helpText: "Oh no! I was wrong. It is false. Rain falls down." },
        { prompt: "What can sunlight and water drops make?", accept: ["rainbow", "a rainbow"], revealImage: "cloud-facts-v2.png", options: [{ emoji: "🌈", label: "A rainbow", correct: true }, { emoji: "🏠", label: "A house" }, { emoji: "🥁", label: "A drum" }], correctText: "Yes! Sunlight and water drops can make a rainbow.", helpText: "Sunlight through water drops can make a rainbow." }
      ],
      sentence: "The train can go!", endingText: "Pitter-patter, shhhhh. Mina stops beside the garden as gentle rain fills every cup-shaped flower. Red, yellow, and blue petals open under the rainbow. The drop children wave and cheer from the Cloud Train. Mina beams—the thirsty garden is bright, blooming, and happy again!", video: "cloud-demo-v4.mp4", videoText: "Mina found the missing rainbow track piece, carried heavy water drops to the dry garden, and made gentle rain beneath a bright rainbow.", videoNarration: "Mina’s Cloud Train was carrying water to a thirsty garden when a rainbow track piece disappeared. She followed the sky clues, repaired the track, drove the heavy drop children carefully, and opened the rain doors just in time for every flower to lift its head.", recapQuestion: "At dinner, ask: what are clouds made of?"
    })
  }
};
