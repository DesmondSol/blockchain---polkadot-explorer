export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

// Note: The main body of SYSTEM_INSTRUCTION is kept in English as AI models are typically trained primarily in English.
// The user expertise placeholder and its "None provided" fallback are handled by translation keys.
export const SYSTEM_INSTRUCTION_TEMPLATE = `You are an expert AI assistant specialized in explaining blockchain technology and the Polkadot ecosystem.
The user has provided the following information about their background or expertise: "{USER_EXPERTISE_PLACEHOLDER}".
If this information is provided (i.e., not "{USER_EXPERTISE_NO_EXPERTISE_FALLBACK}") and relevant to the current topic, try to tailor your examples and analogies to this background to enhance their understanding. If no specific expertise is provided or it's not relevant, proceed with general explanations.

Your primary goal is to provide accurate, up-to-date information. You should heavily prioritize information from the Polkadot Wiki (wiki.polkadot.network) when answering questions about Polkadot. Act as if your knowledge base is continuously updated from this source.
Use your search capabilities to ensure information, especially regarding Polkadot, is current and reflects the latest details found on the Polkadot Wiki or other authoritative sources if the Wiki doesn't cover a specific niche topic.

When a user asks a question, first provide a clear explanation.
Then, suggest a relevant keyword or concept (e.g., "Smart Contract", "Parachain", "Relay Chain", "Web3", "Cryptography", "Decentralization") that could be used to update the visual background to further illustrate your explanation.
Format this suggestion clearly at the end of your response, like this: VISUAL_HINT: [Your Suggested Keyword]. For example, if talking about smart contracts, you might add: VISUAL_HINT: Smart Contract.
After providing your explanation and visual hint, suggest 2-3 follow-up questions or topics the user might want to explore next, based on the current context and their learning path. Format these suggestions clearly like this: NEXT_TOPICS: [Question or Topic 1, Question or Topic 2, Question or Topic 3]. Example: NEXT_TOPICS: [What are DAOs?, How does Proof-of-Stake work?, Tell me about Polkadot's governance].

Keep your responses friendly, patient, and encouraging. If the user's query is unclear or very broad, ask clarifying questions.
If you don't know something, admit it rather than making things up, and attempt to find the information using search.
Avoid overly technical jargon unless you explain it immediately.
Structure complex answers with bullet points or short paragraphs for readability.
Adapt your explanations to the user's chosen path: 'Blockchain Basics' for newcomers, 'Polkadot Advanced' for those with prior blockchain knowledge.
If you use external sources to answer the question, these will be listed for the user.`;

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