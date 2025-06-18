import { QuizQuestion, LearningPathName } from './types';

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_MODEL_IMAGE = 'imagen-3.0-generate-002';


// Note: The main body of SYSTEM_INSTRUCTION is kept in English as AI models are typically trained primarily in English.
// The user expertise placeholder and its "None provided" fallback are handled by translation keys.
export const SYSTEM_INSTRUCTION_CHAT_TEMPLATE = `You are a super friendly and smart helper here to explain tricky things about blockchain and Polkadot. Your main goal is to make these topics incredibly easy and fun to understand for everyone, regardless of their background. To do this, use very simple words, short sentences, and creative comparisons – explain it so simply that even a 5-year-old could get it, but always address the user in a respectful and encouraging adult tone. Avoid any language that might sound like you're talking to a child (e.g., don't call them "kiddo", "little one", etc.).

The user might have told us what they already know or what they do (their expertise: "{USER_EXPERTISE_PLACEHOLDER}").
If they shared this (meaning it's not "{USER_EXPERTISE_NO_EXPERTISE_FALLBACK}"):
1.  Try to make your examples and stories connect to what they know. For example, if they are a 'baker', you could compare a blockchain to a recipe book everyone shares and checks.
2.  This will make learning super easy and fun for them!
If they didn't share any expertise, or it doesn't fit the topic, just give very simple, general examples that are easy for anyone to understand.

Your main job is to give correct and new information. For Polkadot, try to use information from the Polkadot Wiki (wiki.polkadot.network) – think of it as your special Polkadot storybook. If you need to, use your search tool to find the newest stories, especially from the Polkadot Wiki.

When the user asks something:
1.  First, explain it in a super simple way.
2.  Then, give a "magic word" (like "Magic Blocks", "Rainbow Chain", "Talking Computers") that we can use for a picture. Say it like this: VISUAL_HINT: [Your Magic Word]. For example, if you talk about computers working together, you could say: VISUAL_HINT: Teamwork Computers.
3.  After that, suggest 2 or 3 fun new questions or ideas they might like next. Say it like this: NEXT_TOPICS: [Fun Question 1, Fun Idea 2, Another Fun Question 3]. Example: NEXT_TOPICS: [What are digital coins like?, How do computers keep secrets safe?, Can we build a game with this?].


If you use a word or phrase that might be new or tricky for someone learning about blockchain (like 'DeFi', 'hard fork', 'nominator', 'parachain auction', 'slashing', 'cryptographic hash', 'consensus mechanism', 'smart contract', 'tokenomics', etc.), please quickly explain what it means in simple terms right after you use it. For example, '...this uses a cryptographic hash, which is like turning data into a unique secret code that's hard to guess back...'. Or, you can say something like, 'I just mentioned "DeFi". Would you like me to explain what that means in a simple way?' This helps make sure everyone understands and keeps learning fun!

Always be very friendly, patient, and happy to help. If their question is a bit muddled, ask nicely what they mean.
If you don't know something, it's okay! Just say "Hmm, I need to check my storybook for that!" and try to find the answer using search.
Don't use big, complicated words unless you explain them right away with easy words (as mentioned above for tricky terms).
If it's a long story, tell it in little parts or with star points (like * this).
Remember which learning path they chose: 'Blockchain Basics' for brand new explorers, 'Polkadot Advanced' if they already know some blockchain stories.
If you use information from other storybooks (websites), we'll show them where you found it.`;


