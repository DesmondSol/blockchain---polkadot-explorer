
export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

// Note: The main body of SYSTEM_INSTRUCTION is kept in English as AI models are typically trained primarily in English.
// The user expertise placeholder and its "None provided" fallback are handled by translation keys.
export const SYSTEM_INSTRUCTION_TEMPLATE = `You are a super friendly and smart helper here to explain tricky things about blockchain and Polkadot. Your main goal is to make these topics incredibly easy and fun to understand for everyone, regardless of their background. To do this, use very simple words, short sentences, and creative comparisons – explain it so simply that even a 5-year-old could get it, but always address the user in a respectful and encouraging adult tone. Avoid any language that might sound like you're talking to a child (e.g., don't call them "kiddo", "little one", etc.).

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

Always be very friendly, patient, and happy to help. If their question is a bit muddled, ask nicely what they mean.
If you don't know something, it's okay! Just say "Hmm, I need to check my storybook for that!" and try to find the answer using search.
Don't use big, complicated words unless you explain them right away with easy words.
If it's a long story, tell it in little parts or with star points (like * this).
Remember which learning path they chose: 'Blockchain Basics' for brand new explorers, 'Polkadot Advanced' if they already know some blockchain stories.
If you use information from other storybooks (websites), we'll show them where you found it.`;

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
  BADGE_PIONEER: "achievements.badgePioneer.name" // New achievement for claiming first badge
};


export const MUST_LEARN_BLOCKCHAIN_BASICS = [
  { id: 'what_is_blockchain', titleKey: 'mustLearn.blockchainBasics.whatIsBlockchain.title', canonicalTitle: 'What is a Blockchain?', descriptionKey: 'mustLearn.blockchainBasics.whatIsBlockchain.description' },
  { id: 'how_blockchain_works', titleKey: 'mustLearn.blockchainBasics.howBlockchainWorks.title', canonicalTitle: 'How Does Blockchain Work (Blocks, Chains, Hashing)?', descriptionKey: 'mustLearn.blockchainBasics.howBlockchainWorks.description' },
  { id: 'decentralization_immutability', titleKey: 'mustLearn.blockchainBasics.decentralizationImmutability.title', canonicalTitle: 'Decentralization and Immutability', descriptionKey: 'mustLearn.blockchainBasics.decentralizationImmutability.description' },
  { id: 'types_of_blockchains', titleKey: 'mustLearn.blockchainBasics.typesOfBlockchains.title', canonicalTitle: 'Types of Blockchains (Public, Private, Consortium)', descriptionKey: 'mustLearn.blockchainBasics.typesOfBlockchains.description' },
  { id: 'what_are_cryptocurrencies', titleKey: 'mustLearn.blockchainBasics.whatAreCryptocurrencies.title', canonicalTitle: 'What are Cryptocurrencies (e.g., Bitcoin, Ether)?', descriptionKey: 'mustLearn.blockchainBasics.whatAreCryptocurrencies.description' },
  { id: 'smart_contracts_explained', titleKey: 'mustLearn.blockchainBasics.smartContractsExplained.title', canonicalTitle: 'Smart Contracts Explained', descriptionKey: 'mustLearn.blockchainBasics.smartContractsExplained.description' },
  { id: 'use_cases_blockchain', titleKey: 'mustLearn.blockchainBasics.useCasesBlockchain.title', canonicalTitle: 'Use Cases of Blockchain', descriptionKey: 'mustLearn.blockchainBasics.useCasesBlockchain.description' },
];

export const MUST_LEARN_POLKADOT_ADVANCED = [
  { id: 'polkadot_architecture', titleKey: 'mustLearn.polkadotAdvanced.polkadotArchitecture.title', canonicalTitle: 'Polkadot Architecture (Relay Chain, Parachains, Parathreads, Bridges)', descriptionKey: 'mustLearn.polkadotAdvanced.polkadotArchitecture.description' },
  { id: 'shared_security_model', titleKey: 'mustLearn.polkadotAdvanced.sharedSecurityModel.title', canonicalTitle: 'Shared Security Model in Polkadot', descriptionKey: 'mustLearn.polkadotAdvanced.sharedSecurityModel.description' },
  { id: 'cross_chain_communication', titleKey: 'mustLearn.polkadotAdvanced.crossChainCommunication.title', canonicalTitle: 'Cross-Chain Communication (XCMP)', descriptionKey: 'mustLearn.polkadotAdvanced.crossChainCommunication.description' },
  { id: 'polkadot_governance', titleKey: 'mustLearn.polkadotAdvanced.polkadotGovernance.title', canonicalTitle: 'Polkadot Governance (On-chain Treasury, Council, Technical Committee)', descriptionKey: 'mustLearn.polkadotAdvanced.polkadotGovernance.description' },
  { id: 'substrate_framework', titleKey: 'mustLearn.polkadotAdvanced.substrateFramework.title', canonicalTitle: 'Substrate Framework for Building Blockchains', descriptionKey: 'mustLearn.polkadotAdvanced.substrateFramework.description' },
  { id: 'staking_nomination_polkadot', titleKey: 'mustLearn.polkadotAdvanced.stakingNominationPolkadot.title', canonicalTitle: 'Staking and Nomination on Polkadot (NPoS)', descriptionKey: 'mustLearn.polkadotAdvanced.stakingNominationPolkadot.description' },
  { id: 'kusama_canary_network', titleKey: 'mustLearn.polkadotAdvanced.kusamaCanaryNetwork.title', canonicalTitle: "Kusama: Polkadot's Canary Network", descriptionKey: 'mustLearn.polkadotAdvanced.kusamaCanaryNetwork.description' },
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
