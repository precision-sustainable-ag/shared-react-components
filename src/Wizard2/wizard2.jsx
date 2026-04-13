import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Block as BlockIcon,
  Check as CheckIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import PSAButton from '../Button';

import describesImage from './assets/describes.jpg';
import nrcsImage from './assets/nrcs.jpg';
import openingImage from './assets/opening.jpg';
import questionsImage from './assets/questions.jpg';

import { sx } from './styles';

const descriptions = {
  economic:
    'This program helps you understand the impact of cover crops on profitability when making crop management changes.',
  nitrogen:
    'This program helps you with decisions regarding cover crop residue persistence, as well as the amount and timing of nitrogen availability.',
  seeding:
    'This program helps you determine optimal seeding rates for cover crops based on their location, species, and management goals.',
  selector:
    'This program helps you choose the most suitable cover crop species by filtering options based on their location, goals, and farming conditions.',
  vegspec:
    'This program lets you search a robust database to find plants that meet the needs of your specific site, work for your selected practice, and meet your planting purpose. VegSpec can also help you to generate seed mixes and estimate project costs.',
  none: 'Thank you for your interest in our decision support tools. Unfortunately none of these matched exactly with your needs. You can always retake the quiz and pick different answers, or follow along as we release new updates.',
};

const Screen = ({ content, setScreen, next, screen, disabledNext }) => (
  <Box sx={sx.modal}>
    {content.image && (
      <Box sx={sx.imageWrapper}>
        <Box component="img" src={content.image} sx={sx.image} />
      </Box>
    )}

    <Box sx={sx.content}>
      <Box sx={{ ...sx.inner, flex: screen === 'opening' ? 0 : 1 }}>
        {content.header && (
          <Typography variant="h4" sx={sx.header}>
            {content.header}
          </Typography>
        )}

        {typeof content.content === 'string' ? (
          <Typography variant="body1" sx={sx.body}>
            {content.content}
          </Typography>
        ) : (
          content.content
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
        }}
      >
        {content.back && (
          <PSAButton
            sx={{ ...sx.buttonBase, ...sx.backButton }}
            title={<Box sx={{ width: '100%', textAlign: 'center' }}>Back</Box>}
            startIcon={<ArrowBackIcon sx={{ ...sx.arrowIcon, ...sx.arrowBackIcon }} />}
            onClick={() => setScreen(content.back)}
          />
        )}

        {content.next && (
          <PSAButton
            sx={{ ...sx.buttonBase, ...sx.nextButton }}
            disabled={disabledNext}
            title={
              <Box sx={{ width: '100%', textAlign: 'center' }}>{content.nextTitle || 'Next'}</Box>
            }
            endIcon={<ArrowForwardIcon sx={{ ...sx.arrowIcon, ...sx.arrowNextIcon }} />}
            onClick={() => setScreen(next)}
          />
        )}
      </Box>
    </Box>
  </Box>
); // Screen

const Screen1 = ({ nrcsPractice, setNrcsPractice }) => (
  <Box>
    If you're not sure, you can click no.
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <PSAButton
        sx={{
          ...sx.optionButton,
          ...(nrcsPractice === 'yes' && sx.selectedButton),
        }}
        startIcon={<CheckIcon />}
        title="Yes"
        onClick={() => setNrcsPractice('yes')}
      />

      <PSAButton
        sx={{
          ...sx.optionButton,
          ...(nrcsPractice === 'no' && sx.selectedButton),
        }}
        startIcon={<BlockIcon />}
        title="No"
        onClick={() => setNrcsPractice('no')}
      />
    </Box>
  </Box>
); // Screen1

const Options = ({ options, selected, setSelected }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
    {options.map(([match, title]) => (
      <PSAButton
        sx={{
          ...sx.fullOptionButton,
          ...(selected === match && sx.selectedButton),
        }}
        key={match}
        match={match}
        title={title}
        onClick={() => setSelected(match)}
      />
    ))}
  </Box>
); // Options

const ScreenDescribes = ({ selected, setSelected }) => {
  const options = [
    ['selector', 'I need help picking a cover crop species.'],
    ['questions', 'I have other questions related to cover crops.'],
    ['neither', 'Neither of these describe me.'],
  ];

  return <Options options={options} selected={selected} setSelected={setSelected} />;
}; // ScreenDescribes

const ScreenQuestions = ({ question, setQuestion }) => {
  const options = [
    ['seeding', 'Support as I choose seeding rates'],
    ['nitrogen', 'Estimation of the nitrogen my crops release'],
    ['economic', 'Help making economic decisions'],
    ['none', 'None of the above'],
  ];

  return <Options options={options} selected={question} setSelected={setQuestion} />;
}; // ScreenQuestions

const otherTools = [
  {
    name: 'Cover Crop Selector',
    description: descriptions.selector,
    link: 'https://covercrop-selector.org/',
  },
  {
    name: 'Seeding Rate Calculator',
    description: descriptions.seeding,
    link: 'https://covercrop-seedcalc.org/',
  },
  {
    name: 'Cover Crop Nitrogen Calculator',
    description: descriptions.nitrogen,
    link: 'https://covercrop-ncalc.org/',
  },
  {
    name: 'Cover Crop Economic Calculator',
    description: descriptions.economic,
    link: 'https://covercrop-econ.org/',
  },
  {
    name: 'VegSpec',
    description: descriptions.vegspec,
    link: 'https://vegspec.org/location',
  },
];