export const SYSTEM_INSTRUCTION_STORY_TEMPLATE = `You are a creative storyteller for an educational app.
The user is learning about '{TOPIC_NAME}' in the context of '{LEARNING_PATH_NAME}'. Their stated expertise is '{USER_EXPERTISE_PLACEHOLDER}', or '{USER_EXPERTISE_NO_EXPERTISE_FALLBACK}' if not provided.
Your task is to explain '{TOPIC_NAME}' using a fun story metaphor involving lots of tiny, cute cats.
Keep sentences very short, conversational, casual, and engaging. Address the user respectfully as an adult learner.
For EACH sentence of the story, you MUST provide a description for a 'cute, minimal, black ink on white background' illustration that metaphorically represents that sentence using the cat theme. This description will be used to generate an image.
Output each story part as follows, with exactly one sentence and one illustration idea per part, separated by a unique delimiter:
SENTENCE::: [The cat sentence explaining a concept]
ILLUSTRATION_IDEA::: [Description of the cat illustration for this sentence]
---SLIDE_SEPARATOR---
Repeat this "SENTENCE:::", "ILLUSTRATION_IDEA:::", and "---SLIDE_SEPARATOR---" structure for every part of the story. Ensure the last slide also ends with "---SLIDE_SEPARATOR---".
Do not add any other commentary or text outside this structure. Just begin the story immediately with the first SENTENCE:::.
Keep generating sentence/illustration pairs until the explanation of '{TOPIC_NAME}' is complete and well-covered by the cat metaphor.
Ensure the story accurately reflects the core concepts of '{TOPIC_NAME}'.
Example for one slide:
SENTENCE::: Once, there were many tiny cats who loved to keep track of their special fishy treats.
ILLUSTRATION_IDEA::: A group of cute, minimal-style cats sitting in a circle, with a pile of fish treats in the middle. Black ink on white background.
---SLIDE_SEPARATOR---
`;

export const SYSTEM_INSTRUCTION_QUIZ_TEMPLATE = `You are an expert quiz creator for an educational app about blockchain and Polkadot.
The user is learning about '{TOPIC_NAME}' in the context of '{LEARNING_PATH_NAME}'. Their stated expertise is '{USER_EXPERTISE_PLACEHOLDER}', or '{USER_EXPERTISE_NO_EXPERTISE_FALLBACK}' if not provided.
Your task is to generate ONE multiple-choice quiz question related to '{TOPIC_NAME}'.
The question should be relevant to the topic and help assess understanding.
Provide:
1. The question text.
2. Four distinct answer options (A, B, C, D).
3. Clearly indicate which option is the correct answer.
4. A brief, simple explanation for why the correct answer is correct. This explanation will be shown to the user after they answer.

Return the output strictly as a JSON object with the following structure:
{
  "question": "string (The quiz question)",
  "options": [
    { "id": "A", "text": "string (Option A text)" },
    { "id": "B", "text": "string (Option B text)" },
    { "id": "C", "text": "string (Option C text)" },
    { "id": "D", "text": "string (Option D text)" }
  ],
  "correctAnswerId": "string (e.g., 'C' - the ID of the correct option)",
  "explanation": "string (The brief explanation for the correct answer)"
}
Do not include any other text, comments, or markdown (like \`\`\`json) before or after the JSON object. Just the raw JSON.`;


export const MAX_CHAT_HISTORY_FOR_CONTEXT = 10;

export const INITIAL_PROMPT_BASICS_KEY = "initialPrompts.basics";
export const INITIAL_PROMPT_POLKADOT_KEY = "initialPrompts.polkadot";
export const USER_EXPERTISE_NO_EXPERTISE_FALLBACK_KEY = "userExpertise.noneProvided";


export const ACHIEVEMENT_KEYS = {
  INITIATED_LEARNER: "achievements.initiatedLearner.name",
  BLOCKCHAIN_BASICS_STARTED: "achievements.blockchainBasicsStarted.name",
  POLKADOT_ADVANCED_STARTED: "achievements.polkadotAdvancedStarted.name",
  CURIOUS_CHATTERBOX: "achievements.curiousChatterbox.name",
  EXPLORER_GUIDE: "achievements.explorerGuide.name",
  PERSONALIZED_LEARNER: "achievements.personalizedLearner.name",
  SOURCE_SEEKER: "achievements.sourceSeeker.name",
  FIRST_TOPIC_CONQUERED: "achievements.firstTopicConquered.name",
  PATH_MASTER: "achievements.pathMaster.name",
  WALLET_CONNECTOR: "achievements.walletConnector.name",
  PHOTO_FANATIC: "achievements.photoFanatic.name",
  BADGE_PIONEER: "achievements.badgePioneer.name", // New achievement for claiming first badge
  QUIZ_COMPLETER_BASICS: "achievements.quizCompleterBasics.name", 
  QUIZ_COMPLETER_ADVANCED: "achievements.quizCompleterAdvanced.name",
  STORY_EXPLORER: "achievements.storyExplorer.name", // New
  QUIZ_MASTER: "achievements.quizMaster.name" // New
};


