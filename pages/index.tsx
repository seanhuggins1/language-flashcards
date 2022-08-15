import {
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Spinner,
  Text,
  Link as ChakraLink,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { ArrowsCounterClockwise, SpeakerHigh } from "phosphor-react";
import { ReactNode, useEffect, useState } from "react";
import { Flashcard, flashcardData as data } from "../data";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageCode } from "../types";
import decodeBase64MP3Audio from "../services/textToSpeech/decodeBase64MP3Audio";
import { useKeyDown } from "../hooks";
import Link from "next/link";

const FlashCard = ({
  card,
}: {
  readonly card: Flashcard;
  readonly onClickNext: () => void;
  readonly onClickPrevious: () => void;
}) => {
  const [language, setLanguage] = useState<LanguageCode>(`EN`);
  const playAudio = (base64MP3: string) => {
    const audio = decodeBase64MP3Audio(base64MP3);
    audio.play();
  };

  const handlePlayAudio = async () => {
    language === `EN`
      ? playAudio(card.englishAudio)
      : playAudio(card.spanishAudio);
  };

  const handleSwitchLanguage = () => {
    if (language === `EN`) {
      setLanguage(`ES`);
      return;
    }
    setLanguage(`EN`);
  };

  return (
    <VStack w="full" flex="1">
      <HStack w="full" justifyContent="space-between">
        <Text fontWeight="medium" color="gray.400">
          {card.id}
        </Text>
        <IconButton
          onClick={handlePlayAudio}
          aria-label="Play sound"
          color="gray.500"
        >
          <SpeakerHigh size={24} fill="current" />
        </IconButton>
      </HStack>
      <Text
        fontSize={{ base: `4xl`, md: `6xl` }}
        color="gray.600"
        fontWeight="bold"
      >
        {language === `EN` ? card.english : card.spanish}
      </Text>
      <Text fontSize="lg" color="gray.400" fontWeight="bold">
        {card.definition}
      </Text>
      <IconButton
        color="gray.500"
        aria-label="Reveal answer"
        onClick={handleSwitchLanguage}
      >
        <ArrowsCounterClockwise size={32} fill="current" />
      </IconButton>
      <Text fontWeight="medium" color="gray.400" fontSize="4xl">
        {language === `EN` ? `🇺🇸` : `🇲🇽`}
      </Text>
    </VStack>
  );
};

const FlashCardWrapper = ({ children }: { readonly children: ReactNode }) => (
  <VStack
    w={{ base: `100vw`, md: `480px` }}
    h="360px"
    bg="white"
    borderRadius={{ base: 0, md: 24 }}
    p={8}
    shadow={{ base: `none`, md: `xl` }}
  >
    {children}
  </VStack>
);

const getRandomIndex = (array: any[]) =>
  Math.floor(Math.random() * array.length);

const getRandomCard = (cards: Flashcard[]) => cards[getRandomIndex(cards)];

const FlashCards = () => {
  const [cardHistory, setCardHistory] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

  const motionYVal = useBreakpointValue({ base: 0, md: 50 });

  useKeyDown({ key: `ArrowLeft`, handler: () => onClickPrevious() });
  useKeyDown({ key: `ArrowRight`, handler: () => onClickNext() });

  useEffect(() => {
    setCurrentCardIndex(0);
    setCardHistory([getRandomCard(data)]);
  }, []);

  const onClickNext = () => {
    if (!!cardHistory[currentCardIndex + 1]) {
      setCurrentCardIndex(currentCardIndex + 1);
      return;
    }

    const nextCard = getRandomCard(data);
    setCardHistory([...cardHistory, nextCard]);
    setCurrentCardIndex(currentCardIndex + 1);
  };

  const onClickPrevious = () => {
    if (currentCardIndex === 0) return;
    setCurrentCardIndex(currentCardIndex - 1);
  };

  const currentCard = cardHistory[currentCardIndex];

  if (!currentCard)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        initial={{ opacity: 0, y: motionYVal, scale: 0.9 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { opacity: { duration: 0.2 } },
        }}
        exit={{
          opacity: 0,
          y: motionYVal,
          scale: 0.9,
          transition: { opacity: { duration: 0.2 } },
        }}
        key={currentCard.id}
      >
        <FlashCardWrapper>
          <FlashCard
            card={currentCard}
            onClickNext={onClickNext}
            onClickPrevious={onClickPrevious}
          />
          <HStack
            w="full"
            flexDirection="row-reverse"
            justifyContent="space-between"
          >
            <Button onClick={onClickNext} w="24">
              Next
            </Button>
            <Button
              disabled={currentCardIndex === 0}
              onClick={onClickPrevious}
              w="24"
            >
              Previous
            </Button>
          </HStack>
        </FlashCardWrapper>
      </motion.div>
    </AnimatePresence>
  );
};

const Home: NextPage = () => {
  return (
    <Box w="100vw" h="100vh">
      <Head>
        <title>Shuggzy's Flashcards</title>
        <meta
          name="description"
          content="Something to help me learn spanish."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack w="full" h="full" bg={{ base: `white`, md: `gray.200` }}>
        <VStack flex="1" justifyContent="center">
          <FlashCards />
        </VStack>
        <Text p={12} color="gray.500" textAlign="center">
          Hi friends 👋 thanks for visiting! I got the words from
          {` `}
          <Link href="https://top1000mostcommonwords.com/top-1000-most-common-words-in-spanish/">
            <a>
              <ChakraLink textDecoration="underline" as="span">
                this link.
              </ChakraLink>
            </a>
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Home;