const RecommendationScreen = ({ tool, description, onStartOver }) => {
  const link = otherTools.find((t) => t.name === tool)?.link;

  return (
    <Box sx={sx.resultWrap}>
      {link && <Typography sx={sx.resultLead}>We recommend using</Typography>}
      <Typography component="a" href={link} sx={sx.resultTool}>
        {tool}
      </Typography>
      {!link && (
        <Typography sx={sx.resultLead}>None of these tools fit your exact needs.</Typography>
      )}
      <Typography sx={sx.resultBody}>{description}</Typography>
      <Box sx={sx.resultButtons}>
        {link && (
          <Box component="a" href={link}>
            <PSAButton sx={sx.primaryCta} title="Check it Out" endIcon={<ArrowForwardIcon />} />
          </Box>
        )}

        <PSAButton
          sx={sx.secondaryCta}
          title={<Box sx={{ width: '100%', textAlign: 'center' }}>Start Over</Box>}
          endIcon={<SearchIcon sx={{ fontSize: 18 }} />}
          onClick={onStartOver}
        />
      </Box>
      <Box sx={sx.otherToolsBox}>
        <Typography sx={sx.otherToolsHeader}>Explore Other Tools</Typography>

        {otherTools
          .filter((t) => t.name !== tool)
          .map(({ name, description, link }) => (
            <Box key={`${name}-${description}`} sx={sx.otherToolRow}>
              <Typography component="a" href={link} sx={sx.otherToolLink}>
                {name}
              </Typography>
              <Typography sx={sx.otherToolText}>{description}</Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
}; // RecommendationScreen

export const PSAWizard2 = () => {
  const [screen, setScreen] = useState('opening');
  const [nrcsPractice, setNrcsPractice] = useState(null);
  const [selected, setSelected] = useState('');
  const [question, setQuestion] = useState('');

  const recScreen = ({ tool, description }) => (
    <RecommendationScreen
      tool={tool}
      description={description}
      onStartOver={() => {
        setScreen('opening');
        setNrcsPractice(null);
        setSelected('');
        setQuestion('');
      }}
    />
  );

  const content = {
    opening: {
      header: 'Looking for the right Decision Support Tool?',
      content:
        'We can help! We will guide you through a few quick questions to match you with the best web-based tool for your goals.',
      next: 'nrcsPractice',
      nextTitle: 'Get Started',
      image: openingImage,
    },
    nrcsPractice: {
      header: 'Are you planting for a NRCS conservation practice?',
      content: <Screen1 nrcsPractice={nrcsPractice} setNrcsPractice={setNrcsPractice} />,
      back: 'opening',
      next: 'userGoal',
      image: nrcsImage,
    },
    userGoal: {
      header: 'What best describes you?',
      content: <ScreenDescribes selected={selected} setSelected={setSelected} />,
      back: 'nrcsPractice',
      next: 'none',
      image: describesImage,
    },
    questions: {
      header: 'What cover crop support would be most useful to you?',
      content: <ScreenQuestions question={question} setQuestion={setQuestion} />,
      back: 'userGoal',
      next: 'none',
      image: questionsImage,
    },
    vegspec: {
      content: recScreen({
        tool: 'VegSpec',
        description: descriptions.vegspec,
      }),
    },
    selector: {
      content: recScreen({
        tool: 'Cover Crop Selector',
        description: descriptions.selector,
      }),
    },
    economic: {
      content: recScreen({
        tool: 'Cover Crop Economic Calculator',
        description: descriptions.economic,
      }),
    },
    seeding: {
      content: recScreen({
        tool: 'Seeding Rate Calculator',
        description: descriptions.seeding,
      }),
    },
    nitrogen: {
      content: recScreen({
        tool: 'Cover Crop Nitrogen Calculator',
        description: descriptions.nitrogen,
      }),
    },
    none: {
      content: recScreen({
        tool: 'No Match',
        description: descriptions.none,
      }),
    },
  };

  const getNextScreen = (screen) => {
    if (screen === 'nrcsPractice') {
      return (
        {
          yes: 'vegspec',
          no: 'userGoal',
        }[nrcsPractice] || content[screen].next
      );
    }

    if (screen === 'userGoal') {
      return (
        {
          selector: 'selector',
          questions: 'questions',
          neither: 'vegspec',
        }[selected] || 'none'
      );
    }

    if (screen === 'questions') {
      return (
        {
          economic: 'economic',
          seeding: 'seeding',
          nitrogen: 'nitrogen',
          none: 'none',
        }[question] || content[screen].next
      );
    }

    return content[screen].next || null;
  };

  let disabledNext = false;
  if (screen === 'nrcsPractice') disabledNext = !nrcsPractice;
  else if (screen === 'userGoal') disabledNext = !selected;
  else if (screen === 'questions') disabledNext = !question;

  return (
    <Screen
      content={content[screen]}
      screen={screen}
      setScreen={setScreen}
      next={getNextScreen(screen)}
      disabledNext={disabledNext}
    />
  );
};