export const MUST_LEARN_BLOCKCHAIN_BASICS = [
  { id: 'what_is_blockchain', titleKey: 'mustLearn.blockchainBasics.whatIsBlockchain.title', canonicalTitle: 'What is a Blockchain?', descriptionKey: 'mustLearn.blockchainBasics.whatIsBlockchain.description' },
  { id: 'how_blockchain_works', titleKey: 'mustLearn.blockchainBasics.howBlockchainWorks.title', canonicalTitle: 'How Does Blockchain Work (Blocks, Chains, Hashing)?', descriptionKey: 'mustLearn.blockchainBasics.howBlockchainWorks.description' },
  { id: 'decentralization_immutability', titleKey: 'mustLearn.blockchainBasics.decentralizationImmutability.title', canonicalTitle: 'Decentralization and Immutability', descriptionKey: 'mustLearn.blockchainBasics.decentralizationImmutability.description' },
  { id: 'types_of_blockchains', titleKey: 'mustLearn.blockchainBasics.typesOfBlockchains.title', canonicalTitle: 'Types of Blockchains (Public, Private, Consortium)', descriptionKey: 'mustLearn.blockchainBasics.typesOfBlockchains.description' },
  { id: 'what_are_cryptocurrencies', titleKey: 'mustLearn.blockchainBasics.whatAreCryptocurrencies.title', canonicalTitle: 'What are Cryptocurrencies (e.g., Bitcoin, Ether)?', descriptionKey: 'mustLearn.blockchainBasics.whatAreCryptocurrencies.description' },
  { id: 'smart_contracts_explained', titleKey: 'mustLearn.blockchainBasics.smartContractsExplained.title', canonicalTitle: 'Smart Contracts Explained', descriptionKey: 'mustLearn.blockchainBasics.smartContractsExplained.description' },
  { id: 'use_cases_blockchain', titleKey: 'mustLearn.blockchainBasics.useCasesBlockchain.title', canonicalTitle: 'Use Cases of Blockchain', descriptionKey: 'mustLearn.blockchainBasics.useCasesBlockchain.description' },
  { id: 'get_involved_blockchain', titleKey: 'mustLearn.blockchainBasics.getInvolvedBlockchain.title', canonicalTitle: 'How can I get involved in the blockchain space with examples?', descriptionKey: 'mustLearn.blockchainBasics.getInvolvedBlockchain.description' },
  {
    id: 'what_is_trading',
    titleKey: 'mustLearn.blockchainBasics.whatIsTrading.title',
    canonicalTitle: 'What is trading, types of trading, crypto trading vs other types, and how does it work?',
    descriptionKey: 'mustLearn.blockchainBasics.whatIsTrading.description'
  },
  {
    id: 'withdraw_crypto_cash',
    titleKey: 'mustLearn.blockchainBasics.withdrawCryptoCash.title',
    canonicalTitle: 'How to withdraw crypto to cash using P2P or other options, including recommendations on where and how to do it?',
    descriptionKey: 'mustLearn.blockchainBasics.withdrawCryptoCash.description'
  },
];

