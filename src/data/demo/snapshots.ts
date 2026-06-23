import type { StorySnapshot } from "@/domain/story/types";
import { DEMO_SOURCE_DOCUMENT_ID } from "./book";
import { demoBoundaries } from "./boundaries";

/**
 * Hand-authored, strictly cumulative story snapshots for the synthetic demonstration novel,
 * "The Lanternkeeper's Atlas." Each snapshot represents only what a reader who has reached
 * that chapter would know - later snapshots may add detail, but never retroactively edit an
 * earlier snapshot with forward-looking knowledge (see docs/SPOILER_SAFETY.md).
 */
export const demoSnapshots: StorySnapshot[] = [
  // Boundary 1 - end of Chapter 1, "The Keeper's Inventory"
  {
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    boundarySegmentOrdinal: 1,
    boundaryLabel: demoBoundaries[0].label,
    cumulativeSummary:
      "Wren Calder has arrived in the small coastal town of Saltgrave Harbor to catalog the late lighthouse keeper Josiah Fenn's papers for the Hall of Records. Town archivist Thomlin Pike and harbor master Edda Bellamy both mention that Fenn kept a personal atlas of the coastline, though no one has been able to find it since his death.",
    characters: [
      {
        id: "char-wren",
        name: "Wren Calder",
        aliases: ["Wren"],
        reminder:
          "An archivist's apprentice who travelled to Saltgrave Harbor to catalog a dead lighthouse keeper's papers.",
        currentState:
          "Settling into Saltgrave Harbor and beginning her inventory work at the Hall of Records.",
        knownRelationships: [
          {
            characterId: "char-pike",
            description: "Her new mentor at the Hall of Records.",
          },
          {
            characterId: "char-bellamy",
            description: "A helpful but guarded harbor-master acquaintance.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "char-pike",
        name: "Thomlin Pike",
        aliases: ["Master Pike", "Pike"],
        reminder:
          "The town's senior archivist at the Hall of Records and Wren's mentor.",
        currentState: "Welcoming Wren and outlining her cataloguing duties.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "Mentoring her in her new cataloguing role.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "char-bellamy",
        name: "Edda Bellamy",
        aliases: ["Captain Bellamy", "Bellamy"],
        reminder:
          "The town's harbor master, a gruff sailor who knew Fenn personally.",
        currentState: "Greeting Wren at the docks and recalling Fenn's habits.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "A new acquaintance, helpful but guarded about Fenn.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
    ],
    importantEvents: [
      {
        id: "ev-1",
        description:
          "Wren arrives in Saltgrave Harbor to catalog Josiah Fenn's effects for the Hall of Records.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-2",
        description:
          "Pike and Bellamy mention that Fenn kept a personal atlas of the coastline that has not been found since his death.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
    ],
    openThreads: [
      {
        id: "thread-atlas",
        description:
          "Where is Fenn's personal atlas of the coastline, and what does it show?",
        status: "open",
        introducedSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
    ],
    resolvedThreads: [],
    locations: [
      {
        id: "loc-harbor",
        name: "Saltgrave Harbor",
        description:
          "A small coastal town built around its harbor and the Hall of Records archive.",
        supportingSegmentIds: ["seg-1"],
      },
    ],
    supportingSegmentIds: ["seg-1"],
  },

  // Boundary 2 - end of Chapter 2, "Torn Pages"
  {
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    boundarySegmentOrdinal: 2,
    boundaryLabel: demoBoundaries[1].label,
    cumulativeSummary:
      "Wren found Josiah Fenn's trunk inside the lighthouse on Gull's Point, but the atlas notebook inside has several pages torn out. Iris Hale, the local mapmaker's daughter, recognized Fenn's drawing style and offered to compare the remaining pages against her father's old charts.",
    characters: [
      {
        id: "char-wren",
        name: "Wren Calder",
        aliases: ["Wren"],
        reminder:
          "An archivist's apprentice who travelled to Saltgrave Harbor to catalog a dead lighthouse keeper's papers.",
        currentState:
          "Searching the lighthouse on Gull's Point and discovering that Fenn's atlas notebook has torn-out pages.",
        knownRelationships: [
          {
            characterId: "char-pike",
            description: "Her new mentor at the Hall of Records.",
          },
          {
            characterId: "char-bellamy",
            description: "A helpful but guarded harbor-master acquaintance.",
          },
          {
            characterId: "char-iris",
            description:
              "A new friend helping compare Fenn's drawing style to her father's charts.",
          },
        ],
        currentLocationId: "loc-point",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 2,
        supportingSegmentIds: ["seg-1", "seg-2"],
      },
      {
        id: "char-pike",
        name: "Thomlin Pike",
        aliases: ["Master Pike", "Pike"],
        reminder:
          "The town's senior archivist at the Hall of Records and Wren's mentor.",
        currentState: "Welcoming Wren and outlining her cataloguing duties.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "Mentoring her in her new cataloguing role.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "char-bellamy",
        name: "Edda Bellamy",
        aliases: ["Captain Bellamy", "Bellamy"],
        reminder:
          "The town's harbor master, a gruff sailor who knew Fenn personally.",
        currentState: "Greeting Wren at the docks and recalling Fenn's habits.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "A new acquaintance, helpful but guarded about Fenn.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "char-iris",
        name: "Iris Hale",
        aliases: ["Iris"],
        reminder:
          "The local mapmaker's daughter, who recognizes Fenn's drawing style.",
        currentState:
          "Offering to compare Fenn's atlas pages against her father's old charts.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description:
              "A new friend she's offered to help with the atlas pages.",
          },
        ],
        currentLocationId: "loc-point",
        firstSeenSegmentOrdinal: 2,
        lastSeenSegmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
    ],
    importantEvents: [
      {
        id: "ev-1",
        description:
          "Wren arrives in Saltgrave Harbor to catalog Josiah Fenn's effects for the Hall of Records.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-2",
        description:
          "Pike and Bellamy mention that Fenn kept a personal atlas of the coastline that has not been found since his death.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-3",
        description:
          "Wren finds Fenn's trunk in the lighthouse and discovers his atlas notebook with several pages torn out.",
        segmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
      {
        id: "ev-4",
        description:
          "Iris Hale recognizes Fenn's drawing style and offers to compare it with her father's charts.",
        segmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
    ],
    openThreads: [
      {
        id: "thread-atlas",
        description:
          "Where are the torn-out atlas pages, and what did they show?",
        status: "open",
        introducedSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1", "seg-2"],
      },
    ],
    resolvedThreads: [],
    locations: [
      {
        id: "loc-harbor",
        name: "Saltgrave Harbor",
        description:
          "A small coastal town built around its harbor and the Hall of Records archive.",
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "loc-point",
        name: "Gull's Point",
        description:
          "A headland past the harbor, home to Josiah Fenn's lighthouse.",
        supportingSegmentIds: ["seg-2"],
      },
    ],
    supportingSegmentIds: ["seg-1", "seg-2"],
  },

  // Boundary 3 - end of Chapter 3, "The Constable's Warning"
  {
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    boundarySegmentOrdinal: 3,
    boundaryLabel: demoBoundaries[2].label,
    cumulativeSummary:
      "Constable Dray visited Wren and sternly warned her to stop investigating lighthouse matters, telling her to hand over anything she finds directly to him. Wren and Iris privately agreed to keep looking into the missing pages anyway.",
    characters: [
      {
        id: "char-wren",
        name: "Wren Calder",
        aliases: ["Wren"],
        reminder:
          "An archivist's apprentice who travelled to Saltgrave Harbor to catalog a dead lighthouse keeper's papers.",
        currentState:
          "Quietly continuing to investigate the missing atlas pages despite Constable Dray's warning to stop.",
        knownRelationships: [
          {
            characterId: "char-pike",
            description: "Her new mentor at the Hall of Records.",
          },
          {
            characterId: "char-bellamy",
            description: "A helpful but guarded harbor-master acquaintance.",
          },
          {
            characterId: "char-iris",
            description:
              "A trusted friend who has agreed to keep investigating with her.",
          },
          {
            characterId: "char-dray",
            description:
              "Wary of his warning to stop investigating the lighthouse.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 3,
        supportingSegmentIds: ["seg-1", "seg-2", "seg-3"],
      },
      {
        id: "char-pike",
        name: "Thomlin Pike",
        aliases: ["Master Pike", "Pike"],
        reminder:
          "The town's senior archivist at the Hall of Records and Wren's mentor.",
        currentState: "Welcoming Wren and outlining her cataloguing duties.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "Mentoring her in her new cataloguing role.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "char-bellamy",
        name: "Edda Bellamy",
        aliases: ["Captain Bellamy", "Bellamy"],
        reminder:
          "The town's harbor master, a gruff sailor who knew Fenn personally.",
        currentState: "Greeting Wren at the docks and recalling Fenn's habits.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "A new acquaintance, helpful but guarded about Fenn.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "char-iris",
        name: "Iris Hale",
        aliases: ["Iris"],
        reminder:
          "The local mapmaker's daughter, who recognizes Fenn's drawing style.",
        currentState:
          "Agreeing with Wren to keep investigating quietly despite Dray's warning.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description:
              "Trusts Wren enough to keep investigating quietly together.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 2,
        lastSeenSegmentOrdinal: 3,
        supportingSegmentIds: ["seg-2", "seg-3"],
      },
      {
        id: "char-dray",
        name: "Constable Dray",
        aliases: ["Constable Dray", "Dray"],
        reminder:
          "The town constable, initially stern about the search for Fenn's papers.",
        currentState:
          "Warning Wren to stop investigating lighthouse matters and to hand over anything she finds directly to him.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "Has warned her to stay out of lighthouse matters.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 3,
        lastSeenSegmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
    ],
    importantEvents: [
      {
        id: "ev-1",
        description:
          "Wren arrives in Saltgrave Harbor to catalog Josiah Fenn's effects for the Hall of Records.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-2",
        description:
          "Pike and Bellamy mention that Fenn kept a personal atlas of the coastline that has not been found since his death.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-3",
        description:
          "Wren finds Fenn's trunk in the lighthouse and discovers his atlas notebook with several pages torn out.",
        segmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
      {
        id: "ev-4",
        description:
          "Iris Hale recognizes Fenn's drawing style and offers to compare it with her father's charts.",
        segmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
      {
        id: "ev-5",
        description:
          "Constable Dray warns Wren to stop investigating the lighthouse and to hand over anything she finds directly to him.",
        segmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
      {
        id: "ev-6",
        description:
          "Wren and Iris privately agree to continue looking into the missing pages despite Dray's warning.",
        segmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
    ],
    openThreads: [
      {
        id: "thread-atlas",
        description:
          "Where are the torn-out atlas pages, and what did they show?",
        status: "open",
        introducedSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1", "seg-2"],
      },
      {
        id: "thread-dray-motive",
        description:
          "Why is Constable Dray trying to stop the search for Fenn's atlas?",
        status: "open",
        introducedSegmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
    ],
    resolvedThreads: [],
    locations: [
      {
        id: "loc-harbor",
        name: "Saltgrave Harbor",
        description:
          "A small coastal town built around its harbor and the Hall of Records archive.",
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "loc-point",
        name: "Gull's Point",
        description:
          "A headland past the harbor, home to Josiah Fenn's lighthouse.",
        supportingSegmentIds: ["seg-2"],
      },
    ],
    supportingSegmentIds: ["seg-1", "seg-2", "seg-3"],
  },

  // Boundary 4 - end of Chapter 4, "Bellamy's Memory"
  {
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    boundarySegmentOrdinal: 4,
    boundaryLabel: demoBoundaries[3].label,
    cumulativeSummary:
      "Over tea, Captain Bellamy recalled that Fenn used to row alone at night to a hidden cove past the Gull's Point reef, once muttering about keeping the channel's secret safe from grabbing hands. That same night, an anonymous note was slipped under Wren's door warning her to let the dead keep their charts.",
    characters: [
      {
        id: "char-wren",
        name: "Wren Calder",
        aliases: ["Wren"],
        reminder:
          "An archivist's apprentice who travelled to Saltgrave Harbor to catalog a dead lighthouse keeper's papers.",
        currentState:
          "Piecing together Bellamy's memory of Fenn's night rows while uneasy about an anonymous warning note.",
        knownRelationships: [
          {
            characterId: "char-pike",
            description: "Her new mentor at the Hall of Records.",
          },
          {
            characterId: "char-bellamy",
            description: "Increasingly trusts her with his memories of Fenn.",
          },
          {
            characterId: "char-iris",
            description:
              "A trusted friend who has agreed to keep investigating with her.",
          },
          {
            characterId: "char-dray",
            description:
              "Wary of his warning to stop investigating the lighthouse.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 4,
        supportingSegmentIds: ["seg-1", "seg-2", "seg-3", "seg-4"],
      },
      {
        id: "char-pike",
        name: "Thomlin Pike",
        aliases: ["Master Pike", "Pike"],
        reminder:
          "The town's senior archivist at the Hall of Records and Wren's mentor.",
        currentState: "Welcoming Wren and outlining her cataloguing duties.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "Mentoring her in her new cataloguing role.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "char-bellamy",
        name: "Edda Bellamy",
        aliases: ["Captain Bellamy", "Bellamy"],
        reminder:
          "The town's harbor master, a gruff sailor who knew Fenn personally.",
        currentState:
          "Recalling over tea that Fenn used to row alone at night to a hidden cove past the Gull's Point reef.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description:
              "Increasingly open with Wren about Fenn's nighttime habits.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 4,
        supportingSegmentIds: ["seg-1", "seg-4"],
      },
      {
        id: "char-iris",
        name: "Iris Hale",
        aliases: ["Iris"],
        reminder:
          "The local mapmaker's daughter, who recognizes Fenn's drawing style.",
        currentState:
          "Helping Wren make sense of Bellamy's account of Fenn's night rows.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description:
              "Trusts Wren enough to keep investigating quietly together.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 2,
        lastSeenSegmentOrdinal: 4,
        supportingSegmentIds: ["seg-2", "seg-3", "seg-4"],
      },
      {
        id: "char-dray",
        name: "Constable Dray",
        aliases: ["Constable Dray", "Dray"],
        reminder:
          "The town constable, initially stern about the search for Fenn's papers.",
        currentState:
          "Warning Wren to stop investigating lighthouse matters and to hand over anything she finds directly to him.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "Has warned her to stay out of lighthouse matters.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 3,
        lastSeenSegmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
    ],
    importantEvents: [
      {
        id: "ev-1",
        description:
          "Wren arrives in Saltgrave Harbor to catalog Josiah Fenn's effects for the Hall of Records.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-2",
        description:
          "Pike and Bellamy mention that Fenn kept a personal atlas of the coastline that has not been found since his death.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-3",
        description:
          "Wren finds Fenn's trunk in the lighthouse and discovers his atlas notebook with several pages torn out.",
        segmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
      {
        id: "ev-4",
        description:
          "Iris Hale recognizes Fenn's drawing style and offers to compare it with her father's charts.",
        segmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
      {
        id: "ev-5",
        description:
          "Constable Dray warns Wren to stop investigating the lighthouse and to hand over anything she finds directly to him.",
        segmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
      {
        id: "ev-6",
        description:
          "Wren and Iris privately agree to continue looking into the missing pages despite Dray's warning.",
        segmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
      {
        id: "ev-7",
        description:
          "Bellamy recalls that Fenn used to row alone at night to a hidden cove past the Gull's Point reef.",
        segmentOrdinal: 4,
        supportingSegmentIds: ["seg-4"],
      },
      {
        id: "ev-8",
        description:
          "An anonymous note warning Wren to 'let the dead keep their charts' is slipped under her door.",
        segmentOrdinal: 4,
        supportingSegmentIds: ["seg-4"],
      },
    ],
    openThreads: [
      {
        id: "thread-atlas",
        description:
          "Where are the torn-out atlas pages, and what did they show?",
        status: "open",
        introducedSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1", "seg-2", "seg-4"],
      },
      {
        id: "thread-dray-motive",
        description:
          "Why is Constable Dray trying to stop the search for Fenn's atlas?",
        status: "open",
        introducedSegmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
      {
        id: "thread-note",
        description:
          "Who sent the anonymous note warning Wren to stop looking into Fenn's charts?",
        status: "open",
        introducedSegmentOrdinal: 4,
        supportingSegmentIds: ["seg-4"],
      },
    ],
    resolvedThreads: [],
    locations: [
      {
        id: "loc-harbor",
        name: "Saltgrave Harbor",
        description:
          "A small coastal town built around its harbor and the Hall of Records archive.",
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "loc-point",
        name: "Gull's Point",
        description:
          "A headland past the harbor, home to Josiah Fenn's lighthouse and, somewhere along its reef, a hidden cove Fenn used to visit alone at night.",
        supportingSegmentIds: ["seg-2", "seg-4"],
      },
    ],
    supportingSegmentIds: ["seg-1", "seg-2", "seg-3", "seg-4"],
  },

  // Boundary 5 - end of Chapter 5, "What the Reef Hides"
  {
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    boundarySegmentOrdinal: 5,
    boundaryLabel: demoBoundaries[4].label,
    cumulativeSummary:
      "Using Iris's father's old charts alongside the surviving atlas pages, Wren and Iris narrowed down the general location of Fenn's hidden cove. Pike admitted he has long suspected rival archivist Selwyn Crane of trying to acquire Fenn's papers, and handwriting in the archive's letters matched the anonymous note, identifying Crane as the one who sent it.",
    characters: [
      {
        id: "char-wren",
        name: "Wren Calder",
        aliases: ["Wren"],
        reminder:
          "An archivist's apprentice who travelled to Saltgrave Harbor to catalog a dead lighthouse keeper's papers.",
        currentState:
          "Working with Iris and Pike to narrow down the cove's location and to confirm who sent the warning note.",
        knownRelationships: [
          {
            characterId: "char-pike",
            description:
              "Has opened up to her about archive politics and his suspicion of Crane.",
          },
          {
            characterId: "char-bellamy",
            description: "Increasingly trusts her with his memories of Fenn.",
          },
          {
            characterId: "char-iris",
            description:
              "A trusted friend who has agreed to keep investigating with her.",
          },
          {
            characterId: "char-dray",
            description:
              "Wary of his warning to stop investigating the lighthouse.",
          },
          {
            characterId: "char-crane",
            description:
              "A suspected rival who is believed to have sent her an anonymous warning note.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 5,
        supportingSegmentIds: ["seg-1", "seg-2", "seg-3", "seg-4", "seg-5"],
      },
      {
        id: "char-pike",
        name: "Thomlin Pike",
        aliases: ["Master Pike", "Pike"],
        reminder:
          "The town's senior archivist at the Hall of Records and Wren's mentor.",
        currentState:
          "Revealing his long-standing suspicion that rival archivist Selwyn Crane has been trying to acquire Fenn's papers, and helping confirm Crane sent the warning note.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "Mentoring her in her new cataloguing role.",
          },
          {
            characterId: "char-crane",
            description:
              "A rival archivist Pike has long suspected of wanting Fenn's papers.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 5,
        supportingSegmentIds: ["seg-1", "seg-5"],
      },
      {
        id: "char-bellamy",
        name: "Edda Bellamy",
        aliases: ["Captain Bellamy", "Bellamy"],
        reminder:
          "The town's harbor master, a gruff sailor who knew Fenn personally.",
        currentState:
          "Recalling over tea that Fenn used to row alone at night to a hidden cove past the Gull's Point reef.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description:
              "Increasingly open with Wren about Fenn's nighttime habits.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 4,
        supportingSegmentIds: ["seg-1", "seg-4"],
      },
      {
        id: "char-iris",
        name: "Iris Hale",
        aliases: ["Iris"],
        reminder:
          "The local mapmaker's daughter, who recognizes Fenn's drawing style.",
        currentState:
          "Helping narrow down the hidden cove's location using her father's old charts.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description:
              "Trusts Wren enough to keep investigating quietly together.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 2,
        lastSeenSegmentOrdinal: 5,
        supportingSegmentIds: ["seg-2", "seg-3", "seg-4", "seg-5"],
      },
      {
        id: "char-dray",
        name: "Constable Dray",
        aliases: ["Constable Dray", "Dray"],
        reminder:
          "The town constable, initially stern about the search for Fenn's papers.",
        currentState:
          "Warning Wren to stop investigating lighthouse matters and to hand over anything she finds directly to him.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "Has warned her to stay out of lighthouse matters.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 3,
        lastSeenSegmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
      {
        id: "char-crane",
        name: "Selwyn Crane",
        aliases: ["Selwyn Crane", "Crane"],
        reminder:
          "A rival archivist suspected of wanting Fenn's papers for his own collection.",
        currentState:
          "Identified as the likely sender of the anonymous warning note after his handwriting matched letters in the archive.",
        knownRelationships: [
          {
            characterId: "char-pike",
            description: "A long-standing rival of Pike's in archive circles.",
          },
          {
            characterId: "char-wren",
            description: "Suspected of trying to scare her off the search.",
          },
        ],
        firstSeenSegmentOrdinal: 5,
        lastSeenSegmentOrdinal: 5,
        supportingSegmentIds: ["seg-5"],
      },
    ],
    importantEvents: [
      {
        id: "ev-1",
        description:
          "Wren arrives in Saltgrave Harbor to catalog Josiah Fenn's effects for the Hall of Records.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-2",
        description:
          "Pike and Bellamy mention that Fenn kept a personal atlas of the coastline that has not been found since his death.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-3",
        description:
          "Wren finds Fenn's trunk in the lighthouse and discovers his atlas notebook with several pages torn out.",
        segmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
      {
        id: "ev-4",
        description:
          "Iris Hale recognizes Fenn's drawing style and offers to compare it with her father's charts.",
        segmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
      {
        id: "ev-5",
        description:
          "Constable Dray warns Wren to stop investigating the lighthouse and to hand over anything she finds directly to him.",
        segmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
      {
        id: "ev-6",
        description:
          "Wren and Iris privately agree to continue looking into the missing pages despite Dray's warning.",
        segmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
      {
        id: "ev-7",
        description:
          "Bellamy recalls that Fenn used to row alone at night to a hidden cove past the Gull's Point reef.",
        segmentOrdinal: 4,
        supportingSegmentIds: ["seg-4"],
      },
      {
        id: "ev-8",
        description:
          "An anonymous note warning Wren to 'let the dead keep their charts' is slipped under her door.",
        segmentOrdinal: 4,
        supportingSegmentIds: ["seg-4"],
      },
      {
        id: "ev-9",
        description:
          "Wren and Iris use old charts to narrow down the general location of the hidden cove.",
        segmentOrdinal: 5,
        supportingSegmentIds: ["seg-5"],
      },
      {
        id: "ev-10",
        description:
          "Pike reveals his long-standing suspicion of rival archivist Selwyn Crane.",
        segmentOrdinal: 5,
        supportingSegmentIds: ["seg-5"],
      },
      {
        id: "ev-11",
        description:
          "Handwriting in the archive's letters matches the anonymous note, identifying Selwyn Crane as its sender.",
        segmentOrdinal: 5,
        supportingSegmentIds: ["seg-5"],
      },
    ],
    openThreads: [
      {
        id: "thread-atlas",
        description:
          "Where are the torn-out atlas pages, and what do they show about the hidden cove?",
        status: "open",
        introducedSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1", "seg-2", "seg-4", "seg-5"],
      },
      {
        id: "thread-dray-motive",
        description:
          "Why is Constable Dray trying to stop the search for Fenn's atlas?",
        status: "open",
        introducedSegmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
    ],
    resolvedThreads: [
      {
        id: "thread-note",
        description:
          "Who sent the anonymous note warning Wren to stop looking into Fenn's charts?",
        status: "resolved",
        introducedSegmentOrdinal: 4,
        resolvedSegmentOrdinal: 5,
        supportingSegmentIds: ["seg-4", "seg-5"],
      },
    ],
    locations: [
      {
        id: "loc-harbor",
        name: "Saltgrave Harbor",
        description:
          "A small coastal town built around its harbor and the Hall of Records archive.",
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "loc-point",
        name: "Gull's Point",
        description:
          "A headland past the harbor, home to Josiah Fenn's lighthouse and a hidden cove along its reef whose general location Wren and Iris have now narrowed down.",
        supportingSegmentIds: ["seg-2", "seg-4", "seg-5"],
      },
    ],
    supportingSegmentIds: ["seg-1", "seg-2", "seg-3", "seg-4", "seg-5"],
  },

  // Boundary 6 - end of Chapter 6, "Gull's Point at Low Tide"
  {
    sourceDocumentId: DEMO_SOURCE_DOCUMENT_ID,
    boundarySegmentOrdinal: 6,
    boundaryLabel: demoBoundaries[5].label,
    cumulativeSummary:
      "Wren, Iris, and Constable Dray went to the hidden cove together at low tide. Dray revealed that his warnings were meant to protect the cove from old smuggling-related dangers, not to stop Wren out of suspicion, and joined the search. The three found a sealed metal box in the cove, but the final missing atlas page - which would reveal exactly what Fenn was protecting - was still missing, likely taken by Selwyn Crane before they arrived.",
    characters: [
      {
        id: "char-wren",
        name: "Wren Calder",
        aliases: ["Wren"],
        reminder:
          "An archivist's apprentice who travelled to Saltgrave Harbor to catalog a dead lighthouse keeper's papers.",
        currentState:
          "Standing at the hidden cove with Iris and Dray, having found a sealed box but not the final missing atlas page.",
        knownRelationships: [
          {
            characterId: "char-pike",
            description:
              "Has opened up to her about archive politics and his suspicion of Crane.",
          },
          {
            characterId: "char-bellamy",
            description: "Increasingly trusts her with his memories of Fenn.",
          },
          {
            characterId: "char-iris",
            description:
              "A trusted friend who has investigated alongside her from the start.",
          },
          {
            characterId: "char-dray",
            description:
              "Revealed as an ally protecting the cove, not an obstacle to her search.",
          },
          {
            characterId: "char-crane",
            description:
              "Suspected of sending the warning note and of taking the final missing page.",
          },
        ],
        currentLocationId: "loc-point",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 6,
        supportingSegmentIds: [
          "seg-1",
          "seg-2",
          "seg-3",
          "seg-4",
          "seg-5",
          "seg-6",
        ],
      },
      {
        id: "char-pike",
        name: "Thomlin Pike",
        aliases: ["Master Pike", "Pike"],
        reminder:
          "The town's senior archivist at the Hall of Records and Wren's mentor.",
        currentState:
          "Revealing his long-standing suspicion that rival archivist Selwyn Crane has been trying to acquire Fenn's papers, and helping confirm Crane sent the warning note.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description: "Mentoring her in her new cataloguing role.",
          },
          {
            characterId: "char-crane",
            description:
              "A rival archivist Pike has long suspected of wanting Fenn's papers.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 5,
        supportingSegmentIds: ["seg-1", "seg-5"],
      },
      {
        id: "char-bellamy",
        name: "Edda Bellamy",
        aliases: ["Captain Bellamy", "Bellamy"],
        reminder:
          "The town's harbor master, a gruff sailor who knew Fenn personally.",
        currentState:
          "Recalling over tea that Fenn used to row alone at night to a hidden cove past the Gull's Point reef.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description:
              "Increasingly open with Wren about Fenn's nighttime habits.",
          },
        ],
        currentLocationId: "loc-harbor",
        firstSeenSegmentOrdinal: 1,
        lastSeenSegmentOrdinal: 4,
        supportingSegmentIds: ["seg-1", "seg-4"],
      },
      {
        id: "char-iris",
        name: "Iris Hale",
        aliases: ["Iris"],
        reminder:
          "The local mapmaker's daughter, who recognizes Fenn's drawing style.",
        currentState:
          "Joining Wren and Dray at the hidden cove during low tide.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description:
              "A trusted friend who has investigated alongside her from the start.",
          },
        ],
        currentLocationId: "loc-point",
        firstSeenSegmentOrdinal: 2,
        lastSeenSegmentOrdinal: 6,
        supportingSegmentIds: ["seg-2", "seg-3", "seg-4", "seg-5", "seg-6"],
      },
      {
        id: "char-dray",
        name: "Constable Dray",
        aliases: ["Constable Dray", "Dray"],
        reminder:
          "The town constable, initially stern about the search for Fenn's papers.",
        currentState:
          "Revealing that his warnings were meant to protect the cove from old smuggling-related dangers, not to stop Wren out of suspicion, and joining her search at low tide.",
        knownRelationships: [
          {
            characterId: "char-wren",
            description:
              "Now an ally, having explained his true reasons for the earlier warning.",
          },
        ],
        currentLocationId: "loc-point",
        firstSeenSegmentOrdinal: 3,
        lastSeenSegmentOrdinal: 6,
        supportingSegmentIds: ["seg-3", "seg-6"],
      },
      {
        id: "char-crane",
        name: "Selwyn Crane",
        aliases: ["Selwyn Crane", "Crane"],
        reminder:
          "A rival archivist suspected of wanting Fenn's papers for his own collection.",
        currentState:
          "Suspected of having taken the final missing atlas page before Wren, Iris, and Dray reached the cove.",
        knownRelationships: [
          {
            characterId: "char-pike",
            description: "A long-standing rival of Pike's in archive circles.",
          },
          {
            characterId: "char-wren",
            description:
              "Suspected of sending the warning note and of taking the final missing page.",
          },
        ],
        firstSeenSegmentOrdinal: 5,
        lastSeenSegmentOrdinal: 6,
        supportingSegmentIds: ["seg-5", "seg-6"],
      },
    ],
    importantEvents: [
      {
        id: "ev-1",
        description:
          "Wren arrives in Saltgrave Harbor to catalog Josiah Fenn's effects for the Hall of Records.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-2",
        description:
          "Pike and Bellamy mention that Fenn kept a personal atlas of the coastline that has not been found since his death.",
        segmentOrdinal: 1,
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "ev-3",
        description:
          "Wren finds Fenn's trunk in the lighthouse and discovers his atlas notebook with several pages torn out.",
        segmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
      {
        id: "ev-4",
        description:
          "Iris Hale recognizes Fenn's drawing style and offers to compare it with her father's charts.",
        segmentOrdinal: 2,
        supportingSegmentIds: ["seg-2"],
      },
      {
        id: "ev-5",
        description:
          "Constable Dray warns Wren to stop investigating the lighthouse and to hand over anything she finds directly to him.",
        segmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
      {
        id: "ev-6",
        description:
          "Wren and Iris privately agree to continue looking into the missing pages despite Dray's warning.",
        segmentOrdinal: 3,
        supportingSegmentIds: ["seg-3"],
      },
      {
        id: "ev-7",
        description:
          "Bellamy recalls that Fenn used to row alone at night to a hidden cove past the Gull's Point reef.",
        segmentOrdinal: 4,
        supportingSegmentIds: ["seg-4"],
      },
      {
        id: "ev-8",
        description:
          "An anonymous note warning Wren to 'let the dead keep their charts' is slipped under her door.",
        segmentOrdinal: 4,
        supportingSegmentIds: ["seg-4"],
      },
      {
        id: "ev-9",
        description:
          "Wren and Iris use old charts to narrow down the general location of the hidden cove.",
        segmentOrdinal: 5,
        supportingSegmentIds: ["seg-5"],
      },
      {
        id: "ev-10",
        description:
          "Pike reveals his long-standing suspicion of rival archivist Selwyn Crane.",
        segmentOrdinal: 5,
        supportingSegmentIds: ["seg-5"],
      },
      {
        id: "ev-11",
        description:
          "Handwriting in the archive's letters matches the anonymous note, identifying Selwyn Crane as its sender.",
        segmentOrdinal: 5,
        supportingSegmentIds: ["seg-5"],
      },
      {
        id: "ev-12",
        description:
          "Dray reveals he was protecting the cove from old smuggling-related dangers, not obstructing Wren out of suspicion.",
        segmentOrdinal: 6,
        supportingSegmentIds: ["seg-6"],
      },
      {
        id: "ev-13",
        description:
          "Wren, Iris, and Dray find a sealed metal box in the hidden cove at low tide.",
        segmentOrdinal: 6,
        supportingSegmentIds: ["seg-6"],
      },
      {
        id: "ev-14",
        description:
          "The final missing atlas page, which would reveal exactly what Fenn was protecting, is still missing - likely taken by Crane.",
        segmentOrdinal: 6,
        supportingSegmentIds: ["seg-6"],
      },
    ],
    openThreads: [
      {
        id: "thread-atlas",
        description:
          "What is in the sealed box from the cove, and what did the final missing atlas page reveal?",
        status: "open",
        introducedSegmentOrdinal: 1,
        supportingSegmentIds: ["seg-1", "seg-2", "seg-4", "seg-5", "seg-6"],
      },
    ],
    resolvedThreads: [
      {
        id: "thread-note",
        description:
          "Who sent the anonymous note warning Wren to stop looking into Fenn's charts?",
        status: "resolved",
        introducedSegmentOrdinal: 4,
        resolvedSegmentOrdinal: 5,
        supportingSegmentIds: ["seg-4", "seg-5"],
      },
      {
        id: "thread-dray-motive",
        description:
          "Why is Constable Dray trying to stop the search for Fenn's atlas?",
        status: "resolved",
        introducedSegmentOrdinal: 3,
        resolvedSegmentOrdinal: 6,
        supportingSegmentIds: ["seg-3", "seg-6"],
      },
    ],
    locations: [
      {
        id: "loc-harbor",
        name: "Saltgrave Harbor",
        description:
          "A small coastal town built around its harbor and the Hall of Records archive.",
        supportingSegmentIds: ["seg-1"],
      },
      {
        id: "loc-point",
        name: "Gull's Point",
        description:
          "A headland past the harbor, home to Josiah Fenn's lighthouse and the hidden cove where Fenn once kept watch over a sealed box.",
        supportingSegmentIds: ["seg-2", "seg-4", "seg-5", "seg-6"],
      },
    ],
    supportingSegmentIds: [
      "seg-1",
      "seg-2",
      "seg-3",
      "seg-4",
      "seg-5",
      "seg-6",
    ],
  },
];