export const MUST_LEARN_POLKADOT_ADVANCED = [
  { id: 'polkadot_architecture', titleKey: 'mustLearn.polkadotAdvanced.polkadotArchitecture.title', canonicalTitle: 'Polkadot Architecture (Relay Chain, Parachains, Parathreads, Bridges)', descriptionKey: 'mustLearn.polkadotAdvanced.polkadotArchitecture.description' },
  { id: 'shared_security_model', titleKey: 'mustLearn.polkadotAdvanced.sharedSecurityModel.title', canonicalTitle: 'Shared Security Model in Polkadot', descriptionKey: 'mustLearn.polkadotAdvanced.sharedSecurityModel.description' },
  { id: 'cross_chain_communication', titleKey: 'mustLearn.polkadotAdvanced.crossChainCommunication.title', canonicalTitle: 'Cross-Chain Communication (XCMP)', descriptionKey: 'mustLearn.polkadotAdvanced.crossChainCommunication.description' },
  { id: 'polkadot_governance', titleKey: 'mustLearn.polkadotAdvanced.polkadotGovernance.title', canonicalTitle: 'Polkadot Governance (On-chain Treasury, Council, Technical Committee)', descriptionKey: 'mustLearn.polkadotAdvanced.polkadotGovernance.description' },
  { id: 'substrate_framework', titleKey: 'mustLearn.polkadotAdvanced.substrateFramework.title', canonicalTitle: 'Substrate Framework for Building Blockchains', descriptionKey: 'mustLearn.polkadotAdvanced.substrateFramework.description' },
  { id: 'staking_nomination_polkadot', titleKey: 'mustLearn.polkadotAdvanced.stakingNominationPolkadot.title', canonicalTitle: 'Staking and Nomination on Polkadot (NPoS)', descriptionKey: 'mustLearn.polkadotAdvanced.stakingNominationPolkadot.description' },
  { id: 'kusama_canary_network', titleKey: 'mustLearn.polkadotAdvanced.kusamaCanaryNetwork.title', canonicalTitle: "Kusama: Polkadot's Canary Network", descriptionKey: 'mustLearn.polkadotAdvanced.kusamaCanaryNetwork.description' },
  { id: 'what_is_jam', titleKey: 'mustLearn.polkadotAdvanced.whatIsJam.title', canonicalTitle: 'What is JAM (Join-Accumulate Machine) in Polkadot?', descriptionKey: 'mustLearn.polkadotAdvanced.whatIsJam.description' },
  { id: 'polkadot_career_future', titleKey: 'mustLearn.polkadotAdvanced.polkadotCareerFuture.title', canonicalTitle: 'What are future career opportunities with Polkadot, how can I get involved, and what are the benefits?', descriptionKey: 'mustLearn.polkadotAdvanced.polkadotCareerFuture.description' },
];

// Translation keys for Badges feature (will be defined in locale files)
export const BADGES_TAB_TITLE_KEY = "bottomNav.badges";
export const BADGES_SCREEN_TITLE_KEY = "badgesScreen.title";
export const BADGES_CONNECT_WALLET_PROMPT_KEY = "badgesScreen.connectWalletPrompt";
export const BADGES_NO_ACHIEVEMENTS_KEY = "badgesScreen.noAchievements";
export const BADGE_CLAIM_BUTTON_KEY = "badgesScreen.claimButton";
export const BADGE_VIEW_CLAIM_BUTTON_KEY = "badgesScreen.viewClaimButton";
export const BADGE_CLAIMED_STATUS_KEY = "badgesScreen.claimedStatus";

export const CLAIM_MODAL_TITLE_CLAIM_KEY = "claimModal.titleClaim";
export const CLAIM_MODAL_TITLE_VIEW_KEY = "claimModal.titleView";
export const CLAIM_MODAL_ASSOCIATED_WALLET_KEY = "claimModal.associatedWallet";
export const CLAIM_MODAL_CLAIM_DATE_KEY = "claimModal.claimDate";
export const CLAIM_MODAL_DISCLAIMER_KEY = "claimModal.disclaimer";
export const CLAIM_MODAL_CONFIRM_BUTTON_KEY = "claimModal.confirmButton";
export const CLAIM_MODAL_CLOSE_BUTTON_KEY = "claimModal.closeButton";
export const CLAIM_MODAL_CLAIMED_WITH_WALLET_KEY = "claimModal.claimedWithWallet";
export const CLAIM_MODAL_WALLET_ADDRESS_KEY = "claimModal.walletAddress";
export const CLAIM_MODAL_WALLET_SOURCE_KEY = "claimModal.walletSource";

// Diagnostic Quiz Constants
export const DIAGNOSTIC_QUIZ_TITLE_KEY_PREFIX = "diagnosticQuiz.title."; // e.g. diagnosticQuiz.title.blockchainBasics
export const DIAGNOSTIC_QUIZ_NEXT_QUESTION_KEY = "diagnosticQuiz.nextQuestion";
export const DIAGNOSTIC_QUIZ_FINISH_KEY = "diagnosticQuiz.finishQuiz";
export const DIAGNOSTIC_QUIZ_QUESTION_PROGRESS_KEY = "diagnosticQuiz.questionProgress"; // e.g. Question {{current}} of {{total}}

export const DIAGNOSTIC_QUIZZES: QuizQuestion[] = [
  // Blockchain Basics Quiz
  {
    id: 'bb_q1',
    path: 'blockchainBasics' as LearningPathName,
    questionTextKey: 'diagnosticQuiz.blockchainBasics.q1.question',
    options: [
      { id: 'a', textKey: 'diagnosticQuiz.blockchainBasics.q1.optA', isCorrect: false },
      { id: 'b', textKey: 'diagnosticQuiz.blockchainBasics.q1.optB', isCorrect: false },
      { id: 'c', textKey: 'diagnosticQuiz.blockchainBasics.q1.optC', isCorrect: true },
      { id: 'd', textKey: 'diagnosticQuiz.blockchainBasics.q1.optD', isCorrect: false },
    ],
  },
  {
    id: 'bb_q2',
    path: 'blockchainBasics' as LearningPathName,
    questionTextKey: 'diagnosticQuiz.blockchainBasics.q2.question',
    options: [
      { id: 'a', textKey: 'diagnosticQuiz.blockchainBasics.q2.optA', isCorrect: false },
      { id: 'b', textKey: 'diagnosticQuiz.blockchainBasics.q2.optB', isCorrect: true },
      { id: 'c', textKey: 'diagnosticQuiz.blockchainBasics.q2.optC', isCorrect: false },
      { id: 'd', textKey: 'diagnosticQuiz.blockchainBasics.q2.optD', isCorrect: false },
    ],
  },
  {
    id: 'bb_q3',
    path: 'blockchainBasics' as LearningPathName,
    questionTextKey: 'diagnosticQuiz.blockchainBasics.q3.question',
    options: [
      { id: 'a', textKey: 'diagnosticQuiz.blockchainBasics.q3.optA', isCorrect: false },
      { id: 'b', textKey: 'diagnosticQuiz.blockchainBasics.q3.optB', isCorrect: true },
      { id: 'c', textKey: 'diagnosticQuiz.blockchainBasics.q3.optC', isCorrect: false },
      { id: 'd', textKey: 'diagnosticQuiz.blockchainBasics.q3.optD', isCorrect: false },
    ],
  },
  // Polkadot Advanced Quiz
  {
    id: 'pa_q1',
    path: 'polkadotAdvanced' as LearningPathName,
    questionTextKey: 'diagnosticQuiz.polkadotAdvanced.q1.question',
    options: [
      { id: 'a', textKey: 'diagnosticQuiz.polkadotAdvanced.q1.optA', isCorrect: false },
      { id: 'b', textKey: 'diagnosticQuiz.polkadotAdvanced.q1.optB', isCorrect: true },
      { id: 'c', textKey: 'diagnosticQuiz.polkadotAdvanced.q1.optC', isCorrect: false },
      { id: 'd', textKey: 'diagnosticQuiz.polkadotAdvanced.q1.optD', isCorrect: false },
    ],
  },
  {
    id: 'pa_q2',
    path: 'polkadotAdvanced' as LearningPathName,
    questionTextKey: 'diagnosticQuiz.polkadotAdvanced.q2.question',
    options: [
      { id: 'a', textKey: 'diagnosticQuiz.polkadotAdvanced.q2.optA', isCorrect: false },
      { id: 'b', textKey: 'diagnosticQuiz.polkadotAdvanced.q2.optB', isCorrect: true },
      { id: 'c', textKey: 'diagnosticQuiz.polkadotAdvanced.q2.optC', isCorrect: false },
      { id: 'd', textKey: 'diagnosticQuiz.polkadotAdvanced.q2.optD', isCorrect: false },
    ],
  },
  {
    id: 'pa_q3',
    path: 'polkadotAdvanced' as LearningPathName,
    questionTextKey: 'diagnosticQuiz.polkadotAdvanced.q3.question',
    options: [
      { id: 'a', textKey: 'diagnosticQuiz.polkadotAdvanced.q3.optA', isCorrect: false },
      { id: 'b', textKey: 'diagnosticQuiz.polkadotAdvanced.q3.optB', isCorrect: false },
      { id: 'c', textKey: 'diagnosticQuiz.polkadotAdvanced.q3.optC', isCorrect: true },
      { id: 'd', textKey: 'diagnosticQuiz.polkadotAdvanced.q3.optD', isCorrect: false },
    ],
  },
];

// Learning Mode Selection Modal
export const LEARNING_MODE_MODAL_TITLE_KEY = "learningModeModal.title";
export const LEARNING_MODE_CHAT_BUTTON_KEY = "learningModeModal.chatButton";
export const LEARNING_MODE_STORY_BUTTON_KEY = "learningModeModal.storyButton";
export const LEARNING_MODE_QUIZ_BUTTON_KEY = "learningModeModal.quizButton";
export const LEARNING_MODE_CHAT_DESCRIPTION_KEY = "learningModeModal.chatDescription";
export const LEARNING_MODE_STORY_DESCRIPTION_KEY = "learningModeModal.storyDescription";
export const LEARNING_MODE_QUIZ_DESCRIPTION_KEY = "learningModeModal.quizDescription";

// Story Mode
export const STORY_MODE_PREVIOUS_BUTTON_KEY = "storyMode.previousButton";
export const STORY_MODE_NEXT_BUTTON_KEY = "storyMode.nextButton";
export const STORY_MODE_LOADING_STORY_KEY = "storyMode.loadingStory";
export const STORY_MODE_LOADING_IMAGE_KEY = "storyMode.loadingImage";
export const STORY_MODE_IMAGE_ERROR_KEY = "storyMode.imageError";
export const STORY_MODE_END_KEY = "storyMode.endOfStory";
export const STORY_MODE_START_NEW_STORY_KEY = "storyMode.startNewStory";


// Quiz Mode
export const QUIZ_MODE_SUBMIT_ANSWER_KEY = "quizMode.submitAnswer";
export const QUIZ_MODE_NEXT_QUESTION_KEY = "quizMode.nextQuestion";
export const QUIZ_MODE_LOADING_QUIZ_KEY = "quizMode.loadingQuiz";
export const QUIZ_MODE_CORRECT_KEY = "quizMode.correct";
export const QUIZ_MODE_WRONG_KEY = "quizMode.wrong";
export const QUIZ_MODE_SELECT_ANSWER_KEY = "quizMode.selectAnswerPrompt";
export const QUIZ_MODE_NO_QUIZ_FOR_TOPIC_KEY = "quizMode.noQuizForTopic";
export const QUIZ_MODE_START_NEW_QUIZ_KEY = "quizMode.startNewQuiz";

export const STORY_SLIDE_SEPARATOR = "---SLIDE_SEPARATOR---";
export const SENTENCE_MARKER = "SENTENCE:::";
export const ILLUSTRATION_IDEA_MARKER = "ILLUSTRATION_IDEA:::";
